'use client';

import React from 'react';
import { MobileCard } from '@itemseek2/ui-mobile';

export function SystemMonitor() {
  const metrics = [
    { label: 'CPU Usage', value: 45, unit: '%', status: 'good' },
    { label: 'Memory', value: 72, unit: '%', status: 'warning' },
    { label: 'Disk Space', value: 38, unit: '%', status: 'good' },
    { label: 'Network', value: 12, unit: 'Mbps', status: 'good' }
  ];

  const services = [
    { name: 'API Server', status: 'operational', uptime: '99.99%' },
    { name: 'Database', status: 'operational', uptime: '99.95%' },
    { name: 'AI Service', status: 'operational', uptime: '99.90%' },
    { name: 'File Storage', status: 'degraded', uptime: '98.50%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">System Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <MobileCard key={metric.label} padding="sm">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>
                {metric.value}{metric.unit}
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' : 
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.unit === '%' ? metric.value : 50}%` }}
                />
              </div>
            </MobileCard>
          ))}
        </div>
      </div>

      {/* Service Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Service Status</h3>
        <MobileCard>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  service.status === 'operational' ? 'text-green-600' :
                  service.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </MobileCard>
      </div>

      {/* Recent Alerts */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Recent Alerts</h3>
        <MobileCard>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-yellow-500">⚠️</span>
              <div>
                <p className="text-sm font-medium text-gray-900">High memory usage detected</p>
                <p className="text-xs text-gray-500">Server-02 • 15 mins ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-500">ℹ️</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Scheduled maintenance completed</p>
                <p className="text-xs text-gray-500">Database cluster • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500">✅</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Backup completed successfully</p>
                <p className="text-xs text-gray-500">All services • 6 hours ago</p>
              </div>
            </div>
          </div>
        </MobileCard>
      </div>
    </div>
  );
}