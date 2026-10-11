'use client';

import React, { useState } from 'react';
import { CAUSE_EFFECT_TRACE } from '@/lib/geo-data';
import { TraceStep } from '@/lib/types';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Compass, GitCommit, MapPin } from 'lucide-react';

interface CauseEffectExplorerProps {
  onFlyToStep: (step: TraceStep) => void;
  onOpenMap: () => void;
}

export const CauseEffectExplorer: React.FC<CauseEffectExplorerProps> = ({
  onFlyToStep,
  onOpenMap,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = CAUSE_EFFECT_TRACE[currentStepIndex];

  const handleSelectStep = (index: number) => {
    setCurrentStepIndex(index);
    onFlyToStep(CAUSE_EFFECT_TRACE[index]);
  };

  const handleNext = () => {
    if (currentStepIndex < CAUSE_EFFECT_TRACE.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onFlyToStep(CAUSE_EFFECT_TRACE[nextIndex]);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      onFlyToStep(CAUSE_EFFECT_TRACE[prevIndex]);
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px 20px',
    }}>
      {/* Editorial Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-observed">Spatial Causal Diagnostics</span>
          <span className="badge badge-modeled">Ridge-to-Lake System</span>
        </div>
        <h2 className="serif-title" style={{ fontSize: '1.8rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
          Trace the Problem: Spatial Mechanics of Catchment Degradation
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '780px' }}>
          Environmental challenges in Southern Rajasthan are connected across topography. Silt deposition in Lake Pichola does not originate in the water body—it is born 14 kilometers upstream on de-vegetated Aravalli ridge escarpments. Follow the physical pathway from ridge to lake below.
        </p>
      </div>

      {/* Interactive Step Timeline Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${CAUSE_EFFECT_TRACE.length}, 1fr)`,
        gap: '8px',
        marginBottom: '24px',
      }}>
        {CAUSE_EFFECT_TRACE.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;
          return (
            <div
              key={step.step}
              onClick={() => handleSelectStep(idx)}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-xs)',
                border: isActive ? '1.5px solid var(--color-terracotta)' : '1px solid var(--border-subtle)',
                backgroundColor: isActive ? 'var(--color-terracotta-bg)' : isPassed ? 'var(--bg-secondary)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="mono-text" style={{ fontSize: '0.70rem', fontWeight: 600, color: isActive ? 'var(--color-terracotta)' : 'var(--text-tertiary)' }}>
                  STAGE 0{step.step}
                </span>
                {isPassed && <CheckCircle2 size={12} color="var(--color-forest)" />}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: isActive ? 600 : 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Focus Card for Current Step */}
      <div className="editorial-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-simulated" style={{ fontSize: '0.72rem' }}>
                Step {currentStep.step} of {CAUSE_EFFECT_TRACE.length}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                <MapPin size={13} color="var(--color-terracotta)" />
                {currentStep.locationName}
              </span>
            </div>
            <h3 className="serif-title" style={{ fontSize: '1.45rem', color: 'var(--color-terracotta)' }}>
              {currentStep.title}
            </h3>
          </div>

          <button
            onClick={() => {
              onFlyToStep(currentStep);
              onOpenMap();
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            <Compass size={14} />
            Fly 3D Camera to Node
          </button>
        </div>

        {/* Causal Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div className="editorial-card-subtle">
            <div style={{ fontSize: '0.70rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '4px' }}>
              Observed Phenomenon
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {currentStep.phenomenon}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {currentStep.physicalProcess}
            </div>
          </div>

          <div className="editorial-card-subtle">
            <div style={{ fontSize: '0.70rem', textTransform: 'uppercase', color: 'var(--color-terracotta)', fontWeight: 600, marginBottom: '4px' }}>
              Ecological & Human Consequence
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
              {currentStep.consequence}
            </div>
          </div>

          <div className="editorial-card-subtle" style={{ backgroundColor: 'var(--color-forest-bg)', borderColor: '#CFDCD3' }}>
            <div style={{ fontSize: '0.70rem', textTransform: 'uppercase', color: 'var(--color-forest)', fontWeight: 600, marginBottom: '4px' }}>
              Recommended Engineering Action
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-forest-light)', lineHeight: 1.45 }}>
              {currentStep.recommendation}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="btn btn-secondary"
            style={{ opacity: currentStepIndex === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
            Previous Node
          </button>

          <span className="mono-text" style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            [ Lat: {currentStep.latitude.toFixed(4)}°N | Lon: {currentStep.longitude.toFixed(4)}°E ]
          </span>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === CAUSE_EFFECT_TRACE.length - 1}
            className="btn btn-primary"
            style={{ opacity: currentStepIndex === CAUSE_EFFECT_TRACE.length - 1 ? 0.4 : 1 }}
          >
            Next Causal Node
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
