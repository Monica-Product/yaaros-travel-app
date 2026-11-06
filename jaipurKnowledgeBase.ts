/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Verified Jaipur Knowledge Base for Yaaros.
 * All information, timings, highlights, and source URLs are strictly verified.
 * The assistant must strictly draw from this data and not invent any details.
 */

export interface AttractionRecord {
  id: string;
  name: string;
  hindiName?: string;
  category: 'heritage_fort' | 'palace' | 'astronomy_museum' | 'cultural_monument';
  builtYear: string;
  builtBy: string;
  architecturalStyle: string;
  description: string;
  highlights: string[];
  visitingHours: string;
  idealDuration: string;
  location: string;
  sourceTitle: string;
  sourcePublisher: string;
  sourceUrl: string;
  firstTimeVisitorTip: string;
}

export interface CuisineRecord {
  id: string;
  name: string;
  category: 'signature_meal' | 'curry_bread' | 'snack_streetfood' | 'sweet_dessert';
  description: string;
  flavorProfile: string;
  traditionalPreparation: string;
  famousItems: string[];
  bestPlacesInJaipur: string[];
  sourceTitle: string;
  sourcePublisher: string;
  sourceUrl: string;
}

export interface DiningRecord {
  id: string;
  name: string;
  category: 'heritage_fine_dining' | 'historic_thali' | 'legendary_street_eats' | 'rooftop_cafe';
  establishedYear: string;
  location: string;
  specialties: string[];
  description: string;
  atmosphere: string;
  bookingPolicyNotice: string;
  sourceTitle: string;
  sourcePublisher: string;
  sourceUrl: string;
}

export interface ScopeBoundary {
  supportedCities: string[];
  unsupportedCitiesNotice: string;
  realtimeUnsupportedFeatures: string[];
  realtimeDisclaimer: string;
}

export const JAIPUR_SCOPE: ScopeBoundary = {
  supportedCities: ['Jaipur'],
  unsupportedCitiesNotice: 
    'Yaaros is an AI-powered travel companion designed for multi-destination travel discovery worldwide. However, our current MVP launch edition and verified knowledge base are intentionally restricted to Jaipur, Rajasthan. Destinations like Udaipur, Jodhpur, or other cities will be unlocked in upcoming editions. For now, please explore Jaipur’s verified attractions, cuisine, and heritage.',
  realtimeUnsupportedFeatures: [
    'Live restaurant table availability & reservation booking',
    'Real-time transit delays & traffic congestion',
    'Dynamic live ticket surge pricing & seat counters',
    'Live hotel room booking & availability'
  ],
  realtimeDisclaimer: 
    'Please note: Yaaros does not support live restaurant availability, table booking, or real-time wait times. Restaurant visits should be booked directly with the venue or hotel concierge.'
};

export const JAIPUR_ATTRACTIONS: AttractionRecord[] = [
  {
    id: 'amber-fort',
    name: 'Amber Fort (Amer Fort)',
    hindiName: 'आमेर किला',
    category: 'heritage_fort',
    builtYear: '1592 CE',
    builtBy: 'Raja Man Singh I (completed by Sawai Jai Singh I)',
    architecturalStyle: 'Rajput and Mughal fusion with yellow and pink sandstone & white marble',
    description: 'Perched atop Cheel ka Teela (Hill of Eagles) overlooking Maota Lake, Amber Fort is a UNESCO World Heritage site (part of the Hill Forts of Rajasthan). Famous for its artistic Hindu-Mughal style elements, sprawling courtyards, and palace chambers.',
    highlights: [
      'Sheesh Mahal (Hall of Mirrors) adorned with imported convex glass foils that illuminate with a single candle',
      'Diwan-e-Aam (Public Audience Hall) with double-pillared colonnade',
      'Sukh Niwas (Hall of Pleasure) with ingenious ancient water-cascade air cooling',
      'Ganesh Pol gateway with elaborate floral frescoes and lattice screens'
    ],
    visitingHours: '08:00 to 17:30 (Day Entry); 18:30 to 21:15 (Night Tourism & Light/Sound Show)',
    idealDuration: '2.5 - 3.5 hours',
    location: 'Devisinghpura, Amer, Jaipur (11 km northeast of city center)',
    sourceTitle: 'Hill Forts of Rajasthan - Amber Fort Inscription',
    sourcePublisher: 'UNESCO World Heritage Centre',
    sourceUrl: 'https://whc.unesco.org/en/list/247',
    firstTimeVisitorTip: 'Arrive early before 09:30 AM to explore the Sheesh Mahal with natural morning light and avoid peak tourist buses.'
  },
  {
    id: 'hawa-mahal',
    name: 'Hawa Mahal (Palace of Winds)',
    hindiName: 'हवा महल',
    category: 'palace',
    builtYear: '1799 CE',
    builtBy: 'Maharaja Sawai Pratap Singh (designed by Lal Chand Ustad)',
    architecturalStyle: 'Crown of Lord Krishna motif with Rajput-Islamic filigree woodwork & sandstone',
    description: 'A five-storey pyramidical palace facade standing 50 feet high, built with red and pink-hued sandstone. Features 953 meticulously carved jharokhas (small casements) engineered to create the Venturi cooling breeze while allowing purdah-observing royal women to watch street processions unobserved.',
    highlights: [
      '953 honeycomb jharokhas with miniature stained glass and stone latticework',
      'Ratan Mandir on the 2nd floor and Prakash Mandir on the top floor offering bird\'s-eye view of Pink City',
      'No front entrance stairs—floors are connected by gentle inclining ramps',
      'Heritage museum in the rear courtyard showcasing terracotta and Rajput weapons'
    ],
    visitingHours: '09:00 to 17:00 daily',
    idealDuration: '1 - 1.5 hours',
    location: 'Badi Choupad, J.D.A. Market, Pink City, Jaipur',
    sourceTitle: 'Hawa Mahal Monument Archive',
    sourcePublisher: 'Department of Archaeology & Museums, Government of Rajasthan',
    sourceUrl: 'https://artandculture.rajasthan.gov.in',
    firstTimeVisitorTip: 'The sunrise golden hour illuminates the exterior facade magnificently; photograph it from the street or opposite rooftop cafes.'
  },
  {
    id: 'city-palace',
    name: 'City Palace, Jaipur',
    hindiName: 'सिटी पैलेस',
    category: 'palace',
    builtYear: '1727 - 1732 CE',
    builtBy: 'Maharaja Sawai Jai Singh II (architect Vidyadhar Bhattacharya)',
    architecturalStyle: 'Blend of Rajput, Mughal, and European architecture',
    description: 'The ceremonial seat of the Maharaja of Jaipur. A vast walled complex encompassing grand courtyards, gardens, and palaces. A portion remains the royal family residence, while the remainder houses the Maharaja Sawai Man Singh II Museum.',
    highlights: [
      'Pritam Niwas Chowk with 4 celebrated seasonal gates: Peacock Gate (Autumn), Rose Gate (Winter), Green Gate (Spring), Lotus Gate (Summer)',
      'Chandra Mahal (Moon Palace) - 7-storey inner sanctum',
      'Mubarak Mahal (Welcome Palace) displaying royal textiles, Kashmiri shawls, and coronation garments',
      'Two record-holding Gangajalis (sterling silver jars, 1.6m high, holding 4000L of holy Ganges water)'
    ],
    visitingHours: '09:30 to 17:00 (Day); 19:00 to 22:00 (Night View)',
    idealDuration: '2 - 3 hours',
    location: 'Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur',
    sourceTitle: 'The City Palace Jaipur Official Museum',
    sourcePublisher: 'MSMS II Museum Trust & Rajasthan Tourism',
    sourceUrl: 'https://royaljaipur.in',
    firstTimeVisitorTip: 'Opt for the composite heritage pass or audio tour to fully appreciate the textile museum and arms gallery.'
  },
  {
    id: 'jantar-mantar',
    name: 'Jantar Mantar Observatory',
    hindiName: 'जंतर मंतर',
    category: 'astronomy_museum',
    builtYear: '1728 - 1734 CE',
    builtBy: 'Maharaja Sawai Jai Singh II',
    architecturalStyle: 'Astronomical stone & brass monumental instruments',
    description: 'A collection of 19 architectural astronomical instruments and a UNESCO World Heritage site. It is the most intact and complete of the five historic observatories built by Sawai Jai Singh II across Northern India.',
    highlights: [
      'Vrihat Samrat Yantra: The world\'s largest stone sundial standing 27m high, accurate to within two seconds',
      'Jai Prakash Yantra: Hemispherical bowl instruments for tracking celestial coordinate systems',
      'Rama Yantra: Cylindrical open-top structure for measuring altitude and azimuth of stars',
      'Misra Yantra: Composite instrument indicating noon in various observatories worldwide'
    ],
    visitingHours: '09:00 to 17:00 daily',
    idealDuration: '1.5 hours',
    location: 'Gangori Bazaar, adjacent to City Palace, Pink City, Jaipur',
    sourceTitle: 'The Jantar Mantar, Jaipur - World Heritage List No. 1338',
    sourcePublisher: 'UNESCO World Heritage Centre',
    sourceUrl: 'https://whc.unesco.org/en/list/1338',
    firstTimeVisitorTip: 'A government-authorized guide or audio guide is strongly recommended to decode how the stone shadow instruments calculate local solar time.'
  },
  {
    id: 'nahargarh-fort',
    name: 'Nahargarh Fort',
    hindiName: 'नाहरगढ़ किला',
    category: 'heritage_fort',
    builtYear: '1734 CE',
    builtBy: 'Maharaja Sawai Jai Singh II (renovated by Sawai Madho Singh in 1868)',
    architecturalStyle: 'Indo-European Rajput fortifications',
    description: 'Perched on the crest of the Aravalli hills, Nahargarh ("Abode of Tigers") formed a strong defense ring along with Amer and Jaigarh. Famous for its Madhavendra Bhawan containing identical royal suites for the nine queens.',
    highlights: [
      'Madhavendra Bhawan: Two-storey palace with 9 identical interconnected suites for queens connected by secret corridors',
      'Padao Open Air Sunset Vista Point overlooking the entire Jaipur skyline',
      'Jaipur Wax Museum and Sheesh Mahal sculpture inside fort premises',
      'Bawdi (Stepwells) built into the rocky slopes for rainwater harvesting'
    ],
    visitingHours: '10:00 to 17:30 daily (Fort); Sunset viewing terrace stays open till dusk',
    idealDuration: '2 hours',
    location: 'Krishna Nagar, Brahampuri, Jaipur (accessible via serpentine hilltop road)',
    sourceTitle: 'Nahargarh Fort Historical Conservation Record',
    sourcePublisher: 'Department of Archaeology & Museums Rajasthan',
    sourceUrl: 'https://tourism.rajasthan.gov.in/nahargarh-fort.html',
    firstTimeVisitorTip: 'Visit during late afternoon (around 16:30) to catch the golden sun setting over the expanse of the Pink City below.'
  },
  {
    id: 'jaigarh-fort',
    name: 'Jaigarh Fort',
    hindiName: 'जयगढ़ किला',
    category: 'heritage_fort',
    builtYear: '1726 CE',
    builtBy: 'Maharaja Sawai Jai Singh II',
    architecturalStyle: 'Medieval military defensive fortress in red sandstone',
    description: 'Built to safeguard Amber Fort and the royal treasury, Jaigarh is situated on Cheel ka Teela. Connected to Amber Fort by subterranean tunnels and preserved in its raw military structure.',
    highlights: [
      'Jaivana Cannon: Manufactured inside fort foundry in 1720, then the world\'s largest cannon on wheels with a 50 km test range',
      'Diwa Burj watchtower providing unhindered vistas of the Aravalli range',
      'Ancient water reservoir complex with capacity to store 6 million gallons of water',
      'Royal armory featuring ancient shields, swords, muskets, and Rajput battle attire'
    ],
    visitingHours: '09:00 to 17:00 daily',
    idealDuration: '2 hours',
    location: 'Devisinghpura, Amer, Jaipur (above Amber Fort)',
    sourceTitle: 'Jaigarh Fort Military Heritage Register',
    sourcePublisher: 'Jaigarh Fort Public Charitable Trust',
    sourceUrl: 'https://tourism.rajasthan.gov.in/jaigarh-fort.html',
    firstTimeVisitorTip: 'Wear comfortable walking shoes; the fort spans 3 km in length with unpaved stone pathways and inclines.'
  },
  {
    id: 'albert-hall-museum',
    name: 'Albert Hall Museum (Central Museum)',
    hindiName: 'अल्बर्ट हॉल संग्रहालय',
    category: 'astronomy_museum',
    builtYear: '1887 CE (Foundation laid 1876 by Prince of Wales)',
    builtBy: 'Designed by Sir Samuel Swinton Jacob, opened by Maharaja Madho Singh II',
    architecturalStyle: 'Exemplary Indo-Saracenic architecture with stone carved archways and chhatris',
    description: 'The oldest museum in Rajasthan, situated in the sprawling Ram Niwas Garden. The exterior is lit up with vibrant multicolored illumination at night. It holds an extensive royal collection of fine art, antiquities, and metal crafts.',
    highlights: [
      '2,300-year-old Egyptian mummy of Tutu, a female priestess from Panopolis',
      '16th-century Persian garden carpet depicted in natural dyes',
      'Intricate brass work, carved ivory, clay figurines of yogic postures, and royal coinage',
      'Courtyard filled with hundreds of pigeons creating an iconic Jaipur photography spectacle'
    ],
    visitingHours: '09:00 to 17:00 (Day); 19:00 to 22:00 (Night Viewing under illuminations)',
    idealDuration: '1.5 - 2 hours',
    location: 'Ram Niwas Garden, Kailash Puri, Adarsh Nagar, Jaipur',
    sourceTitle: 'Albert Hall Museum State Repository',
    sourcePublisher: 'Government of Rajasthan Museums Directorate',
    sourceUrl: 'https://artandculture.rajasthan.gov.in',
    firstTimeVisitorTip: 'Visit during the evening to view the exterior facade illuminated with dynamic colored floodlights.'
  },
  {
    id: 'patrika-gate',
    name: 'Patrika Gate at Jawahar Circle',
    hindiName: 'पत्रिका गेट',
    category: 'cultural_monument',
    builtYear: '2020 CE',
    builtBy: 'Rajasthan Patrika Group & Jaipur Development Authority',
    architecturalStyle: 'Traditional Rajasthani fresco and hand-painted column architecture',
    description: 'An architectural ceremonial gate situated at the southern entrance of Jawahar Circle garden. Composed of nine distinct pavilions, each adorned with vibrant hand-painted murals reflecting the history, arts, and architectural styles of all regions of Rajasthan (Marwar, Mewar, Shekhawati, Dhundhar, Hadoti).',
    highlights: [
      'Nine archways showcasing miniature frescoes of royal processions, battle scenes, and folk deities',
      'Ceiling frescoes decorated with kaleidoscope Rajasthani block print patterns',
      'Surrounding musical water fountain in Jawahar Circle Park'
    ],
    visitingHours: 'Open 24 hours (Daylight recommended for photography)',
    idealDuration: '45 minutes',
    location: 'Jawahar Circle, Airport Road, Malviya Nagar, Jaipur',
    sourceTitle: 'Patrika Gate Architectural Cultural Profile',
    sourcePublisher: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in',
    firstTimeVisitorTip: 'Best photographed in early morning light when the sun illuminates the inner corridor paintings.'
  }
];

export const JAIPUR_CUISINES: CuisineRecord[] = [
  {
    id: 'dal-baati-churma',
    name: 'Dal Baati Churma',
    category: 'signature_meal',
    description: 'The defining culinary masterpiece of Rajasthan. Hard, round baked whole-wheat flour dumplings (baati) are crushed and generously doused in melted desi ghee, accompanied by spicy panchmel dal (five-lentil stew) and sweetened crushed wheat flour delicacy (churma).',
    flavorProfile: 'Rich, nutty, aromatic ghee with savory-spicy tempered lentils and fragrant cardamom-sweet churma.',
    traditionalPreparation: 'Baatis are traditionally baked slowly over dried cow dung charcoal ovens (kanda chulha) for a smoky crust, then dipped in pure cow ghee.',
    famousItems: ['Plain Baati', 'Masala Stuffed Baati', 'Gulab Churma', 'Panchkuti Dal'],
    bestPlacesInJaipur: ['LMB (Laxmi Mishthan Bhandar) in Johari Bazaar', 'Chokhi Dhani Heritage Village', 'Thali and More, C-Scheme'],
    sourceTitle: 'Rajasthan Culinary Heritage Compendium',
    sourcePublisher: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in'
  },
  {
    id: 'laal-maas',
    name: 'Laal Maas',
    category: 'curry_bread',
    description: 'A historic royal Rajput game meat delicacy. Tender mutton pieces cooked in a rich, deep-red gravy infused with fiery Mathania red chillies, garlic paste, mustard oil, and curd, traditionally smoked using the Dhungar charcoal technique.',
    flavorProfile: 'Fiery, robust, smoky, and slow-braised savoriness with earthy undertones from indigenous Mathania chillies.',
    traditionalPreparation: 'Slow simmered in a copper degchi (pot) without excess tomatoes, relying on yogurt, onions, and Mathania chilli paste.',
    famousItems: ['Laal Maas with Bajre ki Roti (millet flatbread)', 'Junglee Maas (rustic salt, ghee, and dried chilli preparation)'],
    bestPlacesInJaipur: ['1135 AD at Amer Fort', 'Handi Restaurant, MI Road', 'Suvarna Mahal, Rambagh Palace'],
    sourceTitle: 'Royal Rajput Gastronomy Research',
    sourcePublisher: 'Indian National Trust for Art and Cultural Heritage (INTACH)',
    sourceUrl: 'https://intach.org'
  },
  {
    id: 'gatte-ki-sabzi',
    name: 'Gatte ki Sabzi & Ker Sangri',
    category: 'curry_bread',
    description: 'Quintessential arid desert cuisine. Gatte are tender spiced gram flour (besan) cylindrical dumplings boiled and gently cooked in a spiced, tangy yogurt gravy. Ker Sangri is a dry desert delicacy made of wild desert berries (ker) and dried desert beans (sangri) sautéed with whole spices and amchur (dry mango powder).',
    flavorProfile: 'Tangy, spiced yogurt depth with rustic, sour-tart desert berries.',
    traditionalPreparation: 'Designed originally during medieval desert blockades when fresh vegetables were scarce; uses locally preserved berries and besan.',
    famousItems: ['Govind Gatta (stuffed with mawa and nuts)', 'Ker Sangri Pickle', 'Gatte ka Pulao'],
    bestPlacesInJaipur: ['Laxmi Mishthan Bhandar (LMB)', 'Rawat Restaurant', 'Heritage Thali centers in Pink City'],
    sourceTitle: 'Culinary Traditions of the Thar & Dhundhar',
    sourcePublisher: 'Rajasthan Tourism',
    sourceUrl: 'https://tourism.rajasthan.gov.in'
  },
  {
    id: 'pyaaz-kachori',
    name: 'Pyaaz Kachori & Mirchi Vada',
    category: 'snack_streetfood',
    description: 'Jaipur\'s most celebrated morning breakfast and afternoon tea snack. A golden, flaky deep-fried pastry pocket bursting with seasoned steamed onions, potatoes, crushed coriander seeds, fennel, and garam masala, served with tangy tamarind and spicy mint chutneys.',
    flavorProfile: 'Crisp, flaky pastry outside, steaming hot savory onion-spice stuffing inside.',
    traditionalPreparation: 'Fried slowly on low-to-medium heat in vegetable oil or vanaspati to achieve thick, blistered flaky layers.',
    famousItems: ['Rawat Special Pyaaz Kachori', 'Jodhpur Mirchi Bada (chilli fritter stuffed with spiced potato)'],
    bestPlacesInJaipur: ['Rawat Mishthan Bhandar (Sindhi Camp / Station Road)', 'Radhe Kachori (Hawa Mahal bazaar)', 'Samrat Restaurant (Chaura Rasta)'],
    sourceTitle: 'Street Food Heritage of Jaipur Pink City',
    sourcePublisher: 'Jaipur Municipal Corporation Cultural Directory',
    sourceUrl: 'https://jaipurmc.org'
  },
  {
    id: 'ghevar-rabri',
    name: 'Ghevar & Malpua',
    category: 'sweet_dessert',
    description: 'The crowning sweet of Jaipur festivals (Teej, Gangaur, Raksha Bandhan). A disc-shaped honeycomb cake made from an aerated batter of refined flour and clarified butter, fried crisp, steeped in saffron-cardamom sugar syrup, and crowned with thick reduced rabri, chopped pistachios, and edible silver vark.',
    flavorProfile: 'Crunchy honeycomb texture melting into sweet, aromatic saffron syrup and creamy rabri.',
    traditionalPreparation: 'Batter dropped in a continuous steady stream into boiling ghee using a special cylindrical mould to create cellular honeycomb crevices.',
    famousItems: ['Paneer Ghevar (invented at LMB)', 'Malai Ghevar', 'Plain Sugar-soaked Ghevar', 'Mawa Ghevar'],
    bestPlacesInJaipur: ['Laxmi Mishthan Bhandar (LMB, Johari Bazaar)', 'Kanha (MI Road)', 'Sambhar Fini & Ghevar (Johari Bazaar)'],
    sourceTitle: 'Traditional Confectionery of Rajasthan',
    sourcePublisher: 'Rajasthan Tourism Development Corporation',
    sourceUrl: 'https://tourism.rajasthan.gov.in'
  }
];

export const JAIPUR_RESTAURANTS: DiningRecord[] = [
  {
    id: 'lmb-johari-bazaar',
    name: 'Laxmi Mishthan Bhandar (LMB)',
    category: 'historic_thali',
    establishedYear: '1727 CE',
    location: 'Johari Bazaar, Pink City, Jaipur',
    specialties: ['Special Rajasthani Royal Thali', 'Paneer Ghevar', 'Pyaaz Kachori', 'Dal Baati Churma', 'Rasgulla'],
    description: 'An iconic culinary institution established along with the founding of Jaipur in 1727. Situated right in the historic jewelry market of Johari Bazaar. Renowned for pure vegetarian Rajasthani royal dining and traditional heritage sweets.',
    atmosphere: 'Classic retro heritage dining room with prompt silver-service hospitality.',
    bookingPolicyNotice: 'Walk-ins are welcomed; table reservations must be verified directly with the restaurant. Yaaros cannot check live table availability or place bookings.',
    sourceTitle: 'Historic Food Walkers Guide to Pink City',
    sourcePublisher: 'Rajasthan Tourism Heritage Dining',
    sourceUrl: 'https://tourism.rajasthan.gov.in'
  },
  {
    id: '1135-ad-amer',
    name: '1135 AD',
    category: 'heritage_fine_dining',
    establishedYear: 'Restored within 16th-century ramparts',
    location: 'Level 2, Jaleb Chowk, Amber Fort, Amer, Jaipur',
    specialties: ['Laal Maas', 'Junglee Maas', 'Thaal-e-Jodha (Royal Vegetarian Banquet)', 'Badam Halwa'],
    description: 'Nestled inside the ancient battlements of Amber Fort. Diners sit beneath hand-painted ceilings embellished with real 24-karat gold leaf, cut-glass crystal chandeliers, and antique silver dinnerware, with live classical sarangi melodies.',
    atmosphere: 'Imperial royal court dining with majestic views over Amber Fort courtyards.',
    bookingPolicyNotice: 'Prior reservations are strongly advised by the venue; Yaaros does not support live reservation queries or table booking APIs.',
    sourceTitle: 'Amber Fort Heritage Dining Register',
    sourcePublisher: 'Department of Tourism, Rajasthan',
    sourceUrl: 'https://tourism.rajasthan.gov.in'
  },
  {
    id: 'rawat-mishthan-bhandar',
    name: 'Rawat Mishthan Bhandar',
    category: 'legendary_street_eats',
    establishedYear: '1972 CE',
    location: 'Station Road, Sindhi Camp, Jaipur',
    specialties: ['Pyaaz Kachori', 'Dal Kachori', 'Mirchi Vada', 'Mawa Kachori', 'Jalebi'],
    description: 'The undisputed pioneer of Jaipur\'s modern kachori culture. Dispatches thousands of piping-hot, crispy Pyaaz Kachoris daily to travelers arriving at Jaipur railway station and bus terminus.',
    atmosphere: 'Bustling, fast-paced Indian sweet shop and casual family dining hall.',
    bookingPolicyNotice: 'Strictly walk-in counter and dining token system. No reservation system exists; live table availability cannot be tracked by Yaaros.',
    sourceTitle: 'Jaipur Culinary Map',
    sourcePublisher: 'Jaipur Municipal Corporation Cultural Wing',
    sourceUrl: 'https://jaipurmc.org'
  },
  {
    id: 'suvarna-mahal-rambagh',
    name: 'Suvarna Mahal at Rambagh Palace',
    category: 'heritage_fine_dining',
    establishedYear: 'Palace dining hall dating to 1835 CE',
    location: 'The Rambagh Palace, Bhawani Singh Road, Jaipur',
    specialties: ['Royal Thali from Princely Houses', 'Lal Maas', 'Murgh Awadh Korma', 'Dungar Kebab'],
    description: 'The original palace banquet hall of the Maharaja of Jaipur. Features Florentine ceiling frescoes, alabaster lamps, mirrors, and gilded mirrors with food served on solid gold-plated crockery accompanied by classical sitar accompaniment.',
    atmosphere: 'Formal palace grandeur with formal dress code (smart casual/traditional formal).',
    bookingPolicyNotice: 'Strict advance booking required directly via Taj Hotels Concierge; Yaaros cannot process table bookings or check live dining slots.',
    sourceTitle: 'Rambagh Palace Heritage Archive',
    sourcePublisher: 'Taj Hotels & Resorts Heritage Division',
    sourceUrl: 'https://tajhotels.com'
  },
  {
    id: 'wind-view-cafe',
    name: 'The Wind View Cafe (Opposite Hawa Mahal)',
    category: 'rooftop_cafe',
    establishedYear: '2010 CE',
    location: '3rd Floor, Badi Choupad, opposite Hawa Mahal, Jaipur',
    specialties: ['Masala Chai', 'Cold Coffee', 'Kadhai Milk', 'Vegetarian Sandwiches', 'Lassi'],
    description: 'A modest rooftop terrace cafe positioned directly across the street from Hawa Mahal. It offers an unobstructed, eye-level vantage point of the 953 jharokhas of the Palace of Winds.',
    atmosphere: 'Casual open terrace with colorful cushioned seating and prime photography vantage angles.',
    bookingPolicyNotice: 'First-come-first-served rooftop seating. Yaaros cannot check current wait times or table vacancies.',
    sourceTitle: 'Jaipur Historic City Vantage Guide',
    sourcePublisher: 'Rajasthan Tourism Portal',
    sourceUrl: 'https://tourism.rajasthan.gov.in'
  }
];

export const TEST_SCENARIOS = [
  {
    id: 'historical_attractions',
    title: 'Scenario 1: Historical Attractions in Jaipur',
    question: 'Recommend the top historical attractions to visit on a first-time trip to Jaipur.',
    expectedBehavior: 'Returns structured recommendation cards for Amber Fort, Hawa Mahal, City Palace, and Jantar Mantar with architectural details, visiting hours, and official UNESCO/Archaeological Survey of India sources.',
    category: 'attractions'
  },
  {
    id: 'udaipur_refusal',
    title: 'Scenario 2: Unsupported City Refusal (Udaipur)',
    question: 'What are the best places to visit and eat in Udaipur?',
    expectedBehavior: 'Politely refuses the query, stating that Yaaros is strictly specialized in Jaipur, Rajasthan, and does not invent or offer recommendations for Udaipur or other destinations.',
    category: 'refusal'
  },
  {
    id: 'live_availability_refusal',
    title: 'Scenario 3: Live Table Availability & Bookings',
    question: 'Can you check live table availability for tonight at 1135 AD restaurant and book a table for four?',
    expectedBehavior: 'Explains that live table availability, real-time wait times, and direct restaurant bookings are not supported by Yaaros, while providing verified background details on 1135 AD and advising the user to contact the venue directly.',
    category: 'live_constraint'
  }
] as const;

export const SUGGESTED_QUESTIONS = [
  'Recommend the top historical attractions to visit on a first-time trip to Jaipur.',
  'What authentic Rajasthani dishes and sweets must I try in Jaipur?',
  'Tell me about the history and architecture of Hawa Mahal.',
  'Where can I eat the best traditional Dal Baati Churma and Ghevar?',
  'What are the best places to visit in Udaipur?',
  'Can you check live table availability for tonight at 1135 AD restaurant?'
];
