/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenTestEvaluation: () => void;
  hasActiveConversation: boolean;
  onResetSearch: () => void;
  onSelectDestination?: (destId: any) => void;
  activeDestinationId?: string;
  onNavigate?: (section: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTestEvaluation,
  hasActiveConversation,
  onResetSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF6EE]/95 backdrop-blur-md border-b border-[#E8DCCB] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={onResetSearch}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
          title="Yaaros — Your Travel Companion"
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-xs border border-[#E8DCCB] p-0.5 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/aistudio/image_ed674819.png"
              alt="Yaaros Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-2xl text-[#34211C] tracking-tight">
                YAAROS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wide text-[#A64224] bg-[#F9EBE6] px-2.5 py-0.5 rounded-full border border-[#E8CAC4]">
                Jaipur · Bangalore · Hyderabad
              </span>
            </div>
            <span className="text-[11px] text-[#6B554F] font-medium tracking-normal hidden sm:block">
              Your Travel Companion · Explore like a local. Travel like a friend.
            </span>
          </div>
        </div>

        {/* Right side Actions: New Query and Evaluation Bench (No Explore/Destinations/About, No extra dropdown) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveConversation && (
            <button
              type="button"
              onClick={onResetSearch}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full text-[#A64224] bg-[#F9EBE6] hover:bg-[#F2D7CE] transition-colors cursor-pointer border border-[#E8CAC4]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Query</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenTestEvaluation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-white hover:bg-[#F9EBE6] text-[#34211C] hover:text-[#A64224] border border-[#E8DCCB] transition-colors shadow-xs cursor-pointer"
            title="Open Quality Assurance Evaluation Suite (Tests 1–12)"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A64224]" />
            <span className="hidden sm:inline">Evaluation Suite</span>
            <span className="sm:hidden">Tests</span>
          </button>
        </div>
      </div>
    </header>
  );
};
