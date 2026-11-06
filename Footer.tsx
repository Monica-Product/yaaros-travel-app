/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, MapPin, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { SUPPORTED_DESTINATIONS, DestinationId } from '../data/travelKnowledgeBase.ts';

interface FooterProps {
  onOpenTestEvaluation: () => void;
  onNavigateTopic: (prompt: string, destId?: DestinationId) => void;
  onSelectDestination: (destId: DestinationId) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTestEvaluation,
  onNavigateTopic,
  onSelectDestination,
}) => {
  return (
    <footer className="bg-[#FAF4E8] border-t border-[#E8DCCB] text-[#34211C] pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E8DCCB]">
          {/* Col 1: Brand story */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-xs border border-[#E8DCCB] p-0.5 shrink-0">
                <img
                  src="/assets/aistudio/image_ed674819.png"
                  alt="Yaaros"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl text-[#34211C] block leading-tight">
                  Yaaros
                </span>
                <span className="text-[11px] text-[#A64224] font-medium">
                  Your Travel Companion
                </span>
              </div>
            </div>
            <p className="text-sm text-[#6B554F] max-w-sm leading-relaxed">
              Explore like a local. Travel like a friend. An AI-powered travel discovery assistant curated across 3 premier cities in India with verified archives and zero hallucinations.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8C736C]">
              <Compass className="w-3.5 h-3.5 text-[#A64224]" />
              <span>Jaipur (Rajasthan) · Bangalore (Karnataka) · Hyderabad (Telangana)</span>
            </div>
          </div>

          {/* Col 2: Supported Destinations */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#A64224]">
              Three Cities
            </h4>
            <ul className="space-y-2 text-xs text-[#6B554F]">
              {SUPPORTED_DESTINATIONS.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onSelectDestination(d.id)}
                    className="hover:text-[#A64224] transition-colors text-left cursor-pointer flex items-center justify-between w-full group"
                  >
                    <span>{d.name} ({d.state})</span>
                    <span className="text-[10px] text-[#A64224] opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Curated Discovery Queries */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#A64224]">
              Curated Discovery Inquiries
            </h4>
            <ul className="space-y-2 text-xs text-[#6B554F]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTopic('What are the must-visit historical places in Jaipur?', 'jaipur')}
                  className="hover:text-[#A64224] transition-colors text-left cursor-pointer"
                >
                  Jaipur: Amber Fort, Jaigarh Fort, Nahargarh Fort & City Palace
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTopic('Where can I find the best South Indian breakfast in Bangalore?', 'bangalore')}
                  className="hover:text-[#A64224] transition-colors text-left cursor-pointer"
                >
                  Bangalore: Vidyarthi Bhavan dosas, MTR Rava Idli & CTR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTopic('Tell me about Golconda Fort and Falaknuma Palace in Hyderabad.', 'hyderabad')}
                  className="hover:text-[#A64224] transition-colors text-left cursor-pointer"
                >
                  Hyderabad: Golconda Fort, Falaknuma Palace & Chowmahalla
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTopic('What is the difference between Hyderabadi Biryani and Haleem?', 'hyderabad')}
                  className="hover:text-[#A64224] transition-colors text-left cursor-pointer"
                >
                  Hyderabad Food: Authentic Dum Biryani vs. GI-Tagged Haleem
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C736C]">
          <div className="flex items-center gap-2">
            <span>© 2026 Yaaros Travel Intelligence.</span>
            <span>·</span>
            <span>Grounding: Verified records across 3 cities.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenTestEvaluation}
              className="hover:text-[#A64224] inline-flex items-center gap-1.5 cursor-pointer font-medium text-[#34211C] bg-white px-3 py-1.5 rounded-full border border-[#E8DCCB] shadow-2xs hover:border-[#A64224]/50"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#A64224]" />
              <span>Evaluation Suite (Tests A–I)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
