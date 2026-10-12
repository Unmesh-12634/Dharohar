'use client';

import React, { useState } from 'react';
import { DEFAULT_FIELD_MISSIONS } from '@/lib/geo-data';
import { FieldMission, FieldObservation } from '@/lib/types';
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  Compass,
  Download,
  FileCheck,
  FileText,
  Filter,
  MapPin,
  Pencil,
  Plus,
  Printer,
  Shield,
  ShieldAlert,
  Sparkles,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';

interface FieldActionNetworkProps {
  onFlyToLocation?: (coords: { latitude: number; longitude: number; height?: number }) => void;
  externalNewMissions?: FieldMission[];
}

export const FieldActionNetwork: React.FC<FieldActionNetworkProps> = ({
  onFlyToLocation,
  externalNewMissions = [],
}) => {
  const [missions, setMissions] = useState<FieldMission[]>([
    ...externalNewMissions,
    ...DEFAULT_FIELD_MISSIONS,
  ]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedMission, setSelectedMission] = useState<FieldMission | null>(null);
  const [isVerifyingModalOpen, setIsVerifyingModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Form State for Ground Observation Input
  const [inspectorName, setInspectorName] = useState('Rajesh Meena');
  const [organization, setOrganization] = useState('Girwa Watershed Development Cell');
  const [measuredDepth, setMeasuredDepth] = useState('2.4');
  const [measuredWidth, setMeasuredWidth] = useState('4.8');
  const [soilCompaction, setSoilCompaction] = useState<'Loose / Highly Friable' | 'Moderate' | 'Hard Baked / Crusted'>('Loose / Highly Friable');
  const [soilMoisture, setSoilMoisture] = useState<'Desiccated' | 'Damp' | 'Waterlogged'>('Desiccated');
  const [stoneAvailable, setStoneAvailable] = useState(true);
  const [communityNotes, setCommunityNotes] = useState('Local smallholders confirmed seasonal gully widening; requested check dam before upcoming monsoon.');
  const [fieldNotes, setFieldNotes] = useState('Subangular quartzite scree on bedrock; ideal foundation anchor for loose stone check dam.');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80');

  // Filtered Missions
  const filteredMissions = missions.filter((m) => {
    if (filterStatus === 'ALL') return true;
    return m.status === filterStatus;
  });

  const handleOpenVerifyModal = (mission: FieldMission) => {
    setSelectedMission(mission);
    if (mission.fieldObservations) {
      setInspectorName(mission.fieldObservations.inspectorName);
      setOrganization(mission.fieldObservations.organization);
      setMeasuredDepth(mission.fieldObservations.measuredGullyDepthM.toString());
      setMeasuredWidth(mission.fieldObservations.measuredGullyWidthM.toString());
      setSoilCompaction(mission.fieldObservations.soilCompaction);
      setSoilMoisture(mission.fieldObservations.soilMoistureObserved);
      setStoneAvailable(mission.fieldObservations.stoneAvailabilityNearby);
      setCommunityNotes(mission.fieldObservations.communityConsulted);
      setFieldNotes(mission.fieldObservations.fieldNotes);
      if (mission.fieldObservations.photoUrl) {
        setUploadedPhotoUrl(mission.fieldObservations.photoUrl);
      }
    }
    setIsVerifyingModalOpen(true);
  };

  const handleSaveVerification = () => {
    if (!selectedMission) return;

    const newObservation: FieldObservation = {
      inspectorName,
      organization,
      inspectionDate: new Date().toISOString().split('T')[0],
      measuredGullyDepthM: parseFloat(measuredDepth) || 2.0,
      measuredGullyWidthM: parseFloat(measuredWidth) || 4.0,
      soilCompaction,
      soilMoistureObserved: soilMoisture,
      stoneAvailabilityNearby: stoneAvailable,
      communityConsulted: communityNotes,
      recommendedMeasure: selectedMission.suggestedAction,
      fieldNotes,
      photoUploaded: true,
      photoUrl: uploadedPhotoUrl,
    };

    setMissions((prev) =>
      prev.map((m) =>
        m.id === selectedMission.id
          ? {
              ...m,
              status: 'VERIFIED',
              updatedAt: new Date().toISOString().split('T')[0],
              fieldObservations: newObservation,
            }
          : m
      )
    );

    setIsVerifyingModalOpen(false);
  };

  const handleOpenReport = (mission: FieldMission) => {
    setSelectedMission(mission);
    setIsReportModalOpen(true);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '28px 24px 60px',
      color: 'var(--text-primary)',
    }}>
      {/* Editorial Header */}
      <div style={{
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-observed">
              <UserCheck size={12} style={{ marginRight: '4px' }} />
              Ground Action Feedback Loop
            </span>
            <span className="badge badge-live">Digital Twin ⇄ Field Teams</span>
            <span className="badge" style={{ backgroundColor: '#EFEBE2', color: '#555C58' }}>
              Panchayat Level Dispatch
            </span>
          </div>
          <h2 className="serif-title" style={{ fontSize: '1.95rem', color: 'var(--color-forest)', marginBottom: '6px' }}>
            Field Action Network & Ground Verification
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '820px', lineHeight: 1.55 }}>
            A digital twin does not build check dams or restore topsoil by itself.
            The Field Action Network turns satellite and hydrologic risk models into physical inspection tasks for watershed officers, recorded GPS coordinates, verified soil conditions, and photographic evidence that update the twin&apos;s calibration.
          </p>
        </div>

        {/* Stats Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'var(--bg-card)',
          padding: '10px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-subtle)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Total Tasks</div>
            <div className="mono-text" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-forest)' }}>
              {missions.length}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Verified Evidence</div>
            <div className="mono-text" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-lake)' }}>
              {missions.filter((m) => m.status === 'VERIFIED').length}
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>Pending Field Audit</div>
            <div className="mono-text" style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-terracotta)' }}>
              {missions.filter((m) => m.status === 'PENDING_INSPECTION').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        padding: '8px 12px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} color="var(--text-tertiary)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '6px' }}>
            Filter Tasks:
          </span>
          {(['ALL', 'CRITICAL', 'PENDING_INSPECTION', 'IN_PROGRESS', 'VERIFIED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.74rem',
                fontWeight: filterStatus === status ? 600 : 400,
                backgroundColor: filterStatus === status ? 'var(--color-forest-bg)' : 'transparent',
                color: filterStatus === status ? 'var(--color-forest)' : 'var(--text-secondary)',
                border: filterStatus === status ? '1px solid var(--color-forest)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              {status === 'ALL'
                ? 'All Tasks'
                : status === 'CRITICAL'
                ? 'Critical Only'
                : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
          Showing {filteredMissions.length} of {missions.length} field missions
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {filteredMissions.map((mission) => {
          const isVerified = mission.status === 'VERIFIED';
          return (
            <div
              key={mission.id}
              className="editorial-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isVerified ? '1.5px solid rgba(42, 102, 62, 0.45)' : '1px solid var(--border-subtle)',
                backgroundColor: isVerified ? 'rgba(238, 245, 240, 0.5)' : 'var(--bg-card)',
                padding: '20px',
              }}
            >
              <div>
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="mono-text" style={{ fontSize: '0.70rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>
                      {mission.id}
                    </span>
                    <span className={`badge ${mission.priority === 'CRITICAL' ? 'badge-risk' : 'badge-modeled'}`}>
                      {mission.priority}
                    </span>
                  </div>

                  <span className={`badge ${
                    mission.status === 'VERIFIED'
                      ? 'badge-observed'
                      : mission.status === 'IN_PROGRESS'
                      ? 'badge-simulated'
                      : 'badge-demo'
                  }`}>
                    {mission.status === 'VERIFIED' ? '✓ Verified in Field' : mission.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.35 }}>
                  {mission.title}
                </h3>

                {/* Geographic Context */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px',
                }}>
                  <MapPin size={12} color="var(--color-terracotta)" />
                  <span>Gram Panchayat {mission.gramPanchayat} ({mission.village})</span>
                  <span>•</span>
                  <span className="mono-text">{mission.targetCoordinates.elevationM}m MSL</span>
                </div>

                {/* Flagged Reason */}
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '0.78rem',
                  lineHeight: 1.45,
                  marginBottom: '12px',
                  borderLeft: '2.5px solid var(--color-terracotta)',
                }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-terracotta)', fontSize: '0.70rem', marginBottom: '2px' }}>
                    DIGITAL TWIN ANOMALY TRIGGER:
                  </div>
                  {mission.flaggedReason}
                </div>

                {/* Required checklist */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    MANDATORY FIELD AUDIT PROTOCOL:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {mission.requiredMeasurements.slice(0, 3).map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Verified Evidence Snippet if present */}
                {isVerified && mission.fieldObservations && (
                  <div style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--color-forest-bg)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid rgba(42, 102, 62, 0.25)',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <CheckCircle size={13} color="var(--color-forest)" />
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                        VERIFIED BY: {mission.fieldObservations.inspectorName} ({mission.fieldObservations.inspectionDate})
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      Gully Depth: <strong>{mission.fieldObservations.measuredGullyDepthM}m</strong> | Width: <strong>{mission.fieldObservations.measuredGullyWidthM}m</strong> | Stone available: <strong>{mission.fieldObservations.stoneAvailabilityNearby ? 'Yes' : 'No'}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '12px',
              }}>
                <button
                  onClick={() => onFlyToLocation?.({
                    latitude: mission.targetCoordinates.latitude,
                    longitude: mission.targetCoordinates.longitude,
                    height: 1500,
                  })}
                  className="btn btn-ghost"
                  style={{ padding: '6px 10px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Compass size={13} />
                  Fly to 3D
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenReport(mission)}
                    className="btn btn-ghost"
                    style={{ padding: '6px 10px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Export official inspection dossier"
                  >
                    <FileText size={13} />
                    Dossier
                  </button>

                  <button
                    onClick={() => handleOpenVerifyModal(mission)}
                    className="btn apple-pressable"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      backgroundColor: isVerified ? 'var(--color-forest)' : 'var(--color-terracotta)',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Pencil size={12} />
                    {isVerified ? 'Edit Ground Data' : 'Record Ground Visit'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal 1: Ground Observation Entry Form */}
      {isVerifyingModalOpen && selectedMission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(28, 34, 32, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-popover)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <span className="mono-text" style={{ fontSize: '0.70rem', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                  MISSION AUDIT SHEET: {selectedMission.id}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Record Verified Ground Observations
                </h3>
              </div>
              <button
                onClick={() => setIsVerifyingModalOpen(false)}
                className="btn btn-ghost"
                style={{ padding: '4px', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '10px 14px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.78rem',
              }}>
                Target: <strong>{selectedMission.title}</strong> • Gram Panchayat: <strong>{selectedMission.gramPanchayat}</strong> ({selectedMission.targetCoordinates.latitude.toFixed(4)}°N, {selectedMission.targetCoordinates.longitude.toFixed(4)}°E)
              </div>

              {/* Inspector details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    INSPECTOR NAME:
                  </label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    AGENCY / ORGANIZATION:
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Measured Physical Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    GULLY DEPTH (METERS):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measuredDepth}
                    onChange={(e) => setMeasuredDepth(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    TOP WIDTH (METERS):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={measuredWidth}
                    onChange={(e) => setMeasuredWidth(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    LOCAL STONES AVAILABLE:
                  </label>
                  <select
                    value={stoneAvailable ? 'yes' : 'no'}
                    onChange={(e) => setStoneAvailable(e.target.value === 'yes')}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="yes">Yes (Within 200m)</option>
                    <option value="no">No (Must haul)</option>
                  </select>
                </div>
              </div>

              {/* Soil Condition */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    SOIL COMPACTION STATE:
                  </label>
                  <select
                    value={soilCompaction}
                    onChange={(e) => setSoilCompaction(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Loose / Highly Friable">Loose / Highly Friable (Severe detachment)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard Baked / Crusted">Hard Baked / Crusted (High runoff velocity)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    FIELD SOIL MOISTURE:
                  </label>
                  <select
                    value={soilMoisture}
                    onChange={(e) => setSoilMoisture(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-primary)',
                      fontSize: '0.80rem',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Desiccated">Desiccated (&lt;10% moisture)</option>
                    <option value="Damp">Damp (15-30% moisture)</option>
                    <option value="Waterlogged">Waterlogged / Saturated</option>
                  </select>
                </div>
              </div>

              {/* Consultation Remarks */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  COMMUNITY & PANCHAYAT CONSULTATION:
                </label>
                <textarea
                  rows={2}
                  value={communityNotes}
                  onChange={(e) => setCommunityNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.80rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Detailed Field Notes */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  TECHNICAL FIELD OBSERVATIONS & ENGINEERING REMARKS:
                </label>
                <textarea
                  rows={2}
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-primary)',
                    fontSize: '0.80rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              backgroundColor: 'var(--bg-secondary)',
            }}>
              <button
                onClick={() => setIsVerifyingModalOpen(false)}
                className="btn btn-ghost"
                style={{ padding: '8px 14px', fontSize: '0.80rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVerification}
                className="btn apple-pressable"
                style={{
                  padding: '8px 18px',
                  fontSize: '0.80rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-forest)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle size={15} />
                Verify & Sync to Digital Twin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Printable Official Dossier View */}
      {isReportModalOpen && selectedMission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(28, 34, 32, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-popover)',
            width: '100%',
            maxWidth: '780px',
            maxHeight: '92vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            color: '#1A1A1A',
          }}>
            {/* Action Bar */}
            <div style={{
              padding: '12px 20px',
              backgroundColor: '#F5F5F0',
              borderBottom: '1px solid #E0E0D8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                GOVERNMENT OF RAJASTHAN • WATERSHED DEVELOPMENT & CONSERVATION DOSSIER
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handlePrint}
                  className="btn btn-ghost"
                  style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Printer size={14} />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  className="btn btn-ghost"
                  style={{ padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Official Report Document */}
            <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header Letterhead */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #1E3A2B', paddingBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555' }}>
                  District Watershed Cell — Udaipur (Girwa Block)
                </div>
                <h2 className="serif-title" style={{ fontSize: '1.6rem', color: '#1E3A2B', margin: '4px 0' }}>
                  Actionable Field Inspection Protocol & Verification Dossier
                </h2>
                <div style={{ fontSize: '0.76rem', color: '#666' }}>
                  Document Ref: <strong>DHR/WTR/{selectedMission.id}</strong> • Survey Area: Aravalli Southern Ridge Corridor
                </div>
              </div>

              {/* Mission Summary Table */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '0.80rem',
                border: '1px solid #D0D0C8',
                padding: '12px',
                borderRadius: '4px',
                backgroundColor: '#FAF9F6',
              }}>
                <div>
                  <strong>Target Mission:</strong> {selectedMission.title}
                </div>
                <div>
                  <strong>Risk Priority:</strong> {selectedMission.priority}
                </div>
                <div>
                  <strong>Gram Panchayat:</strong> {selectedMission.gramPanchayat} ({selectedMission.village})
                </div>
                <div>
                  <strong>GPS Fix:</strong> {selectedMission.targetCoordinates.latitude.toFixed(5)}°N, {selectedMission.targetCoordinates.longitude.toFixed(5)}°E ({selectedMission.targetCoordinates.elevationM}m MSL)
                </div>
                <div>
                  <strong>Assigned Officer:</strong> {selectedMission.assignedTo}
                </div>
                <div>
                  <strong>Status:</strong> {selectedMission.status}
                </div>
              </div>

              {/* Rationale & Satellite Grounding */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E3A2B', marginBottom: '4px' }}>
                  1. SATELLITE OBSERVATION & HYDROLOGIC ANOMALY RATIONALE
                </h4>
                <p style={{ fontSize: '0.80rem', lineHeight: 1.5, margin: 0 }}>
                  <strong>Digital Twin Model:</strong> {selectedMission.flaggedReason}
                </p>
                <p style={{ fontSize: '0.80rem', lineHeight: 1.5, margin: '4px 0 0' }}>
                  <strong>Earth Engine Multispectral Evidence:</strong> {selectedMission.satelliteEvidence}
                </p>
              </div>

              {/* Mandatory Checklist */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E3A2B', marginBottom: '6px' }}>
                  2. FIELD INSPECTION AUDIT CHECKLIST
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.80rem' }}>
                  {selectedMission.requiredMeasurements.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '14px', height: '14px', border: '1.5px solid #555', display: 'inline-block' }} />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Observations Recorded */}
              {selectedMission.fieldObservations ? (
                <div style={{
                  padding: '14px',
                  backgroundColor: '#F3F6F4',
                  borderRadius: '4px',
                  border: '1px solid #C4D7CA',
                }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E3A2B', marginBottom: '6px' }}>
                    3. RECORDED PHYSICAL OBSERVATIONS (GROUND EVIDENCE)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '0.78rem', marginBottom: '8px' }}>
                    <div>Measured Depth: <strong>{selectedMission.fieldObservations.measuredGullyDepthM}m</strong></div>
                    <div>Measured Width: <strong>{selectedMission.fieldObservations.measuredGullyWidthM}m</strong></div>
                    <div>Compaction: <strong>{selectedMission.fieldObservations.soilCompaction}</strong></div>
                  </div>
                  <p style={{ fontSize: '0.78rem', margin: '4px 0' }}>
                    <strong>Officer Remarks:</strong> {selectedMission.fieldObservations.fieldNotes}
                  </p>
                  <p style={{ fontSize: '0.78rem', margin: '4px 0' }}>
                    <strong>Panchayat Consultation:</strong> {selectedMission.fieldObservations.communityConsulted}
                  </p>
                </div>
              ) : (
                <div style={{ padding: '12px', border: '1px dashed #999', borderRadius: '4px', textAlign: 'center', fontSize: '0.80rem', color: '#666' }}>
                  [Pending Physical Survey Verification by Field Officer]
                </div>
              )}

              {/* Recommended Engineering Action */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E3A2B', marginBottom: '4px' }}>
                  4. RECOMMENDED INTERVENTION (MGNREGA / WATERSHED CELL SPECIFICATION)
                </h4>
                <p style={{ fontSize: '0.80rem', lineHeight: 1.5, margin: 0 }}>
                  {selectedMission.suggestedAction}
                </p>
              </div>

              {/* Sign-off Blocks */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #D0D0C8',
                fontSize: '0.76rem',
              }}>
                <div>
                  <div style={{ height: '36px' }} />
                  <div style={{ borderTop: '1px solid #555', paddingTop: '4px' }}>
                    <strong>Field Inspecting Officer Signature</strong>
                    <div>Name: {selectedMission.assignedTo}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ height: '36px' }} />
                  <div style={{ borderTop: '1px solid #555', paddingTop: '4px' }}>
                    <strong>Gram Panchayat Sarpanch / VDO Endorsement</strong>
                    <div>Panchayat: {selectedMission.gramPanchayat}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
