/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, Database, ExternalLink, MapPin, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import {
  JAIPUR_ATTRACTIONS,
  JAIPUR_CUISINES,
  JAIPUR_RESTAURANTS,
  JAIPUR_SCOPE,
} from '../data/jaipurKnowledgeBase.ts';

interface KnowledgeBaseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const KnowledgeBaseDrawer: React.FC<KnowledgeBaseDrawerProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'attractions' | 'cuisines' | 'restaurants' | 'scope'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  const filteredAttractions = JAIPUR_ATTRACTIONS.filter(
    (a) =>
      a.name.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.builtBy.toLowerCase().includes(query)
  );

  const filteredCuisines = JAIPUR_CUISINES.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.flavorProfile.toLowerCase().includes(query)
  );

  const filteredRestaurants = JAIPUR_RESTAURANTS.filter(
    (r) =>
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#2A1D1A]/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FAF5ED] h-full shadow-2xl flex flex-col border-l border-[#E8D8C3]">
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 bg-[#FDFBF7] border-b border-[#E8D8C3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-xs border border-[#E8DAC8] shrink-0 p-0.5">
              <img
                src="/assets/aistudio/image_ed674819.png"
                alt="Yaaros"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#3D2132]">
                Jaipur Knowledge Repository
              </h3>
              <p className="text-xs text-[#6B554F]">
                Verified grounding facts & citations connecting to Yaaros
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#7A2E17] hover:bg-[#FCECE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#E8D8C3] bg-[#FAF5ED]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9B3B1F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical monuments, dishes, or restaurants..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-[#E8D8C3] text-xs text-[#2A1D1A] placeholder-[#8A756F] focus:outline-none focus:border-[#BF4C29]"
            />
          </div>

          {/* Filter Tabs (Interactive filter buttons) */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#BF4C29] text-white shadow-xs'
                  : 'bg-white text-[#6B554F] hover:text-[#2A1D1A] border border-[#E8D8C3]'
              }`}
            >
              All Records ({JAIPUR_ATTRACTIONS.length + JAIPUR_CUISINES.length + JAIPUR_RESTAURANTS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('attractions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'attractions'
                  ? 'bg-[#BF4C29] text-white shadow-xs'
                  : 'bg-white text-[#6B554F] hover:text-[#2A1D1A] border border-[#E8D8C3]'
              }`}
            >
              Forts & Palaces ({filteredAttractions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cuisines')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'cuisines'
                  ? 'bg-[#BF4C29] text-white shadow-xs'
                  : 'bg-white text-[#6B554F] hover:text-[#2A1D1A] border border-[#E8D8C3]'
              }`}
            >
              Traditional Cuisines ({filteredCuisines.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('restaurants')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'restaurants'
                  ? 'bg-[#BF4C29] text-white shadow-xs'
                  : 'bg-white text-[#6B554F] hover:text-[#2A1D1A] border border-[#E8D8C3]'
              }`}
            >
              Iconic Dining ({filteredRestaurants.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scope')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === 'scope'
                  ? 'bg-[#BF4C29] text-white shadow-xs'
                  : 'bg-white text-[#6B554F] hover:text-[#2A1D1A] border border-[#E8D8C3]'
              }`}
            >
              Scope Boundaries
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Scope rules tab */}
          {activeTab === 'scope' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#E8D8C3]">
                <div className="flex items-center gap-2 mb-2 font-display text-sm font-bold text-[#541E0F]">
                  <ShieldCheck className="w-4 h-4 text-[#BF4C29]" />
                  <span>Geographic Boundary Policy</span>
                </div>
                <p className="text-xs text-[#523B34] leading-relaxed mb-3">
                  {JAIPUR_SCOPE.unsupportedCitiesNotice}
                </p>
                <div className="text-[11px] font-semibold text-[#9B3B1F] bg-[#FFF6F3] p-2.5 rounded-lg border border-[#FCECE7]">
                  Supported City: Jaipur exclusively. Queries regarding Udaipur, Jodhpur, Jaisalmer, Delhi, etc., are explicitly refused.
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8D8C3]">
                <div className="flex items-center gap-2 mb-2 font-display text-sm font-bold text-[#541E0F]">
                  <Clock className="w-4 h-4 text-[#C49A45]" />
                  <span>Real-Time Limitations Policy</span>
                </div>
                <p className="text-xs text-[#523B34] leading-relaxed mb-3">
                  {JAIPUR_SCOPE.realtimeDisclaimer}
                </p>
                <div className="text-[11px] text-[#6B554F] space-y-1 bg-[#FAF5ED] p-2.5 rounded-lg border border-[#E8D8C3]">
                  <div className="font-semibold text-[#2A1D1A] mb-1">Unsupported Real-Time Capabilities:</div>
                  {JAIPUR_SCOPE.realtimeUnsupportedFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[#BF4C29]">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attractions list */}
          {(activeTab === 'all' || activeTab === 'attractions') && filteredAttractions.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9B3B1F]">
                Historical Monuments & Forts ({filteredAttractions.length})
              </div>
              {filteredAttractions.map((a) => (
                <div
                  key={a.id}
                  className="bg-white p-4 rounded-xl border border-[#E8D8C3] hover:border-[#BF4C29] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-serif font-bold text-base text-[#2A1D1A]">
                      {a.name}
                    </h4>
                    <span className="text-[11px] font-medium text-[#7A2E17] whitespace-nowrap">
                      {a.builtYear}
                    </span>
                  </div>
                  <div className="text-xs text-[#9B3B1F] mb-2 font-medium">
                    Built by {a.builtBy} · {a.architecturalStyle}
                  </div>
                  <p className="text-xs text-[#523B34] leading-relaxed mb-2.5">
                    {a.description}
                  </p>
                  <div className="text-[11px] text-[#6B554F] space-y-1 mb-3">
                    <div><strong>Visiting Hours:</strong> {a.visitingHours}</div>
                    <div><strong>Location:</strong> {a.location}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#F3E9DA] text-[11px]">
                    <a
                      href={a.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#BF4C29] hover:underline font-semibold"
                    >
                      <span>{a.sourcePublisher}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(`Tell me more about ${a.name} in Jaipur.`);
                        onClose();
                      }}
                      className="text-[#7A2E17] hover:text-[#BF4C29] font-medium"
                    >
                      Ask Yaaros →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cuisines list */}
          {(activeTab === 'all' || activeTab === 'cuisines') && filteredCuisines.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9B3B1F]">
                Traditional Rajasthani Cuisine & Confectionery ({filteredCuisines.length})
              </div>
              {filteredCuisines.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-xl border border-[#E8D8C3] hover:border-[#BF4C29] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-serif font-bold text-base text-[#2A1D1A]">
                      {c.name}
                    </h4>
                    <span className="text-[11px] text-[#7A2E17]">
                      {c.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#523B34] leading-relaxed mb-2">
                    {c.description}
                  </p>
                  <div className="text-[11px] text-[#7A2E17] bg-[#FFF6F3] p-2 rounded-lg mb-2.5">
                    <strong>Flavor Profile:</strong> {c.flavorProfile}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#F3E9DA] text-[11px]">
                    <span className="text-[#6B554F]">{c.sourcePublisher}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(`Where can I find the best authentic ${c.name} in Jaipur?`);
                        onClose();
                      }}
                      className="text-[#BF4C29] hover:underline font-medium"
                    >
                      Ask Yaaros →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Restaurants list */}
          {(activeTab === 'all' || activeTab === 'restaurants') && filteredRestaurants.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9B3B1F]">
                Iconic Jaipur Dining Institutions ({filteredRestaurants.length})
              </div>
              {filteredRestaurants.map((r) => (
                <div
                  key={r.id}
                  className="bg-white p-4 rounded-xl border border-[#E8D8C3] hover:border-[#BF4C29] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-serif font-bold text-base text-[#2A1D1A]">
                      {r.name}
                    </h4>
                    <span className="text-[11px] text-[#7A2E17]">
                      {r.establishedYear}
                    </span>
                  </div>
                  <div className="text-xs text-[#9B3B1F] mb-1.5 font-medium">
                    {r.location}
                  </div>
                  <p className="text-xs text-[#523B34] leading-relaxed mb-2">
                    {r.description}
                  </p>
                  <div className="text-[11px] text-[#C49A45] bg-[#FFFDF5] p-2 rounded-lg border border-[#E8D8C3] mb-2.5">
                    <strong>Reservation Notice:</strong> {r.bookingPolicyNotice}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#F3E9DA] text-[11px]">
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#BF4C29] hover:underline font-semibold"
                    >
                      <span>{r.sourcePublisher}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPrompt(`Tell me about dining at ${r.name} in Jaipur.`);
                        onClose();
                      }}
                      className="text-[#7A2E17] hover:text-[#BF4C29] font-medium"
                    >
                      Ask Yaaros →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
