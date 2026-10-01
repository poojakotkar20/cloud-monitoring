import React, { useState } from 'react';
import { mockAlerts } from '../data/alerts';
import { mockServices } from '../data/services';
import { AlertTriangle, CheckCircle, Info, Clock, AlertCircle } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleStatusChange = (id: string, newStatus: any) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Alerts Management</h1>
        <p className="text-slate-400">View and respond to system anomalies</p>
      </div>

      <div className="flex gap-4 mb-6">
        <StatCard title="Active" value={alerts.filter(a => a.status === 'Active').length} color="text-red-400" />
        <StatCard title="Acknowledged" value={alerts.filter(a => a.status === 'Acknowledged').length} color="text-amber-400" />
        <StatCard title="Resolved" value={alerts.filter(a => a.status === 'Resolved').length} color="text-green-400" />
      </div>

      <div className="space-y-4">
        {alerts.map(alert => {
          const service = mockServices.find(s => s.id === alert.serviceId);
          return (
            <div key={alert.id} className={`bg-slate-800 border rounded-xl p-5 shadow-sm transition-all ${
              alert.status === 'Active' && alert.severity === 'Critical' ? 'border-red-500/50' : 
              alert.status === 'Active' ? 'border-amber-500/50' : 'border-slate-700'
            }`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    {alert.severity === 'Critical' ? <AlertCircle className="w-6 h-6 text-red-500" /> :
                     alert.severity === 'Warning' ? <AlertTriangle className="w-6 h-6 text-amber-500" /> :
                     <Info className="w-6 h-6 text-blue-500" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{alert.name}</h3>
                    <p className="text-slate-300 mt-1 text-sm">{alert.message}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                      <span className="flex items-center text-slate-400">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {new Date(alert.time).toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        Service: {service?.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        alert.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                        alert.severity === 'Warning' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t border-slate-700 pt-4 md:border-0 md:pt-0">
                  <div className="text-sm font-medium mb-1 hidden md:block text-slate-400">Status: <span className={
                    alert.status === 'Active' ? 'text-red-400' : 
                    alert.status === 'Acknowledged' ? 'text-amber-400' : 'text-green-400'
                  }>{alert.status}</span></div>
                  
                  {alert.status === 'Active' && (
                    <button 
                      onClick={() => handleStatusChange(alert.id, 'Acknowledged')}
                      className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  
                  {(alert.status === 'Active' || alert.status === 'Acknowledged') && (
                    <button 
                      onClick={() => handleStatusChange(alert.id, 'Resolved')}
                      className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 flex-1 shadow-sm">
      <div className="text-sm font-medium text-slate-400">{title}</div>
      <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}
