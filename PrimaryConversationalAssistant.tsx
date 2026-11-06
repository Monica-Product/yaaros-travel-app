/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  MapPin,
  Compass,
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Landmark,
  Utensils,
  BookOpen,
} from 'lucide-react';
import { ChatMessage, DestinationId } from '../types.ts';
import { SUPPORTED_DESTINATIONS } from '../data/travelKnowledgeBase.ts';
import { EditorialRecommendationCard } from './EditorialRecommendationCard.tsx';
import { renderFormattedMarkdown } from '../utils/formatMarkdown.tsx';

interface PrimaryConversationalAssistantProps {
  messages: ChatMessage[];
  isLoading: boolean;
  activeDestinationId: DestinationId;
  onSelectDestination: (destId: DestinationId) => void;
  onSendMessage: (query: string, destId?: DestinationId) => void;
  onResetSearch: () => void;
  onOpenEvaluationSuite: () => void;
}

export const PrimaryConversationalAssistant: React.FC<PrimaryConversationalAssistantProps> = ({
  messages,
  isLoading,
  activeDestinationId,
  onSelectDestination,
  onSendMessage,
  onResetSearch,
  onOpenEvaluationSuite,
}) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const latestExchangeRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only scroll when user asks a new question or an answer finishes generating
      if (
        (lastMessage.sender === 'user' && messages.length > prevMsgCountRef.current) ||
        (lastMessage.sender === 'assistant' && lastMessage.status === 'success')
      ) {
        latestExchangeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    prevMsgCountRef.current = messages.length;
  }, [messages]);

  const activeCityMeta =
    SUPPORTED_DESTINATIONS.find((d) => d.id === activeDestinationId) ||
    SUPPORTED_DESTINATIONS[0];

  const submitQuery = (rawQuery: string, destId?: DestinationId) => {
    const query = rawQuery.trim();
    if (!query || isLoading) return;
    setInputText('');
    onSendMessage(query, destId || activeDestinationId);
  };

  const handleTopSubmit = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    submitQuery(inputText);
  };

  const handleSuggestedClick = (question: string, destId?: DestinationId) => {
    submitQuery(question, destId);
  };

  const handleCitySelect = (destId: DestinationId) => {
    onSelectDestination(destId);
  };

  // City-specific suggestions required by prompt
  const citySuggestedQuestions: Record<DestinationId, string[]> = {
    jaipur: [
      'Tell me about Amber Fort',
      'What are the must-visit historical places in Jaipur?',
      'Recommend authentic Rajasthani food and where to eat it.',
      'Which verified heritage restaurants should I visit in Jaipur?',
    ],
    bangalore: [
      'Tell me about Bangalore Palace',
      'What are the historical places in Bangalore?',
      'Where can I find the best South Indian breakfast in Bangalore?',
      'Which verified heritage restaurants should I visit in Bangalore?',
    ],
    hyderabad: [
      'Tell me about Golconda Fort and Falaknuma Palace in Hyderabad.',
      'What is the difference between Hyderabadi Biryani and Haleem?',
      'Which historical palaces and havelis should I visit in Hyderabad?',
      'Which historic restaurants should I visit in Hyderabad?',
    ],
  };

  return (
    <div className="w-full">
      {/* =========================================================================
          HERO & SEARCH SECTION
          ========================================================================= */}
      <section className="relative bg-[#FAF4E8] border-b border-[#E8DCCB] pt-8 pb-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo & Brand Badge */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white shadow-sm border border-[#E8DCCB] p-1 shrink-0">
              <img
                src="/assets/aistudio/image_ed674819.png"
                alt="Yaaros Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3E7DC] border border-[#E0D0C1] text-xs font-semibold text-[#873117] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C79848]" />
            <span>AI Travel Companion · Jaipur · Bangalore · Hyderabad</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#34211C] tracking-tight mb-2">
            Where would you like to explore?
          </h1>

          {/* Tagline */}
          <p className="font-serif italic text-lg sm:text-2xl text-[#A64224] font-medium mb-3">
            Explore like a local. Travel like a friend.
          </p>

          <p className="text-sm sm:text-base text-[#6B554F] max-w-2xl mx-auto mb-8 font-light">
            Discover verified royal forts, palaces, iconic landmarks, traditional cuisines, and legendary dining institutions across <strong>Jaipur</strong>, <strong>Bangalore</strong>, and <strong>Hyderabad</strong>.
          </p>

          {/* City Selector: Jaipur, Bangalore, Hyderabad */}
          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C736C] mb-3">
              Select Your Active Destination
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {SUPPORTED_DESTINATIONS.map((dest) => {
                const isSelected = activeDestinationId === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => handleCitySelect(dest.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#34211C] text-white border-[#34211C] shadow-md shadow-[#34211C]/15 ring-2 ring-[#A64224]'
                        : 'bg-white hover:bg-[#FAF4E8] text-[#34211C] border-[#E8DCCB] shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F6B83B]' : 'text-[#A64224]'}`} />
                        <span className="font-serif font-bold text-base sm:text-lg">
                          {dest.name}
                        </span>
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-[#D99A91]' : 'text-[#8C736C]'}`}>
                        {dest.state} · {dest.tagline}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F6B83B] shrink-0 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prominent Chat Input Box and Send Button */}
          <form
            onSubmit={handleTopSubmit}
            className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-lg border border-[#E8DCCB] flex flex-col sm:flex-row items-center gap-2 max-w-3xl mx-auto transition-all focus-within:ring-4 focus-within:ring-[#A64224]/15"
          >
            <div className="flex items-center gap-3 w-full pl-4 pr-2 py-1">
              <Compass className="w-5 h-5 text-[#A64224] shrink-0" />
              <input
                ref={inputRef}
                id="ask-input"
                name="ask-a-question"
                aria-label="Ask a Question"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTopSubmit(e);
                  }
                }}
                placeholder="Ask anything about Jaipur, Bangalore or Hyderabad..."
                disabled={isLoading}
                className="w-full text-sm sm:text-base text-[#34211C] placeholder-[#8C736C] bg-transparent focus:outline-none"
              />
            </div>

            <button
              id="ask-button"
              type="button"
              aria-label="Ask"
              onClick={handleTopSubmit}
              disabled={!inputText.trim() || isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl sm:rounded-full bg-[#A64224] hover:bg-[#873117] text-white font-medium text-sm transition-all duration-200 shrink-0 shadow-md shadow-[#A64224]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Exploring...' : 'Ask'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Suggested Quick Questions for Selected City */}
          <div className="mt-6 text-left max-w-3xl mx-auto">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C736C] mb-2 flex items-center justify-between">
              <span>Suggested for {activeCityMeta.name}</span>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={onResetSearch}
                  className="inline-flex items-center gap-1 text-[11px] text-[#A64224] hover:underline font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Conversation</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {citySuggestedQuestions[activeDestinationId].map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedClick(q)}
                  disabled={isLoading}
                  className="text-xs text-[#34211C] hover:text-[#A64224] bg-white hover:bg-[#F9EBE6] px-3.5 py-2 rounded-full border border-[#E8DCCB] hover:border-[#A64224]/40 transition-colors cursor-pointer shadow-2xs font-medium text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONVERSATION STREAM OR CLEAN EDITORIAL EMPTY STATE (ZERO IMAGES)
          ========================================================================= */}
      <section className="py-10 px-4 sm:px-8 max-w-5xl mx-auto">
        {messages.length === 0 ? (
          /* Clean Text-First Destination Discovery (No photographs or image cards) */
          <div className="space-y-10 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#34211C] mb-2">
                Curated Travel Archives
              </h2>
              <p className="text-sm text-[#6B554F]">
                Explore verified historical architecture, signature culinary traditions, and heritage dining institutions across our three supported cities.
              </p>
            </div>

            {/* Three-City Text-First Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUPPORTED_DESTINATIONS.map((dest) => {
                const isCurrent = activeDestinationId === dest.id;
                return (
                  <div
                    key={dest.id}
                    className={`bg-white rounded-3xl p-6 border transition-all duration-300 shadow-sm flex flex-col justify-between ${
                      isCurrent
                        ? 'border-[#A64224] ring-2 ring-[#A64224]/20'
                        : 'border-[#E8DCCB] hover:border-[#A64224]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A64224] bg-[#FAF4E8] px-2.5 py-1 rounded-full border border-[#E8DCCB]">
                          {dest.state}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl font-bold text-[#34211C] mb-1">
                        {dest.name}
                      </h3>
                      <p className="text-xs font-serif italic text-[#A64224] mb-3">
                        {dest.tagline}
                      </p>

                      <p className="text-xs text-[#5C4D49] leading-relaxed mb-4">
                        {dest.description}
                      </p>

                      <div className="space-y-1.5 pt-3 border-t border-[#F2E8DC] mb-5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C736C]">
                          Archival Highlights
                        </div>
                        <div className="text-xs text-[#34211C] space-y-1">
                          {dest.id === 'jaipur' && (
                            <>
                              <div>✦ Amber Fort, Hawa Mahal & City Palace</div>
                              <div>✦ Dal Baati Churma, Ghewar & Pyaaz Kachori</div>
                              <div>✦ Heritage Dining at 1135 AD & Laxmi Mishtan</div>
                            </>
                          )}
                          {dest.id === 'bangalore' && (
                            <>
                              <div>✦ Bangalore Palace, Tipu Sultan's Palace & Fort</div>
                              <div>✦ Bisi Bele Bath, Masala Dosa & Filter Coffee</div>
                              <div>✦ Legendary Tiffin at Vidyarthi Bhavan & MTR</div>
                            </>
                          )}
                          {dest.id === 'hyderabad' && (
                            <>
                              <div>✦ Golconda Fort, Charminar & Falaknuma Palace</div>
                              <div>✦ Hyderabadi Dum Biryani, Haleem & Irani Chai</div>
                              <div>✦ Heritage Institutions at Hotel Shadab & Nimrah</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectDestination(dest.id);
                        onSendMessage(dest.sampleQuestions[0], dest.id);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#FAF4E8] hover:bg-[#A64224] text-[#A64224] hover:text-white border border-[#E8DCCB] hover:border-[#A64224] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore {dest.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Transparent Verification Callout Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCCB] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F9EBE6] border border-[#E8CAC4] flex items-center justify-center text-[#A64224] shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#A64224]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#34211C] mb-1">
                    Verified Quality Assurance Suite
                  </h4>
                  <p className="text-xs text-[#6B554F] leading-relaxed max-w-xl">
                    Inspect 9 automated evaluation scenarios verifying Jaipur sightseeing, Bangalore architecture, Hyderabad palaces, strict food vs. restaurant separation, multi-turn context memory, and zero-fabrication boundary enforcement.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenEvaluationSuite}
                className="px-5 py-2.5 rounded-full bg-[#34211C] hover:bg-[#A64224] text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Open Evaluation Suite →
              </button>
            </div>
          </div>
        ) : (
          /* Active Conversational Message Thread */
          <div className="space-y-12">
            {messages.map((message, idx) => {
              const isLatestUser =
                message.sender === 'user' &&
                (idx === messages.length - 1 || idx === messages.length - 2);

              if (message.sender === 'user') {
                return (
                  <div
                    key={message.id}
                    ref={isLatestUser ? latestExchangeRef : undefined}
                    className="max-w-2xl scroll-mt-24 pt-4"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#A64224] mb-1.5 flex items-center gap-1.5">
                      <span>Your Inquiry</span>
                      <span className="text-[#D99A91]">✦</span>
                      <span className="text-[#8C736C]">{message.timestamp}</span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#34211C] font-bold leading-snug">
                      "{message.text}"
                    </h2>
                  </div>
                );
              }

              // Assistant Response
              const isPending = message.status === 'pending';
              const isError = message.status === 'error';

              return (
                <div key={message.id} className="relative">
                  {/* Loading / Pending State */}
                  {isPending && (
                    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DCCB] shadow-sm flex flex-col items-center justify-center text-center py-16">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF4E8] p-1 border border-[#E8DCCB] mb-4 animate-bounce">
                        <img
                          src="/assets/aistudio/image_ed674819.png"
                          alt="Yaaros"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#34211C] mb-2">
                        Consulting Verified {activeCityMeta.name} Archives...
                      </h3>
                      <p className="text-sm text-[#6B554F] max-w-md">
                        Synthesizing verified historical architecture, signature dishes, and official tourism records with zero fabrication.
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {isError && (
                    <div className="bg-white rounded-3xl p-8 border border-red-200 text-red-900 shadow-sm">
                      <h3 className="font-serif text-lg font-bold mb-2">
                        Unable to complete inquiry
                      </h3>
                      <p className="text-sm text-red-700 mb-4">{message.text}</p>
                      <button
                        type="button"
                        onClick={() => {
                          const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
                          if (lastUser) submitQuery(lastUser.text, lastUser.destinationId || activeDestinationId);
                        }}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
                      >
                        Retry Inquiry
                      </button>
                    </div>
                  )}

                  {/* Editorial Response Article */}
                  {!isPending && !isError && (() => {
                    const messageCityMeta = message.destinationId
                      ? SUPPORTED_DESTINATIONS.find((d) => d.id === message.destinationId) || activeCityMeta
                      : activeCityMeta;

                    return (
                      <div className="space-y-8">
                        {/* Scope Notice (e.g. Unsupported Destination or Live Booking Limit) */}
                        {message.scopeNotice && (
                          <div className="bg-[#F7EAE8] border border-[#E8CAC4] rounded-2xl p-4 sm:p-6 text-xs text-[#34211C] flex items-start gap-3.5 shadow-xs">
                            <ShieldAlert className="w-5 h-5 text-[#A64224] shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-xs uppercase tracking-wider text-[#A64224] mb-1">
                                Knowledge Base Scope Notice
                              </div>
                              <p className="text-sm leading-relaxed text-[#6B554F]">
                                {message.scopeNotice}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Curated Editorial Prose Container */}
                        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DCCB] shadow-sm">
                          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F2E8DC]">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF4E8] border border-[#E8DCCB] p-0.5 shrink-0">
                              <img
                                src="/assets/aistudio/image_ed674819.png"
                                alt="Yaaros"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="font-serif font-bold text-base text-[#34211C]">
                                Yaaros Editorial Travel Dispatch
                              </div>
                              <div className="text-xs text-[#8C736C]">
                                Verified Three-City Travel Companion · {messageCityMeta.name}
                              </div>
                            </div>
                          </div>

                        {/* Markdown Body */}
                        <div className="prose prose-sm max-w-none text-[#34211C] leading-relaxed">
                          {renderFormattedMarkdown(message.text)}
                        </div>
                      </div>

                      {/* Structured Recommendation Cards Section (Clean text-first cards with no images) */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="space-y-6">
                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-widest text-[#A64224] mb-1">
                                Verified Recommendations
                              </div>
                              <h3 className="font-serif text-2xl sm:text-3xl text-[#34211C] font-bold">
                                Architectural Landmarks & Heritage Profiles
                              </h3>
                            </div>
                            <span className="text-xs text-[#8C736C] hidden sm:block">
                              {message.recommendations.length} Verified Entries
                            </span>
                          </div>

                          {/* Recommendation Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {message.recommendations.map((item, recIdx) => (
                              <EditorialRecommendationCard
                                key={recIdx}
                                item={item}
                                index={recIdx}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Supporting Official Citations Section */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCCB] shadow-xs">
                          <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-4 h-4 text-[#A64224]" />
                            <h4 className="font-serif font-bold text-base text-[#34211C]">
                              Official Sources & Archival Records
                            </h4>
                          </div>
                          <ul className="space-y-3">
                            {message.citations.map((cite, citeIdx) => (
                              <li
                                key={citeIdx}
                                className="text-xs text-[#6B554F] flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#FAF4E8]/60 border border-[#E8DCCB]/60"
                              >
                                <div>
                                  <strong className="text-[#34211C]">{cite.title}</strong>
                                  {cite.publisher && <span className="text-[#8C736C]"> · {cite.publisher}</span>}
                                  {cite.lastVerifiedDate && (
                                    <span className="text-[10px] ml-2 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      Verified: {cite.lastVerifiedDate}
                                    </span>
                                  )}
                                  {cite.note && (
                                    <p className="text-[11px] text-[#8C736C] mt-0.5">{cite.note}</p>
                                  )}
                                </div>
                                {cite.url && (
                                  <a
                                    href={cite.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-[#A64224] hover:underline shrink-0"
                                  >
                                    <span>Source Portal</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  );
                })()}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
