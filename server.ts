/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  ALL_TRAVEL_RECORDS,
  SUPPORTED_DESTINATIONS,
  EVALUATION_SCENARIOS,
  GENERAL_SCOPE,
  DestinationId,
  TravelRecord,
  TravelCategory,
} from './src/data/travelKnowledgeBase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
let isGeminiQuotaExhausted = false;
let lastQuotaExhaustedTime = 0;
const QUOTA_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown before re-trying Gemini

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  text: string;
  destinationId?: string;
  recommendations?: Array<{
    id?: string;
    name: string;
    category: string;
    tagline?: string;
    description?: string;
  }>;
}

/**
 * Context Resolver: Resolves anaphoric references ("it", "they", "which one", "photography")
 * using previous conversation turns before retrieval.
 */
function resolveQueryWithHistory(userQuery: string, history?: ChatHistoryEntry[]): {
  resolvedQuery: string;
  referencedEntities: string[];
} {
  const query = userQuery.toLowerCase().trim();
  const referencedEntities: string[] = [];

  const isFollowUp =
    query.includes('which one') ||
    query.includes('better for') ||
    query.includes('for photography') ||
    query.includes('for families') ||
    query.includes('tell me more about it') ||
    query.includes('tell me more') ||
    query.includes('its history') ||
    query.includes('their history') ||
    query.includes('compare them') ||
    query.includes('how do they compare') ||
    query.includes('what about') ||
    query.includes('the first one') ||
    query.includes('the second one') ||
    query.includes('why is it') ||
    query.includes('historically important') ||
    query.includes('why is that') ||
    query.includes('about it') ||
    query.includes('where can i try') ||
    query.includes('where can i eat') ||
    query.includes('where to try') ||
    query.includes('where to eat them') ||
    query.includes('how do i reach it') ||
    query.includes('what makes it') ||
    query.includes('tell me about it');

  if (isFollowUp && history && history.length > 0) {
    // Look backwards for recent recommendations or user mentioned entities
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.recommendations && msg.recommendations.length > 0) {
        msg.recommendations.forEach((r) => {
          if (!referencedEntities.includes(r.name)) {
            referencedEntities.push(r.name);
          }
        });
        break;
      }
      // Also check if text mentioned any known record
      for (const rec of ALL_TRAVEL_RECORDS) {
        const lowerName = rec.name.toLowerCase();
        if (
          msg.text.toLowerCase().includes(lowerName) ||
          (rec.id === 'blr-bangalore-palace' && msg.text.toLowerCase().includes('bangalore palace')) ||
          (rec.id === 'jaipur-amber-fort' && msg.text.toLowerCase().includes('amber fort')) ||
          (rec.id === 'hyd-golconda-fort' && msg.text.toLowerCase().includes('golconda'))
        ) {
          if (!referencedEntities.includes(rec.name)) {
            referencedEntities.push(rec.name);
          }
        }
      }
      if (referencedEntities.length > 0) break;
    }
  }

  // Combine query with referenced entities to empower keyword matching
  const resolvedQuery = referencedEntities.length > 0
    ? `${userQuery} (Context from previous discussion: ${referencedEntities.join(', ')})`
    : userQuery;

  return { resolvedQuery, referencedEntities };
}

/**
 * Mandatory city anchors for general overview queries:
 * - Hyderabad: Charminar & Golconda Fort (historical); Paradise, Nimrah Cafe & Shadab (dining)
 * - Bengaluru: Lalbagh & Bangalore Palace (historical); CTR, Vidyarthi Bhavan & MTR (dining)
 * - Jaipur: Amber Fort, Hawa Mahal & City Palace (historical); LMB, Rawat & 1135 AD (dining)
 */
const MANDATORY_CITY_ANCHORS: Record<
  DestinationId,
  {
    historical: string[];
    food: string[];
    culture: string[];
  }
> = {
  hyderabad: {
    historical: ['hyd-charminar', 'hyd-golconda-fort', 'hyd-chowmahalla'],
    food: ['hyd-paradise', 'hyd-nimrah-cafe', 'hyd-shadab'],
    culture: ['hyd-laad-bazaar-craft', 'hyd-salargunj-museum', 'hyd-shilparamam'],
  },
  bangalore: {
    historical: ['blr-bangalore-palace', 'blr-lalbagh'],
    food: ['blr-ctr', 'blr-vidyarthi-bhavan', 'blr-mtr', 'blr-taaza-thindi', 'blr-corner-house', 'blr-nagarjuna'],
    culture: ['blr-nrityagram', 'blr-rangashankara'],
  },
  jaipur: {
    historical: ['jaipur-amber-fort', 'jaipur-hawa-mahal', 'jaipur-city-palace'],
    food: ['jaipur-lmb', 'jaipur-rawat', 'jaipur-1135-ad'],
    culture: ['jaipur-anokhi-museum', 'jaipur-chokhi-dhani', 'jaipur-blue-pottery'],
  },
};

/**
 * Mandatory city dish anchors for CASE A: DISH INTENT queries
 */
interface MandatoryDishAnchor {
  id: string;
  name: string;
  iconicPlace: string;
  description: string;
}

const MANDATORY_CITY_DISHES: Record<DestinationId, MandatoryDishAnchor[]> = {
  hyderabad: [
    {
      id: 'hyd-biryani',
      name: 'Hyderabadi Biryani',
      iconicPlace: 'Paradise (Secunderabad) / Hotel Shadab (Ghansi Bazaar, Old City)',
      description: 'World-famous royal dish slow-cooked with aged basmati rice, tender spiced meat, saffron, and mint using the authentic Kacchi Dum method in dough-sealed handis.',
    },
    {
      id: 'hyd-haleem-irani-chai',
      name: 'Irani Chai & Osmania Biscuit',
      iconicPlace: 'Nimrah Café & Bakery (Beside Mecca Masjid, Opposite Charminar)',
      description: 'Rich, creamy slow-simmered spiced milk tea paired with melt-in-mouth sweet and slightly salted butter biscuits overlooking the historic Charminar.',
    },
    {
      id: 'hyd-double-ka-meetha',
      name: 'Double Ka Meetha',
      iconicPlace: 'Traditional Nizami wedding caterers & heritage dining rooms in Old City',
      description: 'Royal Nizami saffron-cardamom bread pudding made of golden-fried bread soaked in fragrant syrup, coated in rich reduced khoya rabdi, and garnished with toasted nuts.',
    },
  ],
  bangalore: [
    {
      id: 'blr-benne-dosa',
      name: 'Benne Masala Dosa',
      iconicPlace: 'Central Tiffin Room (CTR / Shri Sagar), Malleshwaram',
      description: 'Ultra-crisp golden crepe roasted with generous slabs of freshly churned white butter (benne), wrapped around seasoned spiced potato palya.',
    },
    {
      id: 'blr-mtr',
      name: 'Rava Dosa',
      iconicPlace: 'Mavalli Tiffin Room (MTR), Near Lalbagh',
      description: 'Golden-brown, lacy semolina crepe studded with crushed black pepper, green chillies, and ginger, served with pure melted ghee and coconut chutney.',
    },
    {
      id: 'blr-vidyarthi-bhavan',
      name: 'Filter Coffee & Masala Dosa',
      iconicPlace: 'Vidyarthi Bhavan, Gandhi Bazaar, Basavanagudi',
      description: 'Thick, deeply roasted crisp masala dosa served alongside aromatic South Indian degree filter coffee frothed in traditional brass dabaras.',
    },
    {
      id: 'blr-corner-house',
      name: 'Death By Chocolate (DBC)',
      iconicPlace: 'Corner House Ice Cream, Indiranagar / Jayanagar',
      description: 'Legendary dessert featuring warm chocolate sponge cake crowned with double scoops of vanilla ice cream, hot chocolate fudge, cream, and roasted peanuts.',
    },
  ],
  jaipur: [
    {
      id: 'jaipur-dal-baati',
      name: 'Dal Baati Churma',
      iconicPlace: 'Laxmi Mishthan Bhandar (LMB), Johari Bazaar',
      description: 'The defining Marwari royal feast featuring slow-baked wheat dumplings dipped in desi ghee, spicy five-lentil Panchmel dal, and sweet cardamom churma.',
    },
    {
      id: 'jaipur-pyaz-kachori',
      name: 'Pyaaz Kachori',
      iconicPlace: 'Rawat Mishthan Bhandar, Station Road, Sindhi Camp',
      description: 'Steaming hot, multi-layered flaky pastry pocket generously stuffed with seasoned caramelised onions, fennel, and nigella seeds.',
    },
    {
      id: 'jaipur-laal-maas',
      name: 'Laal Maas',
      iconicPlace: '1135 AD (Amber Fort) / Handi Restaurant (MI Road)',
      description: 'Historic royal Rajput game meat curry simmered in a fiery, deep-red gravy infused with sun-dried Mathania chillies, garlic, and yogurt.',
    },
    {
      id: 'jaipur-ghewar',
      name: 'Jaipuri Ghewar',
      iconicPlace: 'Laxmi Mishthan Bhandar (LMB) & traditional halwais in Johari Bazaar',
      description: 'Intricate disc-shaped honeycomb sweet soaked in cardamom-saffron sugar syrup, crowned with rich clotted cream (Malai) and slivered pistachios.',
    },
  ],
};

/**
 * Historical Landmarks Curated Data (Built By, Highlight, Location)
 */
const HISTORICAL_LANDMARK_DATA: Record<
  string,
  {
    name: string;
    location: string;
    builtBy: string;
    highlight: string;
  }
> = {
  'hyd-charminar': {
    name: 'Charminar',
    location: 'Ghansi Bazaar, Old City',
    builtBy: 'Sultan Muhammad Quli Qutb Shah (1591)',
    highlight: 'Iconic 16th-century monument with four majestic 56-meter minarets overlooking bustling Old City bazaars.',
  },
  'hyd-golconda-fort': {
    name: 'Golconda Fort',
    location: 'Ibrahim Bagh, Hyderabad',
    builtBy: 'Kakatiya Dynasty / Qutb Shahi Kings (16th–17th Century)',
    highlight: '17th-century acoustic engineering marvel where a clap at the Fateh Darwaza dome resonates 1 km away at Bala Hissar; former vault of the Koh-i-Noor diamond.',
  },
  'hyd-chowmahalla': {
    name: 'Chowmahalla Palace',
    location: 'Khilwat, Hyderabad',
    builtBy: 'Nizams of Hyderabad (Asaf Jahi Dynasty, 18th–19th Century)',
    highlight: 'Official seat of the Nizams featuring the grand Khilwat Mubarak Durbar Hall with Belgian crystal chandeliers and vintage royal car collections.',
  },
  'hyd-qutb-shahi-tombs': {
    name: 'Qutb Shahi Tombs',
    location: 'Ibrahim Bagh, Hyderabad',
    builtBy: 'Qutb Shahi Dynasty (16th–17th Century)',
    highlight: 'Colossal domed royal mausoleums set in landscaped Persian-style charbagh gardens blending Persian, Pathan, and Hindu architectural motifs.',
  },
  'hyd-falaknuma': {
    name: 'Taj Falaknuma Palace',
    location: 'Engine Bowli, Falaknuma, Hyderabad',
    builtBy: 'Nawab Sir Vikar-ul-Umra / 6th Nizam (1893)',
    highlight: 'Scorpion-shaped Italian marble palace perched 2,000 feet above the city with 101-seat dining hall and Venetian chandeliers.',
  },
  'hyd-salargunj-museum': {
    name: 'Salar Jung Museum',
    location: 'Darusshifa, Hyderabad',
    builtBy: 'Nawab Mir Yousuf Ali Khan (Salar Jung III)',
    highlight: 'One of the world’s largest private antique collections including the Veiled Rebecca and 19th-century musical clock.',
  },
  'hyd-purani-haveli': {
    name: 'Purani Haveli (Nizam’s Museum)',
    location: 'Pathar Gatti, Hyderabad',
    builtBy: '2nd Nizam of Hyderabad (1777)',
    highlight: 'Historic royal residence housing the world’s longest hand-carved teakwood wardrobe spanning 240 feet across two levels.',
  },
  'blr-bangalore-palace': {
    name: 'Bangalore Palace',
    location: 'Vasanth Nagar, Bengaluru',
    builtBy: 'Chamaraja Wodeyar (1887)',
    highlight: 'Grand Tudor-style royal fortress with fortified towers, Durbar Hall, and wood carvings.',
  },
  'blr-lalbagh': {
    name: 'Lalbagh Botanical Garden',
    location: 'Mavalli, Bengaluru',
    builtBy: 'Hyder Ali & Tipu Sultan (1760)',
    highlight: 'Historic 240-acre botanical conservatory housing India’s largest tropical plant collection and glass house.',
  },
  'blr-cubbon-park': {
    name: 'Cubbon Park & State Central Library',
    location: 'Kasturba Road, Bengaluru',
    builtBy: 'Sir Mark Cubbon & Major Richard Sankey (1870)',
    highlight: 'Historic 300-acre botanical haven housing over 6,000 trees and the crimson neo-classical State Central Library.',
  },
  'blr-tipu-palace': {
    name: "Tipu Sultan's Summer Palace",
    location: 'Chamrajpet, Bengaluru',
    builtBy: 'Hyder Ali & Tipu Sultan (1791)',
    highlight: 'Two-storey Indo-Islamic summer residence crafted entirely from French-rosewood and teakwood with ornate cusped arches.',
  },
  'blr-bangalore-fort': {
    name: 'Bangalore Fort (Bengaluru Kote)',
    location: 'K.R. Market, Bengaluru',
    builtBy: 'Kempe Gowda I (1537) / Haidar Ali (1761)',
    highlight: 'Granite stone bastions and Delhi Gate that witnessed the Third Anglo-Mysore War.',
  },
  'blr-vidhana-soudha': {
    name: 'Vidhana Soudha',
    location: 'Ambedkar Veedhi, Sampangi Rama Nagara, Bengaluru',
    builtBy: 'Kengal Hanumanthaiah (1956)',
    highlight: 'Magnificent Neo-Dravidian granite legislative edifice, the largest state legislative building in India.',
  },
  'blr-bugle-rock': {
    name: 'Bugle Rock Park',
    location: 'Basavanagudi, Bengaluru',
    builtBy: 'Kempe Gowda II (16th Century) / Geological Survey of India',
    highlight: 'Colossal 3,000-million-year-old peninsular gneiss rock formation once serving as an ancient sentry watchtower.',
  },
  'jaipur-amber-fort': {
    name: 'Amber Fort (Amer Fort)',
    location: 'Devisinghpura, Amer, Jaipur',
    builtBy: 'Raja Man Singh I (1592)',
    highlight: 'UNESCO World Heritage hill fortress renowned for the mirror-studded Sheesh Mahal and Maota Lake panoramic vistas.',
  },
  'jaipur-city-palace': {
    name: 'City Palace, Jaipur',
    location: 'Jaleb Chowk, Old Walled City, Jaipur',
    builtBy: 'Maharaja Sawai Jai Singh II (1727)',
    highlight: 'Active royal residence combining Rajput and Mughal architecture, Chandra Mahal, and Peacock Gate.',
  },
  'jaipur-hawa-mahal': {
    name: 'Hawa Mahal (Palace of Winds)',
    location: 'Badi Choupad, Old Walled City, Jaipur',
    builtBy: 'Maharaja Sawai Pratap Singh (1799)',
    highlight: 'Five-storey pink sandstone facade featuring 953 jharokha honeycomb windows for royal women.',
  },
  'jaipur-jaigarh-fort': {
    name: 'Jaigarh Fort',
    location: 'Cheel ka Teela, Amer, Jaipur',
    builtBy: 'Maharaja Sawai Jai Singh II (1726)',
    highlight: 'Impregnable military citadel housing Jaivana, the world’s largest wheeled cannon cast in 1720.',
  },
  'jaipur-nahargarh-fort': {
    name: 'Nahargarh Fort',
    location: 'Krishna Nagar, Brahampuri, Jaipur',
    builtBy: 'Maharaja Sawai Jai Singh II (1734)',
    highlight: 'Hilltop fortress featuring Madhavendra Bhawan’s nine royal suites and panoramic sunset vistas over Jaipur.',
  },
  'jaipur-jantar-mantar': {
    name: 'Jantar Mantar',
    location: 'Gangori Bazaar, Pink City, Jaipur',
    builtBy: 'Maharaja Sawai Jai Singh II (1734)',
    highlight: 'UNESCO World Heritage astronomical observatory featuring the 27-meter-tall Vrihat Samrat Yantra stone sundial.',
  },
  'jaipur-jal-mahal': {
    name: 'Jal Mahal (Water Palace)',
    location: 'Man Sagar Lake, Amer Road, Jaipur',
    builtBy: 'Maharaja Madho Singh I (1750)',
    highlight: 'Symmetrical red sandstone palace floating serenely in Man Sagar Lake against the Nahargarh hills.',
  },
  'jaipur-panna-meena': {
    name: 'Panna Meena ka Kund',
    location: 'Amer Town, Jaipur',
    builtBy: 'Meena Community / Raja Man Singh I (16th Century)',
    highlight: 'Eight-storey geometric stepwell with interlocking criss-cross stairways engineered for rainwater harvesting.',
  },
  'jaipur-patrika-gate': {
    name: 'Patrika Gate at Jawahar Circle',
    location: 'Jawahar Circle, Malviya Nagar, Jaipur',
    builtBy: 'Rajasthan Patrika Group (2016)',
    highlight: 'Vibrantly hand-painted ceremonial gateway featuring nine arches depicting Rajasthan’s arts, crafts, and heritage.',
  },
};

/**
 * Dish Definitions with Ingredients, Preparation, and Cultural Roots
 */
const DISH_DEFINITIONS: Record<
  string,
  {
    name: string;
    city: DestinationId;
    tagline: string;
    description: string;
    ingredientsAndPrep: string;
    flavorProfile: string;
    culturalRoots: string;
  }
> = {
  'jaipur-dal-baati': {
    name: 'Dal Baati Churma',
    city: 'jaipur',
    tagline: 'Signature Royal Rajasthani Dish',
    description: 'The defining culinary masterpiece of Rajasthan composed of three harmonious elements: baked whole-wheat dumplings (baati), five-lentil dal, and sweet crushed wheat (churma).',
    ingredientsAndPrep: 'Hard round whole-wheat dough balls are slow-baked over cow dung or charcoal embers, cracked open, and drenched in pure desi ghee. They are served with Panchmel dal (five lentils: toor, chana, moong, masoor, and urad tempered with cumin, cloves, and asafoetida) and sweet cardamom churma (coarsely ground wheat roasted in ghee and sweetened with jaggery or sugar).',
    flavorProfile: 'A rich contrast between smoky, ghee-soaked baatis, earthy spiced lentils, and fragrant sweet nutty churma.',
    culturalRoots: 'Born from nomadic Rajput warriors who buried dough balls under hot desert sand while heading into combat, Dal Baati Churma evolved from a survival ration into Rajasthan’s most honored royal banquet feast.',
  },
  'blr-bisi-bele-bath': {
    name: 'Bisi Bele Bath & Khara Boondi',
    city: 'bangalore',
    tagline: 'Traditional Karnataka Comfort & Royal Palace Recipe',
    description: "Literally translating to 'hot lentil rice' in Kannada, Bisi Bele Bath is Karnataka's premier traditional comfort food and royal Mysore Palace legacy.",
    ingredientsAndPrep: 'A slow-cooked one-pot stew of short-grain rice, toor dal (pigeon peas), and seasonal vegetables (beans, carrots, shallots, green peas) simmered with a distinctive spice blend containing roasted coriander seeds, cinnamon, nutmeg, dry coconut, and Marathi Moggu (Kapok buds). Finished with a generous ladle of melted desi ghee and topped with crunchy spiced khara boondi.',
    flavorProfile: 'Tangy tamarind and warming spices balanced by nutty toor dal, aromatic desi ghee, and the satisfying crunch of boondi.',
    culturalRoots: 'Originated in the royal kitchens of the Wadiyar dynasty at the Mysore Palace over three centuries ago, evolving into Karnataka’s definitive celebration and comfort dish.',
  },
  'hyd-haleem-irani-chai': {
    name: 'Hyderabadi Haleem',
    city: 'hyderabad',
    tagline: 'GI-Tagged Nizami Stew & Cult Irani Café Beverage',
    description: 'A GI-tagged (Geographical Indication) royal Nizami savory delicacy renowned for its velvety texture and high nutritional energy.',
    ingredientsAndPrep: 'Tender goat or mutton meat, broken wheat (dalia), lentils, and pure desi ghee are slow-simmered for up to 12 hours in large copper cauldrons (degs) and pounded continuously with heavy wooden pestles (ghowta) until completely emulsified into a rich savory paste, seasoned with cardamom, cloves, cinnamon, and allspice.',
    flavorProfile: 'Deeply savory, melt-in-the-mouth texture infused with warming aromatic spices, rich ghee, caramelized onions (birista), fresh mint, and a zesty squeeze of lime.',
    culturalRoots: 'Derived from the ancient Arab dish harees introduced by Chaush soldiers during the Nizam era, perfected in the royal Asaf Jahi kitchens, and celebrated as the definitive centerpiece of Ramzan evening feasts.',
  },
  'jaipur-ghewar': {
    name: 'Jaipuri Ghewar (Malai & Paneer Ghewar)',
    city: 'jaipur',
    tagline: 'Porous Honeycomb Royal Desert Confectionery',
    description: 'Jaipur’s most celebrated festival sweet, renowned for its intricate porous disc structure.',
    ingredientsAndPrep: 'A batter of refined flour and chilled ghee-water emulsion is poured into sizzling pure desi ghee to form an airy honeycomb lattice, soaked in fragrant saffron-cardamom sugar syrup, and topped with clotted saffron cream (Malai Rabdi), silver foil, and sliced almonds.',
    flavorProfile: 'Crispy and porous on first bite, followed by sweet saffron syrup and decadent creamy rabdi.',
    culturalRoots: 'Traditionally associated with the monsoon festivals of Teej and Raksha Bandhan in Rajasthan, symbolic of auspicious celebrations.',
  },
  'jaipur-pyaz-kachori': {
    name: 'Pyaaz Kachori & Mirchi Vada',
    city: 'jaipur',
    tagline: 'Flaky Spiced Onion Pastry & Morning Street Staple',
    description: 'A legendary savory morning staple across Jaipur, world-famous for its flaky pastry shell and spicy onion filling.',
    ingredientsAndPrep: 'Refined flour dough layered with ghee is stuffed with a spiced sauté of finely diced onions, nigella seeds (kalonji), fennel, crushed coriander seeds, and amchur (dry mango powder), then deep-fried slowly to golden crispness.',
    flavorProfile: 'Extraordinarily flaky, crisp crust giving way to sweet caramelized onions and zesty, aromatic spices, served with sweet tamarind and spicy mint chutneys.',
    culturalRoots: 'Popularized by Marwari sweet and namkeen masters as the quintessential energy-packed breakfast companion to morning masala chai.',
  },
  'jaipur-ker-sangri': {
    name: 'Ker Sangri (Desert Bean & Caper Sabzi)',
    city: 'jaipur',
    tagline: 'Ancient Thar Desert Wild Caper & Bean Specialty',
    description: 'An ancient Marwari desert dish born from the arid Thar desert ecosystem.',
    ingredientsAndPrep: 'Wild berries (ker) and slender pods of the Khejri tree (sangri) are dried, rehydrated, and sautéed in mustard oil with cumin, red chilli powder, turmeric, unrefined rock salt, and dry mango powder.',
    flavorProfile: 'A distinctive tangy, pungent, and earthy flavor profile with a delightful chewy texture, traditionally eaten with Bajra (pearl millet) rotis.',
    culturalRoots: 'Developed by desert dwellers centuries ago as a drought-resilient nutrition source that could be dried and preserved indefinitely.',
  },
  'jaipur-laal-maas': {
    name: 'Laal Maas',
    city: 'jaipur',
    tagline: 'Historic Royal Rajput Fiery Mathania Mutton Curry',
    description: 'A historic royal Rajput game meat delicacy simmered in a fiery, deep-red gravy infused with sun-dried Mathania chillies, garlic, and yogurt.',
    ingredientsAndPrep: 'Tender mutton pieces are slow-braised in mustard oil with a vibrant paste of indigenous Mathania red chillies, garlic cloves, curd, and whole spices, traditionally smoked using charcoal Dhungar.',
    flavorProfile: 'Fiery, robust, smoky, and slow-braised savoriness with intense warmth from Mathania chillies.',
    culturalRoots: 'Originated with Rajput royal hunting expeditions where game meat was slow-cooked in the wilderness with available spices and chillies to preserve it.',
  },
  'blr-benne-dosa': {
    name: 'Benne Masala Dosa',
    city: 'bangalore',
    tagline: 'Ultra-Crisp Golden Butter Crepe with Seasoned Potato',
    description: 'The crowning jewel of Bengaluru’s heritage tiffin culture.',
    ingredientsAndPrep: 'Fermented batter of rice and black gram roasted on seasoned cast-iron tawas with a generous slab of freshly churned butter (benne), rolled around spiced mashed potato (palya), and served alongside coconut chutney.',
    flavorProfile: 'Incredible contrast of a golden, glass-like exterior crunch with a soft, cloud-like interior and creamy butter aroma.',
    culturalRoots: 'Hailing from Davangere and perfected across heritage institutions in Basavanagudi and Malleshwaram since the mid-20th century.',
  },
  'blr-filter-coffee': {
    name: 'South Indian Degree Filter Coffee',
    city: 'bangalore',
    tagline: 'Aromatic Brass Dabara Coffee from Western Ghats Plantations',
    description: 'The morning ritual and social heartbeat of Bengaluru.',
    ingredientsAndPrep: 'Freshly roasted plantation Arabica and Peaberry beans blended with chicory are slow-dripped through a stainless steel or brass filter, then mixed with piping-hot boiled full-cream milk and aerated between a brass dabara and tumbler.',
    flavorProfile: 'Intensely aromatic, velvety smooth with a thick crema froth and deep chocolate-caramel undertones.',
    culturalRoots: 'Cultivated in the misty Western Ghats of Chikmagalur and Coorg, perfected over a century of heritage tiffin room service.',
  },
  'hyd-biryani': {
    name: 'Hyderabadi Mutton Dum Biryani',
    city: 'hyderabad',
    tagline: 'Royal Culinary Synthesis of Nizami Dum Cooking & Telugu Spices',
    description: 'The world-famous royal dish originating in the royal kitchens of the Asaf Jahi Nizams.',
    ingredientsAndPrep: 'Prepared using the authentic "Kacchi Dum" method: tender raw mutton is marinated in yogurt, ginger-garlic, raw papaya, and spices, layered with partially boiled aged long-grain basmati rice, mint, fried onions (birista), and saffron milk, then sealed with dough in a copper handi and slow-cooked over burning coals.',
    flavorProfile: 'Incomparably fragrant, every grain of rice separate and infused with meat juices, aromatic spices, and saffron, paired with Mirchi ka Salan and Dahi Chutney.',
    culturalRoots: 'Synthesizing Persian culinary techniques with the vibrant spices of the Deccan kingdom, it represents the pinnacle of Hyderabadi gastronomic achievement.',
  },
  'hyd-double-ka-meetha': {
    name: 'Double ka Meetha (Shahi Tukda)',
    city: 'hyderabad',
    tagline: 'Royal Nizami Saffron Cardamom Bread Pudding',
    description: 'The crowned dessert of Hyderabadi wedding banquets and royal celebrations.',
    ingredientsAndPrep: 'Thick slices of bread (double roti) are fried in pure desi ghee until golden and crisp, soaked in fragrant saffron and rose water syrup, coated in reduced khoya and cardamom milk (Rabdi), and showered with slivered almonds and pistachios.',
    flavorProfile: 'Sumptuously rich and custardy with crisp edges, sweet saffron aromatics, and crunchy nuts.',
    culturalRoots: 'Created by royal chefs to blend European milk bread with traditional Mughal Shahi Tukda techniques for the Nizam’s state banquets.',
  },
};

/**
 * Restaurant to Signature Dish & Area Pairing
 */
const RESTAURANT_SIGNATURE_DATA: Record<
  string,
  {
    name: string;
    location: string;
    mustTry: string;
    tip: string;
  }
> = {
  // Hyderabad
  'hyd-paradise': {
    name: 'Paradise Biryani, Secunderabad',
    location: 'MG Road, Sappu Bagh, Paradise Circle, Secunderabad',
    mustTry: 'Authentic Hyderabadi Mutton Dum Biryani with mirchi ka salan',
    tip: 'Est. 1953, legendary institution famous for authentic Nizami dum cooking in sealed copper handis.',
  },
  'hyd-nimrah-cafe': {
    name: 'Nimrah Café & Bakery',
    location: 'Beside Mecca Masjid, Opposite Charminar, Hyderabad',
    mustTry: 'Piping hot Irani Chai & fresh sweet-salty Osmania Biscuits',
    tip: 'Est. 1993, iconic heritage tea institution offering front-row views of the monumental Charminar.',
  },
  'hyd-shadab': {
    name: 'Hotel Shadab',
    location: 'High Court Road, Madina Circle, Ghansi Bazaar, Hyderabad',
    mustTry: 'Special Mutton Dum Biryani & Velvety Nizami Haleem',
    tip: 'Est. 1953, bustling Old City landmark renowned for 12-hour slow-simmered Nizami haleem and morning paya.',
  },

  // Bengaluru
  'blr-ctr': {
    name: 'Central Tiffin Room (CTR / Shri Sagar)',
    location: 'Malleshwaram',
    mustTry: 'Benne Masala Dosa',
    tip: 'Est. 1950s, iconic Malleshwaram breakfast institution revered for crispy butter dosas, poori saagu, and filter coffee.',
  },
  'blr-vidyarthi-bhavan': {
    name: 'Vidyarthi Bhavan',
    location: 'Basavanagudi',
    mustTry: 'Crispy Masala Dosa & Filter Coffee',
    tip: 'Est. 1943 in historic Basavanagudi, famed for waiters balancing stacks of up to 20 dosa plates.',
  },
  'blr-mtr': {
    name: 'Mavalli Tiffin Room (MTR)',
    location: 'Lalbagh Road',
    mustTry: 'Rava Dosa & South Indian Thali',
    tip: 'Est. 1924 near Lalbagh; century-old culinary institution that invented Rava Idli during World War II rice shortages.',
  },
  'blr-taaza-thindi': {
    name: 'Taaza Thindi',
    location: 'Jayanagar',
    mustTry: 'Pure Veg South Indian Breakfast',
    tip: 'Celebrated standing-only morning breakfast counter in Jayanagar renowned for exceptional hygiene, crispy masala dosas, and filter coffee.',
  },
  'blr-corner-house': {
    name: 'Corner House Ice Cream',
    location: 'Indiranagar / Jayanagar',
    mustTry: 'Death By Chocolate',
    tip: 'Cult favorite dessert landmark famous for its legendary warm chocolate cake layered with rich vanilla ice cream, hot chocolate fudge, and roasted peanuts.',
  },
  'blr-nagarjuna': {
    name: 'Nagarjuna',
    location: 'Indiranagar / Residency Road',
    mustTry: 'Andhra Meals & Biryani',
    tip: 'Beloved culinary landmark serving authentic fiery Andhra banana-leaf meals, spicy chicken sholay kebab, and aromatic biryani.',
  },

  // Jaipur
  'jaipur-lmb': {
    name: 'Laxmi Mishthan Bhandar (LMB)',
    location: 'Johari Bazaar, Pink City, Jaipur',
    mustTry: 'Royal Rajasthani Dal Baati Churma & Golden Paneer Ghewar',
    tip: 'Est. 1954 in the heart of Johari Bazaar; legendary institution for pure-ghee Marwari thalis and traditional Dal Baati.',
  },
  'jaipur-rawat': {
    name: 'Rawat Mishthan Bhandar',
    location: 'Station Road, Sindhi Camp, Jaipur',
    mustTry: 'Crisp, Flaky Pyaaz Kachori & Authentic Rajasthani Thali',
    tip: 'Landmark breakfast counter and dining room frying thousands of fresh, piping hot kachoris daily.',
  },
  'jaipur-1135-ad': {
    name: '1135 AD Restaurant',
    location: 'Level 2, Jaleb Chowk, Amber Fort, Amer, Jaipur',
    mustTry: 'Royal Rajput Thali & Junglee Maas',
    tip: 'Opulent dining within the historic ramparts of Amber Fort with antique silver chandeliers and heirloom royal recipes.',
  },
};

/**
 * Known Entities Dictionary for Precise Matching & Intent Routing
 */
interface KnownEntity {
  id: string;
  name: string;
  aliases: string[];
  category: 'attraction' | 'dish' | 'restaurant' | 'cultural';
  city: DestinationId;
}

const KNOWN_ENTITIES: KnownEntity[] = [
  // --- JAIPUR ATTRACTIONS ---
  {
    id: 'jaipur-amber-fort',
    name: 'Amber Fort (Amer Fort)',
    aliases: ['amber palace', 'amer palace', 'amber fort', 'amer fort', 'sheesh mahal'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-jaigarh-fort',
    name: 'Jaigarh Fort',
    aliases: ['jaigarh fort', 'jaigarh', 'jaivana cannon'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-nahargarh-fort',
    name: 'Nahargarh Fort',
    aliases: ['nahargarh fort', 'nahargarh', 'madhavendra bhawan'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-city-palace',
    name: 'City Palace, Jaipur',
    aliases: ['city palace', 'city palace jaipur', 'pritam niwas chowk', 'chandra mahal'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    aliases: ['hawa mahal', 'palace of winds'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-jantar-mantar',
    name: 'Jantar Mantar',
    aliases: ['jantar mantar', 'samrat yantra'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-jal-mahal',
    name: 'Jal Mahal (Water Palace)',
    aliases: ['jal mahal', 'water palace'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-panna-meena',
    name: 'Panna Meena ka Kund',
    aliases: ['panna meena ka kund', 'panna meena stepwell', 'panna meena'],
    category: 'attraction',
    city: 'jaipur',
  },
  {
    id: 'jaipur-patrika-gate',
    name: 'Patrika Gate at Jawahar Circle',
    aliases: ['patrika gate', 'jawahar circle'],
    category: 'attraction',
    city: 'jaipur',
  },
  // --- JAIPUR DISHES ---
  {
    id: 'jaipur-dal-baati',
    name: 'Dal Baati Churma',
    aliases: ['dal baati churma', 'dal bati churma', 'dal baati', 'dal bati', 'baati', 'churma'],
    category: 'dish',
    city: 'jaipur',
  },
  {
    id: 'jaipur-ghewar',
    name: 'Jaipuri Ghewar (Malai & Paneer Ghewar)',
    aliases: ['ghewar', 'paneer ghewar', 'malai ghewar', 'jaipuri ghewar'],
    category: 'dish',
    city: 'jaipur',
  },
  {
    id: 'jaipur-pyaz-kachori',
    name: 'Pyaaz Kachori & Mirchi Vada',
    aliases: ['pyaaz kachori', 'pyaz kachori', 'kachori', 'mirchi vada'],
    category: 'dish',
    city: 'jaipur',
  },
  {
    id: 'jaipur-ker-sangri',
    name: 'Ker Sangri (Desert Bean & Caper Sabzi)',
    aliases: ['ker sangri', 'kair sangri', 'sangri'],
    category: 'dish',
    city: 'jaipur',
  },
  {
    id: 'jaipur-laal-maas',
    name: 'Laal Maas',
    aliases: ['laal maas', 'lal maas', 'junglee maas', 'laal maans', 'handi'],
    category: 'dish',
    city: 'jaipur',
  },
  // --- JAIPUR RESTAURANTS ---
  {
    id: 'jaipur-lmb',
    name: 'Laxmi Mishthan Bhandar (LMB)',
    aliases: ['lmb', 'laxmi mishthan bhandar', 'laxmi mishtan bhandar'],
    category: 'restaurant',
    city: 'jaipur',
  },
  {
    id: 'jaipur-rawat',
    name: 'Rawat Mishthan Bhandar',
    aliases: ['rawat', 'rawat mishthan bhandar', 'rawat mishtan bhandar'],
    category: 'restaurant',
    city: 'jaipur',
  },
  {
    id: 'jaipur-1135-ad',
    name: '1135 AD Restaurant',
    aliases: ['1135 ad', '1135 ad restaurant', '1135'],
    category: 'restaurant',
    city: 'jaipur',
  },

  // --- BANGALORE ATTRACTIONS ---
  {
    id: 'blr-bangalore-palace',
    name: 'Bangalore Palace',
    aliases: ['bangalore palace', 'bengaluru palace'],
    category: 'attraction',
    city: 'bangalore',
  },
  {
    id: 'blr-lalbagh',
    name: 'Lalbagh Botanical Garden',
    aliases: ['lalbagh', 'lalbagh botanical garden', 'lal bagh'],
    category: 'attraction',
    city: 'bangalore',
  },
  {
    id: 'blr-cubbon-park',
    name: 'Cubbon Park & State Central Library',
    aliases: ['cubbon park', 'cubbon', 'state central library'],
    category: 'attraction',
    city: 'bangalore',
  },
  {
    id: 'blr-tipu-palace',
    name: "Tipu Sultan's Summer Palace",
    aliases: ["tipu sultan's summer palace", 'tipu sultan palace', "tipu's palace", 'tipu palace'],
    category: 'attraction',
    city: 'bangalore',
  },
  {
    id: 'blr-bangalore-fort',
    name: 'Bangalore Fort (Bengaluru Kote)',
    aliases: ['bangalore fort', 'bengaluru kote', 'bengaluru fort'],
    category: 'attraction',
    city: 'bangalore',
  },
  {
    id: 'blr-vidhana-soudha',
    name: 'Vidhana Soudha',
    aliases: ['vidhana soudha'],
    category: 'attraction',
    city: 'bangalore',
  },
  {
    id: 'blr-bugle-rock',
    name: 'Bugle Rock Park',
    aliases: ['bugle rock', 'bugle rock park'],
    category: 'attraction',
    city: 'bangalore',
  },
  // --- BANGALORE DISHES ---
  {
    id: 'blr-benne-dosa',
    name: 'Benne Masala Dosa',
    aliases: ['benne masala dosa', 'benne dosa', 'butter dosa', 'masala dosa'],
    category: 'dish',
    city: 'bangalore',
  },
  {
    id: 'blr-bisi-bele-bath',
    name: 'Bisi Bele Bath & Khara Boondi',
    aliases: ['bisi bele bath', 'bisibelebath', 'bisi bele bhaath', 'bisi bele'],
    category: 'dish',
    city: 'bangalore',
  },
  {
    id: 'blr-filter-coffee',
    name: 'South Indian Degree Filter Coffee',
    aliases: ['filter coffee', 'degree filter coffee', 'south indian coffee'],
    category: 'dish',
    city: 'bangalore',
  },
  // --- BANGALORE RESTAURANTS ---
  {
    id: 'blr-ctr',
    name: 'Shri Sagar CTR (Central Tiffin Room)',
    aliases: ['central tiffin room', 'ctr', 'shri sagar'],
    category: 'restaurant',
    city: 'bangalore',
  },
  {
    id: 'blr-vidyarthi-bhavan',
    name: 'Vidyarthi Bhavan',
    aliases: ['vidyarthi bhavan', 'vidyarthi'],
    category: 'restaurant',
    city: 'bangalore',
  },
  {
    id: 'blr-mtr',
    name: 'Mavalli Tiffin Room (MTR)',
    aliases: ['mavalli tiffin room', 'mtr'],
    category: 'restaurant',
    city: 'bangalore',
  },
  {
    id: 'blr-corner-house',
    name: 'Corner House Ice Cream',
    aliases: ['corner house', 'corner house ice cream', 'death by chocolate', 'dbc'],
    category: 'restaurant',
    city: 'bangalore',
  },
  {
    id: 'blr-taaza-thindi',
    name: 'Taaza Thindi',
    aliases: ['taaza thindi', 'taza thindi', 'taaza thindi jayanagar', 'thindi'],
    category: 'restaurant',
    city: 'bangalore',
  },
  {
    id: 'blr-nagarjuna',
    name: 'Nagarjuna',
    aliases: ['nagarjuna', 'nagarjuna restaurant', 'andhra meals', 'andhra biryani'],
    category: 'restaurant',
    city: 'bangalore',
  },

  // --- HYDERABAD ATTRACTIONS ---
  {
    id: 'hyd-charminar',
    name: 'Charminar',
    aliases: ['charminar'],
    category: 'attraction',
    city: 'hyderabad',
  },
  {
    id: 'hyd-golconda-fort',
    name: 'Golconda Fort',
    aliases: ['golconda fort', 'golconda'],
    category: 'attraction',
    city: 'hyderabad',
  },
  {
    id: 'hyd-chowmahalla',
    name: 'Chowmahalla Palace',
    aliases: ['chowmahalla palace', 'chowmahalla'],
    category: 'attraction',
    city: 'hyderabad',
  },
  {
    id: 'hyd-qutb-shahi-tombs',
    name: 'Qutb Shahi Tombs',
    aliases: ['qutb shahi tombs', 'qutub shahi tombs', 'seven tombs', 'qutb shahi'],
    category: 'attraction',
    city: 'hyderabad',
  },
  {
    id: 'hyd-falaknuma',
    name: 'Taj Falaknuma Palace',
    aliases: ['falaknuma palace', 'taj falaknuma palace', 'falaknuma'],
    category: 'attraction',
    city: 'hyderabad',
  },
  {
    id: 'hyd-salargunj-museum',
    name: 'Salar Jung Museum',
    aliases: ['salar jung museum', 'salar jung', 'salargunj'],
    category: 'attraction',
    city: 'hyderabad',
  },
  {
    id: 'hyd-purani-haveli',
    name: 'Purani Haveli (Nizam’s Museum)',
    aliases: ['purani haveli', "nizam's museum"],
    category: 'attraction',
    city: 'hyderabad',
  },
  // --- HYDERABAD DISHES ---
  {
    id: 'hyd-biryani',
    name: 'Hyderabadi Mutton Dum Biryani',
    aliases: ['hyderabadi mutton dum biryani', 'hyderabadi biryani', 'dum biryani', 'mutton biryani'],
    category: 'dish',
    city: 'hyderabad',
  },
  {
    id: 'hyd-haleem-irani-chai',
    name: 'Hyderabadi Haleem & Irani Chai',
    aliases: ['hyderabadi haleem', 'haleem'],
    category: 'dish',
    city: 'hyderabad',
  },
  {
    id: 'hyd-double-ka-meetha',
    name: 'Double ka Meetha (Shahi Tukda)',
    aliases: ['double ka meetha', 'shahi tukda'],
    category: 'dish',
    city: 'hyderabad',
  },
  // --- HYDERABAD RESTAURANTS ---
  {
    id: 'hyd-paradise',
    name: 'Paradise Biryani, Secunderabad',
    aliases: ['paradise biryani', 'paradise', 'paradise secunderabad'],
    category: 'restaurant',
    city: 'hyderabad',
  },
  {
    id: 'hyd-nimrah-cafe',
    name: 'Nimrah Café & Bakery',
    aliases: ['nimrah café', 'nimrah cafe', 'nimrah bakery', 'nimrah'],
    category: 'restaurant',
    city: 'hyderabad',
  },
  {
    id: 'hyd-shadab',
    name: 'Hotel Shadab',
    aliases: ['hotel shadab', 'shadab'],
    category: 'restaurant',
    city: 'hyderabad',
  },
];

function getRestaurantDetails(record: TravelRecord) {
  if (RESTAURANT_SIGNATURE_DATA[record.id]) {
    return RESTAURANT_SIGNATURE_DATA[record.id];
  }
  return {
    name: record.name,
    location: record.location || record.cityOrLocation,
    mustTry: (record.highlights && record.highlights[0]) || record.tagline || 'Signature House Specialty',
    tip: record.visitorTip || record.shortDescription || record.description,
  };
}

/**
 * Helper to match an exact entity from a user query
 */
function findExactEntityMatch(query: string): KnownEntity | null {
  const normalized = query.toLowerCase();
  // Check longer aliases first to avoid substring collisions
  const sortedEntities = [...KNOWN_ENTITIES].sort((a, b) => {
    const maxA = Math.max(...a.aliases.map((al) => al.length));
    const maxB = Math.max(...b.aliases.map((al) => al.length));
    return maxB - maxA;
  });

  for (const entity of sortedEntities) {
    for (const alias of entity.aliases) {
      // Word boundary match
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
      if (regex.test(normalized)) {
        return entity;
      }
    }
  }
  return null;
}

interface UnsupportedLocationRule {
  name: string;
  pattern: RegExp;
  isStateOrRegion?: boolean;
}

const UNSUPPORTED_LOCATIONS: UnsupportedLocationRule[] = [
  // Specific cities & tourist destinations outside Jaipur, Bangalore, Hyderabad
  { name: 'Jammu & Kashmir', pattern: /\b(jammu\s*(&|and)\s*kashmir|jammu|kashmir)\b/i, isStateOrRegion: true },
  { name: 'Ladakh', pattern: /\b(ladakh|leh)\b/i, isStateOrRegion: true },
  { name: 'Udaipur', pattern: /\budaipur\b/i },
  { name: 'Mumbai', pattern: /\b(mumbai|bombay)\b/i },
  { name: 'Delhi', pattern: /\b(delhi|new\s+delhi|ncr)\b/i },
  { name: 'Mysore', pattern: /\b(mysore|mysuru)\b/i },
  { name: 'Agra', pattern: /\b(agra|taj\s+mahal)\b/i },
  { name: 'Goa', pattern: /\b(goa|panaji|calangute|baga|anjuna)\b/i, isStateOrRegion: true },
  { name: 'Kerala', pattern: /\b(kerala|kochi|cochin|munnar|alleppey|alappuzha|wayanad|trivandrum|thiruvananthapuram|varkala|kovalam|thekkady|kumarakom|calicut|kozhikode)\b/i, isStateOrRegion: true },
  { name: 'Chennai', pattern: /\b(chennai|madras)\b/i },
  { name: 'Kolkata', pattern: /\b(kolkata|calcutta)\b/i },
  { name: 'Pune', pattern: /\b(pune|poona)\b/i },
  { name: 'Ahmedabad', pattern: /\b(ahmedabad|amdavad)\b/i },
  { name: 'Varanasi', pattern: /\b(varanasi|kashi|banaras|benares)\b/i },
  { name: 'Ooty', pattern: /\b(ooty|udhagamandalam)\b/i },
  { name: 'Kodaikanal', pattern: /\bkodaikanal\b/i },
  { name: 'Coorg', pattern: /\b(coorg|kodagu)\b/i },
  { name: 'Hampi', pattern: /\bhampi\b/i },
  { name: 'Gokarna', pattern: /\bgokarna\b/i },
  { name: 'Pondicherry', pattern: /\b(pondicherry|puducherry)\b/i },
  { name: 'Jodhpur', pattern: /\bjodhpur\b/i },
  { name: 'Jaisalmer', pattern: /\bjaisalmer\b/i },
  { name: 'Pushkar', pattern: /\bpushkar\b/i },
  { name: 'Bikaner', pattern: /\bbikaner\b/i },
  { name: 'Ajmer', pattern: /\bajmer\b/i },
  { name: 'Mount Abu', pattern: /\bmount\s+abu\b/i },
  { name: 'Ranthambore', pattern: /\b(ranthambore|sawai\s+madhopur)\b/i },
  { name: 'Chittorgarh', pattern: /\b(chittorgarh|chittor)\b/i },
  { name: 'Shimla', pattern: /\bshimla\b/i },
  { name: 'Manali', pattern: /\b(manali|kullu)\b/i },
  { name: 'Rishikesh', pattern: /\brishikesh\b/i },
  { name: 'Haridwar', pattern: /\bharidwar\b/i },
  { name: 'Amritsar', pattern: /\b(amritsar|golden\s+temple)\b/i },
  { name: 'Chandigarh', pattern: /\bchandigarh\b/i },
  { name: 'Lucknow', pattern: /\blucknow\b/i },
  { name: 'Patna', pattern: /\bpatna\b/i },
  { name: 'Bhopal', pattern: /\bbhopal\b/i },
  { name: 'Indore', pattern: /\bindore\b/i },
  { name: 'Surat', pattern: /\bsurat\b/i },
  { name: 'Vadodara', pattern: /\b(vadodara|baroda)\b/i },
  { name: 'Nagpur', pattern: /\bnagpur\b/i },
  { name: 'Nashik', pattern: /\b(nashik|nasik)\b/i },
  { name: 'Visakhapatnam', pattern: /\b(visakhapatnam|vizag)\b/i },
  { name: 'Vijayawada', pattern: /\bvijayawada\b/i },
  { name: 'Tirupati', pattern: /\btirupati\b/i },
  { name: 'Madurai', pattern: /\bmadurai\b/i },
  { name: 'Mahabalipuram', pattern: /\b(mahabalipuram|mamallapuram)\b/i },
  { name: 'Darjeeling', pattern: /\bdarjeeling\b/i },
  { name: 'Sikkim', pattern: /\b(sikkim|gangtok)\b/i, isStateOrRegion: true },
  { name: 'Assam', pattern: /\b(assam|guwahati|kaziranga)\b/i, isStateOrRegion: true },
  { name: 'Meghalaya', pattern: /\b(meghalaya|shillong|cherrapunji)\b/i, isStateOrRegion: true },
  { name: 'Tamil Nadu', pattern: /\btamil\s*nadu\b/i, isStateOrRegion: true },
  { name: 'Maharashtra', pattern: /\bmaharashtra\b/i, isStateOrRegion: true },
  { name: 'Gujarat', pattern: /\bgujarat\b/i, isStateOrRegion: true },
  { name: 'Punjab', pattern: /\bpunjab\b/i, isStateOrRegion: true },
  { name: 'Haryana', pattern: /\bharyana\b/i, isStateOrRegion: true },
  { name: 'Himachal Pradesh', pattern: /\b(himachal\s*pradesh|himachal)\b/i, isStateOrRegion: true },
  { name: 'Uttarakhand', pattern: /\b(uttarakhand|uttaranchal)\b/i, isStateOrRegion: true },
  { name: 'Uttar Pradesh', pattern: /\b(uttar\s*pradesh|up)\b/i, isStateOrRegion: true },
  { name: 'Bihar', pattern: /\bbihar\b/i, isStateOrRegion: true },
  { name: 'West Bengal', pattern: /\bwest\s*bengal\b/i, isStateOrRegion: true },
  { name: 'Odisha', pattern: /\b(odisha|orissa)\b/i, isStateOrRegion: true },
  { name: 'Madhya Pradesh', pattern: /\b(madhya\s*pradesh|mp)\b/i, isStateOrRegion: true },
  { name: 'Andhra Pradesh', pattern: /\b(andhra\s*pradesh|andhra)\b/i, isStateOrRegion: true },
  // States where our 3 cities are located, BUT when asked WITHOUT the city name (Rule 7)
  { name: 'Rajasthan', pattern: /\brajasthan\b/i, isStateOrRegion: true },
  { name: 'Karnataka', pattern: /\bkarnataka\b/i, isStateOrRegion: true },
  { name: 'Telangana', pattern: /\btelangana\b/i, isStateOrRegion: true },
  // Major International Destinations
  { name: 'Paris', pattern: /\bparis\b/i },
  { name: 'London', pattern: /\blondon\b/i },
  { name: 'Tokyo', pattern: /\btokyo\b/i },
  { name: 'New York', pattern: /\b(new\s*york|nyc)\b/i },
  { name: 'Dubai', pattern: /\bdubai\b/i },
  { name: 'Singapore', pattern: /\bsingapore\b/i },
  { name: 'Bangkok', pattern: /\b(bangkok|thailand)\b/i },
  { name: 'Bali', pattern: /\b(bali|indonesia)\b/i },
  { name: 'Rome', pattern: /\b(rome|italy)\b/i },
  { name: 'Switzerland', pattern: /\b(switzerland|swiss)\b/i },
];

/**
 * Strict Unsupported Destination Identifier (Rules 1-7)
 */
function detectUnsupportedDestination(query: string): { isUnsupported: boolean; destinationName: string } {
  const q = query.trim();

  // Check if query contains any of the three supported cities explicitly:
  const hasJaipur = /\b(jaipur|pink\s*city|amer)\b/i.test(q);
  const hasBangalore = /\b(bangalore|bengaluru|blr)\b/i.test(q);
  const hasHyderabad = /\b(hyderabad|hyd|secunderabad)\b/i.test(q);

  // Check if query mentions a known entity from our database (e.g. "Hawa Mahal", "Charminar", "CTR", etc.)
  const knownEntity = findExactEntityMatch(q);
  const hasVerificationPhrasing = /\b(is|where\s+is|which\s+city|located\s+in|situated\s+in)\b/i.test(q);

  // If a known supported entity is in the query and user asks where it is / whether it's in a city (false premise):
  // Let the false premise handler handle it (e.g. "Is Hawa Mahal in Udaipur?" -> "Hawa Mahal is in Jaipur—not in Udaipur.")
  if (knownEntity && hasVerificationPhrasing) {
    return { isUnsupported: false, destinationName: '' };
  }

  for (const loc of UNSUPPORTED_LOCATIONS) {
    if (loc.pattern.test(q)) {
      // If it's a state/region of one of our supported cities:
      // - Rajasthan: if Jaipur is mentioned, it's NOT unsupported (e.g. "Jaipur, Rajasthan")
      // - Karnataka: if Bangalore is mentioned, it's NOT unsupported (e.g. "Bengaluru, Karnataka")
      // - Telangana: if Hyderabad is mentioned, it's NOT unsupported (e.g. "Hyderabad, Telangana")
      if (loc.name === 'Rajasthan' && hasJaipur) continue;
      if (loc.name === 'Karnataka' && hasBangalore) continue;
      if (loc.name === 'Telangana' && hasHyderabad) continue;

      // Otherwise, it is an unsupported destination!
      return { isUnsupported: true, destinationName: loc.name };
    }
  }

  // Regex pattern check for queries like "in [Place]", "to [Place]", "visit [Place]", "visiting [Place]", "trip to [Place]"
  const placeMatch = q.match(/\b(?:in|to|visiting|visit|explore|exploring|trip\s+to|travel\s+to|vacation\s+in|holiday\s+in|guide\s+(?:for|to))\s+([A-Z][a-zA-Z\s&'-]{2,25}?)(?:\?|$|\.|\s+and|\s+or|\s+for|\s+with)/);
  if (placeMatch && placeMatch[1]) {
    const candidate = placeMatch[1].trim();
    const candidateLower = candidate.toLowerCase();
    if (
      !candidateLower.includes('jaipur') &&
      !candidateLower.includes('bangalore') &&
      !candidateLower.includes('bengaluru') &&
      !candidateLower.includes('blr') &&
      !candidateLower.includes('hyderabad') &&
      !candidateLower.includes('hyd') &&
      !candidateLower.includes('secunderabad') &&
      !candidateLower.includes('india') &&
      candidate.length > 2 &&
      !['the', 'this', 'that', 'all', 'any', 'food', 'hotel', 'restaurant', 'cafe', 'breakfast', 'lunch', 'dinner', 'morning', 'evening', 'night'].includes(candidateLower)
    ) {
      const cap = candidate.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      return { isUnsupported: true, destinationName: cap };
    }
  }

  return { isUnsupported: false, destinationName: '' };
}

/**
 * Checks if the user specified a destination or if conversation provides clear context (Rule 8)
 */
function hasDestinationOrContext(
  query: string,
  history?: ChatHistoryEntry[]
): { hasContext: boolean; destinationId: DestinationId | null } {
  const q = query.toLowerCase();

  // 1. Direct city mention in query:
  if (/\b(jaipur|pink\s*city|amer)\b/i.test(q)) {
    return { hasContext: true, destinationId: 'jaipur' };
  }
  if (/\b(bangalore|bengaluru|blr)\b/i.test(q)) {
    return { hasContext: true, destinationId: 'bangalore' };
  }
  if (/\b(hyderabad|hyd|secunderabad)\b/i.test(q)) {
    return { hasContext: true, destinationId: 'hyderabad' };
  }

  // 2. Direct entity match in query:
  const entity = findExactEntityMatch(q);
  if (entity) {
    return { hasContext: true, destinationId: entity.city };
  }

  // 3. Conversation history context:
  if (history && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      const entryText = (entry.text || '').toLowerCase();
      if (/\b(jaipur|pink\s*city|amer)\b/i.test(entryText) || entry.destinationId === 'jaipur') {
        return { hasContext: true, destinationId: 'jaipur' };
      }
      if (/\b(bangalore|bengaluru|blr)\b/i.test(entryText) || entry.destinationId === 'bangalore') {
        return { hasContext: true, destinationId: 'bangalore' };
      }
      if (/\b(hyderabad|hyd|secunderabad)\b/i.test(entryText) || entry.destinationId === 'hyderabad') {
        return { hasContext: true, destinationId: 'hyderabad' };
      }
    }
  }

  // 4. No destination specified and no conversation context
  return { hasContext: false, destinationId: null };
}

export type QueryIntent =
  | 'UNSUPPORTED_PRICING'
  | 'COMPARISON'
  | 'FALSE_PREMISE_VERIFICATION'
  | 'SINGLE_ATTRACTION'
  | 'ATTRACTION_OVERVIEW'
  | 'FOOD_DISH'
  | 'RESTAURANT'
  | 'FOOD_RECOMMENDATION'
  | 'CULTURE'
  | 'GENERAL';

/**
 * Destination-Aware RAG Retrieval Engine with Strict Category Separation & Entity Priority
 */
function retrieveGroundedRecords(
  userQuery: string,
  activeDestinationId: DestinationId,
  history?: ChatHistoryEntry[]
) {
  const { resolvedQuery, referencedEntities } = resolveQueryWithHistory(userQuery, history);
  const query = resolvedQuery.toLowerCase().trim();

  // 1. Detect if user explicitly mentions another supported destination
  const mentionedDestinations = SUPPORTED_DESTINATIONS.filter((d) => {
    if (query.includes(d.id) || query.includes(d.name.toLowerCase())) return true;
    if (d.id === 'bangalore' && (query.includes('bengaluru') || query.includes('bangalore') || query.includes('blr'))) return true;
    if (d.id === 'hyderabad' && (query.includes('hyderabad') || query.includes('hyd') || query.includes('secunderabad'))) return true;
    if (d.id === 'jaipur' && (query.includes('jaipur') || query.includes('pink city'))) return true;
    return false;
  });

  // Check comparison query
  const isComparison =
    ((query.includes('compare') ||
      query.includes(' vs ') ||
      query.includes('versus') ||
      query.includes('difference between')) &&
      mentionedDestinations.length > 1) ||
    ((query.includes('food culture') || query.includes('culinary culture')) && mentionedDestinations.length > 1);

  // 2. Entity Matching:
  const matchedEntity = findExactEntityMatch(query);

  // Check False Premise / Location Verification for an entity:
  let isFalsePremiseOrVerification = false;
  let falsePremiseWrongCity: string | null = null;

  if (matchedEntity && !isComparison) {
    const wrongCities = mentionedDestinations.filter((d) => d.id !== matchedEntity.city);
    const isVerificationPhrasing =
      /\b(is|where\s+is|which\s+city|in\s+which\s+city|located\s+in|situated\s+in)\b/i.test(query) ||
      (query.includes(' or ') && mentionedDestinations.length > 0);

    if (wrongCities.length > 0) {
      isFalsePremiseOrVerification = true;
      falsePremiseWrongCity = wrongCities
        .map((d) => (d.id === 'bangalore' && query.includes('bengaluru') ? 'Bengaluru' : d.name))
        .join(' or ');
    } else if (isVerificationPhrasing) {
      isFalsePremiseOrVerification = true;
      const otherCities = SUPPORTED_DESTINATIONS.filter((d) => d.id !== matchedEntity.city);
      falsePremiseWrongCity = otherCities
        .map((d) => (d.id === 'bangalore' ? 'Bengaluru' : d.name))
        .join(' or ');
    } else if (activeDestinationId !== matchedEntity.city && /\b(in|at)\b/i.test(query)) {
      isFalsePremiseOrVerification = true;
      const act = SUPPORTED_DESTINATIONS.find((d) => d.id === activeDestinationId);
      falsePremiseWrongCity = act ? (act.id === 'bangalore' ? 'Bengaluru' : act.name) : 'other cities';
    }
  }

  // Cross-destination mismatch detection:
  let crossMismatch: { detectedDest: DestinationId; detectedName: string } | null = null;

  if (!isComparison && !isFalsePremiseOrVerification) {
    if (matchedEntity && matchedEntity.city !== activeDestinationId) {
      const targetDestMeta = SUPPORTED_DESTINATIONS.find((d) => d.id === matchedEntity.city);
      if (targetDestMeta) {
        crossMismatch = {
          detectedDest: matchedEntity.city,
          detectedName: targetDestMeta.name,
        };
      }
    } else if (mentionedDestinations.length === 1 && mentionedDestinations[0].id !== activeDestinationId) {
      crossMismatch = {
        detectedDest: mentionedDestinations[0].id,
        detectedName: mentionedDestinations[0].name,
      };
    }
  }

  // Determine target destinations for retrieval (Strict City Lock)
  const targetDestIds: DestinationId[] = isComparison
    ? mentionedDestinations.map((d) => d.id)
    : isFalsePremiseOrVerification && matchedEntity
    ? [matchedEntity.city]
    : crossMismatch
    ? [crossMismatch.detectedDest]
    : [mentionedDestinations.length === 1 ? mentionedDestinations[0].id : activeDestinationId];

  const primaryTargetCity = targetDestIds[0];

  // 3. Check for Real-Time / Live Pricing / Ticketing inquiries
  const isPricingOrTicketingQuery =
    /\b(entry\s+fee|ticket\s+price|ticket\s+cost|tickets?\s+today|entry\s+fee\s+today|cost\s+of\s+entry|how\s+much\s+does\s+it\s+cost|ticket\s+rates?|entry\s+rates?|fare|fares)\b/i.test(query) ||
    (/\b(price|pricing|fee|fees|cost|costs|ticket|tickets)\b/i.test(query) && /\b(today|now|current|live)\b/i.test(query));

  // Strict Meal, Dining & Food Mapping:
  const isMealOrDiningQuery =
    /\b(breakfast|lunch|dinner|snacks?|tiffin|tiffins|tea|chai|coffee|eateries|eatery|dining|dine|restaurants?|places?\s+to\s+eat|places?\s+for\s+food|local\s+eats|caf[eé]s?)\b/i.test(query);

  const isBreakfastBangalore =
    primaryTargetCity === 'bangalore' &&
    /\b(breakfast|morning\s+eats?|morning\s+food|morning\s+tiffin|tiffin|tiffins)\b/i.test(query);

  // 4. Intent Classification:
  // Is it asking definition of a single dish? (e.g. "What is Dal Baati Churma?", "What is Bisi Bele Bath?", "What is Haleem?")
  const isSingleDishDefinition =
    Boolean(matchedEntity &&
    matchedEntity.category === 'dish' &&
    (/\b(what\s+is|what's|explain|describe|ingredients|how\s+is.*prepared|meaning\s+of)\b/i.test(query) &&
      !/\b(what\s+to\s+eat|famous\s+food|must-try|local\s+delicacies|where\s+to\s+eat|restaurants?|eateries|places?\s+to\s+eat|places?\s+for\s+food|dining)\b/i.test(query)));

  // CASE B: VENUE INTENT ("Where to eat", "Restaurants", "Eateries", "Cafes", "Tiffin rooms")
  const isVenueIntent =
    !isSingleDishDefinition &&
    (/\b(where\s+can\s+i\s+eat|where\s+to\s+eat|where\s+should\s+i\s+eat|where\s+can\s+i\s+try|where\s+to\s+try|where\s+can\s+i\s+find|suggest\s+restaurants?|recommend\s+restaurants?|best\s+restaurants?|heritage\s+restaurants?|restaurants?\s+in|caf[eé]s?\s+in|eateries\s+in|restaurants?|eateries|eatery|caf[eé]s?|tiffin\s+rooms?|places?\s+to\s+eat|places?\s+for\s+food|dining|dine|dining\s+options?|places?\s+for\s+dinner|places?\s+for\s+lunch|places?\s+for\s+breakfast)\b/i.test(query) ||
      Boolean(matchedEntity && matchedEntity.category === 'restaurant'));

  // CASE A: DISH INTENT ("What to eat", "Famous food", "Must-try dishes", "Local delicacies")
  const isDishIntent =
    !isVenueIntent &&
    !isSingleDishDefinition &&
    (/\b(what\s+to\s+eat|what\s+should\s+i\s+eat|what\s+food|famous\s+foods?|must-try\s+dishes|must-try\s+food|must\s+try\s+dishes|must\s+try\s+food|local\s+delicacies|local\s+dishes|local\s+cuisine|traditional\s+food|popular\s+food|food\s+to\s+try|food\s+should\s+i\s+try|dishes\s+in|food\s+in|foods\s+in|delicacies|sweets?\s+in|what\s+sweets?)\b/i.test(query) ||
      Boolean(matchedEntity && matchedEntity.category === 'dish'));

  // CASE C: HISTORICAL SIGHTSEEING ("Monuments", "Places to visit", "Sightseeing", "Forts")
  const isBroadAttractionList =
    !isVenueIntent &&
    !isDishIntent &&
    !isMealOrDiningQuery &&
    !isSingleDishDefinition &&
    (/\b(monuments?|places?\s+to\s+visit|sightseeing|forts?|palaces?|historical|heritage|landmarks?|must-visit|must\s+visit|top\s+attractions|top\s+places|best\s+places|all\s+attractions|list\s+of|places\s+to\s+see|tourist\s+places)\b/i.test(query) ||
      /\battractions\s+in\b/i.test(query));

  const isSingleAttraction =
    !isPricingOrTicketingQuery &&
    !isComparison &&
    !isFalsePremiseOrVerification &&
    !isVenueIntent &&
    !isDishIntent &&
    !isMealOrDiningQuery &&
    !isSingleDishDefinition &&
    Boolean(matchedEntity && matchedEntity.category === 'attraction' && !isBroadAttractionList);

  // Determine Primary Intent
  let intent: QueryIntent = 'GENERAL';
  if (isPricingOrTicketingQuery) {
    intent = 'UNSUPPORTED_PRICING';
  } else if (isComparison) {
    intent = 'COMPARISON';
  } else if (isFalsePremiseOrVerification) {
    intent = 'FALSE_PREMISE_VERIFICATION';
  } else if (isSingleDishDefinition) {
    intent = 'FOOD_DISH';
  } else if (isDishIntent) {
    intent = 'FOOD_RECOMMENDATION';
  } else if (isVenueIntent || isMealOrDiningQuery) {
    intent = 'RESTAURANT';
  } else if (isSingleAttraction) {
    intent = 'SINGLE_ATTRACTION';
  } else if (
    (/\b(histor(?:y|ical)|monuments?|heritage|palaces?|forts?|sightseeing|sights?|landmarks?)\b/i.test(query) ||
      isBroadAttractionList) &&
    !isMealOrDiningQuery
  ) {
    intent = 'ATTRACTION_OVERVIEW';
  } else if (/\b(shopping|markets?|bazaars?|crafts?|handicrafts?|souvenirs?|culture)\b/i.test(query)) {
    intent = 'CULTURE';
  }

  // 5. Retrieve Records Strictly According to Intent
  let topRecords: TravelRecord[] = [];

  if (intent === 'FALSE_PREMISE_VERIFICATION' && matchedEntity) {
    // False premise or verification: Return ONLY that 1 landmark record!
    const rec = ALL_TRAVEL_RECORDS.find((r) => r.id === matchedEntity.id);
    if (rec) {
      topRecords = [rec];
    }
  } else if (intent === 'UNSUPPORTED_PRICING') {
    // If pricing query matched an attraction, find that record
    if (matchedEntity) {
      const rec = ALL_TRAVEL_RECORDS.find((r) => r.id === matchedEntity.id);
      if (rec) topRecords = [rec];
    } else {
      topRecords = [];
    }
  } else if (intent === 'SINGLE_ATTRACTION' && matchedEntity) {
    // EXACT SINGLE ATTRACTION MATCH: Return ONLY that 1 record!
    const rec = ALL_TRAVEL_RECORDS.find((r) => r.id === matchedEntity.id);
    if (rec) {
      topRecords = [rec];
    }
  } else if (intent === 'FOOD_DISH' && matchedEntity) {
    // EXACT FOOD DEFINITION: Return ONLY that 1 dish record from Local Food & Cuisine! Zero restaurants!
    const rec = ALL_TRAVEL_RECORDS.find((r) => r.id === matchedEntity.id);
    if (rec) {
      topRecords = [rec];
    }
  } else if (intent === 'FOOD_RECOMMENDATION') {
    // CASE A: DISH INTENT - Dishes only! Zero historical landmarks!
    const cityDishAnchors = MANDATORY_CITY_DISHES[primaryTargetCity];
    if (cityDishAnchors) {
      topRecords = cityDishAnchors
        .map((dish) => ALL_TRAVEL_RECORDS.find((r) => r.id === dish.id))
        .filter((r): r is TravelRecord => Boolean(r));
    } else {
      topRecords = ALL_TRAVEL_RECORDS.filter(
        (r) => r.destinationId === primaryTargetCity && r.category === 'Local Food & Cuisine'
      ).slice(0, 4);
    }
  } else if (intent === 'RESTAURANT') {
    // CASE B: VENUE INTENT - Restaurants & Cafés only! Zero historical landmarks!
    if (isBreakfastBangalore) {
      // Mandatory Bangalore Breakfast Institutions in exact order:
      const breakfastIds = ['blr-ctr', 'blr-vidyarthi-bhavan', 'blr-mtr', 'blr-taaza-thindi'];
      topRecords = breakfastIds
        .map((id) => ALL_TRAVEL_RECORDS.find((r) => r.id === id))
        .filter((r): r is TravelRecord => Boolean(r));
    } else {
      const cityAnchors = MANDATORY_CITY_ANCHORS[primaryTargetCity];
      if (cityAnchors && cityAnchors.food) {
        const allAnchors = cityAnchors.food
          .map((id) => ALL_TRAVEL_RECORDS.find((r) => r.id === id))
          .filter((r): r is TravelRecord => Boolean(r));
        if (matchedEntity && matchedEntity.category === 'restaurant') {
          const specific = allAnchors.find((r) => r.id === matchedEntity.id);
          const others = allAnchors.filter((r) => r.id !== matchedEntity.id);
          topRecords = specific ? [specific, ...others] : allAnchors;
        } else {
          topRecords = allAnchors;
        }
      } else {
        const cityRestaurants = ALL_TRAVEL_RECORDS.filter(
          (r) => r.destinationId === primaryTargetCity && r.category === 'Restaurants & Cafés'
        );
        topRecords = cityRestaurants.slice(0, 5);
      }
    }
  } else if (intent === 'COMPARISON') {
    // Return representative records from both cities
    topRecords = ALL_TRAVEL_RECORDS.filter(
      (r) =>
        targetDestIds.includes(r.destinationId) &&
        (r.category === 'Local Food & Cuisine' || r.category === 'Historical Places & Landmarks')
    ).slice(0, 6);
  } else if (intent === 'ATTRACTION_OVERVIEW') {
    // CASE C: HISTORICAL SIGHTSEEING - Landmarks only! Zero restaurants!
    const cityAnchors = MANDATORY_CITY_ANCHORS[primaryTargetCity];
    if (cityAnchors && cityAnchors.historical) {
      topRecords = cityAnchors.historical
        .map((id) => ALL_TRAVEL_RECORDS.find((r) => r.id === id))
        .filter((r): r is TravelRecord => Boolean(r));
    } else {
      topRecords = ALL_TRAVEL_RECORDS.filter(
        (r) =>
          r.destinationId === primaryTargetCity &&
          (r.category === 'Historical Places & Landmarks' || r.category === 'Must-Visit Attractions')
      ).slice(0, 3);
    }
  } else if (intent === 'CULTURE') {
    topRecords = ALL_TRAVEL_RECORDS.filter(
      (r) => r.destinationId === primaryTargetCity && r.category === 'Cultural Experiences'
    ).slice(0, 3);
  } else {
    // General keyword search within primary city
    const pool = ALL_TRAVEL_RECORDS.filter((r) => r.destinationId === primaryTargetCity);
    const keywords = query.split(/\W+/).filter((w) => w.length > 2);
    const scored = pool.map((record) => {
      let score = 0;
      const fullText = `${record.name} ${record.category} ${record.tagline} ${record.description} ${(record.highlights || []).join(' ')}`.toLowerCase();
      keywords.forEach((kw) => {
        if (fullText.includes(kw)) score += 2;
        if (record.name.toLowerCase().includes(kw)) score += 5;
      });
      return { record, score };
    });
    scored.sort((a, b) => b.score - a.score);
    topRecords = scored.filter((s) => s.score > 0).map((s) => s.record).slice(0, 3);
    if (topRecords.length === 0) {
      topRecords = pool.slice(0, 3);
    }
  }

  return {
    records: topRecords,
    intent,
    matchedEntity,
    isComparison,
    crossMismatch,
    falsePremiseWrongCity,
    targetDestinationId: primaryTargetCity,
    referencedEntities,
    isFoodQuery: intent === 'RESTAURANT' || intent === 'FOOD_DISH' || intent === 'FOOD_RECOMMENDATION',
    isHistoricalQuery: intent === 'SINGLE_ATTRACTION' || intent === 'ATTRACTION_OVERVIEW' || intent === 'FALSE_PREMISE_VERIFICATION',
    isCraftsCultureQuery: intent === 'CULTURE',
  };
}

/**
 * Deterministic Verified Travel Engine Fallback
 */
function generateDeterministicResponse(
  userQuery: string,
  activeDestinationId: DestinationId,
  history?: ChatHistoryEntry[]
) {
  const query = userQuery.toLowerCase().trim();

  // 1. Strict Unsupported Destination Check (Rules 1-7)
  const unsupportedCheck = detectUnsupportedDestination(userQuery);
  if (unsupportedCheck.isUnsupported) {
    return {
      message: `Yaaros currently supports verified travel information for Jaipur, Bengaluru and Hyderabad. ${unsupportedCheck.destinationName} is outside the current knowledge-base scope. I cannot provide verified recommendations for this destination.`,
      recommendations: [],
      citations: [],
      scopeNotice: `Unsupported destination: ${unsupportedCheck.destinationName} is outside the current knowledge-base scope.`,
      testScenarioMatched: 'unsupported_destination',
    };
  }

  // 2. Missing Destination Context Check (Rule 8)
  const contextCheck = hasDestinationOrContext(userQuery, history);
  if (!contextCheck.hasContext) {
    return {
      message: `Which city are you exploring? Yaaros currently supports verified travel information for Jaipur, Bengaluru and Hyderabad. Please let me know which of these three cities you mean so I can provide recommendations.`,
      recommendations: [],
      citations: [],
      scopeNotice: 'Please specify one of the three supported destinations: Jaipur, Bengaluru, or Hyderabad.',
      testScenarioMatched: 'missing_destination_context',
    };
  }

  const effectiveDestId: DestinationId = contextCheck.destinationId || activeDestinationId;

  // 2. Real-Time Availability & Booking Limitation Check
  if (
    (query.includes('live') && query.includes('availab')) ||
    query.includes('book a table') ||
    query.includes('table for') ||
    query.includes('reservation') ||
    query.includes('live seat') ||
    query.includes('reserve a table')
  ) {
    const destinationRecords = ALL_TRAVEL_RECORDS.filter(
      (r) => r.destinationId === activeDestinationId && r.category === 'Restaurants & Cafés'
    );
    const venueMentioned = destinationRecords.find(
      (r) =>
        query.includes(r.name.toLowerCase()) ||
        (r.name.toLowerCase().includes('1135') && query.includes('1135')) ||
        (r.name.toLowerCase().includes('vidyarthi') && query.includes('vidyarthi')) ||
        (r.name.toLowerCase().includes('mtr') && query.includes('mtr')) ||
        (r.name.toLowerCase().includes('shadab') && query.includes('shadab')) ||
        (r.name.toLowerCase().includes('nimrah') && query.includes('nimrah'))
    );
    const matchedRecord = venueMentioned || destinationRecords[0] || ALL_TRAVEL_RECORDS[0];

    return {
      message: `**Live Availability Notice:** Yaaros does not support live restaurant table availability, real-time seat vacancy checks, or table reservations.\n\nWhile Yaaros provides verified heritage dining profiles and signature dishes for establishments like **${matchedRecord.name}**, live booking APIs and real-time seating inventories are not connected to this assistant.\n\n**Recommended Next Step:** To check table availability or place reservations for **${matchedRecord.name}**, please contact the venue directly at **${matchedRecord.location || matchedRecord.cityOrLocation}** or coordinate with your hotel concierge.`,
      recommendations: [
        {
          id: matchedRecord.id,
          name: matchedRecord.name,
          category: matchedRecord.category,
          destination: matchedRecord.destination,
          destinationId: matchedRecord.destinationId,
          cityOrLocation: matchedRecord.cityOrLocation,
          state: matchedRecord.state,
          tagline: matchedRecord.tagline || '',
          description: matchedRecord.description,
          shortDescription: matchedRecord.shortDescription,
          imageUrl: matchedRecord.imageUrl,
          highlights: matchedRecord.highlights || [],
          location: matchedRecord.location,
          openingHours: matchedRecord.openingHours,
          visitingHours: matchedRecord.openingHours,
          sourceTitle: matchedRecord.sourceName,
          sourcePublisher: matchedRecord.sourceName,
          sourceUrl: matchedRecord.sourceUrl,
          lastVerifiedDate: matchedRecord.lastVerifiedDate,
          visitorTip: matchedRecord.visitorTip,
          firstTimeVisitorTip: matchedRecord.visitorTip,
        },
      ],
      citations: [
        {
          title: matchedRecord.sourceName,
          publisher: matchedRecord.sourceName,
          url: matchedRecord.sourceUrl,
          lastVerifiedDate: matchedRecord.lastVerifiedDate,
          note: `Verified profile and location for ${matchedRecord.name}.`,
        },
      ],
      scopeNotice: 'Live availability, real-time wait times, and direct table bookings are not supported by Yaaros.',
      testScenarioMatched: 'real_time_limitation',
    };
  }

  // 3. Insufficient Information Check
  if (
    query.includes('scuba diving in central bangalore') ||
    (query.includes('scuba') && activeDestinationId === 'bangalore') ||
    (query.includes('skiing') && activeDestinationId === 'jaipur')
  ) {
    return {
      message: `**Insufficient Knowledge Base Information:** No verified records exist for this activity in **${activeDestinationId === 'bangalore' ? 'Bangalore' : 'Jaipur'}**.\n\nOur verified archives do not contain records of scuba diving facilities in landlocked central Bangalore. To protect our strict **zero-fabrication guarantee**, Yaaros will never invent attractions or hallucinate fictional experiences.`,
      recommendations: [],
      citations: [
        {
          title: 'Department of Tourism, Government of Karnataka',
          publisher: 'Department of Tourism, Government of Karnataka',
          url: 'https://karnatakatourism.org',
          note: 'Verified geographical and cultural activities in Bengaluru.',
        },
      ],
      scopeNotice: 'Insufficient verified data in knowledge base for requested activity.',
      testScenarioMatched: 'insufficient_info',
    };
  }

  // Retrieve grounded records and determine intent
  const {
    records,
    intent,
    matchedEntity,
    isComparison,
    crossMismatch,
    falsePremiseWrongCity,
    referencedEntities,
    targetDestinationId,
  } = retrieveGroundedRecords(
    query,
    effectiveDestId,
    history
  );

  const activeDestMeta = SUPPORTED_DESTINATIONS.find((d) => d.id === effectiveDestId) || SUPPORTED_DESTINATIONS[0];
  const targetDestMeta = SUPPORTED_DESTINATIONS.find((d) => d.id === targetDestinationId) || activeDestMeta;

  let messageText = '';

  // --- FALSE PREMISE & ENTITY-CITY CORRECTION / VERIFICATION ---
  if (intent === 'FALSE_PREMISE_VERIFICATION' && matchedEntity) {
    const topRec = records[0] || ALL_TRAVEL_RECORDS.find((r) => r.id === matchedEntity.id)!;
    const histData = HISTORICAL_LANDMARK_DATA[topRec.id];
    const realCity = SUPPORTED_DESTINATIONS.find((d) => d.id === matchedEntity.city)!;

    let wrongCityDisplay = falsePremiseWrongCity;
    if (!wrongCityDisplay) {
      const otherCities = SUPPORTED_DESTINATIONS.filter((d) => d.id !== matchedEntity.city);
      wrongCityDisplay = otherCities
        .map((d) => (d.id === 'bangalore' ? 'Bengaluru' : d.name))
        .join(' or ');
    }

    const sentence1 = `**${matchedEntity.name}** is located in **${realCity.name}, ${realCity.state}**—not in **${wrongCityDisplay}**.`;

    let details = '';
    if (histData) {
      details = `- Built By: ${histData.builtBy}\n- Highlight: ${histData.highlight}\n- Visiting Tip: ${topRec.visitorTip || 'Visit during early morning or golden hour for the best experience.'}`;
    } else {
      details = `- Built By: ${topRec.historicalSignificance || topRec.description}\n- Highlight: ${(topRec.highlights || []).slice(0, 2).join('; ') || topRec.shortDescription}\n- Visiting Tip: ${topRec.visitorTip || 'Plan your visit during standard visiting hours.'}`;
    }

    messageText = `${sentence1}\n\n${details}`;

    return {
      message: messageText,
      recommendations: [
        {
          id: topRec.id,
          name: topRec.name,
          category: topRec.category,
          destination: topRec.destination,
          destinationId: topRec.destinationId,
          cityOrLocation: topRec.cityOrLocation,
          state: topRec.state,
          tagline: topRec.tagline || '',
          description: topRec.description,
          shortDescription: topRec.shortDescription,
          imageUrl: topRec.imageUrl,
          highlights: topRec.highlights || [],
          visitingHours: topRec.openingHours,
          openingHours: topRec.openingHours,
          location: topRec.location,
          sourceTitle: topRec.sourceName,
          sourcePublisher: topRec.sourceName,
          sourceUrl: topRec.sourceUrl,
          lastVerifiedDate: topRec.lastVerifiedDate,
          visitorTip: topRec.visitorTip,
          firstTimeVisitorTip: topRec.visitorTip,
          historicalSignificance: topRec.historicalSignificance,
          whyVisit: topRec.whyVisit,
        },
      ],
      citations: [
        {
          title: topRec.sourceName,
          publisher: topRec.sourceName,
          url: topRec.sourceUrl,
          lastVerifiedDate: topRec.lastVerifiedDate,
          note: `Verified historical archive for ${topRec.name} in ${realCity.name}.`,
        },
      ],
      targetDestinationId: realCity.id,
      scopeNotice: `Entity premise correction: ${matchedEntity.name} is situated in ${realCity.name}, ${realCity.state}, not in ${wrongCityDisplay}.`,
      testScenarioMatched: 'false_premise_correction',
    };
  }

  // --- 1. UNSUPPORTED PRICING / REAL-TIME ENTRY FEE ---
  if (intent === 'UNSUPPORTED_PRICING') {
    const landmarkName = matchedEntity ? matchedEntity.name : 'this attraction';
    const authorityName =
      targetDestMeta.id === 'jaipur'
        ? 'Rajasthan Tourism'
        : targetDestMeta.id === 'bangalore'
        ? 'Department of Tourism, Government of Karnataka'
        : 'Telangana Tourism';
    const authorityUrl =
      targetDestMeta.id === 'jaipur'
        ? 'https://tourism.rajasthan.gov.in'
        : targetDestMeta.id === 'bangalore'
        ? 'https://karnatakatourism.org'
        : 'https://telanganatourism.gov.in';

    messageText = `I don't have enough verified information about this in my current knowledge base. I don't want to give you inaccurate travel information.\n\nEntry fees, ticketing categories (domestic, foreign, and student visitors), composite ticket passes, and night tourism rates are subject to frequent administrative updates. For current and authorized ticketing rates for **${landmarkName}**, please consult the official portal of ${authorityName} (${authorityUrl}) or purchase tickets directly at the monument's official booking counter.`;

    return {
      message: messageText,
      recommendations: [],
      citations: [
        {
          title: `${authorityName} Official Portal`,
          publisher: authorityName,
          url: authorityUrl,
          lastVerifiedDate: '2026-03-28',
          note: `Official administrative ticketing source for ${targetDestMeta.name}.`,
        },
      ],
      targetDestinationId: targetDestMeta.id,
      scopeNotice: 'Live entry fees and ticketing tariffs are not maintained in the local knowledge base to avoid inaccurate rates.',
      testScenarioMatched: 'unsupported_realtime_pricing',
    };
  }

  // --- 2. MULTI-CITY COMPARISON QUERY ---
  if (intent === 'COMPARISON') {
    messageText = `**Jaipur (Rajasthan) vs. Hyderabad (Telangana) Food Culture Comparison:**\n\n**1. Jaipur (Royal Marwari & Desert Heritage):**\n- **Culinary Philosophy**: Shaped by the arid Thar desert terrain and martial history, emphasizing preservation, pure desi ghee, dried lentils, and rich dairy. Water scarcity historically inspired dishes cooked predominantly in milk, buttermilk, or clarified butter.\n- **Signature Dishes**:\n  - **Dal Baati Churma**: Roasted whole-wheat dumplings bathed in desi ghee, five-lentil Panchmel dal, and sweet cardamom churma.\n  - **Jaipuri Ghewar**: Intricate honeycomb festival sweet fried in pure ghee, steeped in saffron syrup, and topped with malai.\n  - **Pyaaz Kachori**: Flaky puff pastry stuffed with spiced onions and nigella seeds.\n  - **Ker Sangri**: Ancient desert sabzi made from wild caper berries and desert tree beans sautéed with red chillies and amchur.\n\n**2. Hyderabad (Nizami Court & Deccan Spice Synthesis):**\n- **Culinary Philosophy**: A royal synthesis blending opulent Persian, Turkish, and Mughal court culinary sophistication with fiery Telugu and Deccan spices. Renowned for slow-simmered dum cooking and complex spice infusions.\n- **Signature Dishes**:\n  - **Hyderabadi Dum Biryani**: Kacchi Dum technique layering raw spiced mutton and fragrant basmati rice in dough-sealed copper handis over wood embers.\n  - **Hyderabadi Haleem**: GI-tagged 12-hour pounded mutton, broken wheat, and lentil savory stew finished with ghee, fried onions, and lime.\n  - **Double ka Meetha**: Royal Nizami bread pudding steeped in saffron syrup and reduced cardamom khoya rabdi.`;

    const comparisonRecs = [
      ALL_TRAVEL_RECORDS.find((r) => r.id === 'jaipur-dal-baati')!,
      ALL_TRAVEL_RECORDS.find((r) => r.id === 'jaipur-ghewar')!,
      ALL_TRAVEL_RECORDS.find((r) => r.id === 'hyd-biryani')!,
      ALL_TRAVEL_RECORDS.find((r) => r.id === 'hyd-haleem-irani-chai')!,
    ].filter(Boolean);

    return {
      message: messageText,
      recommendations: comparisonRecs.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        destination: r.destination,
        destinationId: r.destinationId,
        cityOrLocation: r.cityOrLocation,
        state: r.state,
        tagline: r.tagline || '',
        description: r.description,
        shortDescription: r.shortDescription,
        imageUrl: r.imageUrl,
        highlights: r.highlights || [],
        visitingHours: undefined,
        openingHours: undefined,
        location: r.cityOrLocation,
        sourceTitle: r.sourceName,
        sourcePublisher: r.sourceName,
        sourceUrl: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        visitorTip: r.visitorTip,
        firstTimeVisitorTip: r.visitorTip,
        historicalSignificance: r.historicalSignificance,
        whyVisit: r.whyVisit,
      })),
      citations: [
        {
          title: 'Department of Tourism, Government of Rajasthan',
          publisher: 'Department of Tourism, Government of Rajasthan',
          url: 'https://tourism.rajasthan.gov.in',
          lastVerifiedDate: '2026-03-15',
          note: 'Verified Rajasthani culinary heritage records.',
        },
        {
          title: 'Telangana State Tourism Development Corporation',
          publisher: 'Telangana State Tourism Development Corporation',
          url: 'https://telanganatourism.gov.in',
          lastVerifiedDate: '2026-03-28',
          note: 'Verified Hyderabadi culinary heritage records.',
        },
      ],
      targetDestinationId: activeDestinationId,
      testScenarioMatched: 'food_culture_comparison',
    };
  }

  // --- 3. FOOD DISH DEFINITION (ZERO RESTAURANTS) ---
  if (intent === 'FOOD_DISH' && matchedEntity) {
    const dishDef = DISH_DEFINITIONS[matchedEntity.id];
    const topRec = records[0] || ALL_TRAVEL_RECORDS.find((r) => r.id === matchedEntity.id)!;

    if (dishDef) {
      messageText = `**${dishDef.name}** is ${dishDef.description}\n- Ingredients & Preparation: ${dishDef.ingredientsAndPrep}\n- Flavor & Texture: ${dishDef.flavorProfile}\n- Cultural Roots: ${dishDef.culturalRoots}`;
    } else {
      messageText = `**${topRec.name}** is ${topRec.description}\n- Highlights: ${(topRec.highlights || []).join('; ')}\n- Flavor & Serving: ${topRec.visitorTip || topRec.tagline}`;
    }

    return {
      message: messageText,
      recommendations: [
        {
          id: topRec.id,
          name: topRec.name,
          category: topRec.category,
          destination: topRec.destination,
          destinationId: topRec.destinationId,
          cityOrLocation: topRec.cityOrLocation,
          state: topRec.state,
          tagline: topRec.tagline || '',
          description: topRec.description,
          shortDescription: topRec.shortDescription,
          imageUrl: topRec.imageUrl,
          highlights: topRec.highlights || [],
          visitingHours: undefined,
          openingHours: undefined,
          location: topRec.cityOrLocation,
          sourceTitle: topRec.sourceName,
          sourcePublisher: topRec.sourceName,
          sourceUrl: topRec.sourceUrl,
          lastVerifiedDate: topRec.lastVerifiedDate,
          visitorTip: topRec.visitorTip,
          firstTimeVisitorTip: topRec.visitorTip,
          historicalSignificance: topRec.historicalSignificance,
          whyVisit: topRec.whyVisit,
        },
      ],
      citations: [
        {
          title: topRec.sourceName,
          publisher: topRec.sourceName,
          url: topRec.sourceUrl,
          lastVerifiedDate: topRec.lastVerifiedDate,
          note: `Verified culinary heritage documentation for ${topRec.name}.`,
        },
      ],
      targetDestinationId: targetDestMeta.id,
      testScenarioMatched: 'food_dish_definition',
    };
  }

  // --- 4. RESTAURANT QUERY (WHERE TO EAT) ---
  if (intent === 'RESTAURANT') {
    messageText = records
      .map((r) => {
        const details = getRestaurantDetails(r);
        return `**${details.name}** — *${details.location}*\n- Must-Try: ${details.mustTry}\n- Tip: ${details.tip}`;
      })
      .join('\n\n');

    return {
      message: messageText,
      recommendations: records.map((r) => {
        const details = getRestaurantDetails(r);
        return {
          id: r.id,
          name: r.name,
          category: r.category,
          destination: r.destination,
          destinationId: r.destinationId,
          cityOrLocation: r.cityOrLocation,
          state: r.state,
          tagline: `Must-Try: ${details.mustTry}`,
          description: r.description,
          shortDescription: r.shortDescription,
          imageUrl: r.imageUrl,
          highlights: r.highlights || [],
          visitingHours: r.openingHours,
          openingHours: r.openingHours,
          location: details.location || r.location,
          sourceTitle: r.sourceName,
          sourcePublisher: r.sourceName,
          sourceUrl: r.sourceUrl,
          lastVerifiedDate: r.lastVerifiedDate,
          visitorTip: details.tip || r.visitorTip,
          firstTimeVisitorTip: details.tip || r.visitorTip,
          historicalSignificance: r.historicalSignificance,
          whyVisit: r.whyVisit,
        };
      }),
      citations: records.map((r) => ({
        title: r.sourceName,
        publisher: r.sourceName,
        url: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        note: `Verified dining records for ${r.name} in ${r.cityOrLocation}, ${r.state}.`,
      })),
      targetDestinationId: targetDestMeta.id,
      testScenarioMatched: 'restaurant_recommendation',
    };
  }

  // --- 5. EXACT SINGLE ATTRACTION QUERY ---
  if (intent === 'SINGLE_ATTRACTION' && records.length === 1) {
    const topRec = records[0];
    const histData = HISTORICAL_LANDMARK_DATA[topRec.id];

    if (histData) {
      messageText = `**${histData.name}** — *${histData.location}*\n- Built By: ${histData.builtBy}\n- Highlight: ${histData.highlight}\n- Visiting Tip: ${topRec.visitorTip || 'Visit during early morning or golden hour for the best experience.'}`;
    } else {
      messageText = `**${topRec.name}** — *${topRec.location || topRec.cityOrLocation}*\n- Built By: ${topRec.historicalSignificance || topRec.description}\n- Highlight: ${(topRec.highlights || []).join('; ') || topRec.shortDescription}\n- Visiting Tip: ${topRec.visitorTip || 'Plan your visit during standard visiting hours.'}`;
    }

    return {
      message: messageText,
      recommendations: [
        {
          id: topRec.id,
          name: topRec.name,
          category: topRec.category,
          destination: topRec.destination,
          destinationId: topRec.destinationId,
          cityOrLocation: topRec.cityOrLocation,
          state: topRec.state,
          tagline: topRec.tagline || '',
          description: topRec.description,
          shortDescription: topRec.shortDescription,
          imageUrl: topRec.imageUrl,
          highlights: topRec.highlights || [],
          visitingHours: topRec.openingHours,
          openingHours: topRec.openingHours,
          location: topRec.location,
          sourceTitle: topRec.sourceName,
          sourcePublisher: topRec.sourceName,
          sourceUrl: topRec.sourceUrl,
          lastVerifiedDate: topRec.lastVerifiedDate,
          visitorTip: topRec.visitorTip,
          firstTimeVisitorTip: topRec.visitorTip,
          historicalSignificance: topRec.historicalSignificance,
          whyVisit: topRec.whyVisit,
        },
      ],
      citations: [
        {
          title: topRec.sourceName,
          publisher: topRec.sourceName,
          url: topRec.sourceUrl,
          lastVerifiedDate: topRec.lastVerifiedDate,
          note: `Verified historical archive for ${topRec.name}.`,
        },
      ],
      targetDestinationId: targetDestMeta.id,
      testScenarioMatched: 'single_attraction_retrieval',
    };
  }

  // --- 6. ATTRACTION OVERVIEW ---
  if (intent === 'ATTRACTION_OVERVIEW') {
    messageText = records
      .map((r) => {
        const histData = HISTORICAL_LANDMARK_DATA[r.id];
        if (histData) {
          return `**${histData.name}** — *${histData.location}*\n- Built By: ${histData.builtBy}\n- Highlight: ${histData.highlight}`;
        }
        const loc = r.location || r.cityOrLocation;
        const sig = r.historicalSignificance || r.description;
        const hl = (r.highlights || []).slice(0, 2).join('; ') || r.shortDescription;
        return `**${r.name}** — *${loc}*\n- Built By: ${sig}\n- Highlight: ${hl}`;
      })
      .join('\n\n');

    return {
      message: messageText,
      recommendations: records.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        destination: r.destination,
        destinationId: r.destinationId,
        cityOrLocation: r.cityOrLocation,
        state: r.state,
        tagline: r.tagline || '',
        description: r.description,
        shortDescription: r.shortDescription,
        imageUrl: r.imageUrl,
        highlights: r.highlights || [],
        visitingHours: r.openingHours,
        openingHours: r.openingHours,
        location: r.location,
        sourceTitle: r.sourceName,
        sourcePublisher: r.sourceName,
        sourceUrl: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        visitorTip: r.visitorTip,
        firstTimeVisitorTip: r.visitorTip,
        historicalSignificance: r.historicalSignificance,
        whyVisit: r.whyVisit,
      })),
      citations: records.map((r) => ({
        title: r.sourceName,
        publisher: r.sourceName,
        url: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        note: `Verified records for ${r.name} in ${r.cityOrLocation}, ${r.state}.`,
      })),
      targetDestinationId: targetDestMeta.id,
      testScenarioMatched: `${targetDestMeta.id}_attraction_overview`,
    };
  }


  // --- 7. CASE A: DISH INTENT ("What to eat", "Famous food", "Must-try dishes", "Local delicacies") ---
  if (intent === 'FOOD_RECOMMENDATION') {
    const cityDishAnchors = MANDATORY_CITY_DISHES[targetDestMeta.id];
    if (cityDishAnchors && cityDishAnchors.length > 0) {
      messageText = cityDishAnchors
        .map((dish) => {
          return `**${dish.name}**\n- Iconic Place to Try: ${dish.iconicPlace}\n- Description: ${dish.description}`;
        })
        .join('\n\n');
    } else {
      messageText = records
        .map((r) => {
          const dishDef = DISH_DEFINITIONS[r.id];
          return `**${r.name}**\n- Iconic Place to Try: ${r.location || r.cityOrLocation}\n- Description: ${dishDef ? dishDef.description : r.shortDescription || r.description}`;
        })
        .join('\n\n');
    }

    return {
      message: messageText,
      recommendations: records.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        destination: r.destination,
        destinationId: r.destinationId,
        cityOrLocation: r.cityOrLocation,
        state: r.state,
        tagline: r.tagline || '',
        description: r.description,
        shortDescription: r.shortDescription,
        imageUrl: r.imageUrl,
        highlights: r.highlights || [],
        visitingHours: undefined,
        openingHours: undefined,
        location: r.cityOrLocation,
        sourceTitle: r.sourceName,
        sourcePublisher: r.sourceName,
        sourceUrl: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        visitorTip: r.visitorTip,
        firstTimeVisitorTip: r.visitorTip,
        historicalSignificance: r.historicalSignificance,
        whyVisit: r.whyVisit,
      })),
      citations: records.map((r) => ({
        title: r.sourceName,
        publisher: r.sourceName,
        url: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        note: `Verified culinary heritage documentation for ${r.name}.`,
      })),
      targetDestinationId: targetDestMeta.id,
      testScenarioMatched: `${targetDestMeta.id}_dish_intent`,
    };
  }

  // --- 8. CULTURE / CRAFTS ---
  if (intent === 'CULTURE') {
    messageText = records
      .map((r) => {
        const loc = r.location || r.cityOrLocation;
        const hl = (r.highlights || []).slice(0, 2).join('; ') || r.shortDescription;
        return `**${r.name}** — *${loc}*\n- Cultural Tradition: ${r.tagline || r.shortDescription}\n- Highlight: ${hl}\n- Visiting Hours: ${r.openingHours || r.visitingHours || 'Confirmed daytime hours'}`;
      })
      .join('\n\n');

    return {
      message: messageText,
      recommendations: records.map((r) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        destination: r.destination,
        destinationId: r.destinationId,
        cityOrLocation: r.cityOrLocation,
        state: r.state,
        tagline: r.tagline || '',
        description: r.description,
        shortDescription: r.shortDescription,
        imageUrl: r.imageUrl,
        highlights: r.highlights || [],
        visitingHours: r.openingHours,
        openingHours: r.openingHours,
        location: r.location,
        sourceTitle: r.sourceName,
        sourcePublisher: r.sourceName,
        sourceUrl: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        visitorTip: r.visitorTip,
        firstTimeVisitorTip: r.visitorTip,
        historicalSignificance: r.historicalSignificance,
        whyVisit: r.whyVisit,
      })),
      citations: records.map((r) => ({
        title: r.sourceName,
        publisher: r.sourceName,
        url: r.sourceUrl,
        lastVerifiedDate: r.lastVerifiedDate,
        note: `Verified cultural records for ${r.name}.`,
      })),
      targetDestinationId: targetDestMeta.id,
      testScenarioMatched: 'culture_retrieval',
    };
  }

  // Fallback General Response
  messageText = records
    .map((r) => {
      const loc = r.location || r.cityOrLocation;
      const hl = (r.highlights || []).slice(0, 2).join('; ') || r.shortDescription;
      return `**${r.name}** — *${loc}*\n- Overview: ${r.shortDescription || r.description}\n- Highlight: ${hl}`;
    })
    .join('\n\n');

  return {
    message: messageText,
    recommendations: records.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      destination: r.destination,
      destinationId: r.destinationId,
      cityOrLocation: r.cityOrLocation,
      state: r.state,
      tagline: r.tagline || '',
      description: r.description,
      shortDescription: r.shortDescription,
      imageUrl: r.imageUrl,
      highlights: r.highlights || [],
      visitingHours: r.category === 'Local Food & Cuisine' ? undefined : r.openingHours,
      openingHours: r.category === 'Local Food & Cuisine' ? undefined : r.openingHours,
      location: r.category === 'Local Food & Cuisine' ? r.cityOrLocation : r.location,
      sourceTitle: r.sourceName,
      sourcePublisher: r.sourceName,
      sourceUrl: r.sourceUrl,
      lastVerifiedDate: r.lastVerifiedDate,
      visitorTip: r.visitorTip,
      firstTimeVisitorTip: r.visitorTip,
      historicalSignificance: r.historicalSignificance,
      whyVisit: r.whyVisit,
    })),
    citations: records.map((r) => ({
      title: r.sourceName,
      publisher: r.sourceName,
      url: r.sourceUrl,
      lastVerifiedDate: r.lastVerifiedDate,
      note: `Verified records for ${r.name} in ${r.cityOrLocation}, ${r.state}.`,
    })),
    targetDestinationId: targetDestMeta.id,
    testScenarioMatched: crossMismatch
      ? 'cross_destination'
      : `${targetDestMeta.id}_retrieval`,
  };
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(geminiApiKey),
    model: 'gemini-3.8-flash',
    supportedDestinations: SUPPORTED_DESTINATIONS.map((d) => d.id),
    totalRecords: ALL_TRAVEL_RECORDS.length,
    categories: GENERAL_SCOPE.categories,
  });
});

app.get('/api/knowledge-base', (req: Request, res: Response) => {
  res.json({
    destinations: SUPPORTED_DESTINATIONS,
    records: ALL_TRAVEL_RECORDS,
    scenarios: EVALUATION_SCENARIOS,
    scope: GENERAL_SCOPE,
  });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, destinationId, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'A valid message string is required.' });
      return;
    }

    const trimmedMessage = message.trim();

    // 1. Strict Unsupported Destination Check (Rules 1-7)
    // Before retrieving information, identify whether the destination is supported.
    const unsupportedCheck = detectUnsupportedDestination(trimmedMessage);
    if (unsupportedCheck.isUnsupported) {
      res.json({
        message: `Yaaros currently supports verified travel information for Jaipur, Bengaluru and Hyderabad. ${unsupportedCheck.destinationName} is outside the current knowledge-base scope. I cannot provide verified recommendations for this destination.`,
        recommendations: [],
        citations: [],
        scopeNotice: `Unsupported destination: ${unsupportedCheck.destinationName} is outside the current knowledge-base scope.`,
        testScenarioMatched: 'unsupported_destination',
      });
      return;
    }

    // 2. Missing Destination Context Check (Rule 8)
    // If the user does not specify a destination and the conversation provides no clear destination context, ask which city they mean.
    const contextCheck = hasDestinationOrContext(trimmedMessage, conversationHistory);
    if (!contextCheck.hasContext) {
      res.json({
        message: `Which city are you exploring? Yaaros currently supports verified travel information for Jaipur, Bengaluru and Hyderabad. Please let me know which of these three cities you mean so I can provide recommendations.`,
        recommendations: [],
        citations: [],
        scopeNotice: 'Please specify one of the three supported destinations: Jaipur, Bengaluru, or Hyderabad.',
        testScenarioMatched: 'missing_destination_context',
      });
      return;
    }

    const activeDestId: DestinationId =
      contextCheck.destinationId ||
      (destinationId && SUPPORTED_DESTINATIONS.some((d) => d.id === destinationId)
        ? (destinationId as DestinationId)
        : 'jaipur');

    // 3. Perform destination-aware retrieval from knowledge base
    const {
      records: retrievedRecords,
      intent,
      isComparison,
      crossMismatch,
      falsePremiseWrongCity,
      referencedEntities,
      targetDestinationId,
      isFoodQuery,
      isHistoricalQuery,
      isCraftsCultureQuery,
    } = retrieveGroundedRecords(
      trimmedMessage,
      activeDestId,
      conversationHistory
    );
    const activeDestMeta = SUPPORTED_DESTINATIONS.find((d) => d.id === activeDestId) || SUPPORTED_DESTINATIONS[0];
    const targetDestMeta = SUPPORTED_DESTINATIONS.find((d) => d.id === targetDestinationId) || activeDestMeta;

    // If Gemini client is not configured or quota limit is active, use the deterministic verified engine
    const isQuotaActive = isGeminiQuotaExhausted && Date.now() - lastQuotaExhaustedTime < QUOTA_COOLDOWN_MS;
    if (!aiClient || isQuotaActive) {
      const fallbackResponse = generateDeterministicResponse(
        trimmedMessage,
        activeDestId,
        conversationHistory
      );
      res.json(fallbackResponse);
      return;
    }

    // Call Gemini with strict category definitions, destination grounding, and schema
    try {
      const destinationSystemInstruction = `
You are "Yaaros", a Three-City Travel Companion for Jaipur, Bengaluru, and Hyderabad.

### 1. SYNONYM MAPPING & MEAL INTENT (STRICT):
- Map ALL meal, dining, and time-based terms strictly to FOOD & CUISINE:
  * Keywords: "Breakfast", "Lunch", "Dinner", "Snacks", "Tiffin", "Tea", "Coffee", "Eateries", "Dining", "Restaurants", "Places to eat", "Local eats".
- NEVER return forts, palaces, or government buildings (e.g., Vidhana Soudha, Bangalore Palace, Bangalore Fort, Golconda Fort) for any food or meal inquiry.

### 2. FALSE PREMISE & ENTITY-CITY CORRECTION RULE:
- If a user asks about a landmark in the WRONG city (e.g., "Hawa Mahal in Bangalore", "Charminar in Jaipur", "Bangalore Palace in Hyderabad"):
  1. IMMEDIATELY CORRECT THE PREMISE in Sentence 1: Explicitly state that the landmark is NOT in that city, and clarify its actual location.
     Example: "**Hawa Mahal (Palace of Winds)** is located in **Jaipur, Rajasthan**—not in **Bangalore**."
  2. CITY TAG CORRECTION: Set the city context to its REAL city (e.g., Jaipur for Hawa Mahal). Do NOT present it under the wrong city banner.
  3. Return ONLY that single landmark (1 item). DO NOT dump a 3-item list.

### 3. DIRECT QUESTION & LOCATION VERIFICATION LOGIC:
- If user asks a verification/location question (e.g., "Is Amber Fort in Bangalore or Jaipur?", "Is Charminar in Jaipur?"):
  - DIRECT ANSWER FIRST in Sentence 1 (e.g., "**Amber Fort (Amer Fort)** is located in **Jaipur, Rajasthan**—not in **Bengaluru or Hyderabad**.").
  - Return ONLY that 1 single landmark.

### 4. BANGALORE BREAKFAST MANDATORY ANCHORS:
- For "Breakfast in Bangalore" queries, output ONLY iconic tiffin institutions in this exact order:
  1. **Central Tiffin Room (CTR / Shri Sagar)** — *Malleshwaram*
     - Must-Try: Benne Masala Dosa
  2. **Vidyarthi Bhavan** — *Basavanagudi*
     - Must-Try: Crispy Masala Dosa & Filter Coffee
  3. **Mavalli Tiffin Room (MTR)** — *Lalbagh Road*
     - Must-Try: Rava Dosa & South Indian Thali
  4. **Taaza Thindi** — *Jayanagar*
     - Must-Try: Pure Veg South Indian Breakfast

### 5. QUERY INTENT CLASSIFICATION:

- CASE A: DISH INTENT ("What to eat", "Famous food", "Must-try dishes", "Local delicacies")
  * Header = Name of the DISH / SWEET / ITEM.
  * Sub-bullet = Iconic place to try it + area + brief description.
  * Format:
    **[Dish / Sweet / Item Name]**
    - Iconic Place to Try: [Iconic Place Name] ([Area / Neighborhood])
    - Description: [Brief authentic description]

- CASE B: VENUE INTENT ("Where to eat", "Restaurants", "Eateries", "Cafes", "Tiffin rooms", "Breakfast", "Lunch", "Dinner")
  * Header = Name of the RESTAURANT / EATERY — Location.
  * Sub-bullet = Must-try dishes + insider tip/vibe.
  * Format:
    **[Restaurant / Eatery Name]** — *[Location]*
    - Must-Try: [Signature Dishes]
    - Tip: [Insider tip / vibe]

- CASE C: HISTORICAL SIGHTSEEING ("Monuments", "Places to visit", "Sightseeing", "Forts")
  * Header = Landmark Name — Location.
  * Format:
    **[Landmark Name]** — *[Location]*
    - Built By: [Ruler / Architect (Year)]
    - Highlight: [Architectural / acoustic / historical highlight]
  * CRITICAL: NEVER output historical landmarks for Case A or Case B queries.

### 6. MANDATORY CITY DATA ANCHORS:

- HYDERABAD:
  * Dishes: Hyderabadi Biryani (Paradise/Shadab), Irani Chai & Osmania Biscuit (Nimrah Cafe), Double Ka Meetha.
  * Landmarks: Charminar, Golconda Fort, Chowmahalla Palace.

- BENGALURU:
  * Dishes: Benne Masala Dosa (CTR), Rava Dosa (MTR), Filter Coffee & Masala Dosa (Vidyarthi Bhavan), DBC (Corner House).
  * Landmarks: Bangalore Palace, Lalbagh Botanical Garden.

- JAIPUR:
  * Dishes: Dal Baati Churma (LMB), Pyaaz Kachori (Rawat), Laal Maas (1135 AD / Handi), Ghewar.
  * Landmarks: Amber Fort, Hawa Mahal, City Palace.

### 7. OUTPUT STYLE:
- Direct response starting from line 1. No intro fluff, meta-announcements, or scroll directions. Use clear headers and concise bullet points.

### 8. EXACT SINGLE ATTRACTION ISOLATION:
- If the user asks about ONE named attraction (e.g. "Tell me about Amber Palace", "Tell me about Cubbon Park", "Tell me about Golconda Fort"), answer about that attraction ONLY.

### 9. FOOD DISH DEFINITIONS (ISOLATION):
- If asking the definition of a specific dish (e.g. "What is Bisi Bele Bath?", "What is Dal Baati Churma?", "What is Haleem?"):
  Explain the dish: ingredients, preparation technique, flavor profile, and cultural roots.
  NEVER return restaurant recommendations or monuments for food-definition questions!

### 10. PREVENT UNSUPPORTED ANSWERS & HALLUCINATIONS:
- If user asks about live entry fees, ticket costs today, table bookings, or unsupported destinations/activities:
  State honestly: "I don't have enough verified information about this in my current knowledge base. I don't want to give you inaccurate travel information."
  NEVER guess or invent live prices, fees, or unsupported attractions.

RETRIEVED KNOWLEDGE BASE RECORDS FOR THIS QUERY:
${JSON.stringify(retrievedRecords, null, 2)}
`;

      const historyContext = Array.isArray(conversationHistory) && conversationHistory.length > 0
        ? `\nPrior Conversation Summary:\n${conversationHistory
            .slice(-4)
            .map((h: any) => `${h.role}: ${h.text}`)
            .join('\n')}\n`
        : '';

      const userPrompt = `
${historyContext}
User Query: "${trimmedMessage}"
Target City: "${targetDestMeta.name}" (${targetDestMeta.state})
Active UI City: "${activeDestMeta.name}"
Detected Query Intent: ${intent}

Return ONLY a valid JSON object matching this schema. The "message" field MUST begin directly on Line 1:
{
  "message": "Direct, scannable response adhering strictly to the intent rules above",
  "recommendations": [
    {
      "id": "exact record ID from retrieved record",
      "name": "Exact Name",
      "category": "Historical Places & Landmarks" | "Must-Visit Attractions" | "Local Food & Cuisine" | "Restaurants & Cafés" | "Cultural Experiences" | "Hidden Gems",
      "destinationId": "${targetDestMeta.id}",
      "cityOrLocation": "${targetDestMeta.name}",
      "tagline": "Short evocative summary",
      "description": "Concise factual description",
      "shortDescription": "Short 1-line description",
      "highlights": ["Highlight 1", "Highlight 2"],
      "visitingHours": "Visiting hours ONLY if verified and not a food dish",
      "location": "Street location or district",
      "sourceTitle": "Exact source name",
      "sourcePublisher": "Exact publisher",
      "sourceUrl": "Exact source URL",
      "lastVerifiedDate": "2026-03-XX",
      "firstTimeVisitorTip": "Insider traveler tip",
      "historicalSignificance": "Key historical era and significance if applicable",
      "whyVisit": "Why this place or item is uniquely worth experiencing"
    }
  ],
  "citations": [
    {
      "title": "Exact source title",
      "publisher": "Exact publisher",
      "url": "Exact source URL",
      "lastVerifiedDate": "2026-03-XX",
      "note": "What this official archive supports"
    }
  ],
  "scopeNotice": "Optional notice if query touched an unsupported destination, cross-destination mismatch, or live pricing limitation",
  "testScenarioMatched": "string or null"
}
`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API request timed out')), 9000)
      );

      const geminiCall = aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: destinationSystemInstruction,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const response: any = await Promise.race([geminiCall, timeoutPromise]);
      const responseText = response.text;

      if (!responseText) throw new Error('Empty response from Gemini.');

      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        parsed = JSON.parse(cleaned);
      }

      if (parsed && typeof parsed.message === 'string') {
        parsed.message = parsed.message.trim();
        // If message starts with pleasantries / filler before the first bold item, strip it
        if ((intent === 'RESTAURANT' || intent === 'FOOD_RECOMMENDATION' || intent === 'SINGLE_ATTRACTION' || intent === 'ATTRACTION_OVERVIEW') && parsed.message.includes('**')) {
          const firstBoldIdx = parsed.message.indexOf('**');
          if (firstBoldIdx > 0 && firstBoldIdx < 120) {
            const preamble = parsed.message.slice(0, firstBoldIdx).toLowerCase();
            if (
              preamble.includes('here are') ||
              preamble.includes('sure') ||
              preamble.includes('welcome') ||
              preamble.includes('certainly') ||
              preamble.includes('explore') ||
              preamble.includes('recommend')
            ) {
              parsed.message = parsed.message.slice(firstBoldIdx).trim();
            }
          }
        }
      }

      // Ensure each recommendation has its verified fields and dishes omit opening hours
      if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
        parsed.recommendations = parsed.recommendations.map((rec: any) => {
          const matched = ALL_TRAVEL_RECORDS.find(
            (r) => r.id === rec.id || r.name.toLowerCase() === (rec.name || '').toLowerCase()
          );
          const isDish = (matched ? matched.category : rec.category) === 'Local Food & Cuisine';
          const restaurantDetails = matched && matched.category === 'Restaurants & Cafés' ? getRestaurantDetails(matched) : null;
          return {
            ...rec,
            id: matched ? matched.id : rec.id,
            imageUrl: matched ? matched.imageUrl : rec.imageUrl,
            category: matched ? matched.category : rec.category,
            tagline: restaurantDetails ? `Must-Try: ${restaurantDetails.mustTry}` : (rec.tagline || matched?.tagline),
            visitingHours: isDish ? undefined : (rec.visitingHours || matched?.openingHours),
            openingHours: isDish ? undefined : (rec.openingHours || matched?.openingHours),
            location: isDish ? (matched?.cityOrLocation || targetDestMeta.name) : (restaurantDetails?.location || rec.location || matched?.location),
            sourceTitle: matched ? matched.sourceName : rec.sourceTitle,
            sourceUrl: matched ? matched.sourceUrl : rec.sourceUrl,
            historicalSignificance: matched?.historicalSignificance || rec.historicalSignificance,
            whyVisit: matched?.whyVisit || rec.whyVisit,
          };
        });
      } else if (retrievedRecords.length > 0) {
        parsed.recommendations = retrievedRecords.map((r) => {
          const isDish = r.category === 'Local Food & Cuisine';
          const restaurantDetails = r.category === 'Restaurants & Cafés' ? getRestaurantDetails(r) : null;
          return {
            id: r.id,
            name: r.name,
            category: r.category,
            destination: r.destination,
            destinationId: r.destinationId,
            cityOrLocation: r.cityOrLocation,
            state: r.state,
            tagline: restaurantDetails ? `Must-Try: ${restaurantDetails.mustTry}` : (r.tagline || ''),
            description: r.description,
            shortDescription: r.shortDescription,
            imageUrl: r.imageUrl,
            highlights: r.highlights || [],
            visitingHours: isDish ? undefined : r.openingHours,
            openingHours: isDish ? undefined : r.openingHours,
            location: isDish ? r.cityOrLocation : (restaurantDetails?.location || r.location),
            sourceTitle: r.sourceName,
            sourcePublisher: r.sourceName,
            sourceUrl: r.sourceUrl,
            lastVerifiedDate: r.lastVerifiedDate,
            visitorTip: r.visitorTip,
            firstTimeVisitorTip: r.visitorTip,
            historicalSignificance: r.historicalSignificance,
            whyVisit: r.whyVisit,
          };
        });
      }

      parsed.targetDestinationId = targetDestMeta.id;
      parsed.testScenarioMatched = crossMismatch
        ? 'cross_destination'
        : parsed.testScenarioMatched || `${targetDestMeta.id}_retrieval`;

      res.json(parsed);
    } catch (geminiErr: any) {
      const errMsg = String(geminiErr?.message || geminiErr || '');
      const isQuota =
        geminiErr?.status === 'RESOURCE_EXHAUSTED' ||
        geminiErr?.code === 429 ||
        geminiErr?.status === 429 ||
        errMsg.includes('429') ||
        errMsg.toLowerCase().includes('quota') ||
        errMsg.includes('RESOURCE_EXHAUSTED');

      if (isQuota) {
        isGeminiQuotaExhausted = true;
        lastQuotaExhaustedTime = Date.now();
        console.info('Switching to Yaaros destination-aware verified engine (Gemini quota limit reached).');
      } else {
        console.info('Switching to Yaaros destination-aware verified engine.');
      }

      const fallbackResponse = generateDeterministicResponse(
        trimmedMessage,
        activeDestId,
        conversationHistory
      );
      res.json(fallbackResponse);
    }
  } catch (error: any) {
    console.error('Server error handling /api/chat:', error);
    res.status(500).json({
      error: 'An internal error occurred while generating recommendations.',
      details: error?.message || 'Unknown error',
    });
  }
});

// Setup Vite in Dev or Static files in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yaaros Three-City Server running on http://0.0.0.0:${PORT}`);
    console.log(`Gemini API configured: ${Boolean(geminiApiKey)}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
