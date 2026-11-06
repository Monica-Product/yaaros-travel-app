/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Lightweight safe markdown renderer tailored for Yaaros travel responses
 */
export const renderFormattedMarkdown = (content: string): React.ReactNode => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="space-y-1.5 my-2.5 pl-4 list-disc marker:text-[#BF4C29]">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const parseInline = (text: string): React.ReactNode[] => {
    // Process bold (**...**) and italics (*...*) and code (`...`)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-[#2A1D1A]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic text-[#7A2E17]">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="px-1.5 py-0.5 rounded bg-[#FAF5ED] text-[#9B3B1F] text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${lineIdx}`}
          className="font-serif font-bold text-base sm:text-lg text-[#541E0F] mt-3.5 mb-1.5 leading-snug"
        >
          {parseInline(trimmed.replace('### ', ''))}
        </h3>
      );
      return;
    }

    // Heading 4
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4
          key={`h4-${lineIdx}`}
          className="font-serif font-bold text-sm sm:text-base text-[#7A2E17] mt-3 mb-1"
        >
          {parseInline(trimmed.replace('#### ', ''))}
        </h4>
      );
      return;
    }

    // Unordered list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.replace(/^[-*]\s+/, '');
      currentList.push(
        <li key={`li-${lineIdx}`} className="text-xs sm:text-sm text-[#392823] leading-relaxed">
          {parseInline(itemText)}
        </li>
      );
      return;
    }

    // Numbered list item
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      currentList.push(
        <li key={`num-li-${lineIdx}`} className="text-xs sm:text-sm text-[#392823] leading-relaxed">
          <span className="font-semibold text-[#9B3B1F] mr-1">{numMatch[1]}.</span>
          {parseInline(numMatch[2])}
        </li>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${lineIdx}`} className="text-xs sm:text-sm text-[#392823] leading-relaxed my-1.5">
        {parseInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
};
