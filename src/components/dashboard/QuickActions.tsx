import React, { useState } from 'react';
import { Search, RefreshCw, FileText, Power } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';

export const QuickActions: React.FC = () => {
  const { showToast } = useToast();
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    showToast('Network scan initiated…', 'info');
    await new Promise((r) => setTimeout(r, 3000));
    setScanning(false);
    showToast('Network scan completed — 149 devices found', 'success');
  };

  const handleReport = () => {
    showToast('Generating report…', 'info');
    setTimeout(() => showToast('Report ready for download', 'success'), 2000);
  };

  const handleRestart = () => {
    showToast('Service restart initiated', 'warning');
    setTimeout(() => showToast('Service restarted successfully', 'success'), 3000);
  };

  return (
    <Card padding="md">
      <CardHeader
        title="Quick Actions"
        subtitle="Common network operations"
        icon={
          <div className="p-2 bg-primary-50 rounded-lg">
            <Power className="h-4 w-4 text-primary-600" />
          </div>
        }
      />
      <div className="space-y-2.5">
        <Button
          variant="primary"
          size="md"
          className="w-full justify-start"
          leftIcon={<Search className="h-4 w-4" />}
          isLoading={scanning}
          onClick={handleScan}
          id="run-scan-btn"
        >
          {scanning ? 'Scanning…' : 'Run Network Scan'}
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="w-full justify-start"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={handleReport}
          id="generate-report-btn"
        >
          Generate Report
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="w-full justify-start"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={handleRestart}
          id="restart-service-btn"
        >
          Restart Monitor Service
        </Button>
      </div>
    </Card>
  );
};
