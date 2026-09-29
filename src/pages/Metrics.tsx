import React, { useState } from 'react';
import { mockTimeSeriesData } from '../data/metrics';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

export default function Metrics() {
  const [timeRange, setTimeRange] = useState('1h');

  // Simulate changing data based on time range (just slicing for demo)
  const displayData = timeRange === '15m' ? mockTimeSeriesData.slice(-15) :
                      timeRange === '1h' ? mockTimeSeriesData :
                      timeRange === '6h' ? mockTimeSeriesData.filter((_, i) => i % 6 === 0) :
                      mockTimeSeriesData.filter((_, i) => i % 24 === 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Metrics Dashboard</h1>
          <p className="text-slate-400">System-wide performance indicators</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <Clock className="w-4 h-4 text-slate-400 ml-2" />
          <div className="flex space-x-1 pl-2">
            {['15m', '1h', '6h', '24h'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === range 
                    ? 'bg-indigo-500/20 text-indigo-400 font-medium' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricCard title="CPU Utilization (%)" data={displayData} dataKey="cpu" color="#3b82f6" />
        <MetricCard title="Memory Usage (%)" data={displayData} dataKey="memory" color="#8b5cf6" />
        <MetricCard title="Global Request Rate (req/min)" data={displayData} dataKey="requestRate" color="#10b981" />
        <MetricCard title="Global Error Rate (%)" data={displayData} dataKey="errorRate" color="#ef4444" />
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">P95 Response Latency (ms)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="timestamp" hide />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, data, dataKey, color }: { title: string, data: any[], dataKey: string, color: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">{title}</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="timestamp" hide />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
