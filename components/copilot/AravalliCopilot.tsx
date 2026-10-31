'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CopilotMessage, LayerId, SimulationResult } from '@/lib/types';
import {
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
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface AravalliCopilotProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedFeature: any | null;
  simulationResult: SimulationResult | null;
  activeLayers: Record<LayerId, boolean>;
  apiKey?: string;
  externalPrompt?: string | null;
  onClearExternalPrompt?: () => void;
}

export const AravalliCopilot: React.FC<AravalliCopilotProps> = ({
  isOpen,
  onToggle,
  selectedFeature,
  simulationResult,
  activeLayers,
  apiKey,
  externalPrompt,
  onClearExternalPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'analysis' | 'chat'>('insights');
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      timestamp: 'Active',
      text: 'Hi! I’m Gemini. Ask me anything about the Aravalli ecosystem, watershed, or your current map context.',
      contextReferenced: 'Gemini Chat',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [requestError, setRequestError] = useState('');
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic latest insight for the Insights Tab
  const [latestInsight, setLatestInsight] = useState<{
    observation: string;
    cause: string;
    risk: string;
    recommendation: string;
  }>({
    observation: 'Steep slope gradients (>30°) with sparse vegetation and exposed quartzite rock.',
    cause: 'Monsoon cloudbursts and high runoff velocity along fractured lithology, with limited soil cover.',
    risk: 'High sediment yield during intense rainfall events, increasing siltation risk in Lake Pichola.',
    recommendation: 'Prioritize stone contour bunds and vegetative stabilization along mid-slopes. Implement check dams at 2nd-order stream confluences.',
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Why is the western Sajjangarh ridge at high erosion risk?',
    'How does the Swaroop Sagar canal protect Lake Pichola?',
    'Assess the native vegetation cover in this area',
    'What interventions protect Nai village terraces?',
    'Explain the Aravalli Green Wall buffer strategy',
  ];

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activeTab]);

  // Handle external prompts triggered from other modules (e.g. Silt Economy, Farm Intelligence, Feature Drawer)
  useEffect(() => {
    if (externalPrompt && externalPrompt.trim()) {
      setActiveTab('chat');
      handleSendPrompt(externalPrompt, 'chat');
      onClearExternalPrompt?.();
    }
  }, [externalPrompt]);

  // Update Insights when a feature is selected on the 3D map
  useEffect(() => {
    if (selectedFeature) {
      if (selectedFeature.type === 'FARM') {
        setLatestInsight({
          observation: `${selectedFeature.name || 'Farm parcel'} in ${selectedFeature.localName || 'Udaipur catchment'} under active cultivation (${selectedFeature.cropType || 'Kharif / Rabi'}).`,
          cause: 'Topsoil compaction and high slope runoff accelerate nutrient leaching during torrential downpours.',
          risk: `Topsoil erosion rate estimated at ${selectedFeature.soilLossRateTonHaYear || 18.5} t/ha/yr without conservation bunds.`,
          recommendation: 'Deploy staggered field-edge stone bunds and introduce lake-desilted nutrient-rich silt for organic carbon restoration.',
        });
      } else if (selectedFeature.name?.includes('Pichola') || selectedFeature.name?.includes('Fateh')) {
        setLatestInsight({
          observation: `${selectedFeature.name} storage level monitored with active catchment siltation risk.`,
          cause: 'Sisarma river and tributary drainage networks debouch upstream runoff into lake basins.',
          risk: 'Accumulated silt encroaches on dead storage capacity, accelerating summer evaporation losses.',
          recommendation: 'Maintain upstream silt retention basins and regulate Swaroop Sagar inter-connecting canal gates.',
        });
      }
    }
  }, [selectedFeature]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSendPrompt = async (
    promptText: string,
    mode: 'insights' | 'analysis' | 'chat' = activeTab
  ) => {
    if (!promptText.trim() || isLoading) return;

    setRequestError('');
    if (mode === 'chat') {
      const userMsg: CopilotMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: promptText,
      };
      setMessages((prev) => [...prev, userMsg]);
    }
    setInputPrompt('');
    setIsLoading(true);

    try {
      const activeLayerNames = Object.entries(activeLayers || {})
        .filter(([_, active]) => active)
        .map(([id]) => id);

      const locationContext = selectedFeature
        ? {
            name: selectedFeature.name || selectedFeature.localName,
            latitude: selectedFeature.latitude,
            longitude: selectedFeature.longitude,
            elevationMeters: selectedFeature.elevationMeters,
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
          mode,
          history:
            mode === 'chat'
              ? messages
                  .filter((message) => message.id !== 'welcome-1' && message.text)
                  .slice(-12)
                  .map((message) => ({
                    role: message.sender === 'user' ? 'user' : 'model',
                    text: message.text || '',
                  }))
              : undefined,
          locationContext,
          simulationContext,
          activeLayers: activeLayerNames,
          apiKey,
        }),
      });

      const data = await res.json();

      const hasExpectedResponse =
        mode === 'insights'
          ? typeof data.response === 'object' && data.response !== null
          : typeof data.response === 'string' && data.response.trim().length > 0;

      if (data.success && hasExpectedResponse) {
        if (mode === 'insights' && typeof data.response === 'object') {
          setLatestInsight(data.response);
        } else if (mode === 'analysis' && typeof data.response === 'string') {
          setAnalysisResult(data.response);
        } else if (mode === 'chat') {
          const aiMsg: CopilotMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: typeof data.response === 'string' ? data.response : data.rawText,
            contextReferenced: data.mode === 'LIVE_GEMINI' ? 'Gemini' : 'Local Analyst',
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
      } else {
        throw new Error(data.error || 'Could not parse response');
      }
    } catch (err: any) {
      console.warn('Copilot request fallback:', err);
      setRequestError(err instanceof Error ? err.message : 'Please try again.');
      if (mode === 'chat') {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `I couldn’t get a response just now. ${err instanceof Error ? err.message : 'Please try again.'}`,
            contextReferenced: 'Connection issue',
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: 70 }}>
        <button
          onClick={onToggle}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 16px',
            backgroundColor: 'var(--primary-forest)',
            border: '1px solid var(--primary-forest)',
            borderRadius: '9999px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.22)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#FFFFFF',
          }}
          title="Open Dharohar AI"
        >
          <Bot size={17} color="#FFFFFF" />
          <span>Dharohar AI</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      className="dharohar-copilot-docked"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        width: 'min(360px, calc(100vw - 24px))',
        maxHeight: 'calc(100dvh - 40px)',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--fine-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        zIndex: 70,
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
          backgroundColor: '#FFFFFF',
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
              Dharohar AI
            </div>
            <div style={{ fontSize: '0.66rem', color: 'var(--secondary-text)', lineHeight: 1.2 }}>
              {activeTab === 'insights'
                ? 'Watershed Insights AI'
                : activeTab === 'analysis'
                  ? 'Technical Analysis AI'
                  : 'Gemini Conversational Chat'}
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)', padding: '2px' }}
          title="Collapse Copilot"
        >
          <ChevronDown size={16} />
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
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span>Chat</span>
          {messages.length > 1 && (
            <span
              style={{
                fontSize: '0.62rem',
                backgroundColor: 'var(--primary-forest)',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '1px 5px',
              }}
            >
              {messages.length}
            </span>
          )}
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
            TAB 1: INSIGHTS
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
                <div>Active layers: 3D Terrain, Vegetation, Erosion Risk</div>
              </div>
            </div>

            <button
              onClick={() =>
                handleSendPrompt(
                  `Give me the most important watershed insight for ${selectedFeature?.name || 'the Udaipur Basin'} using the active map layers and current simulation context.`,
                  'insights'
                )
              }
              disabled={isLoading}
              style={{
                padding: '7px 10px',
                backgroundColor: 'var(--primary-forest)',
                color: '#FFFFFF',
                borderRadius: '6px',
                border: 'none',
                cursor: isLoading ? 'wait' : 'pointer',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              <Sparkles size={13} />
              {isLoading ? 'Generating Insights...' : 'Generate Watershed Insights'}
            </button>

            {requestError && activeTab === 'insights' && (
              <div role="alert" style={{ color: 'var(--status-error)', fontSize: '0.7rem' }}>
                Could not generate insights: {requestError}
              </div>
            )}

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
                  {latestInsight.observation}
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
                  {latestInsight.cause}
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
                  {latestInsight.risk}
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
                  {latestInsight.recommendation}
                </div>
              </div>
            </div>

            {/* Switch to Chat link */}
            <div style={{ marginTop: '2px' }}>
              <span
                onClick={() => setActiveTab('chat')}
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
                Discuss with Copilot AI in Chat <ArrowRight size={11} />
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
                    onClick={() => handleSendPrompt(q, 'insights')}
                    style={{
                      fontSize: '0.71rem',
                      color: 'var(--primary-forest)',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      lineHeight: 1.3,
                      transition: 'background-color 0.12s ease',
                      backgroundColor: '#FAF8F4',
                      border: '1px solid rgba(231, 221, 203, 0.4)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-sandstone)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
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
              <div>Annual Rainfall Baseline: 640 mm/yr</div>
              <div>Primary Lithology: Fractured Quartzite & Phyllites</div>
            </div>

            {simulationResult ? (
              <div style={{ backgroundColor: '#EBF5FA', padding: '10px', borderRadius: '6px', border: '1px solid #C4DCEB' }}>
                <div style={{ fontWeight: 700, color: 'var(--lake-blue)', marginBottom: '4px' }}>Hydrologic Simulation</div>
                <div>Peak Discharge: {simulationResult.peakDischargeCms} m³/s</div>
                <div>Erosion Volume: {simulationResult.erosionVolumeTons?.toLocaleString()} tonnes</div>
                <div>Storage Inflow: {simulationResult.lakeInflowVolumeMcm} MCM</div>
                <div>Erosion Risk Index: {simulationResult.erosionRiskLevel}</div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#F5F8FA', padding: '10px', borderRadius: '6px', border: '1px solid #D6E4EE', color: 'var(--secondary-text)' }}>
                <div>No active storm simulation yet. Run the Monsoon Simulator or ask Copilot to project rainfall impacts.</div>
              </div>
            )}

            {analysisResult && (
              <div
                style={{
                  backgroundColor: '#FCFAF6',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--fine-border)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                }}
              >
                {analysisResult}
              </div>
            )}

            {requestError && activeTab === 'analysis' && (
              <div role="alert" style={{ color: 'var(--status-error)' }}>
                Could not complete analysis: {requestError}
              </div>
            )}

            <button
              onClick={() => handleSendPrompt(`Provide a technical geological and hydrological analysis for ${selectedFeature?.name || 'the Udaipur Basin'}, using the available catchment, active-layer, and simulation data. State assumptions and data limitations.`, 'analysis')}
              disabled={isLoading}
              style={{
                marginTop: '4px',
                padding: '7px 10px',
                backgroundColor: 'var(--primary-forest)',
                color: '#FFFFFF',
                borderRadius: '6px',
                border: 'none',
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={13} />
              {isLoading ? 'Analyzing...' : 'Run Technical Analysis'}
            </button>
          </div>
        )}

        {/* =====================================================================
            TAB 3: CHAT (Structured 4-part Cards + Conversations)
            ===================================================================== */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {requestError && (
              <div role="alert" style={{ color: 'var(--status-error)', fontSize: '0.7rem' }}>
                {requestError}
              </div>
            )}
            {messages.map((m) => {
              if (m.sender === 'user') {
                return (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: 'flex-end',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '2px',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '12px 12px 2px 12px',
                        fontSize: '0.74rem',
                        backgroundColor: 'var(--primary-forest)',
                        color: '#FFFFFF',
                        lineHeight: 1.4,
                        wordBreak: 'break-word',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      {m.text}
                    </div>
                    <span style={{ fontSize: '0.60rem', color: 'var(--secondary-text)', paddingRight: '4px' }}>
                      {m.timestamp}
                    </span>
                  </div>
                );
              }

              // AI Message Rendering
              const fullFormattedText = m.structured
                ? `OBSERVATION:\n${m.structured.observation}\n\nCAUSE:\n${m.structured.cause}\n\nRISK:\n${m.structured.risk}\n\nRECOMMENDATION:\n${m.structured.recommendation}`
                : m.text || '';

              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: 'flex-start',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {/* Sender Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-forest)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Bot size={10} color="#FFFFFF" />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--primary-forest)' }}>
                        {m.contextReferenced?.includes('Gemini') ? 'Gemini' : 'Aravalli Copilot'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {m.contextReferenced && (
                        <span
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 600,
                            color: m.contextReferenced.includes('Gemini') ? '#1A73E8' : 'var(--primary-forest)',
                            backgroundColor: m.contextReferenced.includes('Gemini') ? '#E8F0FE' : '#EAEFE9',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {m.contextReferenced}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyMessage(m.id, fullFormattedText)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', color: 'var(--secondary-text)' }}
                        title="Copy Response"
                      >
                        {copiedId === m.id ? <Check size={11} color="#2E7D32" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>

                  {/* Structured 4-Part Response Cards */}
                  {m.structured ? (
                    <div
                      style={{
                        backgroundColor: '#FCFAF6',
                        border: '1px solid var(--fine-border)',
                        borderRadius: '8px',
                        padding: '10px 11px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '9px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      }}
                    >
                      {/* Observation */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                          <Search size={13} color="var(--lake-blue)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--lake-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Observation
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--primary-text)', lineHeight: 1.38, marginTop: '1px' }}>
                            {m.structured.observation}
                          </div>
                        </div>
                      </div>

                      {/* Cause */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                          <Leaf size={13} color="var(--status-positive)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--status-positive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Cause
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--primary-text)', lineHeight: 1.38, marginTop: '1px' }}>
                            {m.structured.cause}
                          </div>
                        </div>
                      </div>

                      {/* Risk */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                          <AlertTriangle size={13} color="var(--status-error)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--status-error)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Risk
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--primary-text)', lineHeight: 1.38, marginTop: '1px' }}>
                            {m.structured.risk}
                          </div>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px' }}>
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                          <Lightbulb size={13} color="var(--antique-gold)" />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#A67926', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Recommendation
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--primary-text)', lineHeight: 1.38, marginTop: '1px' }}>
                            {m.structured.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Plain text bubble */
                    <div
                      style={{
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '0.74rem',
                        backgroundColor: '#F8F6F0',
                        border: '1px solid var(--fine-border)',
                        color: 'var(--primary-text)',
                        lineHeight: 1.45,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {m.text}
                    </div>
                  )}

                  <span style={{ fontSize: '0.60rem', color: 'var(--secondary-text)', paddingLeft: '4px' }}>
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#F5F8FA',
                  border: '1px solid #D6E4EE',
                  fontSize: '0.72rem',
                  color: 'var(--primary-forest)',
                }}
              >
                <Sparkles size={14} color="var(--antique-gold)" style={{ animation: 'spin 2s linear infinite' }} />
                <span>Analyzing spatial layers & terrain physics...</span>
              </div>
            )}

            {/* Suggested quick chips */}
            {!isLoading && messages.length > 0 && (
              <div style={{ marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed rgba(231, 221, 203, 0.6)' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--secondary-text)', marginBottom: '5px' }}>
                  Quick Follow-ups:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {suggestedQuestions.slice(0, 3).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendPrompt(q, 'chat')}
                      style={{
                        fontSize: '0.66rem',
                        padding: '3px 7px',
                        backgroundColor: '#FAF8F4',
                        border: '1px solid var(--fine-border)',
                        borderRadius: '12px',
                        color: 'var(--primary-forest)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      + {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
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
          placeholder={
            activeTab === 'insights'
              ? 'Ask for a watershed insight...'
              : activeTab === 'analysis'
                ? 'Ask for a technical analysis...'
                : 'Ask Gemini anything...'
          }
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendPrompt(inputPrompt, activeTab);
          }}
          disabled={isLoading}
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
          onClick={() => handleSendPrompt(inputPrompt, activeTab)}
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
          title="Send query"
        >
          <Send size={12} />
        </button>
      </div>
    </aside>
  );
};
