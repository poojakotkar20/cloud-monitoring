import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockServices } from '../data/services';
import { Server, ArrowRight } from 'lucide-react';

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Services Directory</h1>
        <p className="text-slate-400">Monitor health and performance of all microservices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockServices.map((service) => (
          <div 
            key={service.id}
            onClick={() => navigate(`/services/${service.id}`)}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 cursor-pointer transition-all group shadow-sm hover:shadow-indigo-500/5 hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-700 mr-3 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                  <Server className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-200">{service.name}</h3>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                service.status === 'Healthy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                service.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {service.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Request Rate</p>
                <p className="text-sm font-medium text-slate-300">{service.requestRate.toLocaleString()} /min</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Latency (avg)</p>
                <p className="text-sm font-medium text-slate-300">{service.latency}ms</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Error Rate</p>
                <p className="text-sm font-medium text-slate-300">{service.errorRate}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Uptime</p>
                <p className="text-sm font-medium text-slate-300">{service.uptime}%</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-end">
              <span className="text-xs font-medium text-indigo-400 flex items-center group-hover:text-indigo-300">
                View Details <ArrowRight className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
