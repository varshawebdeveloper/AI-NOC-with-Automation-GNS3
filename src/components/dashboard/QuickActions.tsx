import React, { useState } from 'react';
import { Download, RefreshCw, Search, Power } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { useGNS3 } from '../../context/GNS3Context';
import { getTrafficData } from '../../services/api';

export const QuickActions: React.FC = () => {
  const { showToast } = useToast();
  const { refresh, nodes, connected, selectedProject } = useGNS3();
  const [scanning, setScanning]   = useState(false);
  const [reporting, setReporting] = useState(false);

  // ── Scan Network: refresh GNS3 topology ──────────────────────────────────────
  const handleScan = async () => {
    setScanning(true);
    showToast('Scanning GNS3 network…', 'info');
    try {
      refresh();
      await new Promise((r) => setTimeout(r, 1500));
      const onlineCount = nodes.filter((n) => n.status === 'online').length;
      showToast(
        connected
          ? `Scan complete — ${nodes.length} devices found (${onlineCount} online)`
          : 'GNS3 offline — cannot scan',
        connected ? 'success' : 'critical',
      );
    } finally {
      setScanning(false);
    }
  };

  // ── Generate Report: fetch real traffic data from FastAPI ─────────────────────
  const handleReport = async () => {
    setReporting(true);
    showToast('Generating report from live traffic data…', 'info');
    try {
      const data = await getTrafficData();
      const projectName = selectedProject?.name ?? 'Unknown';

      // Build a simple text report from real FastAPI + GNS3 data
      const lines = [
        `AI-NOC Network Report`,
        `Generated: ${new Date().toLocaleString()}`,
        `GNS3 Project: ${projectName}`,
        ``,
        `=== NETWORK DEVICES ===`,
        `Total Devices : ${nodes.length}`,
        `Online        : ${nodes.filter((n) => n.status === 'online').length}`,
        `Offline       : ${nodes.filter((n) => n.status === 'offline').length}`,
        `Warning       : ${nodes.filter((n) => n.status === 'warning').length}`,
        ``,
        `=== TRAFFIC ANALYSIS (from PCAP) ===`,
        `Total Packets : ${data.total_packets}`,
        `Total Bytes   : ${data.total_bytes}`,
        `ICMP          : ${data.icmp}`,
        `TCP           : ${data.tcp}`,
        `UDP           : ${data.udp}`,
        `OSPF          : ${data.ospf}`,
        ``,
        `=== AI THREAT DETECTION ===`,
        `Risk Score    : ${data.risk}/100`,
        `Threat Level  : ${data.threat}`,
        ...(data.threats.length > 0
          ? data.threats.map((t) => `  • [${t.severity}] ${t.type}: ${t.description}`)
          : ['  • No threats detected']),
        ``,
        `=== DEVICE BREAKDOWN ===`,
        ...nodes.map((n) => `  ${n.label} [${n.type.toUpperCase()}] — ${n.status.toUpperCase()}`),
      ];

      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `ai-noc-report-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      showToast('Report downloaded with live network data', 'success');
    } catch {
      showToast('Could not generate report — check FastAPI server', 'critical');
    } finally {
      setReporting(false);
    }
  };

  // ── Refresh Monitor: re-poll GNS3 now ────────────────────────────────────────
  const handleRefresh = () => {
    refresh();
    showToast('Refreshing GNS3 topology…', 'info');
    setTimeout(() => showToast('Topology updated', 'success'), 1500);
  };

  return (
    <Card padding="md">
      <CardHeader
        title="Quick Actions"
        subtitle="Live network operations"
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
          leftIcon={<Download className="h-4 w-4" />}
          isLoading={reporting}
          onClick={handleReport}
          id="generate-report-btn"
        >
          {reporting ? 'Generating…' : 'Generate Report'}
        </Button>

        <Button
          variant="ghost"
          size="md"
          className="w-full justify-start"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={handleRefresh}
          id="refresh-monitor-btn"
        >
          Refresh Monitor
        </Button>
      </div>
    </Card>
  );
};
