import { useState, useEffect, type FC, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import type { Item } from '../types';
import { MapPin, Calendar, User, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

const ItemDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [claimProof, setClaimProof] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    document.title = 'Item Details | CampusFind';
    if (id) {
      fetchItemDetails(parseInt(id));
    }
  }, [id]);

  const fetchItemDetails = async (itemId: number) => {
    try {
      const data = await itemService.getItemById(itemId);
      setItem(data);
    } catch (err) {
      setError('Failed to fetch item details. It might have been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item || !claimProof) return;
    
    setSubmitting(true);
    try {
      await requestService.createRequest({
        item: { id: item.id } as Item,
        proofDetails: claimProof
      });
      setSuccessMsg('Your claim request has been submitted successfully! Check "My Requests" for status updates.');
      setClaimProof('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-24 glass-panel max-w-lg mx-auto rounded-2xl border-dashed border-2 border-white/20">
        <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
        <p className="text-slate-400 mb-6">{error || 'Item not found'}</p>
        <button onClick={() => navigate('/')} className="text-indigo-400 hover:text-indigo-300 font-medium">
          &larr; Back to Dashboard
        </button>
      </div>
    );
  }

  const isOwner = item.reporter?.id === user?.id;

  return (
    <div className="max-w-4xl mx-auto py-8 animate-[fade-in_0.5s_ease-out]">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <div className="flex justify-between items-start mb-6">
              <span className={
                item.status === 'LOST' ? 'badge-lost' : 
                item.status === 'FOUND' ? 'badge-found' : 'badge-default'
              }>
                {item.status}
              </span>
              <span className="text-slate-400 text-sm font-medium bg-black/20 px-3 py-1 rounded-full border border-white/5">ID: #{item.id}</span>
            </div>

            <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">{item.name}</h1>
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">{item.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/5 shadow-inner">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-slate-200 font-medium">{item.location || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/5 shadow-inner">
                  <Calendar className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Date</p>
                  <p className="text-slate-200 font-medium">{new Date(item.dateLostOrFound || (item as any).createdAt || Date.now()).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Reporter Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="bg-black/20 p-2 rounded-lg border border-white/5"><User className="w-5 h-5 text-indigo-400" /></div>
                <span className="font-medium">{item.reporter?.username || (item as any).reportedBy?.username || 'Unknown User'}</span>
              </div>
              {item.contactInfo && (
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="bg-black/20 p-2 rounded-lg border border-white/5"><Phone className="w-5 h-5 text-indigo-400" /></div>
                  <span className="font-medium">{item.contactInfo}</span>
                </div>
              )}
            </div>
          </div>

          {!isOwner && item.status !== 'RESOLVED' && (
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
              <h3 className="text-xl font-bold text-white mb-2">
                {item.status === 'FOUND' ? 'Claim this item' : 'I found this item'}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Please provide proof or specific details to verify your claim.
              </p>

              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleClaimSubmit}>
                <textarea
                  required
                  rows={4}
                  className="glass-input resize-none mb-4"
                  placeholder="Enter details like serial number, specific marks, or time/place..."
                  value={claimProof}
                  onChange={(e) => setClaimProof(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={submitting || !!successMsg}
                  className="w-full btn-primary disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
