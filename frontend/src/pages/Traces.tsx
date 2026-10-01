import React, { useState } from 'react';
import { mockTraces } from '../data/traces';
import { mockServices } from '../data/services';
import { TraceSpan } from '../types';
import { Network, Search, AlertCircle, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';

export default function Traces() {
  const [selectedTrace, setSelectedTrace] = useState(mockTraces[1]); // default to the one with error

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Distributed Tracing</h1>
        <p className="text-slate-400">Track requests across microservices</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Trace List */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm flex flex-col lg:col-span-1 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search trace ID..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {mockTraces.map(trace => {
              const service = mockServices.find(s => s.id === trace.serviceId);
              return (
                <div 
                  key={trace.id}
                  onClick={() => setSelectedTrace(trace)}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors border ${
                    selectedTrace.id === trace.id 
                      ? 'bg-indigo-500/10 border-indigo-500/30' 
                      : 'bg-transparent border-transparent hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-slate-200 truncate pr-2">{trace.rootSpan.operationName}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      trace.status === 'ok' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                    }`}>
                      {trace.duration}ms
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="truncate">{service?.name}</span>
                    <span>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 font-mono">
                    ID: {trace.traceId}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Trace Details / Waterfall */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-sm lg:col-span-2 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
            <div>
              <h2 className="text-lg font-semibold text-slate-200 flex items-center">
                Trace details
                {selectedTrace.status === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 ml-2 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 ml-2 text-red-500" />
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-1">{selectedTrace.traceId}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-300">{new Date(selectedTrace.timestamp).toLocaleString()}</div>
              <div className="text-xs text-slate-500 mt-1">Total Duration: <span className="text-slate-300 font-medium">{selectedTrace.duration}ms</span></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-sm">
            <div className="mb-4 text-xs text-slate-500 flex border-b border-slate-800 pb-2">
              <div className="w-64">Service & Operation</div>
              <div className="flex-1">Timeline</div>
              <div className="w-20 text-right">Duration</div>
            </div>
            
            <SpanRow span={selectedTrace.rootSpan} totalDuration={selectedTrace.duration} depth={0} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SpanRow({ span, totalDuration, depth }: { span: TraceSpan, totalDuration: number, depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const service = mockServices.find(s => s.id === span.serviceId);
  const hasChildren = span.children && span.children.length > 0;
  
  // Simplified visualization calculation for demo
  const widthPercent = Math.max((span.duration / totalDuration) * 100, 1);
  const marginLeftPercent = depth * 5; // Fake offset for demo
  
  return (
    <div className="mb-1">
      <div className="flex items-center group hover:bg-slate-900/80 py-1.5 -mx-4 px-4 transition-colors">
        <div className="w-64 flex items-center" style={{ paddingLeft: `${depth * 16}px` }}>
          {hasChildren ? (
            <button onClick={() => setExpanded(!expanded)} className="p-0.5 hover:bg-slate-700 rounded mr-1 text-slate-400">
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="w-4 mr-1"></div>
          )}
          <span className={`w-2 h-2 rounded-full mr-2 ${span.status === 'error' ? 'bg-red-500' : 'bg-indigo-500'}`}></span>
          <div className="truncate pr-2">
            <div className="text-slate-300 font-medium truncate">{service?.name || span.serviceId}</div>
            <div className="text-xs text-slate-500 truncate">{span.operationName}</div>
          </div>
        </div>
        
        <div className="flex-1 relative h-6 flex items-center">
          <div 
            className={`absolute h-4 rounded-sm ${span.status === 'error' ? 'bg-red-500/20 border border-red-500/50' : 'bg-indigo-500/20 border border-indigo-500/50'}`}
            style={{ width: `${widthPercent}%`, left: `${marginLeftPercent}%` }}
          ></div>
        </div>
        
        <div className={`w-20 text-right text-xs ${span.status === 'error' ? 'text-red-400' : 'text-slate-400'}`}>
          {span.duration}ms
        </div>
      </div>
      
      {expanded && hasChildren && span.children?.map(child => (
        <SpanRow key={child.id} span={child} totalDuration={totalDuration} depth={depth + 1} />
      ))}
    </div>
  );
}
