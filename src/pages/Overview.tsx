import React from 'react';
import { mockServices } from '../data/services';
import { mockTimeSeriesData } from '../data/metrics';
import { Activity, Server, AlertTriangle, Clock } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function Overview() {
  const activeAlerts = 3;
  const avgLatency = Math.round(mockServices.reduce((acc, s) => acc + s.latency, 0) / mockServices.length);
  const totalRequests = mockServices.reduce((acc, s) => acc + s.requestRate, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
        <p className="text-slate-400">System health and metrics at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Server} title="Active Services" value={mockServices.length} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
        <SummaryCard icon={Activity} title="Requests/min" value={(totalRequests / 1000).toFixed(1) + 'k'} color="text-green-400" bg="bg-green-500/10" border="border-green-500/20" />
        <SummaryCard icon={Clock} title="Avg Latency" value={`${avgLatency}ms`} color="text-amber-400" bg="bg-amber-500/10" border="border-amber-500/20" />
        <SummaryCard icon={AlertTriangle} title="Active Alerts" value={activeAlerts} color="text-red-400" bg="bg-red-500/10" border="border-red-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Global Request Traffic</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimeSeriesData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="timestamp" hide />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="requestRate" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Error Rate by Service</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockServices} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: '#334155'}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Bar dataKey="errorRate" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-200">Service Health</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
              <tr>
                <th className="px-5 py-3 font-medium">Service Name</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Requests/min</th>
                <th className="px-5 py-3 font-medium text-right">Error Rate</th>
                <th className="px-5 py-3 font-medium text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {mockServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-200">{service.name}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      service.status === 'Healthy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      service.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-slate-300">{service.requestRate.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-slate-300">{service.errorRate}%</td>
                  <td className="px-5 py-4 text-right text-slate-300">{service.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, title, value, color, bg, border }: any) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center shadow-sm`}>
      <div className={`p-3 rounded-lg ${bg} ${border} border mr-4`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );
}
