/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';
import { JAIPUR_IMAGES } from '../data/jaipurImages.ts';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#E8DCCB]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Visual Vignette */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E8DCCB] h-[460px] bg-[#FAF4E8]">
            <img
              src={JAIPUR_IMAGES.adventureHero}
              alt="Yaaros Travelers overlooking heritage destination"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#261612]/85 via-transparent to-transparent" />
            
            {/* Floating Brand Card */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8DCCB] shadow-lg flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#FAF4E8] border border-[#E8DCCB] p-0.5 shrink-0">
                <img
                  src={JAIPUR_IMAGES.logo}
                  alt="Yaaros"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-[#34211C]">
                  Yaaros — Your Travel Companion
                </div>
                <div className="text-[11px] text-[#A64224] font-medium">
                  Explore like a local. Travel like a friend.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#A64224]">
            <Compass className="w-3.5 h-3.5" />
            <span>The Yaaros Philosophy</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#34211C] tracking-tight leading-[1.15]">
            Explore like a local.<br />Travel like a friend.
          </h2>

          <p className="text-base text-[#6B554F] leading-relaxed">
            <strong>Yaaros</strong> is an AI-powered travel companion built to help travellers uncover extraordinary destinations, architectural wonders, time-honoured local dishes, and living cultural traditions through reliable, source-supported information.
          </p>

          <p className="text-base text-[#6B554F] leading-relaxed">
            Our travel platform currently supports three foundational cities: <strong>Jaipur</strong> (The Pink City), <strong>Bangalore</strong> (The Garden City), and <strong>Hyderabad</strong> (The City of Pearls).
          </p>

          {/* 2 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F2E8DC]">
            <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F9EBE6] flex items-center justify-center text-[#A64224] mb-2.5">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#34211C] mb-1">
                Destination-Aware RAG
              </h4>
              <p className="text-xs text-[#6B554F] leading-relaxed">
                Queries are strictly isolated to the active destination. When you explore Bangalore, you receive only verified Bangalore records—never mixed or confused with other cities.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E8DCCB] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#F9EBE6] flex items-center justify-center text-[#A64224] mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-serif font-bold text-sm text-[#34211C] mb-1">
                Zero-Fabrication Grounding
              </h4>
              <p className="text-xs text-[#6B554F] leading-relaxed">
                Backed by 23 verified records from official State Tourism boards and UNESCO citations. Unsupported cities and live booking requests are honestly explained rather than fabricated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
