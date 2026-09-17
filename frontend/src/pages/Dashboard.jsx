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
      <div className="bg-transparent">
        <div className="py-2">
          <label className="block chalkboard-label text-sm mb-2 text-center">Look up a member</label>
          <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto shadow-sm rounded-lg overflow-hidden border border-cafe-ink border-opacity-20">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 opacity-50" />
              </div>
              <input
                type="text"
                className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg py-4 bg-white text-cafe-ink placeholder-opacity-50"
                placeholder="Search member by phone number..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 border-l border-opacity-20 border-cafe-ink text-lg font-medium text-white bg-cafe-ink hover:bg-opacity-90 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-cafe-ink border-opacity-10 max-w-2xl mx-auto">
          <div className="px-4 py-3 border-b border-opacity-10 border-cafe-ink bg-cafe-base">
            <h3 className="text-sm leading-6 font-medium text-opacity-70 text-cafe-ink uppercase tracking-wider">Search Results</h3>
          </div>
          <ul className="divide-y divide-opacity-10 divide-cafe-ink">
            {searchResults.map((member) => (
              <li key={member._id} className="p-4 hover:bg-cafe-base cursor-pointer transition-colors" onClick={() => navigate(`/members/${member._id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-cafe-caramel truncate">{member.name}</p>
                    <p className="text-sm opacity-70">{member.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold font-serif">{member.currentPoints} pts</p>
                    <p className="text-xs uppercase tracking-wide opacity-70 font-semibold">{member.tier}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-12">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-opacity-10 border-cafe-ink">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 opacity-50" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium opacity-70 truncate">Total Members</dt>
                  <dd className="text-2xl font-serif font-bold text-cafe-ink">{stats.totalMembers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-opacity-10 border-cafe-ink">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-6 w-6 opacity-50" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium opacity-70 truncate">Silver & Gold Members</dt>
                  <dd className="text-2xl font-serif font-bold text-cafe-ink">{stats.silverGold}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-opacity-10 border-cafe-ink">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-6 w-6 opacity-50" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium opacity-70 truncate">Quick Actions</dt>
                  <dd className="text-sm mt-1 text-cafe-caramel font-medium cursor-pointer hover:underline" onClick={() => navigate('/members')}>View all members</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
