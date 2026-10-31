'use client';

import React, { useState } from 'react';
import { Search, Box, Map, Columns } from 'lucide-react';

interface MapTopBarProps {
  isCopilotOpen: boolean;
  onSearch?: (query: string) => void;
  activeMode?: '3d' | '2d' | 'split';
  onChangeMode?: (mode: '3d' | '2d' | 'split') => void;
}

export const MapTopBar: React.FC<MapTopBarProps> = ({
  isCopilotOpen,
  onSearch,
  activeMode = '3d',
  onChangeMode,
}) => {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(query);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '12px',
        left: '304px', // Right next to LayerPanel
        right: isCopilotOpen ? 'calc(min(360px, 100vw - 24px) + 32px)' : '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {/* Search Input Bar */}
      <div
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--fine-border)',
          borderRadius: '9999px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          width: 'min(320px, 100%)',
          maxWidth: '320px',
          flex: '1 1 260px',
        }}
      >
        <Search size={14} color="var(--secondary-text)" />
        <input
          type="text"
          placeholder="Search location, village, ridge..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '0.78rem',
            color: 'var(--primary-text)',
            width: '100%',
          }}
        />
      </div>

      {/* Mode Switches: 3D View | 2D Map | Split View */}
      <div
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          flex: '0 0 auto',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--fine-border)',
          borderRadius: '9999px',
          padding: '3px 5px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        }}
      >
        <button
          onClick={() => onChangeMode?.('3d')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            fontSize: '0.73rem',
            fontWeight: activeMode === '3d' ? 700 : 500,
            backgroundColor: activeMode === '3d' ? 'var(--primary-forest)' : 'transparent',
            color: activeMode === '3d' ? '#FFFFFF' : 'var(--primary-text)',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}
        >
          <Box size={13} />
          <span>3D View</span>
        </button>

        <button
          onClick={() => onChangeMode?.('2d')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            fontSize: '0.73rem',
            fontWeight: activeMode === '2d' ? 700 : 500,
            backgroundColor: activeMode === '2d' ? 'var(--primary-forest)' : 'transparent',
            color: activeMode === '2d' ? '#FFFFFF' : 'var(--primary-text)',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}
        >
          <Map size={13} />
          <span>2D Map</span>
        </button>

        <button
          onClick={() => onChangeMode?.('split')}
          className="apple-pressable"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            fontSize: '0.73rem',
            fontWeight: activeMode === 'split' ? 700 : 500,
            backgroundColor: activeMode === 'split' ? 'var(--primary-forest)' : 'transparent',
            color: activeMode === 'split' ? '#FFFFFF' : 'var(--primary-text)',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
          }}
        >
          <Columns size={13} />
          <span>Split View</span>
        </button>
      </div>
    </div>
  );
};
