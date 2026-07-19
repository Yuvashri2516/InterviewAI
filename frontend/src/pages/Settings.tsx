/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'motion/react';
import { 
  Settings2, 
  Terminal, 
  Trash2, 
  Save, 
  Info, 
  RefreshCw, 
  Key, 
  Loader2, 
  AlertTriangle 
} from 'lucide-react';

export default function Settings() {
  const { showToast } = useToast();

  const [apiBaseUrl, setApiBaseUrl] = useState('/api');
  const [useMockEngine, setUseMockEngine] = useState(true);
  const [developerLogMode, setDeveloperLogMode] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 600));
      localStorage.setItem('settings_api_base_url', apiBaseUrl);
      localStorage.setItem('settings_mock_engine', String(useMockEngine));
      localStorage.setItem('settings_developer_logs', String(developerLogMode));
      showToast('System configuration saved successfully!', 'success');
    } catch (err) {
      showToast('Error persisting settings profiles.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetTelemetry = async () => {
    if (!window.confirm('WARNING: This will purge all your resume and interview session evaluations permanently. Continue?')) {
      return;
    }

    setIsResetting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear localStorage but keep auth
      const authUser = localStorage.getItem('interview_user');
      const authToken = localStorage.getItem('interview_token');
      
      localStorage.clear();

      if (authUser) localStorage.setItem('interview_user', authUser);
      if (authToken) localStorage.setItem('interview_token', authToken);

      showToast('System history indexes purged successfully!', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      showToast('Telemetry purge action failed.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 select-none"
    >
      
      {/* Title description */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Platform Configurations</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure connection endpoints, debug profiles, and system diagnostic registries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings options (2/3 width) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs">
            
            {/* API endpoint settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-150 flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-slate-400 shrink-0" /> API Server Connection
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Express API Endpoint Base URL
                </label>
                <input
                  type="text"
                  required
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-blue-500 font-mono"
                  placeholder="e.g. /api"
                />
                <span className="text-[10px] text-slate-400 block mt-1.5 font-semibold leading-relaxed">
                  Defaults to local Express reverse-proxy middleware router `/api`. Customize if pointing to remote clusters.
                </span>
              </div>
            </div>

            {/* Sandbox toggle controllers */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-150 flex items-center gap-2">
                <Settings2 className="h-4.5 w-4.5 text-slate-400 shrink-0" /> Simulation Options
              </h3>

              <div className="space-y-3">
                {/* Engine Mode */}
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold">Mock Pipeline Backplane</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 max-w-sm">Use static mock assets when Gemini credentials or servers are unavailable.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useMockEngine}
                    onChange={(e) => setUseMockEngine(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                  />
                </div>

                {/* Developer Logger */}
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850">
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold">Verbose Console Logs</p>
                    <p className="text-[10px] sm:text-xs text-slate-400 max-w-sm">Output deep network telemetry diagnostic trees inside the browser developer inspector.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={developerLogMode}
                    onChange={(e) => setDeveloperLogMode(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className="flex justify-end pt-2">
              <button
                id="settings-save-btn"
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl px-6 py-3 shadow-md shadow-blue-500/10 transition-colors focus:outline-hidden cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Save Configs <Save className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Developer Help Cards & Reset Tool Card (1/3 width) */}
        <div className="space-y-6">
          
          {/* Key configuration info banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-xs">
            <h3 className="font-bold flex items-center gap-2 text-sm"><Key className="h-4.5 w-4.5 text-slate-400" /> Platform Security</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Platform evaluation uses advanced <span className="font-bold">Gemini Pro</span>. API secrets and tokens are loaded server-side exclusively. Browser memory buffers are isolated.
            </p>
            <div className="p-3 bg-blue-50/40 dark:bg-blue-950/20 text-[10px] font-semibold text-blue-600 rounded-xl leading-relaxed flex items-start gap-2 border border-blue-100/50">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>To apply alternative environment tokens, please configure via the main AI Studio dashboard Secrets configuration list.</span>
            </div>
          </div>

          {/* Purge / Telemetry Scrub card */}
          <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/30 p-5 rounded-3xl space-y-4 shadow-xs">
            <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4.5 w-4.5" /> Destruction Zone
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Scrub all generated reports, scorecards, resume extractions, and goal checklist items clean to restart fresh candidate preparation. This is irreversible.
            </p>
            <button
              id="settings-reset-all-btn"
              type="button"
              disabled={isResetting}
              onClick={handleResetTelemetry}
              className="w-full inline-flex items-center justify-center gap-2 font-bold text-white bg-red-650 hover:bg-red-600 disabled:bg-red-400 rounded-2xl py-3 shadow-md focus:outline-hidden cursor-pointer text-xs"
            >
              {isResetting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Purging database...
                </>
              ) : (
                <>
                  Purge Sandbox History <Trash2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
