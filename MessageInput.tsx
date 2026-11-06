/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, HelpCircle } from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../data/jaipurKnowledgeBase.ts';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSelectSuggestion = (q: string) => {
    onSendMessage(q);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-[#FAF5ED]/95 backdrop-blur-md border-t border-[#E8D8C3] p-3 sm:p-4 sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto">
        {/* Toggleable suggested questions dropdown/drawer */}
        {showSuggestions && (
          <div className="mb-3 p-3 bg-white rounded-xl border border-[#E8D8C3] shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-xs font-bold text-[#541E0F] uppercase tracking-wider">
                Curated Jaipur Inquiries
              </span>
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="text-xs text-[#7A2E17] hover:underline"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSuggestion(q)}
                  className="text-left text-xs p-2 rounded-lg bg-[#FAF5ED] hover:bg-[#FCECE7] text-[#392823] hover:text-[#9B3B1F] border border-[#E8D8C3] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          {/* Suggestion prompt opener button */}
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="p-2.5 rounded-xl border border-[#E8D8C3] bg-white text-[#7A2E17] hover:bg-[#FCECE7] hover:border-[#BF4C29] transition-colors shrink-0 shadow-xs"
            title="Browse suggested questions"
          >
            <HelpCircle className="w-5 h-5 text-[#9B3B1F]" />
          </button>

          {/* Text input area */}
          <div className="flex-1 relative bg-white rounded-2xl border border-[#E8D8C3] focus-within:border-[#BF4C29] focus-within:ring-2 focus-within:ring-[#BF4C29]/15 transition-all shadow-xs">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about historical forts, palaces, Dal Baati Churma, or kachoris in Jaipur..."
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm text-[#2A1D1A] placeholder-[#8A756F] bg-transparent resize-none focus:outline-none max-h-32"
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-br from-[#BF4C29] to-[#9B3B1F] hover:from-[#9B3B1F] hover:to-[#7A2E17] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0 shadow-md shadow-[#9B3B1F]/20"
            title="Send inquiry"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Quiet footnote explaining boundaries */}
        <div className="flex items-center justify-between text-[11px] text-[#6B554F] mt-2 px-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BF4C29]" />
            <span>Answers strictly derived from verified Jaipur archives · No fabricated facts</span>
          </div>
          <span className="hidden sm:inline text-[#9B3B1F]">
            Shift + Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
};
