import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers, createMember } from '../services/api';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, [pagination.page, sortField, sortOrder]);

  const fetchMembers = async () => {
    try {
      const data = await getMembers(pagination.page, pagination.limit, sortField, sortOrder);
      setMembers(data.members);
      setPagination({
        ...pagination,
        totalPages: data.totalPages,
        totalItems: data.totalItems
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPagination({ ...pagination, page: 1 });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMember(newMember);
      setIsModalOpen(false);
      setNewMember({ name: '', phone: '', email: '' });
      // Refresh list to show new member
      setSortField('createdAt');
      setSortOrder('desc');
      setPagination({ ...pagination, page: 1 });
      fetchMembers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-opacity-10 border-cafe-ink">
      <div className="px-6 py-5 border-b border-opacity-10 border-cafe-ink flex justify-between items-center bg-cafe-base">
        <h3 className="text-xl leading-6 font-bold font-serif text-cafe-ink">All Members</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-cafe-ink text-white rounded font-medium text-sm hover:bg-opacity-90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1.5" /> Add Member
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-opacity-10 divide-cafe-ink">
          <thead className="bg-slate-50">
            <tr>
              <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-opacity-70 text-cafe-ink uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                Name {getSortIcon('name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-opacity-70 text-cafe-ink uppercase tracking-wider">
                Contact
              </th>
              <th onClick={() => handleSort('tier')} className="px-6 py-3 text-left text-xs font-medium text-opacity-70 text-cafe-ink uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                Tier {getSortIcon('tier')}
              </th>
              <th onClick={() => handleSort('currentPoints')} className="px-6 py-3 text-right text-xs font-medium text-opacity-70 text-cafe-ink uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                Balance {getSortIcon('currentPoints')}
              </th>
              <th onClick={() => handleSort('lifetimePoints')} className="px-6 py-3 text-right text-xs font-medium text-opacity-70 text-cafe-ink uppercase tracking-wider cursor-pointer hover:bg-slate-100">
                Lifetime {getSortIcon('lifetimePoints')}
              </th>
              <th className="px-6 py-3 relative">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-opacity-10 divide-cafe-ink">
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-cafe-base transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cafe-ink">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm opacity-70">{member.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.tier === 'Platinum' ? 'bg-[#4B5563] text-white' :
                    member.tier === 'Gold' ? 'bg-[#C9A34E] text-white' : 
                    member.tier === 'Silver' ? 'bg-[#8E9AA6] text-white' : 
                    'bg-[#A9744F] text-white'
                  }`}>
                    {member.tier}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold font-serif">{member.currentPoints}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-serif opacity-70">{member.lifetimePoints}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => navigate(`/members/${member._id}`)} className="text-cafe-caramel hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 border-t border-slate-200 flex items-center justify-between sm:px-6">
        <div className="flex-1 flex justify-between">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
          >
            Previous
          </button>
          <span className="text-sm text-slate-700 py-2">
            Page <span className="font-medium">{pagination.page}</span> of <span className="font-medium">{pagination.totalPages}</span>
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
            disabled={pagination.page === pagination.totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-cafe-ink bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-cafe-surface rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-cafe-border">
              <div className="bg-cafe-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-2xl leading-6 font-serif font-bold text-cafe-ink" id="modal-title">
                    New Member
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-cafe-muted hover:text-cafe-ink">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleCreateMember}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-cafe-ink mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="form-input block w-full px-4 py-3 rounded-lg border border-cafe-border bg-white text-cafe-ink focus:outline-none focus:border-cafe-caramel"
                        value={newMember.name}
                        onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-cafe-ink mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        className="form-input block w-full px-4 py-3 rounded-lg border border-cafe-border bg-white text-cafe-ink focus:outline-none focus:border-cafe-caramel"
                        value={newMember.phone}
                        onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-cafe-ink mb-1">Email (Optional)</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-input block w-full px-4 py-3 rounded-lg border border-cafe-border bg-white text-cafe-ink focus:outline-none focus:border-cafe-caramel"
                        value={newMember.email}
                        onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-8 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-3 bg-cafe-ink text-base font-medium text-white hover:bg-opacity-90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Member'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-cafe-border shadow-sm px-4 py-3 bg-white text-base font-medium text-cafe-ink hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
