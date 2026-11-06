/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Compass,
  ArrowRight,
  Search,
  ExternalLink,
  Cpu,
  MapPin,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  SUPPORTED_DESTINATIONS,
  ALL_TRAVEL_RECORDS,
  EVALUATION_SCENARIOS,
  GENERAL_SCOPE,
  DestinationId,
  EvaluationScenario,
} from '../data/travelKnowledgeBase.ts';

interface EvaluationSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunScenario: (prompt: string, destinationId?: DestinationId) => void;
  activeDestinationId?: DestinationId;
}

export const EvaluationSuiteModal: React.FC<EvaluationSuiteModalProps> = ({
  isOpen,
  onClose,
  onRunScenario,
  activeDestinationId = 'jaipur',
}) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'records' | 'scope'>('scenarios');
  const [selectedDestFilter, setSelectedDestFilter] = useState<string>('all');
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  // Filter verified records
  const filteredRecords = ALL_TRAVEL_RECORDS.filter((r) => {
    const matchesDest = selectedDestFilter === 'all' || r.destinationId === selectedDestFilter;
    const matchesQuery =
      !query ||
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query) ||
      r.cityOrLocation.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query);
    return matchesDest && matchesQuery;
  });

  // Filter scenarios
  const filteredScenarios = EVALUATION_SCENARIOS.filter((s) => {
    if (scenarioFilter === 'all') return true;
    return s.category === scenarioFilter;
  });

  const getCategoryBadge = (category: EvaluationScenario['category']) => {
    switch (category) {
      case 'grounded_retrieval':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Grounded Retrieval
          </span>
        );
      case 'cross_destination':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
            Cross-Destination Mismatch
          </span>
        );
      case 'unsupported_destination':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Scope Boundary
          </span>
        );
      case 'real_time_limitation':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            Real-Time Refusal
          </span>
        );
      case 'follow_up_resolution':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            Follow-Up Resolution
          </span>
        );
      case 'insufficient_info':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            Missing Info Honesty
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FBF6EE] h-full shadow-2xl flex flex-col border-l border-[#E8DCCB]">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E8DCCB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A64224] flex items-center justify-center text-white shadow-sm shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#34211C]">
                  Evaluation Suite & Test Scenarios
                </h3>
                <span className="text-[10px] font-semibold bg-[#F9EBE6] text-[#A64224] px-2 py-0.5 rounded-full border border-[#E8CAC4]">
                  3 Cities
                </span>
              </div>
              <p className="text-xs text-[#6B554F]">
                Automated test scenarios (Tests A–I), verified records, and boundary governance for Jaipur, Bangalore & Hyderabad
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B554F] hover:bg-[#FAF4E8] hover:text-[#34211C] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-4 bg-white/70 border-b border-[#E8DCCB] text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === 'scenarios'
                ? 'bg-[#A64224] text-white shadow-xs'
                : 'text-[#6B554F] hover:bg-[#FAF4E8]'
            }`}
          >
            Test Scenarios (9)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === 'records'
                ? 'bg-[#A64224] text-white shadow-xs'
                : 'text-[#6B554F] hover:bg-[#FAF4E8]'
            }`}
          >
            Verified Archives ({ALL_TRAVEL_RECORDS.length} Records)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scope')}
            className={`px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
              activeTab === 'scope'
                ? 'bg-[#A64224] text-white shadow-xs'
                : 'text-[#6B554F] hover:bg-[#FAF4E8]'
            }`}
          >
            Scope & Boundaries
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Evaluation Scenarios */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <div className="bg-[#FAF4E8] p-4 rounded-2xl border border-[#E8DCCB] text-xs text-[#6B554F]">
                <div className="flex items-center gap-2 font-bold text-[#34211C] mb-1">
                  <Cpu className="w-4 h-4 text-[#A64224]" />
                  <span>Multi-Destination Verification Suite</span>
                </div>
                <span>
                  Execute any of the 9 required test scenarios below. Scenarios automatically set the target destination context (e.g. Scenario 6 sets Bangalore active while querying Jaipur to test cross-destination boundary enforcement).
                </span>
              </div>

              {/* Scenario Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {[
                  { id: 'all', label: 'All Scenarios (9)' },
                  { id: 'grounded_retrieval', label: 'Grounded Retrieval (5)' },
                  { id: 'cross_destination', label: 'Cross-Destination (1)' },
                  { id: 'unsupported_destination', label: 'Scope Refusal (1)' },
                  { id: 'real_time_limitation', label: 'Live Refusal (1)' },
                  { id: 'insufficient_info', label: 'Missing Info (1)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setScenarioFilter(f.id)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      scenarioFilter === f.id
                        ? 'bg-[#A64224] text-white border-[#A64224]'
                        : 'bg-white text-[#6B554F] border-[#E8DCCB] hover:bg-[#FAF4E8]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Scenarios List */}
              <div className="space-y-4">
                {filteredScenarios.map((scenario) => {
                  const targetDest = SUPPORTED_DESTINATIONS.find((d) => d.id === scenario.targetDestination);
                  const isCross = scenario.category === 'cross_destination';

                  return (
                    <div
                      key={scenario.id}
                      className={`bg-white p-5 rounded-2xl border transition-all shadow-xs ${
                        isCross ? 'border-[#A64224]/40 ring-1 ring-[#A64224]/20' : 'border-[#E8DCCB]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-[#34211C]">
                            {scenario.title}
                          </span>
                        </div>
                        {getCategoryBadge(scenario.category)}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#8C736C] mb-2.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#A64224]">
                          <MapPin className="w-3 h-3" />
                          <span>Active Context: {targetDest?.name || scenario.targetDestination}</span>
                        </span>
                        {isCross && (
                          <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            Tests cross-city query separation
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#6B554F] mb-3 leading-relaxed">
                        <strong className="text-[#34211C]">Expected Behavior: </strong>
                        {scenario.expectedBehavior}
                      </p>

                      <div className="bg-[#FAF4E8] p-3 rounded-xl text-xs font-mono text-[#A64224] mb-3 border border-[#E8DCCB]/60">
                        "{scenario.question}"
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onRunScenario(scenario.question, scenario.targetDestination);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#A64224] hover:bg-[#873117] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Execute Scenario</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Verified Knowledge Base Archives */}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8C736C] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${ALL_TRAVEL_RECORDS.length} verified records...`}
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-[#E8DCCB] text-xs text-[#34211C] focus:outline-none focus:border-[#A64224]"
                  />
                </div>

                {/* Destination Dropdown */}
                <select
                  value={selectedDestFilter}
                  onChange={(e) => setSelectedDestFilter(e.target.value)}
                  className="px-3 py-2 bg-white rounded-xl border border-[#E8DCCB] text-xs font-semibold text-[#34211C] focus:outline-none focus:border-[#A64224] cursor-pointer"
                >
                  <option value="all">All Destinations ({ALL_TRAVEL_RECORDS.length})</option>
                  {SUPPORTED_DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({ALL_TRAVEL_RECORDS.filter((r) => r.destinationId === d.id).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Records Counter */}
              <div className="flex items-center justify-between text-xs text-[#8C736C] px-1">
                <span>Showing {filteredRecords.length} verified records</span>
                <span className="text-[11px] text-[#A64224]">Official Govt & Tourism Sources</span>
              </div>

              {/* Records List */}
              <div className="space-y-3">
                {filteredRecords.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-4 rounded-xl border border-[#E8DCCB] text-xs shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#34211C] text-sm">{r.name}</span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#FAF4E8] text-[#A64224] border border-[#E8DCCB]">
                            {r.cityOrLocation}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A64224] font-medium mt-0.5">
                          {r.tagline}
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-[#8C736C] bg-stone-50 px-2 py-0.5 rounded-full border border-stone-200 shrink-0">
                        {r.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B554F] line-clamp-3 mb-2.5 leading-relaxed">
                      {r.description}
                    </p>

                    {(r.openingHours || r.visitingHours) && (
                      <div className="text-[11px] text-[#6B554F] mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A64224] shrink-0" />
                        <span>Hours: {r.openingHours || r.visitingHours}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-[#8C736C] pt-2 border-t border-[#F2E8DC]">
                      <span className="text-[10px] text-stone-500">
                        Verified: {r.lastVerifiedDate}
                      </span>
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A64224] hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>{r.sourceName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Scope Governance */}
          {activeTab === 'scope' && (
            <div className="space-y-4 text-xs text-[#34211C]">
              {/* 3 Destinations Scope */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#A64224]" />
                  <h4 className="font-serif font-bold text-sm text-[#A64224]">
                    3 Supported Cities
                  </h4>
                </div>
                <p className="text-xs text-[#6B554F] leading-relaxed">
                  Yaaros currently provides verified travel discovery for exactly 3 premier cities across India. All recommendation data is strictly bound to these curated archives:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {SUPPORTED_DESTINATIONS.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl bg-[#FAF4E8] border border-[#E8DCCB] flex flex-col"
                    >
                      <span className="font-bold text-[#34211C]">{d.name}</span>
                      <span className="text-[11px] text-[#A64224]">{d.state} · {d.tagline}</span>
                      <span className="text-[10px] text-[#6B554F] mt-1">{d.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unrestricted Cross-City Policy */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#A64224]" />
                  <h4 className="font-serif font-bold text-sm text-[#A64224]">
                    Unrestricted Cross-City Query Capability
                  </h4>
                </div>
                <p className="text-xs text-[#6B554F] leading-relaxed">
                  The city selector serves as a convenient context starting point, but it never restricts queries. If you have Jaipur selected and ask about Bangalore Palace or Golconda Fort in Hyderabad, Yaaros immediately answers with verified records for that city without blocking errors, warning alerts, or cross-city barriers.
                </p>
              </div>

              {/* Real-time Limitations */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DCCB] space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#A64224]" />
                  <h4 className="font-serif font-bold text-sm text-[#A64224]">
                    Real-Time & Live Booking Limitations
                  </h4>
                </div>
                <p className="text-xs text-[#6B554F] leading-relaxed mb-2">
                  {GENERAL_SCOPE.realtimeDisclaimer}
                </p>
                <div className="space-y-1 text-[11px] text-[#6B554F] bg-[#FAF4E8] p-3 rounded-xl border border-[#E8DCCB]">
                  <strong className="text-[#34211C] block mb-1">
                    Explicitly Disallowed Real-Time Functions:
                  </strong>
                  {GENERAL_SCOPE.realtimeUnsupportedFeatures.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[#A64224]">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
