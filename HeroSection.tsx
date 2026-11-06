/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { JAIPUR_IMAGES } from '../data/jaipurImages.ts';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSearch(query.trim());
  };

  const curatedSuggestions = [
    'Recommend historical attractions in Jaipur',
    'Where to eat authentic Dal Baati Churma?',
    'Tell me about the 953 jharokhas of Hawa Mahal',
    'Fine dining experience at 1135 AD Amer',
  ];

  return (
    <section className="relative pt-6 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Magazine Hero Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8DCCB] min-h-[580px] lg:min-h-[640px] flex items-end">
        {/* Full-bleed background photograph of Hawa Mahal */}
        <div className="absolute inset-0">
          <img
            src={JAIPUR_IMAGES.hawaMahalHero}
            alt="Hawa Mahal at sunrise, Jaipur Rajasthan"
            className="w-full h-full object-cover object-center transform scale-102 hover:scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Refined gradient scrim: dark base, warm terracotta mid-tone, subtle top vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#261612]/95 via-[#34211C]/60 to-[#261612]/20" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 w-full p-6 sm:p-12 lg:p-16 max-w-4xl">
          {/* Editorial Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F6B83B] animate-pulse" />
            <span className="tracking-widest uppercase font-serif text-[10px]">
              AI Travel Companion · Inaugural Edition: Jaipur
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-[1.1] mb-3">
            Discover the magic of Jaipur.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#F7EAE8] font-light leading-relaxed mb-8 max-w-2xl">
            Explore like a local. Travel like a friend.
          </p>

          {/* Prominent Search / Chat Bar */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl border border-white/50 flex flex-col sm:flex-row items-center gap-2 max-w-2xl transition-all focus-within:ring-4 focus-within:ring-[#A64224]/20"
          >
            <div className="flex items-center gap-3 w-full pl-4 pr-2 py-1">
              <Search className="w-5 h-5 text-[#A64224] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where would you like to explore in Jaipur?"
                disabled={isLoading}
                className="w-full text-sm sm:text-base text-[#34211C] placeholder-[#8C736C] bg-transparent focus:outline-none"
              />
            </div>

            {/* Subtle Terracotta CTA Button */}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl sm:rounded-full bg-[#A64224] hover:bg-[#873117] text-white font-medium text-sm transition-all duration-200 shrink-0 shadow-md shadow-[#A64224]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Exploring...' : 'Explore Jaipur'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Suggested Prompts Pills */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/80 font-medium">Trending for First-Timers:</span>
            {curatedSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSearch(suggestion)}
                className="text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/35 text-white backdrop-blur-sm border border-white/25 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
