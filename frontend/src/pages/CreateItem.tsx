import { useState, useEffect, type FC, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import type { ItemStatus } from '../types';
import { AlertCircle, PlusCircle } from 'lucide-react';

const CreateItem: FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    location: string;
    dateLostOrFound: string;
    status: ItemStatus;
    contactInfo: string;
  }>({
    name: '',
    description: '',
    location: '',
    dateLostOrFound: new Date().toISOString().split('T')[0],
    status: 'LOST',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Report Item | CampusFind';
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await itemService.createItem(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-[fade-in_0.5s_ease-out]">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Report an Item</h1>
        <p className="text-slate-300 text-lg">Fill in the details below to report a lost or found item.</p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="name">
                Item Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="glass-input"
                placeholder="e.g., Blue iPhone 13"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="status">
                Status *
              </label>
              <select
                id="status"
                name="status"
                className="glass-input [&>option]:bg-slate-800"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="dateLostOrFound">
                Date *
              </label>
              <input
                id="dateLostOrFound"
                name="dateLostOrFound"
                type="date"
                required
                className="glass-input [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                value={formData.dateLostOrFound}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="location">
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="glass-input"
                placeholder="e.g., Library 2nd Floor, Main Cafeteria"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="description">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="glass-input resize-none"
                placeholder="Provide detailed information about the item's appearance, brand, color, etc."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="contactInfo">
                Contact Information (Optional)
              </label>
              <input
                id="contactInfo"
                name="contactInfo"
                type="text"
                className="glass-input"
                placeholder="Phone number or alternative email"
                value={formData.contactInfo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
