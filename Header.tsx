/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, RotateCcw, Compass, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenKnowledgeBase: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenKnowledgeBase,
  onClearChat,
  hasMessages,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF5ED]/95 backdrop-blur-md border-b border-[#E8D8C3] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF5ED] shadow-sm border border-[#E8DAC8] shrink-0 flex items-center justify-center hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/image_ed674819.png"
              alt="Yaaros Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-tight text-[#3D2132]">
                Yaaros
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF6F3] text-[#BF4C29] border border-[#E78361]/30">
                Pink City
              </span>
            </div>
            <p className="text-xs text-[#6B555E] hidden sm:block font-medium">
              Your Jaipur Travel Companion
            </p>
          </div>
        </div>

        {/* Operating status & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Knowledge Base Inspector button */}
          <button
            type="button"
            onClick={onOpenKnowledgeBase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F3E9DA] text-[#541E0F] hover:bg-[#E8D8C3] hover:text-[#2A1D1A] border border-[#E8D8C3] transition-colors shadow-xs"
            title="Inspect the verified facts, opening hours, and sources in the Jaipur Knowledge Base"
          >
            <Database className="w-3.5 h-3.5 text-[#9B3B1F]" />
            <span className="hidden md:inline">Knowledge Base</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#BF4C29] text-white">
              18 Records
            </span>
          </button>

          {/* Clear Chat Button */}
          {hasMessages && (
            <button
              type="button"
              onClick={onClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#7A2E17] hover:bg-[#FCECE7] border border-transparent hover:border-[#E68567]/30 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Scope sub-banner */}
      <div className="bg-[#FFF6F3] border-t border-[#FCECE7] px-4 py-1.5 text-[11px] text-[#7A2E17] flex items-center justify-between max-w-6xl mx-auto sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          <span className="inline-flex items-center gap-1 font-medium text-[#9B3B1F]">
            <MapPin className="w-3 h-3 text-[#BF4C29]" />
            Scope: Jaipur Only
          </span>
          <span className="text-[#DFB769]" aria-hidden="true">·</span>
          <span>Archival Grounded</span>
          <span className="text-[#DFB769]" aria-hidden="true">·</span>
          <span>Zero Hallucinations Policy</span>
          <span className="text-[#DFB769]" aria-hidden="true">·</span>
          <span className="text-[#9B3B1F]/80">Live restaurant availability & bookings not supported</span>
        </div>
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-[#6B554F]">
          <Sparkles className="w-3 h-3 text-[#C49A45]" />
          <span>Gemini 3.8 Flash Powered</span>
        </div>
      </div>
    </header>
  );
};
