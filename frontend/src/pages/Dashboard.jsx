import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMembers, getMembers } from '../services/api';
import { Search, Users, Award, Zap } from 'lucide-react';

export default function Dashboard() {
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stats, setStats] = useState({ totalMembers: 0, silverGold: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getMembers(1, 100);
      setStats({
        totalMembers: data.totalItems,
        silverGold: data.members.filter(m => m.tier !== 'Bronze').length
      });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPhone) return;
    try {
      const results = await searchMembers(searchPhone);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <form onSubmit={handleSearch} className="flex">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 sm:text-lg border-slate-300 rounded-l-md py-4 bg-orange-50"
                placeholder="Search member by phone number..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-4 border border-transparent text-lg font-medium rounded-r-md text-white bg-amber-600 hover:bg-amber-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-slate-200">
            <h3 className="text-lg leading-6 font-medium text-slate-900">Search Results</h3>
          </div>
          <ul className="divide-y divide-slate-200">
            {searchResults.map((member) => (
              <li key={member._id} className="p-4 hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/members/${member._id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 truncate">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{member.currentPoints} pts</p>
                    <p className="text-sm text-slate-500">{member.tier}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-slate-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Total Members</dt>
                  <dd className="text-lg font-medium text-slate-900">{stats.totalMembers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 text-slate-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Silver & Gold Members</dt>
                  <dd className="text-lg font-medium text-slate-900">{stats.silverGold}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-6 w-6 text-slate-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Quick Actions</dt>
                  <dd className="text-sm mt-1 text-amber-600 cursor-pointer hover:underline" onClick={() => navigate('/members')}>View all members</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
