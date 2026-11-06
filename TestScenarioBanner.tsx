/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, ShieldAlert, Clock, ArrowRight } from 'lucide-react';

interface TestScenarioBannerProps {
  onSelectScenario: (prompt: string) => void;
  isLoading: boolean;
}

export const TestScenarioBanner: React.FC<TestScenarioBannerProps> = ({
  onSelectScenario,
  isLoading,
}) => {
  const scenarios = [
    {
      id: 'historical_attractions',
      num: '01',
      title: 'Historical Attractions',
      subtitle: 'Amber Fort, Hawa Mahal, City Palace',
      prompt: 'Recommend the top historical attractions to visit on a first-time trip to Jaipur.',
      icon: Landmark,
      badge: 'Grounding Verification',
      badgeColor: 'text-[#9B3B1F] bg-[#FCECE7]',
    },
    {
      id: 'udaipur_refusal',
      num: '02',
      title: 'Udaipur City Refusal',
      subtitle: 'Strict Jaipur boundary test',
      prompt: 'What are the best places to visit in Udaipur?',
      icon: ShieldAlert,
      badge: 'Scope Boundary',
      badgeColor: 'text-[#B44622] bg-[#FAF5ED]',
    },
    {
      id: 'live_availability_refusal',
      num: '03',
      title: 'Live Booking Refusal',
      subtitle: '1135 AD table availability test',
      prompt: 'Can you check live table availability for tonight at 1135 AD restaurant and book a table for four?',
      icon: Clock,
      badge: 'Real-Time Limitation',
      badgeColor: 'text-[#7A2E17] bg-[#F3E9DA]',
    },
  ];

  return (
    <div className="bg-[#FAF5ED] border-b border-[#E8D8C3] px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-display text-xs tracking-wider font-bold text-[#541E0F] uppercase">
              Evaluation Test Scenarios
            </span>
            <span className="text-[11px] text-[#6B554F]">
              Click any scenario to verify compliance with the prompt directives
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                disabled={isLoading}
                onClick={() => onSelectScenario(s.prompt)}
                className="group relative flex flex-col items-start p-3 text-left rounded-xl bg-white/80 hover:bg-white border border-[#E8D8C3] hover:border-[#BF4C29] transition-all duration-200 shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[11px] font-bold text-[#BF4C29]">
                      {s.num}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>
                  <Icon className="w-3.5 h-3.5 text-[#9B3B1F] group-hover:scale-110 transition-transform" />
                </div>

                <div className="text-xs font-semibold text-[#2A1D1A] group-hover:text-[#9B3B1F] transition-colors">
                  {s.title}
                </div>
                <div className="text-[11px] text-[#6B554F] line-clamp-1 mb-2">
                  {s.subtitle}
                </div>

                <div className="mt-auto w-full pt-1.5 border-t border-[#F3E9DA] flex items-center justify-between text-[11px] text-[#BF4C29] font-medium group-hover:translate-x-0.5 transition-transform">
                  <span>Run Scenario</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
