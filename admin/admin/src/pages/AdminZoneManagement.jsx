import { useEffect, useState } from 'react';
import { adminService } from '../api/adminService';
import '../components/layout.css';

const AdminZoneManagement = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    places: [],
  });
  const [newPlace, setNewPlace] = useState({ name: '', type: 'other' });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      setLoading(true);
      const res = await adminService.getZones();
      setZones(res.data || res || []);
    } catch (err) {
      setError(err.message || 'Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');

      if (editingZone) {
        await adminService.updateZone(editingZone._id, formData);
        setSuccess('Zone updated successfully');
      } else {
        await adminService.createZone(formData);
        setSuccess('Zone created successfully');
      }

      setShowForm(false);
      setEditingZone(null);
      setFormData({ name: '', description: '', places: [] });
      setNewPlace({ name: '', type: 'other' });
      loadZones();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save zone');
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      description: zone.description || '',
      places: zone.places || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this zone?')) return;

    try {
      setError('');
      await adminService.deleteZone(id);
      setSuccess('Zone deleted successfully');
      loadZones();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete zone');
    }
  };

  const addPlace = () => {
    if (!newPlace.name.trim()) return;
    setFormData({
      ...formData,
      places: [...formData.places, { ...newPlace, isActive: true }],
    });
    setNewPlace({ name: '', type: 'other' });
  };

  const removePlace = (index) => {
    setFormData({
      ...formData,
      places: formData.places.filter((_, i) => i !== index),
    });
  };

  const updatePlace = (index, field, value) => {
    const updated = [...formData.places];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, places: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Zone & Collection Points Management</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingZone(null);
            setFormData({ name: '', description: '', places: [] });
          }}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm"
        >
          + Add Zone
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">{success}</div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {editingZone ? 'Edit Zone' : 'Create New Zone'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingZone(null);
                setFormData({ name: '', description: '', places: [] });
              }}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Zone Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., Zone A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Optional description of the zone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Collection Points (Places)</label>
              <div className="space-y-2 mb-3">
                {formData.places.map((place, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <input
                      type="text"
                      value={place.name}
                      onChange={(e) => updatePlace(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                      placeholder="Place name"
                    />
                    <select
                      value={place.type}
                      onChange={(e) => updatePlace(index, 'type', e.target.value)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                    >
                      <option value="street-bin">Street Bin</option>
                      <option value="apartment">Apartment</option>
                      <option value="market">Market</option>
                      <option value="institution">Institution</option>
                      <option value="office">Office</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removePlace(index)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlace.name}
                  onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPlace())}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="New place name"
                />
                <select
                  value={newPlace.type}
                  onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value })}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                >
                  <option value="street-bin">Street Bin</option>
                  <option value="apartment">Apartment</option>
                  <option value="market">Market</option>
                  <option value="institution">Institution</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={addPlace}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm"
                >
                  Add Place
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
              >
                {editingZone ? 'Update Zone' : 'Create Zone'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingZone(null);
                  setFormData({ name: '', description: '', places: [] });
                }}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading zones...</div>
      ) : zones.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
          <p className="text-lg font-medium">No zones found</p>
          <p className="mt-2 text-sm">Create your first zone to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div
              key={zone._id}
              className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{zone.name}</h3>
                  {zone.description && (
                    <p className="text-sm text-slate-500 mt-1">{zone.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(zone)}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(zone._id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Collection Points ({zone.places?.length || 0})
                </p>
                {zone.places && zone.places.length > 0 ? (
                  <div className="space-y-1.5">
                    {zone.places.map((place, idx) => (
                      <div
                        key={place._id || idx}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-sm"
                      >
                        <span className="text-slate-700">{place.name}</span>
                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                          {place.type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No places added yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminZoneManagement;



