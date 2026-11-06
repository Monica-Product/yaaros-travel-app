/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink, BookOpen, CheckCircle } from 'lucide-react';
import { CitationItem } from '../types.ts';

interface CitationsListProps {
  citations: CitationItem[];
}

export const CitationsList: React.FC<CitationsListProps> = ({ citations }) => {
  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-4 pt-3.5 border-t border-[#E8D8C3] bg-[#FDFBF7]/60 rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-3.5 h-3.5 text-[#9B3B1F]" />
        <h5 className="font-display text-xs font-bold text-[#541E0F] uppercase tracking-wider">
          Verified Supporting Sources & Documentation
        </h5>
      </div>
      <p className="text-[11px] text-[#6B554F] mb-3">
        Grounded directly in archival records from the connected Jaipur Knowledge Base. No fabricated citations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {citations.map((c, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-2.5 rounded-lg bg-white/90 border border-[#E8D8C3] text-xs hover:border-[#BF4C29] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-[#2A1D1A] line-clamp-1">
                  {c.title}
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-[#BF4C29] shrink-0 mt-0.5" />
              </div>
              <div className="text-[11px] text-[#9B3B1F] font-medium mt-0.5">
                {c.publisher}
              </div>
              {c.note && (
                <div className="text-[11px] text-[#6B554F] mt-1 line-clamp-2">
                  {c.note}
                </div>
              )}
            </div>

            {c.url && (
              <div className="mt-2 pt-1.5 border-t border-[#F3E9DA]">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#BF4C29] hover:text-[#7A2E17] hover:underline"
                >
                  <span>Visit Source Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
