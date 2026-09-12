import React, { useState, useMemo } from 'react';
import {
  Server,
  Router,
  SwitchCamera,
  Monitor,
  Search,
  Filter,
  MoreVertical,
  Activity,
  CheckCircle,
  XCircle,
  Cpu,
  ShieldAlert
} from 'lucide-react';

import { AppLayout } from '../../layouts/AppLayout';
import { useGNS3 } from '../../context/GNS3Context';

export const DeviceInventoryPage: React.FC = () => {
  const { nodes, loading } = useGNS3();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Generate deterministic mock hardware data based on node ID
  const enrichNodeData = (node: any) => {
    // node is a MappedNode: { id, label, type, status, ipAddress, ... }
    const nodeId = node.id || 'unknown';
    const hash = nodeId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    
    // Deterministic hardware properties
    const vendors = ['Cisco', 'Juniper', 'Arista', 'Palo Alto', 'Generic'];
    const models = ['C3640', 'vSRX', 'vEOS', 'PA-VM', 'VPC'];
    const firmware = ['15.2(4)M1', '19.4R1', '4.24.1F', '10.0.3', '1.0.0'];
    
    const index = hash % vendors.length;
    
    // Derive node category from type or label
    let category = 'Endpoint';
    const labelLower = (node.label || '').toLowerCase();
    const typeLower = (node.type || '').toLowerCase();
    
    if (labelLower.includes('router') || typeLower.includes('router')) category = 'Router';
    else if (labelLower.includes('switch') || typeLower.includes('switch')) category = 'Switch';
    else if (labelLower.includes('fw') || labelLower.includes('firewall') || typeLower.includes('firewall')) category = 'Firewall';

    // Build deterministic MAC
    const hex = hash.toString(16).padStart(4, '0');
    const mac = `00:50:56:xx:xx:xx`.replace(/xx/g, () => (hash % 256).toString(16).padStart(2, '0'));

    return {
      ...node,
      name: node.label,
      node_id: nodeId,
      category,
      vendor: vendors[index],
      model: models[index],
      firmware: firmware[index],
      serial: `SN-${hex.toUpperCase()}-${nodeId.substring(0, 4).toUpperCase()}`,
      mac: mac,
      ip: node.ipAddress || `192.168.${(hash % 254) + 1}.${(hash % 254) + 1}`
    };
  };

  const enrichedNodes = useMemo(() => {
    return nodes.map(enrichNodeData);
  }, [nodes]);

  const filteredNodes = useMemo(() => {
    return enrichedNodes.filter((node) => {
      const matchesSearch = 
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.mac.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.serial.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || node.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'ALL' || node.category.toLowerCase() === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [enrichedNodes, searchTerm, statusFilter, typeFilter]);

  return (
    <AppLayout breadcrumbs={[{ label: 'Devices' }]}>
      <div className="flex flex-col gap-6 animate-fade-in">
        
        {/* FILTERS & SEARCH */}
        <div className="bg-white rounded-xl shadow-card border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, serial, or MAC..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <select 
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Devices</option>
                  <option value="Router">Routers</option>
                  <option value="Switch">Switches</option>
                  <option value="Firewall">Firewalls</option>
                  <option value="Endpoint">Endpoints</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <select 
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Device</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Hardware Info</th>
                  <th className="px-6 py-4">Network Info</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Loading inventory data...
                    </td>
                  </tr>
                ) : filteredNodes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <Cpu className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      No devices found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredNodes.map((node) => (
                    <tr key={node.node_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${node.category === 'Router' ? 'bg-blue-100 text-blue-600' : 
                              node.category === 'Switch' ? 'bg-indigo-100 text-indigo-600' : 
                              node.category === 'Firewall' ? 'bg-red-100 text-red-600' : 
                              'bg-gray-100 text-gray-600'}
                          `}>
                            {node.category === 'Router' ? <Router className="w-5 h-5" /> : 
                             node.category === 'Switch' ? <SwitchCamera className="w-5 h-5" /> : 
                             node.category === 'Firewall' ? <ShieldAlert className="w-5 h-5" /> : 
                             <Monitor className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{node.name}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">{node.node_id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {node.status === 'online' ? (
                            <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-700 font-medium">Online</span></>
                          ) : node.status === 'offline' ? (
                            <><XCircle className="w-4 h-4 text-red-500" /><span className="text-red-700 font-medium">Offline</span></>
                          ) : (
                            <><Activity className="w-4 h-4 text-yellow-500" /><span className="text-yellow-700 font-medium">Warning</span></>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {node.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{node.vendor} {node.model}</div>
                        <div className="text-xs text-gray-500 mt-1">SN: {node.serial}</div>
                        <div className="text-xs text-gray-500">FW: {node.firmware}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <div className="text-gray-900">{node.ip}</div>
                        <div className="text-gray-500 mt-1">{node.mac}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {filteredNodes.length} devices</span>
            <div className="flex gap-1">
              <span className="font-medium text-gray-900">{enrichedNodes.filter(n => n.status === 'online').length}</span> Online
              <span className="mx-2 text-gray-300">|</span>
              <span className="font-medium text-gray-900">{enrichedNodes.filter(n => n.status === 'offline').length}</span> Offline
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
export default DeviceInventoryPage;
