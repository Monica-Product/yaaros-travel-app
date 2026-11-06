/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, User, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { RecommendationCard } from './RecommendationCard.tsx';
import { CitationsList } from './CitationsList.tsx';
import { ScopeAlertNotice } from './ScopeAlertNotice.tsx';
import { renderFormattedMarkdown } from '../utils/formatMarkdown.tsx';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onRetry?: (text: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';
  const isPending = message.status === 'pending';
  const isError = message.status === 'error';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 mb-6 animate-fadeIn">
        <div className="max-w-[85%] sm:max-w-[75%]">
          <div className="bg-gradient-to-r from-[#9B3B1F] to-[#7A2E17] text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs shadow-md shadow-[#9B3B1F]/15">
            <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
              {message.text}
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 text-[10px] text-[#6B554F] mt-1 px-1">
            <span>You</span>
            <span>·</span>
            <span>{message.timestamp}</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#E8D8C3] flex items-center justify-center text-[#541E0F] shrink-0 border border-[#FAF5ED]">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6 animate-fadeIn">
      {/* Yaaros avatar */}
      <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#FAF5ED] shadow-xs border border-[#E8DAC8] shrink-0 flex items-center justify-center mt-0.5">
        <img
          src="/assets/aistudio/image_ed674819.png"
          alt="Yaaros"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1 max-w-[92%] sm:max-w-[88%]">
        <div className="bg-white border border-[#E8D8C3] rounded-2xl rounded-tl-xs p-4 sm:p-6 shadow-xs">
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F3E9DA] text-xs">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#3D2132] tracking-wide">
                Yaaros
              </span>
              <span className="text-[10px] font-medium text-[#BF4C29] bg-[#FFF6F3] px-2 py-0.5 rounded-full border border-[#E78361]/30">
                Verified Archival Output
              </span>
            </div>

            {!isPending && !isError && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-[#6B554F] hover:text-[#9B3B1F] transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* Pending / Loading State */}
          {isPending && (
            <div className="py-4 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-[#9B3B1F] font-medium">
                <div className="w-4 h-4 border-2 border-[#BF4C29] border-t-transparent rounded-full animate-spin" />
                <span>Consulting verified Jaipur heritage records & formulating response...</span>
              </div>
              <div className="space-y-2 opacity-60">
                <div className="h-3.5 bg-[#FAF5ED] rounded w-3/4 animate-pulse" />
                <div className="h-3.5 bg-[#FAF5ED] rounded w-full animate-pulse" />
                <div className="h-3.5 bg-[#FAF5ED] rounded w-5/6 animate-pulse" />
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Failed to complete discovery query</span>
              </div>
              <p className="text-xs text-red-800">{message.text}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={() => onRetry(message.text)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Query</span>
                </button>
              )}
            </div>
          )}

          {/* Normal Response Body */}
          {!isPending && !isError && (
            <>
              {/* Scope alert if triggered */}
              {(message.scopeNotice || message.testScenarioMatched) && (
                <ScopeAlertNotice
                  notice={message.scopeNotice}
                  scenarioType={message.testScenarioMatched}
                />
              )}

              {/* Formatted Markdown Body */}
              <div className="text-xs sm:text-sm text-[#2A1D1A]">
                {renderFormattedMarkdown(message.text)}
              </div>

              {/* Structured Recommendation Cards */}
              {message.recommendations && message.recommendations.length > 0 && (
                <div className="mt-5 pt-4 border-t border-[#E8D8C3]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-xs font-bold text-[#541E0F] uppercase tracking-wider">
                      Structured Architectural & Culinary Cards ({message.recommendations.length})
                    </span>
                    <span className="text-[11px] text-[#6B554F]">
                      Archival records
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {message.recommendations.map((rec, idx) => (
                      <RecommendationCard key={idx} item={rec} index={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* Supporting Citations & Links */}
              {message.citations && message.citations.length > 0 && (
                <CitationsList citations={message.citations} />
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[#6B554F] mt-1 px-1">
          <span>Yaaros Grounded Engine</span>
          <span>·</span>
          <span>{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};
