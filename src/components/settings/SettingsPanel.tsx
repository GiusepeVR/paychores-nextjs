'use client';

import { useState } from 'react';
import { Button } from '@/components';
import { useBills } from '@/hooks/useBills';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { bills, exportBills, importBills } = useBills();
  const [importData, setImportData] = useState('');

  const handleExport = () => {
    const dataStr = exportBills();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'paychores-bills-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importData.trim()) {
      const success = importBills(importData.trim());
      if (success) {
        alert('Bills imported successfully!');
        setImportData('');
      } else {
        alert('Import failed. Please check the format of your data.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-8">
        {/* Data Management */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💾</span>
            Data Management
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Local Data</span>
                <span className="text-sm text-gray-600">{bills.length} bills stored</span>
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExport}
                >
                  Export Backup
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-2">
                <span className="font-medium">Import Data</span>
                <p className="text-sm text-gray-600">Paste your backup data below</p>
              </div>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your exported bill data here..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
              <div className="mt-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleImport}
                  disabled={!importData.trim()}
                >
                  Import Data
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cloud Sync (Future) */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">☁️</span>
            Cloud Sync (Coming Soon)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium text-gray-700">Google Account Sync</div>
                <div className="text-sm text-gray-500">
                  Sync your bills across devices with your Google account
                </div>
              </div>
              <div className="text-gray-400">
                🔐 Not Connected
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Connect Google Account
            </Button>
          </div>
        </section>

        {/* Notifications (Future) */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔔</span>
            Notifications (Coming Soon)
          </h3>
          <div className="space-y-3">
            <label className="flex items-center text-gray-500">
              <input type="checkbox" disabled className="mr-3" />
              Email reminders for due bills
            </label>
            <label className="flex items-center text-gray-500">
              <input type="checkbox" disabled className="mr-3" />
              Push notifications for overdue bills
            </label>
            <label className="flex items-center text-gray-500">
              <input type="checkbox" disabled className="mr-3" />
              Weekly bill summary
            </label>
          </div>
        </section>

        {/* App Info */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">ℹ️</span>
            About
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <div className="mb-2">
              <strong>PayChores</strong> v1.0.0
            </div>
            <div className="mb-2">
              A simple, privacy-focused bill tracking application
            </div>
            <div>
              Currently using local storage. Cloud sync features coming soon!
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-end">
          <Button onClick={onClose} variant="primary">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}