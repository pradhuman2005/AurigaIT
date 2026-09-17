import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
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

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-opacity-10 border-cafe-ink">
      <div className="px-6 py-5 border-b border-opacity-10 border-cafe-ink flex justify-between items-center bg-cafe-base">
        <h3 className="text-xl leading-6 font-bold font-serif text-cafe-ink">All Members</h3>
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
    </div>
  );
}
