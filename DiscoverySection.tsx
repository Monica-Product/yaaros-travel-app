/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpRight, Compass, Landmark, Utensils, Sparkles } from 'lucide-react';
import { JAIPUR_IMAGES } from '../data/jaipurImages.ts';

interface DiscoverySectionProps {
  onSelectTopic: (prompt: string) => void;
}

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({ onSelectTopic }) => {
  const cards = [
    {
      id: 'historic-jaipur',
      title: 'Historic Jaipur',
      subtitle: 'Forts, palaces and architectural wonders',
      prompt: 'Recommend the top historical attractions and architectural wonders to visit on a first-time trip to Jaipur.',
      image: JAIPUR_IMAGES.amberFort,
      tag: 'Architectural Marvels',
      alt: 'Amber Fort overlooking Maota Lake, Jaipur',
      highlights: 'Amer Fort · City Palace · Jantar Mantar · Hawa Mahal',
    },
    {
      id: 'taste-of-rajasthan',
      title: 'Taste of Rajasthan',
      subtitle: 'Traditional dishes, street food and local restaurants',
      prompt: 'What authentic Rajasthani dishes, traditional sweets, and iconic local restaurants must I experience in Jaipur?',
      image: JAIPUR_IMAGES.rajasthaniThali,
      tag: 'Culinary Heritage',
      alt: 'Authentic Royal Rajasthani Thali feast with Dal Baati Churma and Ghevar',
      highlights: 'Dal Baati Churma · Pyaaz Kachori · Ghevar · 1135 AD',
    },
    {
      id: 'hidden-gems',
      title: 'Hidden Gems',
      subtitle: 'Cultural experiences and lesser-known places',
      prompt: 'What are the best cultural experiences, scenic stepwells, and architectural hidden gems in Jaipur?',
      image: JAIPUR_IMAGES.patrikaGate,
      tag: 'Cultural Treasures',
      alt: 'Patrika Gate at Jawahar Circle in Jaipur',
      highlights: 'Patrika Gate · Nahargarh Sunset · Albert Hall Night View',
    },
  ];

  return (
    <section id="discover-section" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A64224] mb-2">
            <span>Curated Collections</span>
            <span aria-hidden="true" className="text-[#D99A91]">✦</span>
            <span>First-Timer Portfolios</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#34211C] font-bold tracking-tight">
            Curated journeys through the Pink City
          </h2>
        </div>
        <p className="text-sm text-[#6B554F] max-w-md leading-relaxed">
          Select an editorial theme below to launch tailored, archive-grounded discovery with your travel companion.
        </p>
      </div>

      {/* 3 Visually Striking Image-Led Cards in a Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelectTopic(card.prompt)}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8DCCB] hover:border-[#A64224]/60 transition-all duration-300 shadow-editorial hover:shadow-editorial-hover cursor-pointer flex flex-col justify-between"
          >
            {/* Image Container with subtle zoom */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#F4ECE0]">
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#261612]/70 via-transparent to-black/10" />

              {/* Tag pill */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-[#34211C] shadow-xs">
                  {card.tag}
                </span>
              </div>

              {/* Arrow action button */}
              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#A64224] group-hover:bg-[#A64224] group-hover:text-white transition-colors duration-300 shadow-md">
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-1 justify-between bg-white">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#34211C] group-hover:text-[#A64224] transition-colors mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6B554F] leading-relaxed mb-4">
                  {card.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2E8DC] text-[11px] font-medium text-[#8C736C]">
                <span>{card.highlights}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
