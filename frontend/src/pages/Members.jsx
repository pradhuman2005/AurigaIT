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

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-slate-900">Members List</h3>
        <div className="text-sm text-slate-500">Total: {pagination.totalItems}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Name', 'Phone', 'Tier', 'Current Points', 'Lifetime Points'].map((col) => {
                const field = col.replace(' ', '').charAt(0).toLowerCase() + col.replace(' ', '').slice(1);
                const actualField = field === 'currentPoints' ? 'currentPoints' : field === 'lifetimePoints' ? 'lifetimePoints' : field.toLowerCase();
                return (
                  <th
                    key={col}
                    onClick={() => handleSort(actualField)}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                  >
                    {col} {sortField === actualField ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </th>
                )
              })}
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {members.map((member) => (
              <tr key={member._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{member.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${member.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 
                      member.tier === 'Silver' ? 'bg-slate-100 text-slate-800' : 
                      'bg-orange-100 text-orange-800'}`}>
                    {member.tier}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.currentPoints}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{member.lifetimePoints}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => navigate(`/members/${member._id}`)} className="text-amber-600 hover:text-amber-900">View</button>
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
