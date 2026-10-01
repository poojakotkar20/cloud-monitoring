import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(e => console.error(e));
      
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(e => console.error(e));
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (log.requestId && log.requestId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    const matchesService = serviceFilter === 'ALL' || log.serviceId === serviceFilter;
    
    return matchesSearch && matchesLevel && matchesService;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Logs Explorer</h1>
        <p className="text-slate-400">Search and filter application logs</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search logs by message or request ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="DEBUG">DEBUG</option>
          </select>
          
          <select 
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 max-w-[150px]"
          >
            <option value="ALL">All Services</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          
          {(searchTerm || levelFilter !== 'ALL' || serviceFilter !== 'ALL') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('ALL');
                setServiceFilter('ALL');
              }}
              className="p-2 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col font-mono text-sm">
        <div className="flex text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900 border-b border-slate-800 py-3 px-4">
          <div className="w-40 flex-shrink-0">Timestamp</div>
          <div className="w-24 flex-shrink-0">Level</div>
          <div className="w-48 flex-shrink-0">Service</div>
          <div className="flex-1">Message</div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Filter className="w-8 h-8 mb-2 opacity-50" />
              <p>No logs match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredLogs.map(log => {
                const service = services.find(s => s.id === log.serviceId);
                return (
                  <div key={log.id} className="flex hover:bg-slate-800/30 transition-colors py-2 px-4 group">
                    <div className="w-40 flex-shrink-0 text-slate-500 pt-0.5">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="w-24 flex-shrink-0">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        log.level === 'ERROR' || log.level === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        log.level === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        log.level === 'DEBUG' ? 'bg-slate-700 text-slate-300 border border-slate-600' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {log.level}
                      </span>
                    </div>
                    <div className="w-48 flex-shrink-0 text-slate-400 pt-0.5 truncate pr-2">
                      {service?.name || log.serviceId}
                    </div>
                    <div className="flex-1 text-slate-300 break-all pt-0.5">
                      {log.message}
                      {log.requestId && (
                        <span className="ml-2 text-slate-500 text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          req: {log.requestId}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
