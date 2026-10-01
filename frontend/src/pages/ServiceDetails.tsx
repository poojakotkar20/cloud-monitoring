import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockServices } from '../data/services';
import { mockTimeSeriesData } from '../data/metrics';
import { mockLogs } from '../data/logs';
import { mockAlerts } from '../data/alerts';
import { ArrowLeft, Activity, Server, Clock, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = mockServices.find(s => s.id === id);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Server className="w-12 h-12 mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Service not found</h2>
        <button onClick={() => navigate('/services')} className="text-indigo-400 hover:underline">
          Return to services
        </button>
      </div>
    );
  }

  const serviceLogs = mockLogs.filter(l => l.serviceId === id);
  const serviceAlerts = mockAlerts.filter(a => a.serviceId === id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/services')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white">{service.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              service.status === 'Healthy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              service.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {service.status}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">ID: {service.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox icon={Activity} label="Request Rate" value={`${service.requestRate} /min`} />
        <StatBox icon={AlertTriangle} label="Error Rate" value={`${service.errorRate}%`} />
        <StatBox icon={Clock} label="Avg Latency" value={`${service.latency}ms`} />
        <StatBox icon={Server} label="Uptime" value={`${service.uptime}%`} />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Performance Metrics</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockTimeSeriesData}>
              <defs>
                <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="timestamp" hide />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorLat)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-200">Recent Alerts</h2>
          </div>
          <div className="flex-1 p-0 overflow-y-auto max-h-80">
            {serviceAlerts.length === 0 ? (
              <div className="p-5 text-slate-400 text-sm text-center">No recent alerts for this service.</div>
            ) : (
              <ul className="divide-y divide-slate-700">
                {serviceAlerts.map(alert => (
                  <li key={alert.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-slate-200 text-sm">{alert.name}</span>
                      <span className="text-xs text-slate-500">{new Date(alert.time).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{alert.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-200">Recent Logs</h2>
          </div>
          <div className="flex-1 p-0 overflow-y-auto max-h-80">
            {serviceLogs.length === 0 ? (
              <div className="p-5 text-slate-400 text-sm text-center">No recent logs for this service.</div>
            ) : (
              <ul className="divide-y divide-slate-700">
                {serviceLogs.map(log => (
                  <li key={log.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        log.level === 'ERROR' || log.level === 'CRITICAL' as any ? 'bg-red-500/20 text-red-400' :
                        log.level === 'WARNING' ? 'bg-amber-500/20 text-amber-400' :
                        log.level === 'DEBUG' ? 'bg-slate-600/50 text-slate-300' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-mono mt-1 break-all">{log.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center">
      <Icon className="w-5 h-5 text-slate-500 mb-2" />
      <div className="text-xl font-bold text-slate-200">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}
