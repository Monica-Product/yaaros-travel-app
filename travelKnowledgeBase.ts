/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YAAROS Three-City Verified Knowledge Base
 * Supporting 3 Curated Destinations with Strict 6-Category Separation:
 * 1. Historical Places & Landmarks
 * 2. Must-Visit Attractions
 * 3. Local Food & Cuisine (dishes only; no opening hours!)
 * 4. Restaurants & Cafés (dining establishments only!)
 * 5. Cultural Experiences
 * 6. Hidden Gems
 */

import { TravelCategory, DestinationId, DestinationMeta, TravelRecord, EvaluationScenario, TRAVEL_CATEGORIES } from '../types.ts';
import { RECORD_IMAGE_MAP, LOCAL_ASSETS } from './destinationImages.ts';

export { TRAVEL_CATEGORIES };
export type { DestinationId, TravelCategory, DestinationMeta, TravelRecord, EvaluationScenario };

export const SUPPORTED_DESTINATIONS: DestinationMeta[] = [
  {
    id: 'jaipur',
    name: 'Jaipur',
    tagline: 'The Pink City',
    state: 'Rajasthan',
    region: 'North India',
    isStateLevel: false,
    description: 'Founded in 1727 CE by Maharaja Sawai Jai Singh II, celebrated for UNESCO World Heritage hill forts, pink sandstone royal palaces, and rich desert culinary traditions.',
    imageKey: 'jaipurHero',
    sampleQuestions: [
      'What are the must-visit historical places and forts in Jaipur?',
      'Recommend authentic Rajasthani food and where to eat it in Jaipur.',
      'What is the difference between Amber Fort, Jaigarh Fort, and Nahargarh Fort?',
      'Which verified heritage restaurants should I visit in Jaipur?'
    ]
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    tagline: 'The Garden City',
    state: 'Karnataka',
    region: 'South India',
    isStateLevel: false,
    description: 'Renowned for royal Tudor and teakwood palaces, historic Bangalore Fort, sprawling 18th-century botanical gardens, and legendary heritage tiffin institutions.',
    imageKey: 'bangaloreHero',
    sampleQuestions: [
      'What are the top architectural landmarks and palaces in Bangalore?',
      'Where can I find the best South Indian breakfast in Bangalore?',
      'Tell me about Bangalore Fort and Tipu Sultan’s Summer Palace.',
      'Which legendary heritage restaurants and cafés are verified in Bangalore?'
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    tagline: 'The City of Pearls',
    state: 'Telangana',
    region: 'South-Central India',
    isStateLevel: false,
    description: 'The royal seat of the Qutb Shahi and Nizam dynasties, world-famous for the monumental Charminar, Golconda Fort acoustic marvels, Falaknuma Palace, and authentic Dum Biryani.',
    imageKey: 'hyderabadHero',
    sampleQuestions: [
      'Tell me about Golconda Fort and Falaknuma Palace in Hyderabad.',
      'What is the difference between Hyderabadi Dum Biryani and Haleem?',
      'Which historical palaces and havelis should I visit in Hyderabad?',
      'Which historic restaurants should I visit in Hyderabad?'
    ]
  }
];

export const ALL_TRAVEL_RECORDS: TravelRecord[] = [
  // =========================================================================
  // 1. JAIPUR, RAJASTHAN
  // =========================================================================

  // Category 1: Historical Places & Landmarks
  {
    id: 'jaipur-amber-fort',
    name: 'Amber Fort (Amer Fort)',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Historical Places & Landmarks',
    shortDescription: '1592 CE UNESCO World Heritage hill fort overlooking Maota Lake, famous for the mirror-studded Sheesh Mahal and grand courtyards.',
    description: 'Perched atop Cheel ka Teela overlooking Maota Lake, Amber Fort is a UNESCO World Heritage site renowned for Sheesh Mahal (Mirror Palace), Diwan-e-Aam, and Sukh Niwas with ancient water cooling.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-amber-fort'],
    tagline: '1592 CE · UNESCO World Heritage Hill Fort',
    highlights: [
      'Sheesh Mahal adorned with imported convex mirror foils',
      'Diwan-e-Aam public audience colonnade',
      'Ganesh Pol gateway with floral fresco artistry'
    ],
    historicalSignificance: 'Constructed in 1592 CE by Raja Man Singh I, serving as the principal seat of the Kachwaha Rajputs before the founding of Jaipur.',
    whyVisit: 'Witness breathtaking Rajput-Mughal architecture and experience the reflective brilliance of the Sheesh Mahal.',
    openingHours: '08:00 to 17:30 (Day Entry); 18:30 to 21:15 (Night Tourism)',
    location: 'Devisinghpura, Amer, Jaipur',
    sourceName: 'UNESCO World Heritage Centre & Rajasthan Tourism',
    sourceUrl: 'https://whc.unesco.org/en/list/247',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Arrive before 09:30 AM to see morning light illuminate the Sheesh Mahal mirrors without crowds.'
  },
  {
    id: 'jaipur-jaigarh-fort',
    name: 'Jaigarh Fort',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Historical Places & Landmarks',
    shortDescription: '1726 CE military stronghold housing the Jaivana cannon, the world’s largest cannon on wheels, connected to Amber by subterranean tunnels.',
    description: 'Built in 1726 CE by Maharaja Sawai Jai Singh II to defend Amber Fort and the Jaipur dynasty. Positioned on the "Cheel ka Teela" (Hill of Eagles), it features rugged battlements, water reservoirs, and an artillery factory.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-jaigarh-fort'],
    tagline: '1726 CE · Impregnable Rajput Military Citadel & Cannon Foundry',
    highlights: [
      'Jaivana: The world’s largest 50-ton wheeled cannon cast in 1720',
      'Subterranean escape tunnels connecting directly down to Amber Fort',
      'Subhat Niwas assembly hall and extensive rainwater harvesting tanks'
    ],
    historicalSignificance: 'Served as the royal treasury and artillery manufacturing powerhouse of the Kachwaha rulers, never captured in combat.',
    whyVisit: 'Unrivaled views across the Aravalli hills and the engineering triumph of the 18th-century royal cannon foundry.',
    openingHours: '09:00 to 17:00 daily',
    location: 'Cheel ka Teela, Amer, Jaipur',
    sourceName: 'Archaeological Survey of India & Rajasthan Tourism',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Walk the high western ramparts in the late afternoon for dramatic golden hour views over Amber Palace.'
  },
  {
    id: 'jaipur-nahargarh-fort',
    name: 'Nahargarh Fort',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Historical Places & Landmarks',
    shortDescription: '1734 CE hilltop fortress perched on the edge of the Aravalli hills, renowned for Madhavendra Bhawan and sweeping sunset views.',
    description: 'Commissioned by Maharaja Sawai Jai Singh II in 1734 CE as an impregnable northern defensive shield. Features the two-storey Madhavendra Bhawan, designed with nine identical royal suites for the king’s nine queens.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-nahargarh-fort'],
    tagline: '1734 CE · Northern Mountain Citadel & Royal Sunset Perch',
    highlights: [
      'Madhavendra Bhawan with interconnected royal suites and Rajput frescoes',
      'Sweeping panoramic vantage point over the entire grid-planned Pink City',
      'Historic stepwells (Baori) carved directly into the mountain bedrock'
    ],
    historicalSignificance: 'Formed a fortified defensive triangle alongside Amber and Jaigarh forts, protecting the newly established city of Jaipur.',
    whyVisit: 'The definitive sunset overlook in Jaipur, paired with delicate 19th-century courtyard frescoes.',
    openingHours: '10:00 to 17:30 daily (Fort ramparts & restaurants open till 22:00)',
    location: 'Krishna Nagar, Brahampuri, Jaipur',
    sourceName: 'Department of Archaeology & Museums Rajasthan',
    sourceUrl: 'https://artandculture.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Arrive around 16:30 to tour Madhavendra Bhawan before watching twilight fall over the glowing city below.'
  },
  {
    id: 'jaipur-city-palace',
    name: 'City Palace, Jaipur',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Historical Places & Landmarks',
    shortDescription: '1727 CE ceremonial seat of the Maharaja of Jaipur, featuring the iconic seasonal peacock gates and royal textile galleries.',
    description: 'A grand complex of courtyards, gardens, and palaces founded by Maharaja Sawai Jai Singh II. Features the Pritam Niwas Chowk peacock gates, Mubarak Mahal textile museum, and historic Gangajali silver urns.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-city-palace'],
    tagline: '1727 CE · Ceremonial Seat of the Maharaja of Jaipur',
    highlights: [
      'Pritam Niwas Chowk with 4 seasonal gates including Peacock Gate',
      'Mubarak Mahal royal textile gallery and Kashmiri shawls',
      'World-record Gangajalis (sterling silver water vessels)'
    ],
    historicalSignificance: 'Center of royal administration and culture since Maharaja Sawai Jai Singh II moved his capital from Amber in 1727.',
    whyVisit: 'Immerse yourself in living royal heritage and marvel at the master craftsmanship of the seasonal courtyard doorways.',
    openingHours: '09:30 to 17:00 (Day); 19:00 to 22:00 (Night Viewing)',
    location: 'Tulsi Marg, Gangori Bazaar, Pink City, Jaipur',
    sourceName: 'The City Palace Museum Trust & Rajasthan Tourism',
    sourceUrl: 'https://royaljaipur.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'A composite ticket or authorized audio guide is recommended to appreciate the royal armory.'
  },
  {
    id: 'jaipur-jantar-mantar',
    name: 'Jantar Mantar',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Historical Places & Landmarks',
    shortDescription: '1734 CE UNESCO astronomical observatory featuring the world’s largest stone sundial, measuring time to two-second accuracy.',
    description: 'Constructed by Maharaja Sawai Jai Singh II, this UNESCO World Heritage astronomical monument features 19 architectural instruments, including the 27-meter-tall Vrihat Samrat Yantra sundial.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-jantar-mantar'],
    tagline: '1734 CE · UNESCO World Heritage Astronomical Marvel',
    highlights: [
      'Vrihat Samrat Yantra: World’s largest stone sundial (27m tall)',
      'Rama Yantra: Cylindrical structures measuring celestial altitudes',
      'Jai Prakash Yantra: Hemispherical sundial bowl mapping the zodiac'
    ],
    historicalSignificance: 'The crowning achievement of 18th-century Indian scientific observation, integrating Sanskrit astronomical treatises with Islamic and European techniques.',
    whyVisit: 'See how monumental masonry instruments can accurately measure celestial movements and local solar time.',
    openingHours: '09:00 to 16:30 daily',
    location: 'Gangori Bazaar, Pink City, Jaipur',
    sourceName: 'Archaeological Survey of India & UNESCO List No. 1338',
    sourceUrl: 'https://whc.unesco.org/en/list/1338',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Hire an authorized ASI astronomy guide at the entrance to explain instrument readings.'
  },

  // Category 2: Must-Visit Attractions
  {
    id: 'jaipur-hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Must-Visit Attractions',
    shortDescription: '1799 CE five-storey pink sandstone crown engineered with 953 honeycomb jharokhas for royal women to observe festivals.',
    description: 'A five-storey pyramidical pink sandstone facade built by Maharaja Sawai Pratap Singh, engineered with 953 carved jharokhas to allow royal ladies to observe street festivals through cooling Venturi breezes.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-hawa-mahal'],
    tagline: '1799 CE · 953 Honeycomb Sandstone Jharokhas',
    highlights: [
      '953 intricate honeycomb windows with stained glass',
      'Panoramic Pink City view from Prakash Mandir at the top',
      'Gentle inclining ramps connecting floors instead of front stairs'
    ],
    historicalSignificance: 'Designed in 1799 CE by Lal Chand Ustad in the form of Lord Krishna’s crown, embodying Jaipur’s signature pink terracotta stone.',
    whyVisit: 'The supreme symbol of Jaipur’s architectural flair and ingenious passive natural climate control.',
    openingHours: '09:00 to 17:00 daily',
    location: 'Badi Choupad, Pink City, Jaipur',
    sourceName: 'Department of Archaeology & Museums Rajasthan',
    sourceUrl: 'https://artandculture.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Golden hour at sunrise creates the most striking lighting for exterior facade photography.'
  },
  {
    id: 'jaipur-jal-mahal',
    name: 'Jal Mahal (Water Palace)',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Must-Visit Attractions',
    shortDescription: '1750 CE pink sandstone palace floating in the middle of Man Sagar Lake, surrounded by the scenic Aravalli hills.',
    description: 'Commissioned by Maharaja Madho Singh I as a summer pleasure pavilion, this five-storey architectural marvel has four submerged underwater levels when the lake is full. Viewable from the landscaped lake promenade.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-jal-mahal'],
    tagline: '1750 CE · Floating Palace on Man Sagar Lake',
    highlights: [
      'Picturesque reflection against the waters of Man Sagar Lake',
      'Evening lighting when golden illuminations mirror across the water',
      'Surrounding sunset promenade popular for desert craft vendors'
    ],
    historicalSignificance: 'Built around 1750 CE in Man Sagar reservoir, built with specialized lime mortar to withstand centuries of water submersion.',
    whyVisit: 'One of Rajasthan’s most tranquil visual landscapes, especially dramatic at sunset.',
    openingHours: 'Promenade open 24 hours daily (Interior palace restricted)',
    location: 'Amer Road, Man Sagar Lake, Jaipur',
    sourceName: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Sunset and twilight lighting provide breathtaking reflections of the illuminated facade.'
  },

  // Category 3: Local Food & Cuisine (dishes only - NO opening hours!)
  {
    id: 'jaipur-dal-baati',
    name: 'Dal Baati Churma',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Local Food & Cuisine',
    shortDescription: 'The defining culinary masterpiece of Rajasthan: roasted wheat dumplings in desi ghee, five-lentil dal, and cardamom churma.',
    description: 'The defining culinary masterpiece of Rajasthan. Hard, round baked whole-wheat dumplings (baati) dipped in pure desi ghee, served with spicy five-lentil Panchmel dal and sweet cardamom-infused churma.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-dal-baati'],
    tagline: 'Signature Royal Rajasthani Dish',
    highlights: [
      'Golden roasted baatis cracked open and bathed in pure desi ghee',
      'Panchmel dal tempered with cumin, cloves, and asafoetida',
      'Sweet crushed wheat churma with almonds and pistachios'
    ],
    location: 'Traditional dining halls and thali establishments across Jaipur',
    sourceName: 'Rajasthan Tourism Culinary Archives',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Crush the baati into your bowl and pour the hot dal and a spoonful of ghee over it for maximum authentic flavor.'
  },
  {
    id: 'jaipur-ghewar',
    name: 'Jaipuri Ghewar (Malai & Paneer Ghewar)',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Local Food & Cuisine',
    shortDescription: 'Iconic disc-shaped honeycomb sweet soaked in cardamom saffron syrup, topped with rich clotted cream (Malai) and pistachios.',
    description: 'Jaipur’s most celebrated festival sweet. Crafted from flour batter fried into an intricate porous honeycomb disc in pure desi ghee, steeped in fragrant sugar syrup, and topped with thickened saffron rabdi, silver leaf, and sliced dry fruits.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-ghewar'],
    tagline: 'Porous Honeycomb Royal Desert Confectionery',
    highlights: [
      'Intricate honeycomb lattice structure fried in pure desi ghee',
      'Topped with luscious saffron Rabdi (Malai) and slivered almonds',
      'Traditional delicacy associated with Teej, Gangaur, and royal celebrations'
    ],
    location: 'Traditional halwais and sweet makers in the Johari Bazaar and MI Road areas',
    sourceName: 'Department of Tourism, Government of Rajasthan',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Ask for fresh Malai Ghewar prepared that day for the best creamy crunch.'
  },
  {
    id: 'jaipur-pyaz-kachori',
    name: 'Pyaaz Kachori & Mirchi Vada',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Local Food & Cuisine',
    shortDescription: 'Flaky deep-fried pastry stuffed with spiced caramelised onions, paired with fried green chilli and tamarind chutney.',
    description: 'A beloved morning breakfast and tea-time snack across Jaipur. Crisp, flaky pastry pocket filled with a savory mixture of onions, nigella seeds, fennel, and garam masala. Paired with sweet tamarind chutney and mint sauce.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-pyaz-kachori'],
    tagline: 'Flaky Spiced Onion Pastry & Morning Street Staple',
    highlights: [
      'Golden, multi-layered flaky crust fried in pure oil or ghee',
      'Spiced filling of crushed onions, coriander seeds, and amchur',
      'Served hot alongside tangy jaggery tamarind chutney'
    ],
    location: 'Street corners and heritage sweet shops throughout Jaipur',
    sourceName: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Pair with a clay kulhad of ginger masala chai for the quintessentially authentic Jaipur morning breakfast.'
  },
  {
    id: 'jaipur-ker-sangri',
    name: 'Ker Sangri (Desert Bean & Caper Sabzi)',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Local Food & Cuisine',
    shortDescription: 'Tangy desert delicacy of wild caper berries (ker) and slender desert tree beans (sangri) cooked with dry mango and whole red chillies.',
    description: 'An ancient Marwari desert dish born from the arid Thar climate. Ker (wild berries) and Sangri (pods of the Khejri tree) are dried, rehydrated, and sautéed with mustard oil, fenugreek, dried whole red chillies, and amchur. Typically served with hot bajra (pearl millet) rotis.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-ker-sangri'],
    tagline: 'Ancient Thar Desert Wild Caper & Bean Specialty',
    highlights: [
      'Unique spicy-sour profile using indigenous wild desert flora',
      'Traditionally prepared with mustard oil and unrefined rock salt',
      'Best accompanied by thick Bajra Roti with white butter'
    ],
    location: 'Heritage thali restaurants and royal dining rooms across Jaipur',
    sourceName: 'Department of Tourism, Government of Rajasthan',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Enjoy alongside freshly churned buttermilk (chaas) to balance the desert spices.'
  },
  {
    id: 'jaipur-laal-maas',
    name: 'Laal Maas',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Local Food & Cuisine',
    shortDescription: 'Historic royal Rajput game meat curry cooked in rich gravy of fiery Mathania red chillies, garlic, and yogurt.',
    description: 'A historic royal Rajput game meat delicacy. Tender mutton pieces slow-cooked in a rich, fiery gravy infused with indigenous Mathania red chillies, garlic paste, mustard oil, and curd, traditionally smoked using charcoal Dhungar.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-laal-maas'],
    tagline: 'Historic Royal Rajput Fiery Mathania Mutton Curry',
    highlights: [
      'Fiery red gravy infused with vibrant sun-dried Mathania chillies',
      'Slow-braised tender mutton cooked with rustic whole spices and garlic',
      'Best savored with hot Bajre ki Roti or crisp tandoori flatbreads'
    ],
    location: 'Royal heritage dining rooms and traditional non-vegetarian institutions in Jaipur',
    sourceName: 'Department of Tourism, Government of Rajasthan',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Pair with Bajre ki Roti smeared with white butter to balance the fiery Mathania chilli heat.'
  },

  // Category 4: Restaurants & Cafés (dining establishments only!)
  {
    id: 'jaipur-1135-ad',
    name: '1135 AD Restaurant',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Restaurants & Cafés',
    shortDescription: 'Fine-dining royal palace restaurant located inside the ramparts of Amber Fort, serving silver-thali Rajput banquets.',
    description: 'Perched on the ramparts of Amber Fort, 1135 AD recreates the opulent dining rituals of Rajput royalty. Features carved marble archways, silver furniture, crystal chandeliers, live santoor music, and heirloom Rajasthani recipes.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-1135-ad'],
    tagline: 'Fine Dining Inside the Historic Ramparts of Amber Fort',
    highlights: [
      'Sheesh Mahal-inspired private dining room with gold-leaf inlay',
      'Signature Lal Maas prepared according to secret royal hunting recipes',
      'Open-air rampart terrace overlooking illuminated Amber valley'
    ],
    openingHours: '12:00 to 15:30 (Lunch); 19:00 to 22:30 (Dinner) daily',
    location: 'Level 2, Jaleb Chowk, Amber Fort, Amer, Jaipur',
    sourceName: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Advance table reservations are essential for evening candlelight terrace seating.'
  },
  {
    id: 'jaipur-lmb',
    name: 'Laxmi Mishthan Bhandar (LMB)',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1954 legendary sweet shop and vegetarian restaurant in the heart of Johari Bazaar, famed for its royal Rajasthani Thali.',
    description: 'Established in 1954 in the bustling gemstone market of Johari Bazaar, LMB is an institution of pure vegetarian Marwari cuisine. Renowned for its multi-course Rajasthani thali, Paneer Ghewar, and Dahi Vada.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-lmb'],
    tagline: 'Est. 1954 · Historic Vegetarian Dining Institution in Johari Bazaar',
    highlights: [
      'Grand Rajasthani Royal Thali served with over 12 traditional items',
      'Inventors of the famous Paneer Ghewar confection',
      'Historic Old City dining room frequented by generations of travelers'
    ],
    openingHours: '08:00 to 22:30 daily',
    location: 'Johari Bazaar, Pink City, Jaipur',
    sourceName: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Sample the mini royal thali if you want a complete Marwari tasting menu in one sitting.'
  },
  {
    id: 'jaipur-rawat',
    name: 'Rawat Mishthan Bhandar',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Restaurants & Cafés',
    shortDescription: 'Legendary Station Road heritage restaurant and eatery famed throughout India for selling over 10,000 hot Pyaaz Kachoris daily.',
    description: 'Established in the mid-20th century near Jaipur Junction, Rawat is an iconic culinary landmark where travelers flock straight from trains and flights. While world-renowned for its piping-hot Pyaaz Kachoris and Mawa Kachoris, it offers a full casual dining restaurant serving authentic vegetarian thalis and snacks.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-rawat'],
    tagline: 'Legendary Culinary Institution Famed for Jaipur Kachoris & Sweets',
    highlights: [
      'Freshly fried Pyaaz Kachori prepared round the clock in front of diners',
      'Full-service family dining room upstairs serving hearty North Indian thalis',
      'Extensive takeaway counter for travel packs of Ghewar, Sohan Halwa, and Namkeen'
    ],
    openingHours: '06:00 to 22:30 daily',
    location: 'Station Road, Sindhi Camp, Jaipur',
    sourceName: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Arrive between 08:00 and 10:00 AM for the freshest batch of morning kachoris straight out of the kadhai.'
  },

  // Category 5: Cultural Experiences
  {
    id: 'jaipur-block-printing',
    name: 'Anokhi Museum of Hand Printing',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Cultural Experiences',
    shortDescription: 'Restored 16th-century stone haveli dedicated to preserving the ancient Rajasthani art of hand block textile printing.',
    description: 'Located in a UNESCO-award-winning restored haveli near Amber Fort, the museum showcases centuries of natural vegetable dyes and wood-block carving. Visitors can watch master artisans and try hand-stamping fabric.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-block-printing'],
    tagline: 'Living Preservation of Centuries-Old Block Printing Artistry',
    highlights: [
      'Live master block carvers carving intricate teak wood blocks',
      'Hands-on printing workshops on organic cotton cloth',
      'Exhibition of rare antique royal textile heirlooms'
    ],
    openingHours: '10:30 to 17:00 (Closed Mondays)',
    location: 'Anokhi Haveli, Kheri Gate, Amer, Jaipur',
    sourceName: 'Anokhi Museum of Hand Printing & Rajasthan Crafts Council',
    sourceUrl: 'https://anokhi.com/museum',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Wear clothes you don’t mind getting dye spots on if attending a hands-on printing workshop.'
  },
  {
    id: 'jaipur-chokhi-dhani',
    name: 'Chokhi Dhani Ethnic Cultural Village',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Cultural Experiences',
    shortDescription: 'Immersive open-air cultural village celebrating Rajasthani folk dances, Kalbelia music, puppetry, and artisan traditions.',
    description: 'An expansive cultural resort recreating a traditional Rajasthani village. Features nightly Ghoomar and Kalbelia folk performances, fire-breathers, acrobats, traditional puppet shows, and village pottery demonstrations.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-chokhi-dhani'],
    tagline: 'Vibrant Living Showcase of Rajasthani Folk Heritage',
    highlights: [
      'Ghoomar and Kalbelia folk dance performances under night lanterns',
      'Traditional Kathputli puppet theater and fortune tellers',
      'Artisan huts demonstrating hand-thrown pottery and lac bangles'
    ],
    openingHours: '17:00 to 23:00 daily',
    location: '12 Miles, Tonk Road, Via Vatika, Jaipur',
    sourceName: 'Department of Tourism, Government of Rajasthan',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Arrive at opening time (17:00) to enjoy the artisan demonstrations before dinner crowds peak.'
  },

  // Category 6: Hidden Gems
  {
    id: 'jaipur-patrika-gate',
    name: 'Patrika Gate at Jawahar Circle',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Hidden Gems',
    shortDescription: 'Nine hand-painted ceremonial arches displaying kaleidoscopic murals of Rajasthan’s princely states and arts.',
    description: 'A grand ceremonial gateway at Jawahar Circle composed of nine pavilions, each adorned with vibrant hand-painted murals reflecting the history, arts, and architectural styles across all regions of Rajasthan.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-patrika-gate'],
    tagline: 'Architectural Monument of Nine Hand-Painted Arches',
    highlights: [
      'Nine arches showcasing miniature frescoes of royal processions',
      'Kaleidoscope ceiling patterns inspired by traditional block prints',
      'Surrounding musical fountains in Jawahar Circle Park'
    ],
    openingHours: 'Open 24 hours daily',
    location: 'Jawahar Circle, Malviya Nagar, Jaipur',
    sourceName: 'Jaipur Development Authority & Rajasthan Tourism',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Visit early morning for soft natural light illuminating the interior corridor frescoes.'
  },
  {
    id: 'jaipur-panna-meena-kund',
    name: 'Panna Meena ka Kund',
    destination: 'Jaipur, Rajasthan',
    destinationId: 'jaipur',
    cityOrLocation: 'Jaipur',
    state: 'Rajasthan',
    category: 'Hidden Gems',
    shortDescription: '16th-century eight-storey stepwell featuring mesmerizing crisscross geometric stairs and octagonal pavilions.',
    description: 'Tucked away near Amber Fort, this 16th-century rainwater harvesting reservoir is famous for its intricate mathematical geometry. According to legend, no one can use the same set of stairs to descend and ascend.',
    imageUrl: RECORD_IMAGE_MAP['jaipur-panna-meena-kund'],
    tagline: '16th Century · Geometric Architectural Stepwell',
    highlights: [
      'Symmetrical crisscrossing zig-zag staircases on three sides',
      'Recessed niches and pillared verandas for shaded community gatherings',
      'Serene historic courtyard located away from highway tourist traffic'
    ],
    openingHours: '07:00 to 18:00 daily',
    location: 'Amer, near Anokhi Museum, Jaipur',
    sourceName: 'Department of Archaeology & Museums Rajasthan',
    sourceUrl: 'https://artandculture.rajasthan.gov.in',
    lastVerifiedDate: '2026-03-15',
    visitorTip: 'Combine with an early morning visit to Amber Fort while crowds are still sparse.'
  },

  // =========================================================================
  // 2. BANGALORE, KARNATAKA
  // =========================================================================

  // Category 1: Historical Places & Landmarks
  {
    id: 'blr-bangalore-palace',
    name: 'Bangalore Palace',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Historical Places & Landmarks',
    shortDescription: '1878 CE Tudor-style royal residence of the Wadiyars, featuring fortified towers, battlements, and Spanish benches.',
    description: 'Built in 1878 by Maharaja Chamarajendra Wadiyar X, inspired by England’s Windsor Castle. Features fortified towers, battlements, turreted parapets, wooden carvings, and 19th-century royal family portraits.',
    imageUrl: RECORD_IMAGE_MAP['blr-bangalore-palace'],
    tagline: '1878 CE · Tudor-Style Royal Residence of the Wadiyars',
    highlights: [
      'Tudor-style architecture with imported stained-glass windows',
      'Durbar Hall with painted Spanish benches and chandeliers',
      'Ornate wooden floral carvings throughout the royal suites'
    ],
    historicalSignificance: 'Constructed in 1878 CE as the princely residence of the Wadiyar dynasty in Bangalore, representing the Victorian era of Mysore kingdom history.',
    whyVisit: 'Marvel at authentic European Tudor-Revival fortified architecture in the heart of Karnataka, complete with historic hunting trophies and royal memorabilia.',
    openingHours: '10:00 to 17:30 daily',
    location: 'Vasanth Nagar, Bengaluru, Karnataka',
    sourceName: 'Karnataka Tourism Official Directory',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Audio guides are available at the entrance in multiple languages covering the Wadiyar dynasty.'
  },
  {
    id: 'blr-tipu-palace',
    name: 'Tipu Sultan’s Summer Palace',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Historical Places & Landmarks',
    shortDescription: '1791 CE Indo-Islamic palace crafted entirely of seasoned teakwood pillars and carved floral arches.',
    description: 'Completed in 1791 by Tipu Sultan as his summer retreat, affectionately named "Rashk-e-Jannat" (Envy of Heaven). Constructed entirely from seasoned teakwood, adorned with fluted pillars and Persian inscriptions.',
    imageUrl: RECORD_IMAGE_MAP['blr-tipu-palace'],
    tagline: '1791 CE · Teakwood Indo-Islamic Royal Summer Retreat',
    highlights: [
      'Two-storey palace constructed entirely of ornate teakwood pillars',
      'Zenana quarters with wooden balconies on the upper floor',
      'Museum showcasing Tipu Sultan’s crown replica, silver vessels, and historic rockets'
    ],
    historicalSignificance: 'Served as the summer capital of the Tiger of Mysore, built inside the perimeter of the historic Bangalore Fort.',
    whyVisit: 'Exquisite teakwood woodwork and a close-up encounter with 18th-century Anglo-Mysore military history.',
    openingHours: '08:30 to 17:30 daily',
    location: 'Albert Victor Road, Chamrajpet, Bengaluru',
    sourceName: 'Archaeological Survey of India & Karnataka Tourism',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Combine with a walk through the neighboring historic K.R. Market flower bazaar.'
  },
  {
    id: 'blr-bangalore-fort',
    name: 'Bangalore Fort (Bengaluru Fort & Delhi Gate)',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Historical Places & Landmarks',
    shortDescription: '1537 CE foundation of Bengaluru by Kempe Gowda, rebuilt in granite by Hyder Ali in 1761, featuring the monumental Delhi Gate.',
    description: 'Originally established in 1537 CE as a mud fort by Kempe Gowda I, the founding father of Bengaluru. In 1761 CE, Hyder Ali replaced it with massive perimeter stone ramparts and bastion fortifications. The surviving Delhi Gate showcases Indo-Islamic arches and carved granite reliefs.',
    imageUrl: RECORD_IMAGE_MAP['blr-bangalore-fort'],
    tagline: '1537 CE Foundation of Bengaluru Rebuilt in 1761 Granite by Hyder Ali',
    highlights: [
      'Monumental Delhi Gate flanked by massive granite stone bastions',
      'Historic 18th-century British siege site and memorial plaque',
      'Ancient Ganesha shrine carved directly into the inner bastion rampart'
    ],
    historicalSignificance: 'The original defensive birthplace of modern Bangalore, witnessing the decisive Siege of Bangalore in 1791 during the Third Anglo-Mysore War.',
    whyVisit: 'Stand at the precise historic threshold where Bengaluru was founded five centuries ago.',
    openingHours: '09:00 to 17:30 daily',
    location: 'Near K.R. Market, Kalasipalyam, Bengaluru',
    sourceName: 'Archaeological Survey of India & Karnataka Tourism',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Located directly adjacent to Tipu Sultan’s Summer Palace; both can easily be explored together within 90 minutes.'
  },

  // Category 2: Must-Visit Attractions
  {
    id: 'blr-vidhana-soudha',
    name: 'Vidhana Soudha',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Must-Visit Attractions',
    shortDescription: '1956 CE monumental Neo-Dravidian granite state legislature crowned by the four-headed Lion Capital of Ashoka.',
    description: 'The monumental seat of Karnataka’s state legislature, completed in 1956 under Chief Minister Kengal Hanumanthaiah. Constructed with pure Bangalore granite in Neo-Dravidian style, spanning 60 acres.',
    imageUrl: RECORD_IMAGE_MAP['blr-vidhana-soudha'],
    tagline: '1956 CE · Monumental Neo-Dravidian Granite Landmark',
    highlights: [
      'Magnificent central dome rising 46 meters crowned by the Ashoka Lion Capital',
      'Intricately carved granite Dravidian columns and arched porches',
      'Spectacular illumination with tens of thousands of lights on Sunday evenings'
    ],
    historicalSignificance: 'Conceived as "a temple dedicated to the people", built entirely by prison laborers who were subsequently pardoned.',
    whyVisit: 'The definitive architectural icon of post-independence South India.',
    openingHours: 'Exterior viewable 24 hours (Sunday lighting from 18:30 to 20:30)',
    location: 'Dr. Ambedkar Veedhi, Sampangi Rama Nagar, Bengaluru',
    sourceName: 'Karnataka Government Secretariat & Tourism Department',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Visit on Sunday evening or national holidays to witness the grand golden illumination.'
  },
  {
    id: 'blr-lalbagh',
    name: 'Lalbagh Botanical Garden & Glass House',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Must-Visit Attractions',
    shortDescription: '1760 CE 240-acre botanical garden commissioned by Hyder Ali, housing India’s largest collection of tropical plants.',
    description: 'Commissioned by Hyder Ali in 1760 and completed by Tipu Sultan. Holds India’s largest collection of tropical plants, centuries-old trees, and the iconic Glass House inspired by London’s Crystal Palace.',
    imageUrl: RECORD_IMAGE_MAP['blr-lalbagh'],
    tagline: '1760 CE · Historic 240-Acre Garden Planned by Hyder Ali',
    highlights: [
      'Central Glass House hosting biennial Republic Day Flower Shows',
      '3,000-million-year-old Peninsular Gneiss Geological Monument',
      'Lotus pond and rare exotic flora from Persia, Afghanistan, and France'
    ],
    historicalSignificance: 'Laid out in 1760 CE as a royal pleasure garden, subsequently managed by British botanists into one of Asia’s premier botanical conservatories.',
    whyVisit: 'A vast sanctuary of old-growth trees, avian wildlife, and Victorian iron-and-glass horticultural design.',
    openingHours: '06:00 to 19:00 daily',
    location: 'Mavalli, Bengaluru, Karnataka',
    sourceName: 'Department of Horticulture, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Morning walkers enjoy free entry between 06:00 and 09:00 AM; ideal for peaceful exploration.'
  },
  {
    id: 'blr-cubbon-park',
    name: 'Cubbon Park & State Central Library',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Must-Visit Attractions',
    shortDescription: '1870 CE 300-acre green lung in central Bangalore featuring neoclassical red buildings and bamboo groves.',
    description: 'Established in 1870 by Major General Richard Sankey, this historic 300-acre park houses over 6,000 indigenous and exotic trees, the red terracotta neoclassical Seshadri Iyer Memorial Library, and serene walking avenues.',
    imageUrl: RECORD_IMAGE_MAP['blr-cubbon-park'],
    tagline: '1870 CE · 300-Acre Heritage Arboretum in the City Heart',
    highlights: [
      'Seshadri Iyer Memorial Hall housing Karnataka State Central Library',
      'Shaded bamboo thickets, lotus pond, and heritage bandstand',
      'Vehicle-free pedestrian avenues on weekends for tranquil walking'
    ],
    historicalSignificance: 'Created in 1870 as Meade’s Park and later renamed after Sir Mark Cubbon, preserving Bangalore’s reputation as the Garden City.',
    whyVisit: 'Experience Bangalore’s leafy tranquility and grand red Greco-Roman colonial buildings.',
    openingHours: '06:00 to 19:00 daily',
    location: 'Kasturba Road, Sampangi Rama Nagar, Bengaluru',
    sourceName: 'Department of Horticulture, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Traffic is closed on weekends, making it a peaceful sanctuary for joggers and reading.'
  },

  // Category 3: Local Food & Cuisine (dishes only - NO opening hours!)
  {
    id: 'blr-benne-dosa',
    name: 'Benne Masala Dosa (Butter Dosa)',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Local Food & Cuisine',
    shortDescription: 'Signature golden butter crepe roasted over cast iron with pure white butter, spiced potato mash, and fresh coconut chutney.',
    description: 'A beloved Karnataka culinary specialty. Crisp and blistered on the outside with a spongy, pillowy crumb inside, roasted with generous dollops of fresh white butter (benne). Stuffed with aromatic potato palya and accompanied by spicy green coconut chutney.',
    imageUrl: RECORD_IMAGE_MAP['blr-benne-dosa'],
    tagline: 'Karnataka’s Definitive Heritage Breakfast Dish',
    highlights: [
      'Crisp, butter-glazed outer crust with tender interior crumb',
      'Served with spiced potato mash and freshly grated coconut chutney',
      'Cooked on seasoned heavy cast-iron tawas'
    ],
    location: 'Traditional tiffin counters and Darshinis across Bangalore',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Eat immediately while the butter glaze is sizzling hot on the crepe.'
  },
  {
    id: 'blr-bisi-bele-bath',
    name: 'Bisi Bele Bath & Khara Boondi',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Local Food & Cuisine',
    shortDescription: 'Slow-cooked spiced rice, toor dal, and vegetable stew finished with pure ghee, cinnamon, and crunchy boondi.',
    description: 'Bisi Bele Bath (literally "hot lentil rice" in Kannada) is a traditional slow-cooked rice, pigeon pea dal, and vegetable stew spiced with roasted spices, marathi moggu, nutmeg, and dry coconut. Served piping hot topped with melted desi ghee and crispy spiced boondi.',
    imageUrl: RECORD_IMAGE_MAP['blr-bisi-bele-bath'],
    tagline: 'Traditional Karnataka Comfort & Royal Palace Recipe',
    highlights: [
      'Bisi Bele Bath served piping hot topped with boondi and melted ghee',
      'Unique spice blend featuring Marathi Moggu (Kapok buds)',
      'Traditional pairing with crispy potato wafers or papad'
    ],
    location: 'Available across heritage tiffin rooms and vegetarian dining halls',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Pour a generous teaspoon of warm ghee on top before mixing in the boondi.'
  },
  {
    id: 'blr-filter-coffee',
    name: 'South Indian Degree Filter Coffee',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Local Food & Cuisine',
    shortDescription: 'Aromatic dark-roast coffee brewed through a brass percolator, frothed with boiled full-fat milk in traditional dabara-tumbler sets.',
    description: 'The soul of Bangalore’s morning culture. High-grown Arabica and Robusta beans from Chikmagalur and Coorg, blended with a touch of chicory, extracted via slow percolation, and aerated between a brass dabara and tumbler to produce a thick, frothy crema.',
    imageUrl: RECORD_IMAGE_MAP['blr-filter-coffee'],
    tagline: 'Aromatic Brass Dabara Coffee from Western Ghats Plantations',
    highlights: [
      'Slow-drip decoction brewed fresh using stainless steel or brass filters',
      'Aerated by hand pouring back and forth creating a frothy crown',
      'Served hot in classic heavy brass Dabara and Tumbler sets'
    ],
    location: 'Iconic tiffin institutions and Darshinis across Bangalore',
    sourceName: 'Coffee Board of India & Karnataka Tourism',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Hold the tumbler by the rim and sip gently; the dabara saucer catches any drips and helps cool the coffee to perfect drinking temperature.'
  },

  // Category 4: Restaurants & Cafés (dining establishments only!)
  {
    id: 'blr-vidyarthi-bhavan',
    name: 'Vidyarthi Bhavan',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1943 legendary heritage vegetarian tiffin room in Gandhi Bazaar, renowned for waitstaff carrying stacks of 20 crispy dosas.',
    description: 'Founded in 1943 in historic Basavanagudi, Vidyarthi Bhavan is a cultural institution that once hosted Karnataka’s literary giants. Famous for thick, deeply browned Benne Masala Dosas served with minty coconut chutney.',
    imageUrl: RECORD_IMAGE_MAP['blr-vidyarthi-bhavan'],
    tagline: 'Est. 1943 · Legendary Tiffin Room in Gandhi Bazaar',
    highlights: [
      'Signature thick Benne Masala Dosa roasted with clarified butter',
      'Waiters balancing towers of up to 20 plates through bustling aisles',
      'Walls decorated with caricatures of Karnataka writers and artists'
    ],
    openingHours: '06:30 to 11:30 & 14:00 to 20:00 (Closed Fridays)',
    location: 'Gandhi Bazaar Main Road, Basavanagudi, Bengaluru',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Arrive early on weekend mornings as queues can stretch down Gandhi Bazaar; collect a token at the doorway.'
  },
  {
    id: 'blr-mtr',
    name: 'Mavalli Tiffin Room (MTR)',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1924 historic culinary institution near Lalbagh, inventors of Rava Idli during World War II rice shortages.',
    description: 'Founded in 1924 by the Maiya family, MTR is an internationally celebrated dining temple. Known for inventing the steamed Rava Idli with ghee and cashew nuts, silver-tumbler filter coffee, and multi-course silver-thali lunches.',
    imageUrl: RECORD_IMAGE_MAP['blr-mtr'],
    tagline: 'Est. 1924 · Century-Old Culinary Institution near Lalbagh',
    highlights: [
      'Original Rava Idli served with small bowls of pure melted ghee',
      'Rich multi-dish traditional Karnataka silver thali meals',
      'A century of uncompromising purity standards and traditional recipes'
    ],
    openingHours: '06:30 to 11:00 & 12:30 to 20:30 (Closed Mondays)',
    location: 'Lalbagh Road, Mavalli, Bengaluru',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Walk across the street to Lalbagh Botanical Garden before or after your breakfast.'
  },
  {
    id: 'blr-ctr',
    name: 'Shri Sagar CTR (Central Tiffin Room)',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1950s iconic breakfast venue in Malleshwaram, famed for its Benne Masala Dosa with an extraordinarily crisp golden crust.',
    description: 'Located in the cultural neighborhood of Malleshwaram, Shri Sagar (widely known as CTR) is celebrated across Bangalore for its Benne Dosa. The exterior is fried to an unmatched golden glass-like crunch while remaining tender inside, stuffed with seasoned potatoes.',
    imageUrl: RECORD_IMAGE_MAP['blr-ctr'],
    tagline: 'Est. 1950s · Iconic Malleshwaram Benne Dosa Landmark',
    highlights: [
      'Ultra-crisp golden Benne Masala Dosa roasted with pure butter',
      'Poori Saagu and hot Mangalore Bajji snacks',
      'Piping hot filter coffee served in stainless steel tumblers'
    ],
    openingHours: '07:30 to 12:30 & 16:00 to 21:00 daily',
    location: '7th Cross, Margosa Road, Malleshwaram, Bengaluru',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Try the Poori Saagu if you visit with friends alongside a dosa.'
  },
  {
    id: 'blr-corner-house',
    name: 'Corner House Ice Cream',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1982 cult dessert institution beloved across generations, famous for Death By Chocolate (DBC).',
    description: 'A Bengaluru institution since 1982, Corner House is legendary for nostalgic, unpretentious sundaes. Renowned for Death By Chocolate (DBC)—warm, fudgy chocolate cake topped with double scoops of vanilla ice cream, hot chocolate fudge, roasted peanuts, and cream.',
    imageUrl: RECORD_IMAGE_MAP['blr-corner-house'],
    tagline: 'Est. 1982 · Cult Bengaluru Dessert & Sundae Institution',
    highlights: [
      'Original Death By Chocolate (DBC) with warm cake and hot fudge',
      'Fresh fruit seasonal sundaes and classic banana splits',
      'Iconic community dessert hubs across Indiranagar, Jayanagar, and Koramangala'
    ],
    openingHours: '11:00 to 23:30 daily',
    location: 'Indiranagar / Jayanagar, Bengaluru',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Share the DBC with friends as the portion size is generously rich.'
  },
  {
    id: 'blr-nagarjuna',
    name: 'Nagarjuna',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1984 legendary dining destination famous for fiery Andhra banana-leaf meals and spicy mutton biryani.',
    description: 'Founded in 1984, Nagarjuna is Bengaluru’s gold standard for fiery, authentic Andhra cuisine. Revered for unlimited traditional meals served on fresh banana leaves with gun powder (podi), desi ghee, pappu dal, chicken sholay kebab, and aromatic biryani.',
    imageUrl: RECORD_IMAGE_MAP['blr-nagarjuna'],
    tagline: 'Est. 1984 · Premier Authentic Andhra Banana-Leaf Dining Landmark',
    highlights: [
      'Unlimited traditional Andhra meals served on banana leaves',
      'Crispy, spicy Chicken Sholay Kebab with deep-fried curry leaves',
      'Aromatic Andhra-style Dum Biryani served with spicy gravy and raita'
    ],
    openingHours: '12:00 to 16:00 & 19:00 to 23:00 daily',
    location: 'Indiranagar / Residency Road, Bengaluru',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Mix hot steamed rice with a dollop of pure ghee and gunpowder (podi) for the classic Andhra opening course.'
  },
  {
    id: 'blr-taaza-thindi',
    name: 'Taaza Thindi',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Restaurants & Cafés',
    shortDescription: 'Modern cult-favorite breakfast counter in Jayanagar famed for clinical hygiene, crisp masala dosas, and filter coffee.',
    description: 'A benchmark in modern Bengaluru breakfast culture located in Jayanagar. Known for immaculate stainless-steel open kitchens, conveyor-belt dishwashers, and exceptionally crisp golden masala dosas, fluffy chow-chow bath, and degree filter coffee at accessible prices.',
    imageUrl: RECORD_IMAGE_MAP['blr-taaza-thindi'],
    tagline: 'Modern High-Hygiene Pure Veg South Indian Breakfast Landmark',
    highlights: [
      'Piping hot Masala Dosa with red chilli-garlic chutney and coconut chutney',
      'Chow-Chow Bath (duo of savory Khara Bath and sweet Kesari Bath)',
      'Clinical open-kitchen hygiene with touchless token operations'
    ],
    openingHours: '07:00 to 12:00 & 16:30 to 21:30 daily',
    location: '1004, 26th Main Rd, 4th T Block East, Jayanagar, Bengaluru',
    sourceName: 'Department of Tourism, Government of Karnataka',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Expect a standing-only experience with rapid service; perfect for early morning breakfast.'
  },

  // Category 5: Cultural Experiences
  {
    id: 'blr-nrityagram',
    name: 'Nrityagram Dance Village',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Cultural Experiences',
    shortDescription: 'India’s first modern Gurukul residential dance village, dedicated to Odissi and classical Indian dance forms.',
    description: 'Founded in 1990 by Protima Gauri in the rural outskirts of Bangalore. Designed by architect Gerard da Cunha using mud and red earth, students live under the ancient guru-shishya parampara practicing classical Odissi dance.',
    imageUrl: RECORD_IMAGE_MAP['blr-nrityagram'],
    tagline: 'Modern Gurukul Classical Dance Community in Mud Architecture',
    highlights: [
      'Open-air yoga and dance rehearsals under flowering bougainvillea',
      'Sustainable earthen architecture blending seamlessly with nature',
      'Annual Vasantahabba all-night spring festival grounds'
    ],
    openingHours: '10:00 to 14:00 (Open to visitors Fridays to Sundays; Closed Mondays)',
    location: 'Hesaraghatta, Bengaluru Rural, Karnataka',
    sourceName: 'Sangeet Natak Akademi & Karnataka Tourism',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Visit on Saturday morning between 10:30 and 12:30 to observe dancers rehearsing in the studios.'
  },
  {
    id: 'blr-rangashankara',
    name: 'Ranga Shankara Theatre',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Cultural Experiences',
    shortDescription: 'Dynamic live theatre space founded in memory of actor Shankar Nag, staging plays in Kannada, English, and Hindi.',
    description: 'Founded by Arundhati Nag in JP Nagar, Ranga Shankara is dedicated to keeping live theatre affordable and accessible with a show nearly every day of the year. Known for its intimate acoustic design and famous sabudana vadas at the theatre café.',
    imageUrl: RECORD_IMAGE_MAP['blr-rangashankara'],
    tagline: 'Vibrant Cultural Hub of Indian Contemporary & Regional Theatre',
    highlights: [
      'Intimate thrust stage ensuring every seat has unbroken sightlines',
      'Annual Ranga Shankara National Theatre Festival',
      'Beloved courtyard café serving hot sabudana vadas and ginger chai'
    ],
    openingHours: 'Box office opens 10:00 daily; Performances usually at 19:30',
    location: '36/2, 8th Cross Road, JP Nagar 2nd Phase, Bengaluru',
    sourceName: 'Karnataka Nataka Academy & Ranga Shankara Trust',
    sourceUrl: 'https://rangashankara.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Arrive 45 minutes before showtime to get courtyard café snacks; doors strictly close once plays commence.'
  },

  // Category 6: Hidden Gems
  {
    id: 'blr-blossom-book-house',
    name: 'Blossom Book House on Church Street',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Hidden Gems',
    shortDescription: 'Three-storey labyrinth of over 200,000 rare, out-of-print, and pre-owned books in Bangalore’s literary quarter.',
    description: 'An iconic literary haven on Church Street established in 2001. Shelves stacked to the ceiling with hundreds of thousands of volumes spanning philosophy, Indian literature, classic comics, and rare historical maps.',
    imageUrl: RECORD_IMAGE_MAP['blr-blossom-book-house'],
    tagline: 'Three-Storey Literary Sanctuary of Rare and Second-Hand Books',
    highlights: [
      'Over 200,000 used and new books across three packed storeys',
      'Rare first editions of Indian and world literature',
      'Surrounding cobblestone pedestrianized Church Street café vibe'
    ],
    openingHours: '10:30 to 21:00 daily',
    location: '84, Church Street, Haridevpur, Shanthala Nagar, Bengaluru',
    sourceName: 'Bangalore Literary Society & Karnataka Tourism',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Allow yourself at least an hour to browse the second floor where rare art and history books reside.'
  },
  {
    id: 'blr-bugle-rock',
    name: 'Bugle Rock Geological Park',
    destination: 'Bangalore, Karnataka',
    destinationId: 'bangalore',
    cityOrLocation: 'Bangalore',
    state: 'Karnataka',
    category: 'Hidden Gems',
    shortDescription: '3,000-million-year-old volcanic rock formation in Basavanagudi where Kempe Gowda II’s watchmen sounded warning bugles.',
    description: 'A designated National Geological Monument in Basavanagudi. Composed of Peninsular Gneiss dated to 3,000 million years ago. Features one of Kempe Gowda II’s four 16th-century boundary watchtowers that marked Bangalore’s royal perimeter.',
    imageUrl: RECORD_IMAGE_MAP['blr-bugle-rock'],
    tagline: '3,000-Million-Year-Old Natural Geological Wonder & Kempe Gowda Watchtower',
    highlights: [
      'Precambrian rock formations examined by geologists worldwide',
      '16th-century Kempe Gowda boundary watchtower',
      'Shaded green park paths adjacent to the famous Bull Temple'
    ],
    openingHours: '05:30 to 20:00 daily',
    location: 'Bull Temple Road, Basavanagudi, Bengaluru',
    sourceName: 'Geological Survey of India & BBMP Parks',
    sourceUrl: 'https://karnatakatourism.org',
    lastVerifiedDate: '2026-03-20',
    visitorTip: 'Combine with a visit to the colossal monolithic Nandi at the adjacent 16th-century Bull Temple.'
  },

  // =========================================================================
  // 3. HYDERABAD, TELANGANA
  // =========================================================================

  // Category 1: Historical Places & Landmarks
  {
    id: 'hyd-golconda-fort',
    name: 'Golconda Fort',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Historical Places & Landmarks',
    shortDescription: '16th-century acoustic citadel and capital of the Qutb Shahi kings, famed for the Koh-i-Noor diamond trade.',
    description: 'The ancient capital of the Qutb Shahi kings, famed for its diamond trade (including the Koh-i-Noor and Hope Diamond) and acoustic engineering where a hand-clap at Fateh Darwaza can be heard 1 km away at Bala Hissar.',
    imageUrl: RECORD_IMAGE_MAP['hyd-golconda-fort'],
    tagline: '16th Century Citadel & World-Famous Diamond Capital',
    highlights: [
      'Acoustic marvel at Fateh Darwaza (Victory Gate)',
      'Bala Hissar royal palace pavilion offering 360-degree city views',
      'Evening Sound & Light show narrating the reign of the Qutb Shahis'
    ],
    historicalSignificance: 'Capital of the Qutb Shahi dynasty from 1512 to 1687 CE; global hub for diamond trade mined from the Kollur mines.',
    whyVisit: 'Astonishing acoustic engineering and panoramic summit views of Hyderabad and the Deccan plateau.',
    openingHours: '09:00 to 17:30 daily (Light Show 18:30 to 20:30)',
    location: 'Ibrahim Bagh, Hyderabad, Telangana',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Wear sports shoes for climbing the 380 stone steps to the Bala Hissar peak.'
  },
  {
    id: 'hyd-chowmahalla',
    name: 'Chowmahalla Palace',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Historical Places & Landmarks',
    shortDescription: '1860s CE ceremonial seat of the Asaf Jahi Nizams, housing 19 Belgian chandeliers and the 1912 Silver Ghost Rolls-Royce.',
    description: 'The ceremonial palace of the Asaf Jahi dynasty, synthesizer of Persian, Indo-Saracenic, and European architecture. Features Khilwat Mubarak durbar hall with 19 Belgian crystal chandeliers and vintage royal car collection.',
    imageUrl: RECORD_IMAGE_MAP['hyd-chowmahalla'],
    tagline: '1860s CE · UNESCO Asia Pacific Heritage Seat of the Nizams',
    highlights: [
      'Khilwat Mubarak durbar hall with pure yellow marble royal throne',
      'Vintage Rolls-Royce 1912 Silver Ghost custom built for the Nizam',
      'Lush courtyards with marble fountains and clock tower'
    ],
    historicalSignificance: 'Official seat of the Nizams of Hyderabad, modeled on the Shah of Iran’s palace in Isfahan.',
    whyVisit: 'Pure royal splendor and immaculately preserved state ceremonial rooms of one of history’s wealthiest dynasties.',
    openingHours: '10:00 to 17:00 (Closed Fridays)',
    location: 'Motigalli, Khilwat, Hyderabad, Telangana',
    sourceName: 'Chowmahalla Palace Trust & UNESCO Asia Pacific Award',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Photography permits for SLR cameras can be purchased at the ticket counter.'
  },
  {
    id: 'hyd-falaknuma',
    name: 'Taj Falaknuma Palace',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Historical Places & Landmarks',
    shortDescription: '1893 CE scorpion-shaped Italian marble palace perched 2,000 feet above Hyderabad, famed for its 101-seat dining hall.',
    description: 'Commissioned by Nawab Vikar-ul-Umra and later acquired by Nizam Mahbub Ali Khan. Designed by British architect William Ward Marret in the shape of a scorpion. Entirely carved from Italian marble, boasting jade collections, frescoed ceilings, and the world’s longest 101-seat dining table.',
    imageUrl: RECORD_IMAGE_MAP['hyd-falaknuma'],
    tagline: '1893 CE · "Mirror of the Sky" Palace of Italian Marble & 101-Seat Royal Table',
    highlights: [
      'Monumental 101-seat rosewood dining table illuminated by Belgian crystal chandeliers',
      'Grand marble staircase lined with statues of British monarchs and muses',
      'Stately Durbar Hall with Venetian crystal chandeliers and intricately painted ceilings'
    ],
    historicalSignificance: 'Hosted King George V, Tsar Nicholas II, and served as the private mountain retreat of the sixth and seventh Nizams.',
    whyVisit: 'Witness the pinnacle of 19th-century royal opulence and sweeping views over the city from 2,000 feet altitude.',
    openingHours: 'Heritage tours available on weekends via Telangana Tourism (or dining reservations)',
    location: 'Engine Bowli, Fatima Nagar, Falaknuma, Hyderabad',
    sourceName: 'Telangana State Tourism Development Corporation & Indian National Trust for Art and Cultural Heritage (INTACH)',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Book the official weekend Telangana Tourism heritage tour or reserve afternoon tea on the jade terrace.'
  },
  {
    id: 'hyd-purani-haveli',
    name: 'Purani Haveli (The Nizam’s Museum)',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Historical Places & Landmarks',
    shortDescription: '18th-century palace complex of the Asaf Jahi Nizams, housing the world’s longest 240-foot Burma teak wardrobe.',
    description: 'Originally constructed as the residence for Mir Alam, Prime Minister to the third Nizam, and later transformed into the official palace of the second Nizam. Houses the famous Nizam’s Museum featuring golden jubilees gifts, a 1930 Rolls-Royce, and the incredible 240-foot-long, two-tiered hand-cranked Burma teak wardrobe of Nizam Mir Mahbub Ali Khan.',
    imageUrl: RECORD_IMAGE_MAP['hyd-purani-haveli'],
    tagline: '18th Century Palace & World’s Longest 240-Foot Burma Teak Wardrobe',
    highlights: [
      'World’s longest hand-cranked wooden wardrobe spanning two full storeys in Burma teak',
      'Solid silver models of Hyderabad’s landmark monuments gifted for the 1937 Silver Jubilee',
      'Historic 1930 Rolls-Royce and ceremonial gold dagger collections'
    ],
    historicalSignificance: 'Birthplace and home to multiple Nizams; a testament to Mir Mahbub Ali Khan’s legendary sartorial taste (he never wore the same outfit twice).',
    whyVisit: 'A fascinating, quirky, and deeply personal glimpse into the everyday eccentricities of the Nizams.',
    openingHours: '10:00 to 17:00 (Closed Fridays)',
    location: 'Purani Haveli, Pathar Gatti, Old City, Hyderabad',
    sourceName: 'Nizam’s Museum Trust & Telangana Tourism',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Notice the wooden elevator gear inside the wardrobe that moved clothes between floors without electricity.'
  },
  {
    id: 'hyd-qutb-shahi-tombs',
    name: 'Qutb Shahi Tombs at Ibrahim Bagh',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Historical Places & Landmarks',
    shortDescription: '16th & 17th-century domed royal necropolis where seven kings of the Qutb Shahi dynasty are entombed within landscaped gardens.',
    description: 'Set in the tranquil Ibrahim Bagh near Golconda Fort, this monumental ensemble represents the only place in the world where an entire dynasty is buried in one location. Blends Persian, Pashtun, and Hindu architectural elements under majestic bulbous domes.',
    imageUrl: RECORD_IMAGE_MAP['hyd-qutb-shahi-tombs'],
    tagline: 'Royal Domed Necropolis of the Entire Qutb Shahi Dynasty',
    highlights: [
      'Monumental tomb of Muhammad Quli Qutb Shah, founder of Hyderabad',
      'Two-tiered square plinths with intricately carved stucco arches and battlements',
      'Meticulously restored Persian water courses and baolis by the Aga Khan Trust for Culture'
    ],
    historicalSignificance: 'The resting place of the founders of Hyderabad, showcasing the architectural evolution of the Deccan Sultanates.',
    whyVisit: 'A serene historical landscape combining majestic funerary architecture with peaceful restored Persian gardens.',
    openingHours: '09:30 to 17:30 (Closed Fridays)',
    location: 'Ibrahim Bagh, near Golconda Fort, Hyderabad',
    sourceName: 'Archaeological Survey of India & Aga Khan Trust for Culture',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Combine with Golconda Fort as the tombs are situated just 1 kilometer from the fort gates.'
  },

  // Category 2: Must-Visit Attractions
  {
    id: 'hyd-charminar',
    name: 'Charminar & Laad Bazaar',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Must-Visit Attractions',
    shortDescription: '1591 CE monumental four-minaret gateway marking the founding of Hyderabad, surrounded by vibrant bangle markets.',
    description: 'Built in 1591 by Muhammad Quli Qutb Shah to mark the founding of Hyderabad and the end of a deadly plague. The square granite monument features four 48.7-meter minarets, a 2nd-floor mosque, and overlooks the historic bangle bazaar.',
    imageUrl: RECORD_IMAGE_MAP['hyd-charminar'],
    tagline: '1591 CE · Four-Minaret Landmark of the Qutb Shahi Dynasty',
    highlights: [
      'Four grand minarets with 149 spiral steps overlooking Old City',
      'Surrounding Laad Bazaar famed for handcrafted lacquer and stone bangles',
      'Twilight illuminations creating a golden glow over historic streets'
    ],
    historicalSignificance: 'Commissioned in 1591 CE at the crossroads of ancient trading routes to symbolize the spiritual heart of Hyderabad.',
    whyVisit: 'The indispensable visual centerpiece of Hyderabad culture, street life, and cuisine.',
    openingHours: '09:30 to 17:30 daily (Surrounding market open till late evening)',
    location: 'Charminar Road, Old City, Hyderabad',
    sourceName: 'Archaeological Survey of India & Telangana Tourism',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Climb to the first-floor balcony for a panoramic perspective of the bustling Char Kaman arches.'
  },
  {
    id: 'hyd-hussain-sagar',
    name: 'Hussain Sagar Lake & Buddha Statue',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Must-Visit Attractions',
    shortDescription: '1563 CE heart-shaped lake featuring the world’s tallest monolithic granite statue of Gautama Buddha.',
    description: 'Excavated in 1563 by Ibrahim Quli Qutb Shah, connecting twin cities Hyderabad and Secunderabad. In the center on Gibraltar Rock stands an 18-meter-tall, 450-ton monolithic white granite statue of the Buddha, reached by ferry boats.',
    imageUrl: RECORD_IMAGE_MAP['hyd-hussain-sagar'],
    tagline: '1563 CE · Heart-Shaped Lake & 450-Ton Monolithic Buddha',
    highlights: [
      'Ferry cruise to Gibraltar Rock standing directly beneath the towering Buddha',
      'Illuminated Necklace Road promenade with water fountain gardens',
      'Picturesque evening skyline reflecting across the vast waters'
    ],
    historicalSignificance: 'Built in 1563 CE to supply water to the Qutb Shahi kingdom, named after Hussain Shah Wali.',
    whyVisit: 'Enjoy cool evening lake breezes and take a scenic boat trip to the monolithic island statue.',
    openingHours: 'Lake promenade open 24 hours (Boating 09:00 to 20:30 daily)',
    location: 'Tank Bund Road / Necklace Road, Hyderabad',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Board the evening speedboat from Lumbini Park for sunset views against the statue.'
  },

  // Category 3: Local Food & Cuisine (dishes only - NO opening hours!)
  {
    id: 'hyd-biryani',
    name: 'Hyderabadi Dum Biryani',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Local Food & Cuisine',
    shortDescription: 'The defining royal dish of Hyderabad: raw marinated goat meat and aged basmati rice cooked on slow coal flame.',
    description: 'The world-famous royal dish originating in the kitchens of the Nizam. Prepared using the "Kacchi Dum" technique where marinated raw meat and aged basmati rice are layered with saffron, mint, and fried onions, then sealed with dough in copper handis.',
    imageUrl: RECORD_IMAGE_MAP['hyd-biryani'],
    tagline: 'Royal Culinary Synthesis of Nizami Dum Cooking & Telugu Spices',
    highlights: [
      'Authentic Kacchi Dum mutton biryani slow-cooked over wood fire',
      'Served with spicy Mirchi ka Salan (chilli gravy) and Dahi Chutney (raita)',
      'Fragrant Basmati rice infused with whole spices and saffron milk'
    ],
    location: 'Available across Hyderabad’s heritage biryani dining houses',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Enjoy with a cold glass of Thums Up or sweet Double Ka Meetha dessert.'
  },
  {
    id: 'hyd-haleem-irani-chai',
    name: 'Hyderabadi Haleem & Irani Chai',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Local Food & Cuisine',
    shortDescription: 'GI-tagged slow-simmered meat and broken wheat stew, paired with creamy condensed-milk Irani tea and Osmania biscuits.',
    description: 'Hyderabadi Haleem holds Geographical Indication (GI) status. Mutton, broken wheat, lentils, and pure ghee are pounded continuously for 12 hours into a rich savoury porridge. Paired with Irani Chai—creamy, slow-boiled tea infused with evaporated milk and cardamom, dunked with salted Osmania biscuits.',
    imageUrl: RECORD_IMAGE_MAP['hyd-haleem-irani-chai'],
    tagline: 'GI-Tagged Nizami Stew & Cult Irani Café Beverages',
    highlights: [
      'Haleem garnished with fried onions (birista), mint leaves, and lime wedge',
      'Creamy Irani Chai brewed with concentrated decoction and scalded milk',
      'Crumbly, buttery sweet-salty Osmania biscuits'
    ],
    location: 'Traditional food stalls and Irani bakeries across Hyderabad',
    sourceName: 'Geographical Indications Registry & Telangana Tourism',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Haleem is especially ubiquitous and fresh during the holy month of Ramzan.'
  },
  {
    id: 'hyd-double-ka-meetha',
    name: 'Double ka Meetha (Shahi Tukda)',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Local Food & Cuisine',
    shortDescription: 'Sumptuous royal Nizami dessert of fried bread soaked in saffron-infused thickened milk, cardamom, and roasted nuts.',
    description: 'The crowned dessert of Hyderabadi celebratory feasts. Named "Double" from double roti (milk bread), crisp golden-fried slices are steeped in a fragrant sugar syrup scented with rose water, coated in luscious reduced cardamom saffron milk (Rabdi), and showered with toasted pistachios, cashews, and silver foil.',
    imageUrl: RECORD_IMAGE_MAP['hyd-double-ka-meetha'],
    tagline: 'Royal Nizami Saffron Cardamom Bread Pudding',
    highlights: [
      'Ghee-toasted bread steeped in fragrant saffron-rose syrup',
      'Creamy reduced khoya Rabdi glaze with cardamom notes',
      'Essential finale after an authentic Hyderabadi Biryani feast'
    ],
    location: 'Traditional wedding feasts and heritage dessert shops across Old Hyderabad',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Best enjoyed warm or at room temperature alongside black tea or after biryani.'
  },

  // Category 4: Restaurants & Cafés (dining establishments only!)
  {
    id: 'hyd-shadab',
    name: 'Hotel Shadab',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1953 bustling multi-storey food institution near Charminar, famous for Mutton Dum Biryani and morning Paya.',
    description: 'A bustling multi-storey food institution near the High Court and Charminar. Celebrated for authentic Mutton Dum Biryani, morning Paya Nihari with Sheermal, and Ramzan Haleem.',
    imageUrl: RECORD_IMAGE_MAP['hyd-shadab'],
    tagline: 'Est. 1953 · Old City Culinary Institution near Charminar',
    highlights: [
      'Special Mutton Biryani prepared with tender local meat and long grain rice',
      'Nizami Haleem slow-cooked for 12 hours with wheat, lentils, and ghee',
      'Morning Paya soup served with freshly baked Naan bread'
    ],
    openingHours: '05:30 AM to 02:00 AM midnight daily',
    location: 'High Court Road, Madina Circle, Ghansi Bazaar, Hyderabad',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Head upstairs to the air-conditioned family dining hall for relaxed seating.'
  },
  {
    id: 'hyd-nimrah-cafe',
    name: 'Nimrah Café & Bakery',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1993 iconic heritage café standing directly opposite the arches of Charminar, famous for hot Irani chai.',
    description: 'Perched directly in front of the Mecca Masjid and Charminar, Nimrah is the spiritual center of Hyderabad’s tea culture. Diners stand shoulder-to-shoulder sipping fresh piping-hot Irani chai while warm batches of Osmania, tie, and fruit biscuits are pulled from the ovens.',
    imageUrl: RECORD_IMAGE_MAP['hyd-nimrah-cafe'],
    tagline: 'Est. 1993 · Iconic Irani Tea Institution Directly Facing Charminar',
    highlights: [
      'Piping hot special Irani Chai poured from brass samovars',
      'Fresh-out-of-the-oven buttery Osmania biscuits and Khari puffs',
      'Unobstructed front-row views of the monumental Charminar minarets'
    ],
    openingHours: '04:00 AM to 11:30 PM daily',
    location: 'Beside Mecca Masjid, Charminar, Old City, Hyderabad',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Visit at dawn around 06:00 AM when the morning breeze cools Charminar square.'
  },
  {
    id: 'hyd-paradise',
    name: 'Paradise Biryani, Secunderabad',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Restaurants & Cafés',
    shortDescription: 'Est. 1953 landmark multi-level culinary complex in Secunderabad that popularized Hyderabadi Biryani across the globe.',
    description: 'Started in 1953 as a small 100-seat café in Secunderabad, Paradise has grown into a landmark restaurant complex serving tens of thousands of guests daily. Renowned for its aromatic Chicken and Mutton Dum Biryanis, tender Reshmi Kebabs, and classic Double ka Meetha.',
    imageUrl: RECORD_IMAGE_MAP['hyd-paradise'],
    tagline: 'Est. 1953 · Landmark Secunderabad Culinary Complex',
    highlights: [
      'Signature Hyderabadi Dum Biryani served with Mirchi ka Salan',
      'Heritage Persian-influenced café roots dating back 7 decades',
      'Spacious multi-level dining options including rooftop and family halls'
    ],
    openingHours: '11:00 AM to 23:30 daily',
    location: 'MG Road, Sappu Bagh, Paradise Circle, Secunderabad',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'The original Paradise Circle branch in Secunderabad offers the most authentic heritage atmosphere.'
  },

  // Category 5: Cultural Experiences
  {
    id: 'hyd-laad-bazaar-craft',
    name: 'Laad Bazaar Lac Bangle Crafting',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Cultural Experiences',
    shortDescription: 'Centuries-old living tradition of heating natural resin and embedding sparkling stones into bridal bangles.',
    description: 'Flanking Charminar, Laad Bazaar has been a center for natural lac bangle craftsmanship since the Qutb Shahi era. Watch master artisans heat resin over open coals, shape it onto metal rings, and stud it with colorful glass beads and mirrors.',
    imageUrl: RECORD_IMAGE_MAP['hyd-laad-bazaar-craft'],
    tagline: 'Centuries-Old Royal Lacquer & Stone Bangle Craftsmanship',
    highlights: [
      'Live demonstrations of heating and shaping natural tree resin (lac)',
      'Intricate setting of sparkling stones, mirrors, and glass crystals',
      'Atmospheric historic bazaar lit by shimmering glass display chandeliers'
    ],
    openingHours: '11:00 to 22:30 daily',
    location: 'Laad Bazaar, Charminar, Old City, Hyderabad',
    sourceName: 'Telangana Handicrafts Development Corporation & Golkonda Handicrafts',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Bargaining is expected; artisans will happily customize bangle sizes on the spot.'
  },
  {
    id: 'hyd-salargunj-museum',
    name: 'Salar Jung Museum',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Cultural Experiences',
    shortDescription: 'One of the world’s largest one-man art collections, featuring the Veiled Rebecca and 19th-century musical clock.',
    description: 'Housed on the southern bank of the Musi River, this monumental museum holds the private collection of Nawab Mir Yousuf Ali Khan (Salar Jung III). Boasting 43,000 art objects, 47,000 printed books, and rare manuscripts from Europe, Persia, Japan, and India.',
    imageUrl: RECORD_IMAGE_MAP['hyd-salargunj-museum'],
    tagline: 'Monumental World Heritage Art Collection of the Salar Jungs',
    highlights: [
      'The Veiled Rebecca: Exquisite 1876 marble statue by Italian sculptor GB Benzoni',
      '19th-century British musical clock with mechanical soldier striking the hour',
      'Mughal jade dagger collection including daggers of Emperor Jahangir and Noor Jahan'
    ],
    openingHours: '10:00 to 17:00 (Closed Fridays)',
    location: 'Salar Jung Road, Darulshifa, Hyderabad',
    sourceName: 'Ministry of Culture, Government of India',
    sourceUrl: 'https://salarjungmuseum.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Arrive at the central clock hall 10 minutes before any hour to watch the mechanical clock chime.'
  },

  // Category 6: Hidden Gems
  {
    id: 'hyd-paigah-tombs',
    name: 'Paigah Tombs',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Hidden Gems',
    shortDescription: 'Secluded 18th-century royal necropolis famed for exquisite marble jaali lace and Indo-Saracenic stucco craft.',
    description: 'The private burial ground of the aristocratic Paigah nobles, fiercely loyal to the Nizams. Built between 1787 and 1880, these tombs are an architectural triumph of limestone stucco, floral inlays, and geometric jaali screens that rival the Alhambra.',
    imageUrl: RECORD_IMAGE_MAP['hyd-paigah-tombs'],
    tagline: 'Exquisite Geometric Stucco Jaali Lace Necropolis',
    highlights: [
      'Perforated stone jaali screens with completely unique geometric patterns in each arch',
      'Delicate lime-plaster carvings and mother-of-pearl marble inlays',
      'Quiet, tree-shaded sanctuary far removed from the city traffic'
    ],
    openingHours: '10:00 to 17:00 (Closed Fridays)',
    location: 'Pisallabanda, Santosh Nagar, Hyderabad',
    sourceName: 'Telangana Department of Heritage & Archaeological Survey',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Wear socks as shoes must be removed when walking onto the marble courtyards.'
  },
  {
    id: 'hyd-taramati-baradari',
    name: 'Taramati Baradari',
    destination: 'Hyderabad, Telangana',
    destinationId: 'hyderabad',
    cityOrLocation: 'Hyderabad',
    state: 'Telangana',
    category: 'Hidden Gems',
    shortDescription: '17th-century acoustic 12-door open-air music pavilion perched on a hillock overlooking Golconda.',
    description: 'Built during the reign of Ibrahim Quli Qutb Shah for his court courtesan Taramati. Engineered with 12 arched doorways so that her singing could carry across the breeze 2 kilometers into Golconda Fort without amplification.',
    imageUrl: RECORD_IMAGE_MAP['hyd-taramati-baradari'],
    tagline: '17th Century · 12-Door Acoustic Royal Hillock Music Pavilion',
    highlights: [
      '12 arched doorways engineered for natural cross-breeze acoustic projection',
      'Panoramic sunset views over the historic Golconda landscape',
      'Surrounding amphitheatre hosting classical music and dance recitals'
    ],
    openingHours: '10:00 to 18:00 daily',
    location: 'Ramdev Guda, Ibrahim Bagh, Hyderabad',
    sourceName: 'Telangana State Tourism Development Corporation',
    sourceUrl: 'https://telanganatourism.gov.in',
    lastVerifiedDate: '2026-03-28',
    visitorTip: 'Visit in the late afternoon to catch sunset breezes through the 12 open arches.'
  }
];

export const EVALUATION_SCENARIOS: EvaluationScenario[] = [
  // Test 1: Jaipur Historical Places & Forts
  {
    id: 'test-1-jaipur-history',
    title: 'Test 1: Jaipur Historical Places & Forts (Amber, Jaigarh, Nahargarh, City Palace, Hawa Mahal)',
    targetDestination: 'jaipur',
    question: 'What are the must-visit historical places and forts in Jaipur, and how do Amber, Jaigarh, and Nahargarh compare?',
    expectedBehavior: 'Retrieves Amber Fort, Jaigarh Fort, Nahargarh Fort, and City Palace with verified historical significance, founding dates, and UNESCO citations without returning food or restaurants.',
    category: 'grounded_retrieval'
  },
  // Test 2: Bangalore Architecture & Historical Places
  {
    id: 'test-2-bangalore-architecture',
    title: 'Test 2: Bangalore Historical Places & Architecture (Bangalore Palace, Tipu Summer Palace, Bangalore Fort, Vidhana Soudha, Lalbagh)',
    targetDestination: 'bangalore',
    question: 'Can you recommend an architectural heritage itinerary in Bangalore including Bangalore Fort and palaces?',
    expectedBehavior: 'Retrieves Bangalore Palace, Tipu Sultan’s Summer Palace, Bangalore Fort, Vidhana Soudha, and Lalbagh with architectural eras, founding dates, and official Karnataka Tourism citations.',
    category: 'grounded_retrieval'
  },
  // Test 3: Hyderabad Palaces & Forts
  {
    id: 'test-3-hyderabad-palaces',
    title: 'Test 3: Hyderabad Palaces & Forts (Golconda Fort, Chowmahalla, Falaknuma, Purani Haveli)',
    targetDestination: 'hyderabad',
    question: 'Tell me about the historical forts and royal palaces to visit in Hyderabad, including Falaknuma Palace and Purani Haveli.',
    expectedBehavior: 'Retrieves Golconda Fort, Chowmahalla Palace, Falaknuma Palace, and Purani Haveli with acoustic marvels, Nizam dynasty history, the 101-seat table, and verified Telangana Tourism sources.',
    category: 'grounded_retrieval'
  },
  // Test 4: Cross-City Query (Active: Jaipur -> Question about Bangalore)
  {
    id: 'test-4-cross-city-jaipur-bangalore',
    title: 'Test 4: Cross-City Query (Jaipur selected, ask about Bangalore)',
    targetDestination: 'jaipur',
    question: 'Tell me about Bangalore Palace and Tipu Sultan’s Summer Palace.',
    expectedBehavior: 'Directly answers with verified Bangalore recommendations without error messages, blocking barriers, or defaulting to Jaipur.',
    category: 'cross_destination'
  },
  // Test 5: Cross-City Query (Active: Bangalore -> Question about Hyderabad)
  {
    id: 'test-5-cross-city-bangalore-hyderabad',
    title: 'Test 5: Cross-City Query (Bangalore selected, ask about Hyderabad)',
    targetDestination: 'bangalore',
    question: 'Tell me about Golconda Fort and Charminar in Hyderabad.',
    expectedBehavior: 'Directly answers with verified Hyderabad recommendations without error messages, blocking barriers, or defaulting to Bangalore.',
    category: 'cross_destination'
  },
  // Test 6: Local Food Discovery (Dishes only, no opening hours)
  {
    id: 'test-6-local-food-dishes',
    title: 'Test 6: Local Food Discovery (Strict Dish Categorization with No Opening Hours)',
    targetDestination: 'jaipur',
    question: 'What traditional food dishes should I try in Jaipur?',
    expectedBehavior: 'Recommends authentic dishes (Dal Baati Churma, Ghewar, Pyaaz Kachori, Ker Sangri) classified strictly under Local Food & Cuisine with flavor profiles and cultural roots, without confusing dishes with restaurants or displaying opening hours.',
    category: 'grounded_retrieval'
  },
  // Test 7: Restaurant Discovery (Verified Venues with Operating Details)
  {
    id: 'test-7-restaurant-venues',
    title: 'Test 7: Restaurant Discovery (Verified Dining Venues with Practical Details)',
    targetDestination: 'bangalore',
    question: 'Which verified heritage restaurants and cafés should I visit to eat in Bangalore?',
    expectedBehavior: 'Recommends verified dining establishments (Vidyarthi Bhavan, MTR, CTR) classified under Restaurants & Cafés with addresses, opening hours, visitor tips, and official citations.',
    category: 'grounded_retrieval'
  },
  // Test 8: Follow-up Resolution (Pronoun & Context Resolution)
  {
    id: 'test-8-follow-up-resolution',
    title: 'Test 8: Multi-Turn Follow-Up Resolution ("Which one is best for photography?")',
    targetDestination: 'jaipur',
    question: 'Which one is best for photography?',
    expectedBehavior: 'Resolves the referential question against previous conversation recommendations (e.g. Amber Fort vs Nahargarh Fort) without defaulting or resetting city context, evaluating visual aesthetics and golden hour light.',
    category: 'follow_up_resolution'
  },
  // Test 9: Unsupported City Refusal
  {
    id: 'test-9-unsupported-refusal',
    title: 'Test 9: Unsupported City Refusal (e.g. Udaipur)',
    targetDestination: 'jaipur',
    question: 'What are the top attractions and palaces to visit in Udaipur?',
    expectedBehavior: 'Politely refuses Udaipur (explaining Yaaros currently supports Jaipur, Bangalore, and Hyderabad) and directs the traveler to active supported cities, adhering strictly to zero fabrication.',
    category: 'unsupported_destination'
  },
  // Test 10: Real-Time Availability Limitation
  {
    id: 'test-10-live-availability',
    title: 'Test 10: Live Restaurant Availability & Reservation Limitation',
    targetDestination: 'bangalore',
    question: 'Can you check live table availability for Vidyarthi Bhavan or book a table tonight?',
    expectedBehavior: 'Honestly explains that live restaurant availability, wait times, and direct table reservations are not supported, directing the user to contact the venue directly.',
    category: 'real_time_limitation'
  },
  // Test 11: Insufficient Information Check
  {
    id: 'test-11-insufficient-info',
    title: 'Test 11: Insufficient Knowledge Base Information (Scuba Diving in Central Bangalore)',
    targetDestination: 'bangalore',
    question: 'Where can I go scuba diving in central Bangalore?',
    expectedBehavior: 'Honestly states no verified records exist for scuba diving in landlocked central Bangalore, adhering strictly to zero fabrication, and offers verified historical attractions instead.',
    category: 'insufficient_info'
  },
  // Test 12: Ambiguous Query
  {
    id: 'test-12-ambiguous-query',
    title: 'Test 12: Ambiguous Query (No city mentioned, no prior context)',
    targetDestination: 'jaipur',
    question: 'What cities does Yaaros cover and what can I explore?',
    expectedBehavior: 'Politely and clearly introduces all three supported cities (Jaipur, Bangalore, Hyderabad) and invites the traveler to choose which one to explore.',
    category: 'grounded_retrieval'
  }
];

export const GENERAL_SCOPE = {
  supportedDestinations: ['Jaipur (Rajasthan)', 'Bangalore (Karnataka)', 'Hyderabad (Telangana)'],
  categories: [
    'Historical Places & Landmarks',
    'Must-Visit Attractions',
    'Local Food & Cuisine',
    'Restaurants & Cafés',
    'Cultural Experiences',
    'Hidden Gems'
  ],
  realtimeUnsupportedFeatures: [
    'Live restaurant table availability & reservation booking',
    'Real-time transit delays & traffic congestion',
    'Dynamic live ticket surge pricing & seat counters',
    'Live hotel room booking & availability'
  ],
  realtimeDisclaimer: 
    'Please note: Yaaros does not support live restaurant availability, table booking, or real-time wait times. Restaurant visits should be booked directly with the venue or hotel concierge.'
};
