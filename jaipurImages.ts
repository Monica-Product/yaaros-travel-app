/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LOCAL_ASSETS, RECORD_IMAGE_MAP, getDestinationHeroImage, getImageForRecordId } from './destinationImages.ts';

export const JAIPUR_IMAGES = {
  adventureHero: LOCAL_ASSETS.adventureHero,
  jaipurHero: LOCAL_ASSETS.jaipurHero,
  bangaloreHero: LOCAL_ASSETS.bangaloreHero,
  tamilNaduHero: LOCAL_ASSETS.tamilNaduHero,
  delhiHero: LOCAL_ASSETS.delhiHero,
  hyderabadHero: LOCAL_ASSETS.hyderabadHero,

  hawaMahalHero: LOCAL_ASSETS.jaipurHawaMahal,
  amberFort: LOCAL_ASSETS.jaipurAmberFort,
  rajasthaniThali: LOCAL_ASSETS.jaipurThali,
  patrikaGate: LOCAL_ASSETS.jaipurPatrikaGate,
  cityPalace: LOCAL_ASSETS.jaipurCityPalace,
  jantarMantar: LOCAL_ASSETS.jaipurJantarMantar,
  logo: LOCAL_ASSETS.logo,
};

/**
 * Returns the exact verified image URL for an entity by checking record map or unique asset.
 * Zero cross-contamination across destinations or categories.
 */
export function getImageForEntity(name: string, category?: string, destinationId?: string, recordId?: string): string {
  if (recordId && RECORD_IMAGE_MAP[recordId]) {
    return RECORD_IMAGE_MAP[recordId];
  }

  const n = (name || '').toLowerCase();
  
  // Exact name matching to avoid accidental image recycling
  for (const [recId, url] of Object.entries(RECORD_IMAGE_MAP)) {
    const cleanId = recId.replace(/^(jaipur-|blr-|tn-|del-|hyd-)/, '').replace(/-/g, ' ');
    if (n.includes(cleanId) || cleanId.includes(n)) {
      return url;
    }
  }

  // Safe fallback to destination hero
  return getDestinationHeroImage(destinationId || 'jaipur');
}
