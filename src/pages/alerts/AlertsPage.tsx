import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, MapPin, Clock } from 'lucide-react';
import { alertAPI } from '../../lib/api';
import { Alert } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Select from '../../components/common/Select';

const severityOptions = [
  { value: '', label: 'All Severities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

const AlertsPage: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (user) {
          const agencyId = typeof user.agency === 'string' ? user.agency : user.agency._id;
          const response = await alertAPI.getAgencyAlerts(agencyId);
          const alertsData = response?.data || [];
          setAlerts(Array.isArray(alertsData) ? alertsData : []);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [user]);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = !selectedSeverity || alert.severity === selectedSeverity;
    const matchesActive = !showActive || alert.active;
    return matchesSeverity && matchesActive;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600">View and manage emergency alerts</p>
        </div>
        <Link to="/alerts/new">
          <Button variant="primary" icon={<Plus size={16} />}>
            Create Alert
          </Button>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select
          options={severityOptions}
          value={selectedSeverity}
          onChange={(value) => setSelectedSeverity(value)}
          placeholder="Filter by severity"
        />
        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showActive}
              onChange={(e) => setShowActive(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Show active alerts only</span>
          </label>
        </div>
      </div>

      <div className="space-y-6">
        {filteredAlerts.map((alert) => (
          <Card key={alert._id}>
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full bg-${getSeverityColor(alert.severity)}-100`}>
                <AlertTriangle
                  size={24}
                  className={`text-${getSeverityColor(alert.severity)}-600`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    {alert.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={getSeverityColor(alert.severity)}
                      size="sm"
                      rounded
                    >
                      {alert.severity}
                    </Badge>
                    {!alert.active && (
                      <Badge variant="error" size="sm" rounded>
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {alert.message}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" />
                    <span>
                      {alert.radius}km radius
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {alert.expiresAt && (
                  <div className="mt-2 text-sm text-gray-500">
                    Expires: {new Date(alert.expiresAt).toLocaleString()}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    From: {typeof alert.sender === 'string' ? alert.sender : alert.sender.name}
                  </div>
                  {alert.active && user?.role === 'manager' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alertAPI.deactivateAlert(alert._id)}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedSeverity
                ? `No ${selectedSeverity} severity alerts found`
                : 'No alerts match your filters'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;