'use client';

import React, { useState } from 'react';
import { CopilotMessage, LayerId, SimulationResult } from '@/lib/types';
import { Bot, ChevronDown, ChevronRight, Compass, HelpCircle, Send, Sparkles, X } from 'lucide-react';

interface AravalliCopilotProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedFeature: any | null;
  simulationResult: SimulationResult | null;
  activeLayers: Record<LayerId, boolean>;
  apiKey?: string;
}

export const AravalliCopilot: React.FC<AravalliCopilotProps> = ({
  isOpen,
  onToggle,
  selectedFeature,
  simulationResult,
  activeLayers,
  apiKey,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      timestamp: 'Just now',
      structured: {
        observation: 'Udaipur Basin Catchment initialized with 10 environmental layers active. Critical soil erosion hotspot identified on Sajjangarh western ridge.',
        cause: 'Steep slope gradients (>30°) coupled with dry scrub vegetation canopy deficit along quartzite rock fractures.',
        risk: 'Direct sediment yield during monsoon cloudbursts accelerates siltation in the Sisarma tributary debouching into Lake Pichola.',
        recommendation: 'Prioritize stone contour bunds along mid-slopes and loose-boulder check dams at 2nd-order stream confluences.',
      },
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Why is the western Sajjangarh ridge at critical erosion risk?',
    'How does Swaroop Sagar canal protect Lake Pichola from flooding?',
    'Assess marble mining degradation at Sukher-Amberi ridge gap',
    'What interventions protect Nai village terraced smallholders?',
    'Explain the Aravalli Green Wall anti-desertification buffer',
  ];

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const activeLayerNames = Object.entries(activeLayers)
        .filter(([_, active]) => active)
        .map(([id]) => id);

      const locationContext = selectedFeature
        ? {
            name: selectedFeature.name || selectedFeature.localName,
            latitude: selectedFeature.latitude,
            longitude: selectedFeature.longitude,
            zoneType: selectedFeature.type,
          }
        : undefined;

      const simulationContext = simulationResult
        ? {
            peakDischargeCms: simulationResult.peakDischargeCms,
            erosionTons: simulationResult.erosionVolumeTons,
            lakeInflowMcm: simulationResult.lakeInflowVolumeMcm,
          }
        : undefined;

      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          locationContext,
          simulationContext,
          activeLayers: activeLayerNames,
          apiKey,
        }),
      });

      const data = await res.json();

      if (data.success && data.response) {
        const aiMsg: CopilotMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: 'Just now',
          structured: data.response,
          contextReferenced: data.mode === 'LIVE_GEMINI' ? 'Google Gemini 2.0' : 'Aravalli Spatial Analyst Engine',
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('Could not parse response');
      }
    } catch (err) {
      const fallbackMsg: CopilotMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        timestamp: 'Just now',
        structured: {
          observation: 'Hydraulic convergence observed across the Sisarma drainage corridor.',
          cause: 'Steep regional relief interacting with high-velocity storm discharge.',
          risk: 'Severe field gullying and sediment delivery into Lake Pichola delta.',
          recommendation: 'Deploy staggered contour trenches and indigenous Dhok afforestation.',
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: isOpen ? '360px' : 'auto',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-card)',
      backdropFilter: 'blur(10px)',
      zIndex: 25,
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 'calc(100vh - 120px)',
    }}>
      {/* Top Header */}
      <div
        onClick={onToggle}
        style={{
          padding: '10px 14px',
          borderBottom: isOpen ? '1px solid var(--border-subtle)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: isOpen ? 'var(--bg-card)' : 'transparent',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: 'var(--color-forest)',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}>
            <Sparkles size={13} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-forest)' }}>
              ARAVALLI COPILOT
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-tertiary)' }}>
              Environmental Reasoning Analyst
            </div>
          </div>
        </div>

        <button className="btn btn-ghost" style={{ padding: '2px 4px' }}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Main Copilot Content */}
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {/* Active spatial context indicator banner */}
          <div style={{
            padding: '6px 12px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '0.70rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span>
              Active Focus: <strong>{selectedFeature ? selectedFeature.name : 'Udaipur Study Basin'}</strong>
            </span>
            <span className="badge badge-observed" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
              Spatial Context
            </span>
          </div>

          {/* Messages scroll area */}
          <div style={{ padding: '12px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m) => (
              <div key={m.id}>
                {m.sender === 'user' ? (
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    borderLeft: '3px solid var(--color-forest)',
                    marginBottom: '4px',
                  }}>
                    {m.text}
                  </div>
                ) : (
                  <div style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-card)',
                    boxShadow: 'var(--shadow-subtle)',
                    fontSize: '0.76rem',
                    lineHeight: 1.45,
                  }}>
                    {m.contextReferenced && (
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-forest)' }} />
                        {m.contextReferenced}
                      </div>
                    )}

                    {m.structured ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', letterSpacing: '0.04em' }}>
                            OBSERVATION
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}>{m.structured.observation}</span>
                        </div>

                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-olive)', textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', letterSpacing: '0.04em' }}>
                            CAUSE
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}>{m.structured.cause}</span>
                        </div>

                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-terracotta)', textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', letterSpacing: '0.04em' }}>
                            RISK
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}>{m.structured.risk}</span>
                        </div>

                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-forest)', textTransform: 'uppercase', fontSize: '0.68rem', display: 'block', letterSpacing: '0.04em' }}>
                            RECOMMENDATION
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>{m.structured.recommendation}</span>
                        </div>
                      </div>
                    ) : (
                      <p>{m.text}</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{
                padding: '10px',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span className="pulse-ring">Analyzing spatial terrain & hydrological tensors...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Chips */}
          <div style={{ padding: '6px 10px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(q)}
                style={{
                  fontSize: '0.66rem',
                  padding: '3px 7px',
                  borderRadius: '3px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Prompt input row */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Ask environmental analyst..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt(inputPrompt)}
              style={{
                flex: 1,
                padding: '6px 10px',
                fontSize: '0.78rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-strong)',
                backgroundColor: 'var(--bg-primary)',
              }}
            />
            <button
              onClick={() => handleSendPrompt(inputPrompt)}
              className="btn btn-primary"
              style={{ padding: '6px 10px' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
