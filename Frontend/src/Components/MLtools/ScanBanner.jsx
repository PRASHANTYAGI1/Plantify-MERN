import React from "react";
import Icon from "./Icon";

/**
 * Show banner only when free user has reached limit (or unsubscribed and limit reached).
 * Controlled from parent via props.
 */
export default function ScanBanner({ isPro, usage, dailyLimit, onUpgradeClick }) {
  if (isPro) return null;
  if (usage < dailyLimit) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 mb-8 rounded-xl crystal-alert border shadow">
      <div className="flex items-center gap-3">
        <Icon name="ShieldOff" className="w-6 h-6 text-red-600" />
        <div>
          <div className="font-bold text-red-700">Daily Scan Limit Reached</div>
          <div className="text-sm text-gray-700">Free users receive up to {dailyLimit} scans per day. Upgrade for unlimited access.</div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <button onClick={onUpgradeClick} className="btn-upgrade">Upgrade to Pro</button>
      </div>
    </div>
  );
}
