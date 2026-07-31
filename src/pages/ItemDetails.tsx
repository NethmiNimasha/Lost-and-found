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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Oops!</h3>
        <p className="text-slate-500 mb-6">{error || 'Item not found'}</p>
        <button onClick={() => navigate('/')} className="text-primary hover:underline font-medium">
          &larr; Back to Dashboard
        </button>
      </div>
    );
  }

  const isOwner = item.reporter?.id === user?.id;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                item.status === 'LOST' ? 'bg-red-100 text-red-700' : 
                item.status === 'FOUND' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {item.status}
              </span>
              <span className="text-slate-400 text-sm font-medium">ID: #{item.id}</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-800 mb-4">{item.name}</h1>
            
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-slate-700 font-medium">{item.location || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Date</p>
                  <p className="text-slate-700 font-medium">{new Date(item.dateLostOrFound || (item as any).createdAt || Date.now()).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Reporter Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <User className="w-5 h-5 text-slate-400" />
                <span>{item.reporter?.username || (item as any).reportedBy?.username || 'Unknown User'}</span>
              </div>
              {item.contactInfo && (
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span>{item.contactInfo}</span>
                </div>
              )}
            </div>
          </div>

          {!isOwner && item.status !== 'RESOLVED' && (
            <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {item.status === 'FOUND' ? 'Claim this item' : 'I found this item'}
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Please provide proof or specific details to verify your claim.
              </p>

              {successMsg && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <p>{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleClaimSubmit}>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all mb-4 text-sm resize-none bg-white"
                  placeholder="Enter details like serial number, specific marks, or time/place..."
                  value={claimProof}
                  onChange={(e) => setClaimProof(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={submitting || !!successMsg}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
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
