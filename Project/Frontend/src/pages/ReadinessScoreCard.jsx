import React from 'react';
import './ReadinessScoreCard.css';

export default function ReadinessScoreCard({ response }) {
  // Agar score data missing hai, toh kuch bhi render mat karo
  if (response.readiness_score === undefined || response.readiness_score === null) {
    return null;
  }

  const scoreColor = response.readiness_color || 'medium'; // default to medium if missing

  return (
    <div className={`readiness-card ${scoreColor} mt-4`}>
      {/* Header with score circle */}
      <div className="score-row">
        <span className="score-label flex items-center gap-2">
          <span className="text-lg">📊</span> Patent Readiness
        </span>
        <div className="score-main">
          <div className={`score-circle ${scoreColor}`}>
            {Math.round(response.readiness_score)}
          </div>
          <div className="score-text">
            <div className="score-percentage">{Math.round(response.readiness_score)}%</div>
            <div className="score-status">
              {response.readiness_level ? response.readiness_level.replace(/[🟢🟡🔴]/g, '').trim() : 'Analyzing...'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div 
          className={`progress-fill ${scoreColor}`} 
          style={{ width: `${Math.round(response.readiness_score)}%` }}
        />
      </div>

      {/* Breakdown 4-grid */}
      {response.readiness_breakdown && (
        <div className="breakdown-mini">
          <div className="breakdown-item">
            <span className="breakdown-label">📝 Clarity</span>
            <span className="breakdown-value">{response.readiness_breakdown.clarity}/25</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">⚖️ Legal</span>
            <span className="breakdown-value">{response.readiness_breakdown.legal}/25</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">📋 Docs</span>
            <span className="breakdown-value">{response.readiness_breakdown.documentation}/25</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">🌍 Int'l</span>
            <span className="breakdown-value">{response.readiness_breakdown.international}/25</span>
          </div>
        </div>
      )}
    </div>
  );
}