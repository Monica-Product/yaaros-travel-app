/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles, BookOpen, ExternalLink, ShieldAlert, AlertTriangle, CheckCircle, RotateCcw, MapPin, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { EditorialRecommendationCard } from './EditorialRecommendationCard.tsx';
import { renderFormattedMarkdown } from '../utils/formatMarkdown.tsx';
import { JAIPUR_IMAGES } from '../data/jaipurImages.ts';
import { DestinationId, SUPPORTED_DESTINATIONS } from '../data/travelKnowledgeBase.ts';

interface EditorialResponseViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  activeDestinationId: DestinationId;
  onSendMessage: (query: string, destId?: DestinationId) => void;
  onSwitchDestination: (destId: DestinationId) => void;
  onResetSearch: () => void;
}

export const EditorialResponseView: React.FC<EditorialResponseViewProps> = ({
  messages,
  isLoading,
  activeDestinationId,
  onSendMessage,
  onSwitchDestination,
  onResetSearch,
}) => {
  const [followUp, setFollowUp] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim() || isLoading) return;
    onSendMessage(followUp.trim(), activeDestinationId);
    setFollowUp('');
  };

  const activeDestMeta = SUPPORTED_DESTINATIONS.find((d) => d.id === activeDestinationId) || SUPPORTED_DESTINATIONS[0];
  const userMessages = messages.filter((m) => m.sender === 'user');

  return (
    <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Breadcrumb & Destination Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E8DCCB]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResetSearch}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B554F] hover:text-[#A64224] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Destinations</span>
          </button>
          <span className="text-[#D99A91]">·</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A64224] bg-[#F9EBE6] px-3 py-1 rounded-full border border-[#E8CAC4]">
            <MapPin className="w-3.5 h-3.5 text-[#A64224]" />
            <span>Active Destination: {activeDestMeta.name}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onResetSearch}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#A64224] bg-[#F9EBE6] hover:bg-[#F2D7CE] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Inquiry</span>
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="space-y-12">
        {messages.map((message) => {
          if (message.sender === 'user') {
            return (
              <div key={message.id} className="max-w-3xl">
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
              {/* Pending State */}
              {isPending && (
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8DCCB] shadow-editorial flex flex-col items-center justify-center text-center py-16">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF4E8] p-1 border border-[#E8DCCB] mb-4 animate-bounce">
                    <img
                      src={JAIPUR_IMAGES.logo}
                      alt="Yaaros"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#34211C] mb-2">
                    Consulting Verified {activeDestMeta.name} Archives...
                  </h3>
                  <p className="text-sm text-[#6B554F] max-w-md">
                    Synthesizing destination-filtered landmarks, cultural heritage, and authentic culinary records with zero fabrication.
                  </p>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="bg-white rounded-3xl p-8 border border-red-200 text-red-900 shadow-editorial">
                  <h3 className="font-serif text-lg font-bold mb-2">
                    Unable to complete inquiry
                  </h3>
                  <p className="text-sm text-red-700 mb-4">{message.text}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const lastUser = userMessages[userMessages.length - 1];
                      if (lastUser) onSendMessage(lastUser.text, activeDestinationId);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
                  >
                    Retry Inquiry
                  </button>
                </div>
              )}

              {/* Editorial Response Article */}
              {!isPending && !isError && (
                <div className="space-y-8">
                  {/* Cross-Destination Mismatch Notice & Quick Switch Action */}
                  {message.crossDestinationNotice && (
                    <div className="bg-[#FAF4E8] border border-[#A64224]/30 rounded-2xl p-4 sm:p-5 text-xs text-[#34211C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[#A64224] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-xs uppercase tracking-wider text-[#A64224] mb-0.5">
                            Cross-Destination Inquired
                          </div>
                          <p className="text-xs text-[#6B554F] leading-relaxed">
                            {message.crossDestinationNotice.message} Recommendations below were fetched from <strong>{message.crossDestinationNotice.detectedDestination}</strong>.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSwitchDestination(message.crossDestinationNotice!.suggestedSwitchId as DestinationId)}
                        className="px-4 py-2 rounded-xl bg-[#A64224] hover:bg-[#873117] text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0"
                      >
                        Switch to {message.crossDestinationNotice.detectedDestination} Mode →
                      </button>
                    </div>
                  )}

                  {/* General Scope Notice (if triggered, e.g. unsupported destination or live booking limit) */}
                  {message.scopeNotice && !message.crossDestinationNotice && (
                    <div className="bg-[#F7EAE8] border border-[#E8CAC4] rounded-2xl p-4 sm:p-6 text-xs text-[#34211C] flex items-start gap-3.5 shadow-xs">
                      <ShieldAlert className="w-5 h-5 text-[#A64224] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs uppercase tracking-wider text-[#A64224] mb-1">
                          Knowledge Base Scope Directives
                        </div>
                        <p className="text-sm leading-relaxed text-[#6B554F]">
                          {message.scopeNotice}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Curated Editorial Prose Container */}
                  <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DCCB] shadow-editorial">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F2E8DC]">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#FAF4E8] border border-[#E8DCCB] p-0.5 shrink-0">
                        <img
                          src={JAIPUR_IMAGES.logo}
                          alt="Yaaros"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-base text-[#34211C]">
                          Yaaros Editorial Dispatch · {activeDestMeta.name}
                        </div>
                        <div className="text-xs text-[#8C736C]">
                          Verified Grounding · Multi-Destination Architecture
                        </div>
                      </div>
                    </div>

                    {/* Markdown Body */}
                    <div className="prose prose-sm max-w-none text-[#34211C] leading-relaxed">
                      {renderFormattedMarkdown(message.text)}
                    </div>
                  </div>

                  {/* Recommendation Cards Section */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-widest text-[#A64224] mb-1">
                            Curated Recommendations
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl text-[#34211C] font-bold">
                            Selected Landmarks & Heritage Highlights
                          </h3>
                        </div>
                        <span className="text-xs text-[#8C736C] hidden sm:block">
                          {message.recommendations.length} Verified Entries
                        </span>
                      </div>

                      {/* Editorial Visual Cards Grid */}
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

                  {/* Verified Supporting Citations Section with last-verified dates */}
                  {message.citations && message.citations.length > 0 && (
                    <div className="bg-[#FAF4E8] rounded-3xl p-6 sm:p-8 border border-[#E8DCCB]">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-[#A64224]" />
                        <h4 className="font-serif text-lg font-bold text-[#34211C]">
                          Archival References & Source Citations
                        </h4>
                      </div>
                      <p className="text-xs text-[#6B554F] mb-4">
                        Every factual recommendation is grounded in official government tourism portals, UNESCO archives, and archaeological registries. Zero fabricated links.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {message.citations.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-white rounded-2xl p-4 border border-[#E8DCCB] text-xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-bold text-[#34211C] line-clamp-1">
                                  {c.title}
                                </span>
                                <CheckCircle className="w-3.5 h-3.5 text-[#A64224] shrink-0 mt-0.5" />
                              </div>
                              <span className="text-[11px] text-[#A64224] font-medium block mt-0.5">
                                {c.publisher}
                              </span>
                              {c.lastVerifiedDate && (
                                <span className="text-[10px] text-[#8C736C] block mt-0.5">
                                  Last Verified: {c.lastVerifiedDate}
                                </span>
                              )}
                              {c.note && (
                                <p className="text-[11px] text-[#6B554F] mt-1.5 line-clamp-2">
                                  {c.note}
                                </p>
                              )}
                            </div>

                            {c.url && (
                              <div className="mt-3 pt-2 border-t border-[#F2E8DC]">
                                <a
                                  href={c.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A64224] hover:underline"
                                >
                                  <span>View Official Portal</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Follow-up Inquiry Bar at Bottom */}
      <div className="sticky bottom-6 z-30 mt-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md p-2 rounded-2xl sm:rounded-full shadow-2xl border border-[#E8DCCB] flex items-center gap-2 max-w-3xl mx-auto focus-within:ring-4 focus-within:ring-[#A64224]/15"
        >
          <input
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder={`Ask a follow-up about ${activeDestMeta.name}...`}
            disabled={isLoading}
            className="w-full text-sm text-[#34211C] placeholder-[#8C736C] bg-transparent pl-4 pr-2 py-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!followUp.trim() || isLoading}
            className="px-5 py-2.5 rounded-xl sm:rounded-full bg-[#A64224] hover:bg-[#873117] text-white text-xs font-semibold transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
};
