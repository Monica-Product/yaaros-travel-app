/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, Clock, MapPin, Sparkles, Landmark, Utensils, Coffee, Compass, Gem } from 'lucide-react';
import { RecommendationItem } from '../types.ts';

interface EditorialRecommendationCardProps {
  item: RecommendationItem;
  index: number;
}

export const EditorialRecommendationCard: React.FC<EditorialRecommendationCardProps> = ({ item, index }) => {
  const isFoodDish =
    item.category === 'Local Food & Cuisine' || item.category === 'local_cuisine';
  const isRestaurant =
    item.category === 'Restaurants & Cafés' || item.category === 'restaurants';
  const isHistorical =
    item.category === 'Historical Places & Landmarks' || item.category === 'historical_attractions';

  const getCategoryTheme = () => {
    switch (item.category) {
      case 'Historical Places & Landmarks':
        return {
          badgeBg: 'bg-[#F9EBE6]',
          badgeText: 'text-[#A64224]',
          badgeBorder: 'border-[#E8CAC4]',
          icon: Landmark,
        };
      case 'Local Food & Cuisine':
        return {
          badgeBg: 'bg-[#EDF5EE]',
          badgeText: 'text-[#2D6A4F]',
          badgeBorder: 'border-[#C7E2CE]',
          icon: Utensils,
        };
      case 'Restaurants & Cafés':
        return {
          badgeBg: 'bg-[#FFF8E7]',
          badgeText: 'text-[#B8860B]',
          badgeBorder: 'border-[#F3E2B8]',
          icon: Coffee,
        };
      case 'Cultural Experiences':
        return {
          badgeBg: 'bg-[#F3EFFB]',
          badgeText: 'text-[#5B3794]',
          badgeBorder: 'border-[#D9CDF2]',
          icon: Compass,
        };
      case 'Hidden Gems':
        return {
          badgeBg: 'bg-[#EEF4F8]',
          badgeText: 'text-[#2B6CB0]',
          badgeBorder: 'border-[#C5DCED]',
          icon: Gem,
        };
      default:
        return {
          badgeBg: 'bg-[#FAF4E8]',
          badgeText: 'text-[#873117]',
          badgeBorder: 'border-[#E8DCCB]',
          icon: Sparkles,
        };
    }
  };

  const theme = getCategoryTheme();
  const CategoryIcon = theme.icon;

  return (
    <article className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8DCCB] hover:border-[#A64224]/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Card Header: Category Badge, Destination, Index Number */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{item.category}</span>
            </span>

            {(item.cityOrLocation || item.destination) && (
              <span className="text-xs text-[#8C736C] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#A64224]" />
                <span>{item.cityOrLocation || item.destination}</span>
              </span>
            )}
          </div>

          <span className="font-serif text-xs font-bold text-[#A64224] px-2.5 py-0.5 rounded-full bg-[#FAF4E8] border border-[#E8DCCB]">
            0{index + 1}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#34211C] leading-snug mb-1">
          {item.name}
        </h3>

        {/* Tagline */}
        {item.tagline && (
          <p className="text-xs font-serif italic text-[#A64224] mb-3">
            {item.tagline}
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-[#4A3B37] leading-relaxed mb-4">
          {item.shortDescription || item.description}
        </p>

        {/* Signature Dish Callout (For Restaurants & Cafés) */}
        {isRestaurant && item.highlights && item.highlights.length > 0 && (
          <div className="mb-3.5 p-3 rounded-2xl bg-[#FFF8E7] border border-[#F3E2B8] text-xs">
            <span className="block font-bold text-[#B8860B] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>Must-Try Dish</span>
            </span>
            <p className="text-[#34211C] font-medium leading-relaxed">
              {item.highlights[0]}
            </p>
          </div>
        )}

        {/* Curated Highlights List */}
        {item.highlights && item.highlights.length > 0 && (
          <div className="mb-4 pt-3 border-t border-[#F2E8DC]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#A64224] mb-2">
              Curated Highlights
            </div>
            <ul className="space-y-1.5">
              {item.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="text-xs text-[#5C4D49] flex items-start gap-2 leading-relaxed">
                  <span className="text-[#A64224] font-bold shrink-0 mt-0.5">✦</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Historical Significance (For Historical & Landmarks) */}
        {item.historicalSignificance && isHistorical && (
          <div className="mb-3 p-3.5 rounded-2xl bg-[#FAF4E8] border border-[#E8DCCB] text-xs">
            <span className="block font-semibold text-[#A64224] text-[10px] uppercase tracking-wider mb-1">
              Historical Era & Significance
            </span>
            <p className="text-[#34211C] leading-relaxed">
              {item.historicalSignificance}
            </p>
          </div>
        )}

        {/* Visiting Hours & Venue Location (For Historical, Attractions, Restaurants — NEVER for food dishes) */}
        {!isFoodDish && (item.visitingHours || item.openingHours || item.location) && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
            {(item.visitingHours || item.openingHours) && (
              <div className="flex items-start gap-1.5 text-[#6B554F] bg-[#FAF4E8]/60 p-2.5 rounded-xl border border-[#E8DCCB]/60">
                <Clock className="w-3.5 h-3.5 text-[#A64224] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#34211C] block text-[11px]">
                    {isRestaurant ? 'Operating Hours:' : 'Visiting Hours:'}
                  </span>
                  <span>{item.visitingHours || item.openingHours}</span>
                </div>
              </div>
            )}
            {item.location && (
              <div className="flex items-start gap-1.5 text-[#6B554F] bg-[#FAF4E8]/60 p-2.5 rounded-xl border border-[#E8DCCB]/60">
                <MapPin className="w-3.5 h-3.5 text-[#A64224] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#34211C] block text-[11px]">
                    {isRestaurant ? 'Street Address:' : 'Location:'}
                  </span>
                  <span>{item.location}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* First-Time Visitor Tip */}
        {(item.visitorTip || item.firstTimeVisitorTip) && (
          <div className="mb-4 p-3 rounded-2xl bg-[#F6F0E4] border border-[#E2D5BF] text-xs text-[#34211C]">
            <span className="font-bold text-[#873117] block text-[10px] uppercase tracking-wider mb-0.5">
              Insider Tip:
            </span>
            <p className="text-[#5C4D49] leading-relaxed">
              {item.visitorTip || item.firstTimeVisitorTip}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer: Verified Official Source Link */}
      <div className="pt-4 border-t border-[#F2E8DC] flex items-center justify-between gap-3 text-xs">
        <div className="truncate">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C736C] block">
            Verified Archive Source
          </span>
          <span className="font-medium text-[#34211C] truncate block" title={item.sourceTitle || item.sourceName}>
            {item.sourceTitle || item.sourceName || 'Official Tourism Directory'}
          </span>
          {item.lastVerifiedDate && (
            <span className="text-[10px] text-emerald-800 font-semibold">
              Verified: {item.lastVerifiedDate}
            </span>
          )}
        </div>

        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF4E8] hover:bg-[#A64224] text-[#A64224] hover:text-white border border-[#E8DCCB] hover:border-[#A64224] transition-colors font-semibold text-xs shrink-0 cursor-pointer"
          >
            <span>View Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </article>
  );
};
