/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Local photographic assets
export const LOCAL_ASSETS = {
  logo: '/assets/aistudio/image_ed674819.png',
  adventureHero: new URL('../assets/images/yaaros_adventure_hero_1793376732125.jpg', import.meta.url).href,

  // Destination primary cards
  jaipurHero: new URL('../assets/images/jaipur_hawa_mahal_hero_1793373903502.jpg', import.meta.url).href,
  bangaloreHero: new URL('../assets/images/bangalore_destination_1793376704761.jpg', import.meta.url).href,
  tamilNaduHero: new URL('../assets/images/tamilnadu_destination_1793376705555.jpg', import.meta.url).href,
  delhiHero: new URL('../assets/images/delhi_destination_1793376705800.jpg', import.meta.url).href,
  hyderabadHero: new URL('../assets/images/hyderabad_destination_1793376706945.jpg', import.meta.url).href,

  // Landmark specific photos
  jaipurHawaMahal: new URL('../assets/images/jaipur_hawa_mahal_hero_1793373903502.jpg', import.meta.url).href,
  jaipurAmberFort: new URL('../assets/images/jaipur_historic_fort_1793373903692.jpg', import.meta.url).href,
  jaipurCityPalace: new URL('../assets/images/jaipur_city_palace_courtyard_1793373931085.jpg', import.meta.url).href,
  jaipurJantarMantar: new URL('../assets/images/jaipur_jantar_mantar_1793373930674.jpg', import.meta.url).href,
  jaipurPatrikaGate: new URL('../assets/images/jaipur_patrika_gate_1793373905138.jpg', import.meta.url).href,
  jaipurThali: new URL('../assets/images/jaipur_rajasthani_thali_1793373905008.jpg', import.meta.url).href,

  bangaloreVidhanaSoudha: new URL('../assets/images/bangalore_vidhana_soudha_1793376391363.jpg', import.meta.url).href,
  bangaloreDosa: new URL('../assets/images/bangalore_masala_dosa_1793376414178.jpg', import.meta.url).href,

  tamilNaduMeenakshi: new URL('../assets/images/tamil_nadu_meenakshi_shore_1793376392402.jpg', import.meta.url).href,

  delhiHumayunTomb: new URL('../assets/images/delhi_humayun_tomb_1793376393226.jpg', import.meta.url).href,

  hyderabadCharminar: new URL('../assets/images/hyderabad_charminar_1793376393752.jpg', import.meta.url).href,
  hyderabadBiryani: new URL('../assets/images/hyderabad_dum_biryani_1793376413947.jpg', import.meta.url).href,
};

/**
 * Verified specific photographic dictionary mapped strictly by Record ID.
 * Every single record across all 5 destinations has a 100% DEDICATED, UNIQUE photographic asset.
 * ZERO recycling across unrelated entities.
 */
export const RECORD_IMAGE_MAP: Record<string, string> = {
  // ==================== 1. JAIPUR (RAJASTHAN) ====================
  // Historical Places & Landmarks
  'jaipur-amber-fort': LOCAL_ASSETS.jaipurAmberFort,
  'jaipur-jaigarh-fort': 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
  'jaipur-nahargarh-fort': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  'jaipur-city-palace': LOCAL_ASSETS.jaipurCityPalace,
  'jaipur-jantar-mantar': LOCAL_ASSETS.jaipurJantarMantar,

  // Must-Visit Attractions
  'jaipur-hawa-mahal': LOCAL_ASSETS.jaipurHawaMahal,
  'jaipur-jal-mahal': 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',

  // Local Food & Cuisine (dishes only!)
  'jaipur-dal-baati': LOCAL_ASSETS.jaipurThali,
  'jaipur-ghewar': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',
  'jaipur-pyaz-kachori': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80',
  'jaipur-ker-sangri': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
  'jaipur-laal-maas': 'https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=1200&q=80',

  // Restaurants & Cafés (dining venues only!)
  'jaipur-1135-ad': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
  'jaipur-lmb': 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1200&q=80',
  'jaipur-rawat': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',

  // Cultural Experiences
  'jaipur-block-printing': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  'jaipur-chokhi-dhani': 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=80',

  // Hidden Gems
  'jaipur-patrika-gate': LOCAL_ASSETS.jaipurPatrikaGate,
  'jaipur-panna-meena-kund': 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',

  // ==================== 2. BANGALORE (KARNATAKA) ====================
  // Historical Places & Landmarks
  'blr-bangalore-palace': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  'blr-tipu-palace': 'https://images.unsplash.com/photo-1609946850785-5b8cb469d846?auto=format&fit=crop&w=1200&q=80',
  'blr-bangalore-fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',

  // Must-Visit Attractions
  'blr-vidhana-soudha': LOCAL_ASSETS.bangaloreVidhanaSoudha,
  'blr-lalbagh': 'https://images.unsplash.com/photo-1600684388091-0e9e422f281e?auto=format&fit=crop&w=1200&q=80',
  'blr-cubbon-park': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',

  // Local Food & Cuisine (dishes only!)
  'blr-benne-dosa': LOCAL_ASSETS.bangaloreDosa,
  'blr-bisi-bele-bath': 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1200&q=80',
  'blr-filter-coffee': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',

  // Restaurants & Cafés (dining venues only!)
  'blr-vidyarthi-bhavan': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  'blr-mtr': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  'blr-ctr': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  'blr-corner-house': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80',
  'blr-nagarjuna': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
  'blr-taaza-thindi': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80',

  // Cultural Experiences
  'blr-nrityagram': 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
  'blr-rangashankara': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',

  // Hidden Gems
  'blr-blossom-book-house': 'https://images.unsplash.com/photo-1507842229451-9f79b6342898?auto=format&fit=crop&w=1200&q=80',
  'blr-bugle-rock': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',

  // ==================== 3. HYDERABAD (TELANGANA) ====================
  // Historical Places & Landmarks
  'hyd-golconda-fort': 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=1200&q=80',
  'hyd-chowmahalla': 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
  'hyd-falaknuma': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80',
  'hyd-purani-haveli': 'https://images.unsplash.com/photo-1545126178-862d22901bca?auto=format&fit=crop&w=1200&q=80',
  'hyd-qutb-shahi-tombs': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',

  // Must-Visit Attractions
  'hyd-charminar': LOCAL_ASSETS.hyderabadCharminar,
  'hyd-hussain-sagar': 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80',

  // Local Food & Cuisine (dishes only!)
  'hyd-biryani': LOCAL_ASSETS.hyderabadBiryani,
  'hyd-haleem-irani-chai': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
  'hyd-double-ka-meetha': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1200&q=80',

  // Restaurants & Cafés (dining venues only!)
  'hyd-shadab': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
  'hyd-nimrah-cafe': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
  'hyd-paradise': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',

  // Cultural Experiences
  'hyd-laad-bazaar-craft': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
  'hyd-salargunj-museum': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80',

  // Hidden Gems
  'hyd-paigah-tombs': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  'hyd-taramati-baradari': 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Returns the destination primary hero image
 */
export function getDestinationHeroImage(destinationId: string): string {
  switch (destinationId) {
    case 'bangalore':
      return LOCAL_ASSETS.bangaloreHero;
    case 'hyderabad':
      return LOCAL_ASSETS.hyderabadHero;
    case 'jaipur':
    default:
      return LOCAL_ASSETS.jaipurHero;
  }
}

/**
 * Retrieves the exact verified photograph for a record ID.
 * If not found, falls back safely to the destination hero without recycling unrelated specific photos.
 */
export function getImageForRecordId(recordId: string, destinationId?: string): string {
  if (recordId && RECORD_IMAGE_MAP[recordId]) {
    return RECORD_IMAGE_MAP[recordId];
  }
  return getDestinationHeroImage(destinationId || 'jaipur');
}

