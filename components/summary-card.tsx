'use client';

import { TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';

interface SummaryCardProps {
  readinessScore: number;
  roiEstimate: {
    annual_hours_saved: number;
    estimated_dollars: number;
    team_efficiency_gain: string;
  };
}

export function SummaryCard({ readinessScore, roiEstimate }: SummaryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-[#8AFF00] to-[#FCEE09]';
    if (score >= 60) return 'from-[#FCEE09] to-[#FF0080]';
    return 'from-[#FF0080] to-[#00FFFF]';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'GOOD';
    if (score >= 40) return 'MODERATE';
    return 'NEEDS IMPROVEMENT';
  };

  return (
    <div className="space-y-6">
      {/* Readiness Score */}
      <div className="relative">
        <div className={`absolute -inset-1 bg-gradient-to-r ${getScoreColor(readinessScore)} rounded-2xl blur-xl opacity-30`} />
        
        <div className="relative bg-gradient-to-br from-[#1B1B1B] to-[#0F0F0F] border-2 border-[#00FFFF]/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#00FFFF] font-['Orbitron',sans-serif] text-sm tracking-wider uppercase mb-2">
                AI READINESS SCORE
              </p>
              <p className="text-gray-400 text-xs font-['Exo',sans-serif]">
                Based on your assessment responses
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#00FFFF]" />
          </div>

          <div className="flex items-end gap-4 mb-4">
            <div className={`text-7xl font-bold bg-gradient-to-r ${getScoreColor(readinessScore)} bg-clip-text text-transparent font-['Orbitron',sans-serif]`}>
              {readinessScore}
            </div>
            <div className="text-3xl text-gray-500 font-['Orbitron',sans-serif] mb-2">
              /100
            </div>
          </div>

          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor(readinessScore)} bg-opacity-20 border border-current`}>
            <span className={`text-sm font-bold font-['Orbitron',sans-serif] tracking-wider bg-gradient-to-r ${getScoreColor(readinessScore)} bg-clip-text text-transparent`}>
              {getScoreLabel(readinessScore)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 relative h-3 bg-[#0F0F0F] rounded-full overflow-hidden border border-[#00FFFF]/30">
            <div 
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getScoreColor(readinessScore)} transition-all duration-1000 ease-out`}
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ROI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hours Saved */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8AFF00] to-[#FCEE09] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
          
          <div className="relative bg-[#1B1B1B] border border-[#8AFF00]/50 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8AFF00] to-[#FCEE09] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#0F0F0F]" />
              </div>
              <p className="text-[#8AFF00] font-['Orbitron',sans-serif] text-xs tracking-wider uppercase">
                TIME SAVED
              </p>
            </div>
            
            <div className="text-3xl font-bold text-white font-['Orbitron',sans-serif] mb-1">
              {roiEstimate.annual_hours_saved}
            </div>
            <p className="text-gray-400 text-sm font-['Exo',sans-serif]">
              hours per year
            </p>
          </div>
        </div>

        {/* Dollar Value */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FCEE09] to-[#FF0080] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
          
          <div className="relative bg-[#1B1B1B] border border-[#FCEE09]/50 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FCEE09] to-[#FF0080] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#0F0F0F]" />
              </div>
              <p className="text-[#FCEE09] font-['Orbitron',sans-serif] text-xs tracking-wider uppercase">
                VALUE
              </p>
            </div>
            
            <div className="text-3xl font-bold text-white font-['Orbitron',sans-serif] mb-1">
              ${roiEstimate.estimated_dollars.toLocaleString()}
            </div>
            <p className="text-gray-400 text-sm font-['Exo',sans-serif]">
              estimated annual savings
            </p>
          </div>
        </div>

        {/* Efficiency Gain */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF0080] to-[#00FFFF] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
          
          <div className="relative bg-[#1B1B1B] border border-[#00FFFF]/50 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF0080] to-[#00FFFF] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#0F0F0F]" />
              </div>
              <p className="text-[#00FFFF] font-['Orbitron',sans-serif] text-xs tracking-wider uppercase">
                EFFICIENCY
              </p>
            </div>
            
            <div className="text-3xl font-bold text-white font-['Orbitron',sans-serif] mb-1">
              {roiEstimate.team_efficiency_gain}
            </div>
            <p className="text-gray-400 text-sm font-['Exo',sans-serif]">
              team productivity boost
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
