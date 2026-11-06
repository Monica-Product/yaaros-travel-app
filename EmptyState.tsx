/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, Utensils, Compass, Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const categories = [
    {
      title: 'Historical Forts & Palaces',
      description: 'Amber Fort, Hawa Mahal, City Palace, Nahargarh, and Jaigarh.',
      icon: Landmark,
      prompt: 'Recommend the top historical attractions to visit on a first-time trip to Jaipur.',
    },
    {
      title: 'Authentic Rajasthani Cuisines',
      description: 'Dal Baati Churma, fiery Laal Maas, Pyaaz Kachori, and honeycomb Ghevar.',
      icon: Utensils,
      prompt: 'What authentic Rajasthani dishes and sweets must I try in Jaipur?',
    },
    {
      title: 'Historic Dining & Cafes',
      description: 'LMB in Johari Bazaar, 1135 AD inside Amer Fort, and Hawa Mahal rooftop cafes.',
      icon: Compass,
      prompt: 'Where can I eat the best traditional Dal Baati Churma and Ghevar?',
    },
    {
      title: 'Architectural Details',
      description: 'The 953 jharokhas of Hawa Mahal and the astronomical instruments of Jantar Mantar.',
      icon: Sparkles,
      prompt: 'Tell me about the history and architecture of Hawa Mahal.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-center">
      {/* Yaaros Mascot & Palace Arch Logo Hero */}
      <div className="relative inline-block mb-7 group">
        <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl overflow-hidden bg-white/95 shadow-xl shadow-[#D96B43]/15 border-2 border-[#E8DAC8] p-1.5 transition-transform duration-300 group-hover:scale-105">
          <img
            src="/assets/aistudio/image_ed674819.png"
            alt="Yaaros - Your Jaipur Travel Companion"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#3D2132] text-[#FDF9F3] text-[11px] font-medium px-3.5 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1.5 border border-[#F6B83B]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F6B83B] animate-pulse" />
          <span>Your Jaipur Travel Companion</span>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9B3B1F]">
        <span>पधारो म्हारे देश</span>
        <span aria-hidden="true" className="text-[#F6B83B]">✦</span>
        <span>Padharo Mhare Desh</span>
      </div>

      <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3D2132] mb-3 leading-tight">
        Discover Jaipur with Archival Intelligence
      </h2>

      <p className="max-w-2xl mx-auto text-sm text-[#523B34] leading-relaxed mb-8">
        Meet <strong>Yaaros</strong>, your dedicated discovery companion for the Pink City. Every recommendation, visiting hour, and architectural fact is strictly verified through our connected Jaipur heritage database.
      </p>

      {/* 4 Feature categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
        {categories.map((c, i) => {
          const Icon = c.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectPrompt(c.prompt)}
              className="group p-4 rounded-xl bg-white border border-[#E8D8C3] hover:border-[#BF4C29] transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF5ED] flex items-center justify-center text-[#BF4C29] group-hover:bg-[#FCECE7] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#2A1D1A] group-hover:text-[#BF4C29] transition-colors">
                    {c.title}
                  </h3>
                </div>
                <p className="text-xs text-[#6B554F] leading-relaxed mb-3">
                  {c.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F3E9DA] flex items-center justify-between text-xs font-medium text-[#BF4C29]">
                <span>Explore Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Suggested prompts list */}
      <div className="bg-white/80 rounded-2xl border border-[#E8D8C3] p-4 sm:p-5 text-left">
        <div className="text-xs font-bold uppercase tracking-wider text-[#541E0F] mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C49A45]" />
          <span>Curated First-Timer Questions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            'Recommend the top historical attractions to visit on a first-time trip to Jaipur.',
            'What authentic Rajasthani dishes and sweets must I try in Jaipur?',
            'Tell me about the history and architecture of Hawa Mahal.',
            'Where can I eat the best traditional Dal Baati Churma and Ghevar?',
            'What are the best places to visit in Udaipur?',
            'Can you check live table availability for tonight at 1135 AD restaurant?'
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(prompt)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#FCECE7] text-[#523B34] hover:text-[#9B3B1F] border border-[#E8D8C3] hover:border-[#E68567] transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
