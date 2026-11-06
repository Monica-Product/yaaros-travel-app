/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';

interface ScopeAlertNoticeProps {
  notice?: string;
  scenarioType?: string | null;
}

export const ScopeAlertNotice: React.FC<ScopeAlertNoticeProps> = ({ notice, scenarioType }) => {
  if (!notice && !scenarioType) return null;

  const isUdaipur = scenarioType === 'udaipur_refusal' || (notice && notice.toLowerCase().includes('udaipur'));
  const isLiveAvailability = scenarioType === 'live_availability_refusal' || (notice && (notice.toLowerCase().includes('live') || notice.toLowerCase().includes('availability') || notice.toLowerCase().includes('booking')));

  if (!isUdaipur && !isLiveAvailability && !notice) return null;

  return (
    <div className={`p-3.5 rounded-xl border text-xs mb-3 flex items-start gap-2.5 ${
      isUdaipur
        ? 'bg-[#FFF6F3] border-[#E68567] text-[#7A2E17]'
        : isLiveAvailability
        ? 'bg-[#FFFDF5] border-[#DFB769] text-[#7A2E17]'
        : 'bg-[#FCECE7] border-[#E8D8C3] text-[#541E0F]'
    }`}>
      {isUdaipur ? (
        <ShieldAlert className="w-4 h-4 text-[#BF4C29] shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
      )}
      <div>
        <div className="font-bold text-[11px] uppercase tracking-wider mb-0.5">
          {isUdaipur ? 'Boundary Restriction Enforced' : isLiveAvailability ? 'Real-Time Limit Enforced' : 'Operating Scope Notice'}
        </div>
        <p className="leading-relaxed text-[11px]">
          {notice || (isUdaipur 
            ? 'Yaaros strictly answers for Jaipur, Rajasthan. Questions regarding Udaipur are not within our knowledge boundary.' 
            : 'Live restaurant table availability, real-time wait times, and direct table bookings are not supported by Yaaros.')}
        </p>
      </div>
    </div>
  );
};
