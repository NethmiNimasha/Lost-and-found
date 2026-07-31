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
    fetchRequests();
  }, []);

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
    <div className="py-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          {isAdmin ? 'Manage All Requests' : 'My Claim Requests'}
        </h1>
        <p className="text-slate-500 mt-2">
          {isAdmin ? 'Review and approve/reject item claims.' : 'Track the status of your claims.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700">No requests found</h3>
          <p className="text-slate-500 mt-1">You haven't made any claims yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">ID</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Item</th>
                  {isAdmin && <th className="px-6 py-4 font-semibold text-sm text-slate-600">Requester</th>}
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Date</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600">Status</th>
                  {isAdmin && <th className="px-6 py-4 font-semibold text-sm text-slate-600">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map(request => (
                  <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">#{request.id}</td>
                    <td className="px-6 py-4">
                      <Link to={`/items/${request.item.id}`} className="font-medium text-slate-800 hover:text-primary transition-colors">
                        {request.item.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1 truncate max-w-xs" title={request.proofDetails}>
                        Proof: {request.proofDetails}
                      </p>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {request.requester.username}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status === 'APPROVED' && <CheckCircle className="w-3.5 h-3.5" />}
                        {request.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                        {request.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                        {request.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        {request.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                              className="text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                              className="text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded transition-colors"
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
