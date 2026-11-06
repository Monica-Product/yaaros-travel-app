/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { RecommendationItem } from '../types.ts';

interface RecommendationCardProps {
  item: RecommendationItem;
  index: number;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item, index }) => {
  const isFood = item.category === 'Local Food & Cuisine' || item.category === 'local_cuisine';

  return (
    <article className="bg-[#FAF5ED] border border-[#E8D8C3] hover:border-[#D86542] rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Top Header: Unboxed metadata line with typographic dot separator */}
        <div className="flex items-center justify-between text-[11px] text-[#7A2E17] font-medium mb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[#A64224]">{item.category}</span>
            <span aria-hidden="true" className="text-[#C49A45]">·</span>
            <span>{item.cityOrLocation || item.destination || 'Verified Record'}</span>
          </div>
          <span className="font-serif text-xs text-[#BF4C29] font-bold">
            0{index + 1}
          </span>
        </div>

        {/* Place Title */}
        <h4 className="font-serif text-lg sm:text-xl font-bold text-[#2A1B17] leading-snug mb-1">
          {item.name}
        </h4>

        {/* Tagline */}
        {item.tagline && (
          <p className="text-xs text-[#A84A2A] italic mb-2.5">
            {item.tagline}
          </p>
        )}

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#4E3933] leading-relaxed mb-3">
          {item.shortDescription || item.description}
        </p>

        {/* Curated Highlights with simple checkmark bullets */}
        {item.highlights && item.highlights.length > 0 && (
          <div className="mb-3 pt-2 border-t border-[#E8D8C3]/60">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#7A2E17] mb-1.5">
              Verified Highlights
            </div>
            <ul className="space-y-1">
              {item.highlights.map((highlight, idx) => (
                <li key={idx} className="text-xs text-[#4E3933] flex items-start gap-1.5 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A84A2A] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Practical Timings & Physical Location (hours omitted for food dishes!) */}
        <div className="space-y-1.5 mb-3 text-xs text-[#5E4740]">
          {(item.visitingHours || item.openingHours) && !isFood && (
            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#A84A2A] shrink-0 mt-0.5" />
              <span><strong>Visiting Hours:</strong> {item.visitingHours || item.openingHours}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A84A2A] shrink-0 mt-0.5" />
              <span><strong>Location:</strong> {item.location}</span>
            </div>
          )}
        </div>

        {/* First Time Visitor Tip */}
        {(item.firstTimeVisitorTip || item.visitorTip) && (
          <div className="bg-[#F4ECE0] rounded-lg p-2.5 mb-3 text-xs text-[#3E2D27] border border-[#E3D1BB]">
            <div className="flex items-center gap-1 font-semibold text-[#8B3419] mb-0.5 text-[11px]">
              <Sparkles className="w-3 h-3 text-[#C49A45]" />
              <span>Visitor Tip</span>
            </div>
            <p className="text-xs text-[#5E4740] leading-relaxed">
              {item.firstTimeVisitorTip || item.visitorTip}
            </p>
          </div>
        )}
      </div>

      {/* Official Source Link Footer */}
      <div className="pt-2.5 border-t border-[#E8D8C3] flex items-center justify-between text-xs">
        <span className="text-[#7A6158] truncate max-w-[180px]" title={item.sourceTitle || item.sourceName}>
          Source: {item.sourcePublisher || item.sourceName || item.sourceTitle}
        </span>
        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#8B3419] hover:text-[#5C1F0E] hover:underline"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[#8C736C]">Verified Archive</span>
        )}
      </div>
    </article>
  );
};
