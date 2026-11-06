/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { PrimaryConversationalAssistant } from './components/PrimaryConversationalAssistant.tsx';
import { Footer } from './components/Footer.tsx';
import { EvaluationSuiteModal } from './components/EvaluationSuiteModal.tsx';
import { ChatMessage, DestinationId, ChatHistoryItem } from './types.ts';
import { SUPPORTED_DESTINATIONS } from './data/travelKnowledgeBase.ts';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [activeDestinationId, setActiveDestinationId] = useState<DestinationId>('jaipur');

  const handleSendMessage = async (text: string, destId?: DestinationId) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Use explicit destId if provided, otherwise active destination
    const targetDestId = destId || activeDestinationId;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `asst-${Date.now()}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      destinationId: targetDestId,
      text: trimmed,
      timestamp: currentTime,
      status: 'success',
    };

    const newPendingAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      sender: 'assistant',
      destinationId: targetDestId,
      text: '',
      timestamp: currentTime,
      status: 'pending',
    };

    // Prepare conversation history payload for multi-turn resolution before adding pending
    const historyPayload: ChatHistoryItem[] = messages
      .filter((m) => m.status === 'success')
      .map((m) => ({
        role: m.sender,
        text: m.text,
        destinationId: m.destinationId,
        recommendations: m.recommendations?.map((r) => ({
          id: r.id,
          name: r.name,
          category: r.category,
          tagline: r.tagline,
          description: r.description,
          highlights: r.highlights,
          sourceTitle: r.sourceTitle,
          sourceUrl: r.sourceUrl,
        })),
      }));

    setMessages((prev) => [...prev, newUserMessage, newPendingAssistantMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          destinationId: targetDestId,
          conversationHistory: historyPayload,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text: data.message || 'No response details received.',
                destinationId: data.targetDestinationId || targetDestId,
                recommendations: data.recommendations || [],
                citations: data.citations || [],
                scopeNotice: data.scopeNotice,
                crossDestinationNotice: data.crossDestinationNotice,
                testScenarioMatched: data.testScenarioMatched,
                status: 'success',
              }
            : msg
        )
      );

      if (data.targetDestinationId && data.targetDestinationId !== activeDestinationId) {
        setActiveDestinationId(data.targetDestinationId);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text:
                  err?.message ||
                  'An error occurred connecting to the Yaaros service. Please verify your connection and try again.',
                status: 'error',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDestination = (destId: DestinationId) => {
    setActiveDestinationId(destId);
  };

  const handleResetSearch = () => {
    setMessages([]);
  };

  const handleRunEvaluationScenario = (prompt: string, targetDestId?: DestinationId) => {
    const dest = targetDestId || activeDestinationId;
    setActiveDestinationId(dest);
    setIsEvaluationOpen(false);
    handleSendMessage(prompt, dest);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EE] text-[#34211C]">
      {/* Luxury Brand Navbar */}
      <Navbar
        onNavigate={() => {}}
        onSelectDestination={handleSelectDestination}
        activeDestinationId={activeDestinationId}
        onOpenTestEvaluation={() => setIsEvaluationOpen(true)}
        hasActiveConversation={messages.length > 0}
        onResetSearch={handleResetSearch}
      />

      {/* Main Experience: One Unified Conversational Travel Assistant */}
      <main className="flex-1">
        <PrimaryConversationalAssistant
          messages={messages}
          isLoading={isLoading}
          activeDestinationId={activeDestinationId}
          onSelectDestination={handleSelectDestination}
          onSendMessage={handleSendMessage}
          onResetSearch={handleResetSearch}
          onOpenEvaluationSuite={() => setIsEvaluationOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenTestEvaluation={() => setIsEvaluationOpen(true)}
        onNavigateTopic={(prompt, destId) => {
          if (destId) setActiveDestinationId(destId);
          handleSendMessage(prompt, destId);
        }}
        onSelectDestination={handleSelectDestination}
      />

      {/* Evaluation Suite Modal (Automated Verification of Tests A through I) */}
      <EvaluationSuiteModal
        isOpen={isEvaluationOpen}
        onClose={() => setIsEvaluationOpen(false)}
        onRunScenario={handleRunEvaluationScenario}
        activeDestinationId={activeDestinationId}
      />
    </div>
  );
}
