import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Database, Save, Loader2, Bot } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { apiClient } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const [autoMitigation, setAutoMitigation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/api/settings');
        setAutoMitigation(res.data.auto_mitigation);
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.post('/api/settings', { auto_mitigation: autoMitigation });
      setTimeout(() => setSaving(false), 500);
    } catch (e) {
      console.error('Failed to save settings', e);
      setSaving(false);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Settings' }]}>
      <div className="flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
            <p className="text-sm text-gray-500 mt-1">Manage automation behavior and NOC preferences</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-6">
            
            {/* AI Automation Section */}
            <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-indigo-50/50">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">AI Mitigation Engine</h2>
                  <p className="text-sm text-gray-500">Configure how the system responds to detected threats.</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-8">
                    <h3 className="font-semibold text-gray-900 text-base">Enable Automated Response</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      When enabled, the AI engine will not only detect anomalies (such as ICMP floods or abnormal bandwidth usage) but will also automatically execute mitigation scripts. For example, it can dynamically isolate a suspicious port or block a MAC address without requiring human intervention.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">
                      <Shield className="w-3.5 h-3.5" /> Recommended for production
                    </div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <div className="pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={autoMitigation}
                        onChange={(e) => setAutoMitigation(e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section (Placeholder) */}
            <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Alert Notifications</h2>
                  <p className="text-sm text-gray-500">Manage how you are notified about network events.</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Critical Audio Alerts</h3>
                    <p className="text-sm text-gray-500">Play a 10-second alarm sound when a CRITICAL threat is detected.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked disabled />
                    <div className="w-11 h-6 bg-blue-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </AppLayout>
  );
};
export default SettingsPage;
