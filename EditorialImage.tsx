/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Landmark, Compass, Utensils, Coffee, Sparkles, Gem, MapPin } from 'lucide-react';
import { TravelCategory } from '../types.ts';

interface EditorialImageProps {
  src?: string;
  alt: string;
  recordName: string;
  category?: TravelCategory | string;
  destinationName?: string;
  className?: string;
  containerClassName?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  recordName,
  category,
  destinationName,
  className = 'w-full h-full object-cover object-center',
  containerClassName = 'relative w-full h-full overflow-hidden bg-[#F4ECE0]',
}) => {
  const [hasError, setHasError] = useState(false);

  const getCategoryIcon = (cat?: string) => {
    switch (cat) {
      case 'Historical Places & Landmarks':
      case 'historical_place':
        return <Landmark className="w-5 h-5 text-[#A64224]" />;
      case 'Must-Visit Attractions':
      case 'must_visit':
        return <Compass className="w-5 h-5 text-[#A64224]" />;
      case 'Local Food & Cuisine':
      case 'local_cuisine':
        return <Utensils className="w-5 h-5 text-[#A64224]" />;
      case 'Restaurants & Cafés':
      case 'restaurant':
        return <Coffee className="w-5 h-5 text-[#A64224]" />;
      case 'Cultural Experiences':
      case 'cultural_experience':
        return <Sparkles className="w-5 h-5 text-[#A64224]" />;
      case 'Hidden Gems':
      case 'hidden_gem':
      default:
        return <Gem className="w-5 h-5 text-[#A64224]" />;
    }
  };

  if (!src || hasError) {
    return (
      <div className={`${containerClassName} flex flex-col justify-between p-6 bg-gradient-to-br from-[#FBF6EE] via-[#F4ECE0] to-[#EBDCCE] border-b border-[#E8DCCB]`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#A64224]">
            {getCategoryIcon(category)}
            <span>{category || 'Verified Travel Record'}</span>
          </div>
          {destinationName && (
            <span className="text-[11px] font-medium text-[#8C736C] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#A64224]" />
              {destinationName}
            </span>
          )}
        </div>

        <div className="my-auto py-4">
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#34211C] leading-snug">
            {recordName}
          </h4>
          <p className="text-xs text-[#8C736C] mt-1 italic">
            Verified Archival Entry · Yaaros Editorial Collection
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E8DCCB]/60 text-[10px] text-[#A64224] font-medium uppercase tracking-widest">
          <span>Official Heritage Registry</span>
          <span>✦ Authentic</span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className={className}
        loading="lazy"
      />
    </div>
  );
};
