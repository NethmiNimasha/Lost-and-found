import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { useAuth } from '../context/AuthContext';
import type { Request } from '../types';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const MyRequests: React.FC = () => {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = isAdmin ? 'Manage Requests | CampusFind' : 'My Requests | CampusFind';
    fetchRequests();
  }, [isAdmin]);

  const fetchRequests = async () => {
    try {
      const data = isAdmin ? await requestService.getAllRequests() : await requestService.getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await requestService.updateRequestStatus(id, newStatus);
      // Optimistic update
      setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus as any } : req));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto animate-[fade-in_0.5s_ease-out]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          {isAdmin ? 'Manage All Requests' : 'My Claim Requests'}
        </h1>
        <p className="text-slate-300 text-lg">
          {isAdmin ? 'Review and approve/reject item claims.' : 'Track the status of your claims.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-2xl border-dashed border-2 border-white/20">
          <div className="bg-black/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No requests found</h3>
          <p className="text-slate-400">You haven't made any claims yet.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/10">
                  <th className="px-6 py-5 font-semibold text-sm text-slate-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-5 font-semibold text-sm text-slate-300 uppercase tracking-wider">Item</th>
                  {isAdmin && <th className="px-6 py-5 font-semibold text-sm text-slate-300 uppercase tracking-wider">Requester</th>}
                  <th className="px-6 py-5 font-semibold text-sm text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-5 font-semibold text-sm text-slate-300 uppercase tracking-wider">Status</th>
                  {isAdmin && <th className="px-6 py-5 font-semibold text-sm text-slate-300 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map(request => (
                  <tr key={request.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 text-sm text-slate-400 font-medium">#{request.id}</td>
                    <td className="px-6 py-5">
                      <Link to={`/items/${request.item.id}`} className="font-bold text-indigo-300 hover:text-indigo-200 transition-colors">
                        {request.item.name}
                      </Link>
                      <p className="text-xs text-slate-400 mt-1.5 truncate max-w-xs" title={request.proofDetails}>
                        <span className="font-semibold text-slate-300">Proof:</span> {request.proofDetails}
                      </p>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-5 text-sm text-slate-300 font-medium">
                        {request.requester.username}
                      </td>
                    )}
                    <td className="px-6 py-5 text-sm text-slate-400">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        request.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        request.status === 'REJECTED' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}>
                        {request.status === 'APPROVED' && <CheckCircle className="w-3.5 h-3.5" />}
                        {request.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                        {request.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {request.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-5">
                        {request.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                              className="text-xs font-bold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                              className="text-xs font-bold text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
