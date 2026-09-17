import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMember, getMemberTransactions, recordPurchase, getRewards, redeemReward } from '../services/api';
import { Award, IndianRupee, History, Coffee, Gift } from 'lucide-react';

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [memberData, transData, rewardsData] = await Promise.all([
        getMember(id),
        getMemberTransactions(id),
        getRewards()
      ]);
      setMember(memberData);
      setTransactions(transData);
      setRewards(rewardsData);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!purchaseAmount || purchaseAmount <= 0) return;
    setLoading(true);
    try {
      const res = await recordPurchase(id, parseFloat(purchaseAmount));
      setMessage({ text: `Purchase recorded! +${res.data.purchase.pointsEarned} points.`, type: 'success' });
      setPurchaseAmount('');
      fetchData(); // Refresh data
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Purchase failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId) => {
    setLoading(true);
    try {
      const res = await redeemReward(id, rewardId);
      setMessage({ text: `Reward redeemed! -${res.data.redemption.pointsUsed} points.`, type: 'success' });
      fetchData(); // Refresh data
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Redemption failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!member) return <div className="text-center p-8">Loading...</div>;

  const getMultiplier = (tier) => {
    if (tier === 'Gold') return 1.5;
    if (tier === 'Silver') return 1.25;
    return 1.0;
  };
  
  const estimatedPoints = purchaseAmount ? Math.floor((purchaseAmount / 10) * getMultiplier(member.tier)) : 0;
  
  const nextTierTarget = member.tier === 'Bronze' ? 500 : member.tier === 'Silver' ? 1000 : null;
  const progressToNext = nextTierTarget ? nextTierTarget - member.lifetimePoints : 0;

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
        <div className={`absolute top-0 left-0 w-full h-2 ${member.tier === 'Gold' ? 'bg-yellow-400' : member.tier === 'Silver' ? 'bg-slate-400' : 'bg-orange-800'}`}></div>
        <div className="p-6 sm:p-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">{member.name}</h2>
          <p className="text-slate-500 mb-8">{member.phone}</p>
          
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Current Balance</div>
          <div className="mt-2 text-6xl font-extrabold text-amber-600">
            {member.currentPoints} <span className="text-2xl text-slate-400 font-medium">pts</span>
          </div>
          
          <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full border border-slate-200 bg-slate-50">
            <Award className={`h-5 w-5 mr-2 ${member.tier === 'Gold' ? 'text-yellow-500' : member.tier === 'Silver' ? 'text-slate-500' : 'text-orange-800'}`} />
            <span className="font-medium text-slate-900">{member.tier} Tier</span>
            <span className="mx-2 text-slate-300">•</span>
            <span className="text-slate-600">{getMultiplier(member.tier)}× earning</span>
          </div>
          
          <div className="mt-8 flex justify-center space-x-12 border-t border-slate-100 pt-8">
            <div>
              <div className="text-sm text-slate-500">Lifetime Earned</div>
              <div className="text-xl font-semibold text-slate-900">{member.lifetimePoints}</div>
            </div>
            {nextTierTarget && (
              <div>
                <div className="text-sm text-slate-500">Progress to {member.tier === 'Bronze' ? 'Silver' : 'Gold'}</div>
                <div className="text-xl font-semibold text-slate-900">{progressToNext} pts</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record Purchase */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <IndianRupee className="h-6 w-6 text-slate-400 mr-2" />
            <h3 className="text-lg font-medium text-slate-900">Record Purchase</h3>
          </div>
          <form onSubmit={handlePurchase}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700">Purchase Amount (₹)</label>
              <input
                type="number"
                min="1"
                required
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="mt-1 focus:ring-amber-500 focus:border-amber-500 block w-full shadow-sm sm:text-lg border-slate-300 rounded-md py-3 px-4 bg-orange-50"
              />
            </div>
            {purchaseAmount > 0 && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                Estimated points: <strong>+{estimatedPoints}</strong> (based on {member.tier} tier)
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none disabled:opacity-50"
            >
              Record Purchase
            </button>
          </form>
        </div>

        {/* Redeem Reward */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Gift className="h-6 w-6 text-slate-400 mr-2" />
            <h3 className="text-lg font-medium text-slate-900">Redeem Reward</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map(reward => {
              const affordable = member.currentPoints >= reward.pointsCost;
              return (
                <div key={reward._id} className={`border rounded-lg p-4 ${affordable ? 'border-amber-200 bg-orange-50' : 'border-slate-200 bg-slate-50 opacity-75'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <Coffee className={`h-5 w-5 ${affordable ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className="font-bold text-slate-900">{reward.pointsCost} pts</span>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">{reward.name}</h4>
                  <button
                    onClick={() => handleRedeem(reward._id)}
                    disabled={!affordable || loading}
                    className={`mt-3 w-full py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white 
                      ${affordable ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-300 cursor-not-allowed'}`}
                  >
                    Redeem
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center">
          <History className="h-6 w-6 text-slate-400 mr-2" />
          <h3 className="text-lg font-medium text-slate-900">Transaction History</h3>
        </div>
        <ul className="divide-y divide-slate-200">
          {transactions.length === 0 ? (
            <li className="px-6 py-4 text-slate-500 text-center">No transactions yet.</li>
          ) : (
            transactions.map(t => (
              <li key={t._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {t.type === 'EARN' ? 'Purchase Recorded' : `Redeemed Reward`}
                  </p>
                  <p className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.type === 'EARN' ? 'text-green-600' : 'text-slate-900'}`}>
                    {t.type === 'EARN' ? '+' : '-'}{Math.abs(t.points)}
                  </p>
                  <p className="text-xs text-slate-500">Bal: {t.balanceAfter}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
