'use client';

import React, { useState } from 'react';
import { CopilotMessage, LayerId, SimulationResult } from '@/lib/types';
import {
  ChevronUp,
  ChevronDown,
  Send,
  Sparkles,
  MapPin,
  Search,
  Leaf,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Bot,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'insights' | 'analysis' | 'chat'>('insights');
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const suggestedQuestions = [
    'Why is the western Sajjangarh ridge at high erosion risk?',
    'How does the Swaroop Sagar canal protect Lake Pichola?',
    'Assess the native vegetation cover in this area',
    'What interventions protect Nai village terraces?',
    'Explain the Aravalli Green Wall buffer strategy',
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
    setActiveTab('chat');

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
          contextReferenced: data.mode === 'LIVE_GEMINI' ? 'Google Gemini 2.0 Spatial AI' : 'Aravalli Spatial Analyst',
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
        text: 'Steep regional relief interacting with high-velocity storm discharge. Recommend deploying staggered contour stone bunds.',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 25 }}>
        <button
          onClick={onToggle}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--fine-border)',
            borderRadius: '9999px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--primary-forest)',
          }}
        >
          <Bot size={15} color="var(--primary-forest)" />
          <span>Aravalli Copilot AI</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      className="dharohar-copilot-docked"
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '350px',
        maxHeight: 'calc(100vh - 110px)',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--fine-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.09)',
        zIndex: 25,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          padding: '11px 14px',
          borderBottom: '1px solid rgba(231, 221, 203, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={15} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--primary-text)', lineHeight: 1.2 }}>
              Aravalli Copilot AI
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', lineHeight: 1.2 }}>
              Mewar Watershed Intelligence & GIS AI
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
          title="Collapse Copilot"
        >
          <ChevronUp size={16} />
        </button>
      </div>

      {/* Tabs Row: Insights | Analysis | Chat */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(231, 221, 203, 0.6)',
          padding: '0 14px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          onClick={() => setActiveTab('insights')}
          style={{
            padding: '9px 12px',
            fontSize: '0.76rem',
            fontWeight: activeTab === 'insights' ? 700 : 500,
            color: activeTab === 'insights' ? 'var(--primary-forest)' : 'var(--secondary-text)',
            border: 'none',
            borderBottom: activeTab === 'insights' ? '2px solid var(--primary-forest)' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          Insights
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          style={{
            padding: '9px 12px',
            fontSize: '0.76rem',
            fontWeight: activeTab === 'analysis' ? 700 : 500,
            color: activeTab === 'analysis' ? 'var(--primary-forest)' : 'var(--secondary-text)',
            border: 'none',
            borderBottom: activeTab === 'analysis' ? '2px solid var(--primary-forest)' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          Analysis
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          style={{
            padding: '9px 12px',
            fontSize: '0.76rem',
            fontWeight: activeTab === 'chat' ? 700 : 500,
            color: activeTab === 'chat' ? 'var(--primary-forest)' : 'var(--secondary-text)',
            border: 'none',
            borderBottom: activeTab === 'chat' ? '2px solid var(--primary-forest)' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          Chat
        </button>
      </div>

      {/* Body Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* =====================================================================
            TAB 1: INSIGHTS (Exact match to screenshot)
            ===================================================================== */}
        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Spatial Context Card */}
            <div
              style={{
                padding: '9px 12px',
                backgroundColor: '#F5F8FA',
                border: '1px solid #D6E4EE',
                borderRadius: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={13} color="var(--lake-blue)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                    {selectedFeature?.name || 'Udaipur Study Basin'}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    color: 'var(--lake-blue)',
                    backgroundColor: '#E1EDF5',
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  Spatial Context
                </span>
              </div>
              <div style={{ fontSize: '0.69rem', color: 'var(--secondary-text)', lineHeight: 1.35 }}>
                <div>Selected area: {selectedFeature?.localName || 'Western Sajjangarh Ridge'}</div>
                <div>Layers: 3D Terrain, Vegetation, Erosion Risk</div>
              </div>
            </div>

            {/* Observation */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                <Search size={14} color="var(--lake-blue)" />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary-forest)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  OBSERVATION
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--primary-text)', lineHeight: 1.4, marginTop: '1px' }}>
                  Steep slope gradients (&gt;30°) with sparse vegetation and exposed quartzite rock.
                </div>
              </div>
            </div>

            {/* Cause */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                <Leaf size={14} color="var(--status-positive)" />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--status-positive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CAUSE
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--primary-text)', lineHeight: 1.4, marginTop: '1px' }}>
                  Monsoon cloudbursts and high runoff velocity along fractured lithology, with limited soil cover.
                </div>
              </div>
            </div>

            {/* Risk */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                <AlertTriangle size={14} color="var(--status-error)" />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--status-error)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  RISK
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--primary-text)', lineHeight: 1.4, marginTop: '1px' }}>
                  High sediment yield during intense rainfall events, increasing siltation risk in Lake Pichola.
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                <Lightbulb size={14} color="var(--antique-gold)" />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A67926', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  RECOMMENDATION
                </div>
                <div style={{ fontSize: '0.73rem', color: 'var(--primary-text)', lineHeight: 1.4, marginTop: '1px' }}>
                  Prioritize stone contour bunds and vegetative stabilization along mid-slopes. Implement check dams at 2nd-order stream confluences.
                </div>
              </div>
            </div>

            {/* Show related data link */}
            <div style={{ marginTop: '2px' }}>
              <span
                style={{
                  fontSize: '0.70rem',
                  fontWeight: 600,
                  color: 'var(--primary-forest)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Show related data & references <ArrowRight size={11} />
              </span>
            </div>

            {/* Suggested Questions Strip */}
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(231, 221, 203, 0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.70rem', fontWeight: 700, color: 'var(--primary-text)' }}>
                  Suggested Questions
                </span>
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  style={{ background: 'none', border: 'none', fontSize: '0.66rem', color: 'var(--lake-blue)', cursor: 'pointer', fontWeight: 600 }}
                >
                  {showAllQuestions ? 'Show Less' : 'View All'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(showAllQuestions ? suggestedQuestions : suggestedQuestions.slice(0, 3)).map((q, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSendPrompt(q)}
                    style={{
                      fontSize: '0.71rem',
                      color: 'var(--primary-forest)',
                      cursor: 'pointer',
                      padding: '3px 4px',
                      borderRadius: '4px',
                      lineHeight: 1.3,
                      transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    → {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: ANALYSIS
            ===================================================================== */}
        {activeTab === 'analysis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.73rem' }}>
            <div style={{ backgroundColor: '#F8F6F0', padding: '10px', borderRadius: '6px', border: '1px solid var(--fine-border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-forest)', marginBottom: '4px' }}>Catchment Overview</div>
              <div>Area: 284.5 km²</div>
              <div>Elevation: 577 m – 938 m MSL</div>
              <div>Rainfall: 640 mm/yr</div>
            </div>
            {simulationResult && (
              <div style={{ backgroundColor: '#EBF5FA', padding: '10px', borderRadius: '6px', border: '1px solid #C4DCEB' }}>
                <div style={{ fontWeight: 700, color: 'var(--lake-blue)', marginBottom: '4px' }}>Hydrologic Simulation</div>
                <div>Peak Discharge: {simulationResult.peakDischargeCms} m³/s</div>
                <div>Erosion Volume: {simulationResult.erosionVolumeTons?.toLocaleString()} tonnes</div>
                <div>Storage Inflow: {simulationResult.lakeInflowVolumeMcm} MCM</div>
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 3: CHAT
            ===================================================================== */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  backgroundColor: m.sender === 'user' ? 'var(--primary-forest)' : '#F8F6F0',
                  color: m.sender === 'user' ? '#FFFFFF' : 'var(--primary-text)',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                {m.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ fontSize: '0.70rem', color: 'var(--secondary-text)' }}>
                Analyzing spatial layers...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Chat Input */}
      <div
        style={{
          padding: '8px 10px',
          borderTop: '1px solid rgba(231, 221, 203, 0.6)',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Sparkles size={14} color="var(--antique-gold)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Ask a question about this area..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendPrompt(inputPrompt);
          }}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.74rem',
            color: 'var(--primary-text)',
            backgroundColor: 'transparent',
          }}
        />
        <button
          onClick={() => handleSendPrompt(inputPrompt)}
          disabled={!inputPrompt.trim() || isLoading}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: inputPrompt.trim() && !isLoading ? 'var(--primary-forest)' : '#D1D5DB',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputPrompt.trim() && !isLoading ? 'pointer' : 'default',
            color: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Send size={12} />
        </button>
      </div>
    </aside>
  );
};
