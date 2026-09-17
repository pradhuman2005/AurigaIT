import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Coffee, Search, PlusCircle, ArrowLeft, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import api from '../services/api';

// Simple custom hook for count up animation
function useCountUp(end, duration = 1000) {
  const [count, setCount] = useState(0);
  const prevEndRef = useRef(end);

  useEffect(() => {
    // If end is 0 initially, set to 0 immediately
    if (prevEndRef.current === undefined) {
      setCount(end);
      prevEndRef.current = end;
      return;
    }

    const start = count;
    const difference = end - start;
    if (difference === 0) return;

    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + difference * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
        prevEndRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const animatedPoints = useCountUp(member?.currentPoints || 0, 1200);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [memberRes, transRes, rewardsRes] = await Promise.all([
        api.get(`/members/${id}`),
        api.get(`/members/${id}/transactions`),
        api.get(`/rewards`)
      ]);
      setMember(memberRes.data);
      setTransactions(transRes.data);
      setRewards(rewardsRes.data);
    } catch (error) {
      console.error(error);
      setError('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccessMsg('');
      const res = await api.post('/purchases', {
        memberId: id,
        amount: Number(purchaseAmount)
      });
      setPurchaseAmount('');
      setShowPurchaseForm(false);
      setSuccessMsg(`Successfully recorded purchase. Earned ${res.data.data.purchase.pointsEarned} points.`);
      fetchData();
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record purchase');
    }
  };

  const handleRedeem = async (rewardId) => {
    try {
      setError('');
      setSuccessMsg('');
      const res = await api.post('/redemptions', {
        memberId: id,
        rewardId
      });
      setSuccessMsg('Reward redeemed successfully!');
      fetchData();
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to redeem reward');
    }
  };

  const getMultiplier = (tier) => {
    if (tier === 'Gold') return 1.5;
    if (tier === 'Silver') return 1.25;
    return 1.0;
  };

  const getTierColor = (tier) => {
    if (tier === 'Gold') return 'bg-[#C9A34E] text-white';
    if (tier === 'Silver') return 'bg-[#8E9AA6] text-white';
    return 'bg-[#A9744F] text-white';
  };

  const getTierTextClass = (tier) => {
    if (tier === 'Gold') return 'text-[#C9A34E]';
    if (tier === 'Silver') return 'text-[#8E9AA6]';
    return 'text-[#A9744F]';
  };

  if (loading) return <div className="text-center p-8 text-cafe-ink opacity-70">Loading...</div>;
  if (!member) return <div className="text-center p-8 text-red-500">Member not found</div>;

  const estimatedPoints = purchaseAmount ? Math.floor((purchaseAmount / 10) * getMultiplier(member.tier)) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium opacity-70 hover:opacity-100 transition-opacity text-cafe-ink">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </button>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">{error}</div>}
      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200">{successMsg}</div>}

      {/* Hero Ticket Stub */}
      <div className="ticket-stub">
        <div className={`ticket-tier-bar ${getTierColor(member.tier)}`}></div>
        <div className="p-8 sm:p-12 text-center">
          <div className="mb-4">
            <span className={`inline-flex items-center justify-center h-12 w-12 rounded-full border-2 ${getTierTextClass(member.tier)} border-current bg-white shadow-sm font-bold tracking-wider uppercase text-xs transform -rotate-12`}>
              {member.tier}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-cafe-ink mb-2">{member.name}</h2>
          <p className="text-cafe-ink opacity-60 mb-8">{member.phone} &bull; {member.email}</p>
          
          <div className="relative inline-block">
            <div className="text-6xl sm:text-8xl font-serif font-bold text-cafe-ink mb-2 tabular-nums">
              {animatedPoints}
            </div>
            <div className="text-sm uppercase tracking-widest font-semibold opacity-50 mb-2">Current Balance</div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-dashed border-opacity-20 border-cafe-ink">
            <div className="flex justify-center space-x-12">
              <div>
                <p className="text-sm opacity-60">Lifetime Points</p>
                <p className="text-xl font-bold font-serif">{member.lifetimePoints}</p>
              </div>
              <div>
                <p className="text-sm opacity-60">Multiplier</p>
                <p className="text-xl font-bold font-serif">{getMultiplier(member.tier)}x</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Record Purchase Action */}
        <div className="bg-white rounded-lg shadow-sm border border-opacity-10 border-cafe-ink overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold font-serif text-cafe-ink mb-4 flex items-center">
              <PlusCircle className="h-5 w-5 mr-2 text-cafe-caramel" />
              Record Purchase
            </h3>
            
            {!showPurchaseForm ? (
              <button
                onClick={() => setShowPurchaseForm(true)}
                className="w-full py-4 border-2 border-dashed border-opacity-20 border-cafe-ink rounded-lg text-cafe-ink opacity-70 hover:opacity-100 hover:border-cafe-caramel hover:text-cafe-caramel transition-colors font-medium"
              >
                + Add new purchase
              </button>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-cafe-ink opacity-70">Purchase Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="mt-1 focus:ring-0 focus:outline-none block w-full border-b border-opacity-20 border-cafe-ink py-2 bg-transparent text-xl font-serif"
                    placeholder="e.g. 450"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                  />
                  {purchaseAmount && (
                    <p className="mt-2 text-sm text-cafe-caramel font-medium">
                      Estimated points: <strong>+{estimatedPoints}</strong>
                    </p>
                  )}
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-cafe-ink text-white py-3 rounded text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPurchaseForm(false); setPurchaseAmount(''); }}
                    className="flex-1 bg-slate-100 text-cafe-ink py-3 rounded text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Redeem Rewards */}
        <div className="bg-white rounded-lg shadow-sm border border-opacity-10 border-cafe-ink overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold font-serif text-cafe-ink mb-4 flex items-center">
              <Coffee className="h-5 w-5 mr-2 text-cafe-caramel" />
              Redeem Rewards
            </h3>
            <div className="space-y-3">
              {rewards.map(reward => {
                const affordable = member.currentPoints >= reward.pointsCost;
                return (
                  <div key={reward._id} className={`border rounded p-4 flex justify-between items-center ${affordable ? 'border-cafe-caramel bg-cafe-base' : 'border-opacity-10 border-cafe-ink bg-slate-50 opacity-60'}`}>
                    <div className="flex items-center">
                      <div className="mr-3 text-cafe-caramel">
                        {reward.name.toLowerCase().includes('coffee') ? <Coffee className="h-6 w-6" /> : <div className="h-6 w-6 rounded-full bg-cafe-caramel bg-opacity-20 flex items-center justify-center font-bold text-xs">☕</div>}
                      </div>
                      <div>
                        <p className="font-medium text-cafe-ink">{reward.name}</p>
                        <p className="text-sm font-serif font-bold text-cafe-caramel">{reward.pointsCost} pts</p>
                      </div>
                    </div>
                    <button
                      disabled={!affordable}
                      onClick={() => handleRedeem(reward._id)}
                      className={`px-4 py-2 rounded text-sm font-medium ${affordable ? 'bg-cafe-caramel text-white hover:bg-opacity-90 transition-colors' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                    >
                      Redeem
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-lg shadow-sm border border-opacity-10 border-cafe-ink overflow-hidden">
        <div className="px-6 py-4 border-b border-opacity-10 border-cafe-ink">
          <h3 className="text-lg font-bold font-serif text-cafe-ink">Transaction History</h3>
        </div>
        <ul className="divide-y divide-opacity-10 divide-cafe-ink">
          {transactions.map(t => (
            <li key={t._id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center">
                {t.type === 'EARN' ? (
                  <ArrowUpCircle className="h-8 w-8 text-green-500 mr-4 opacity-80" />
                ) : (
                  <ArrowDownCircle className="h-8 w-8 text-cafe-caramel mr-4 opacity-80" />
                )}
                <div>
                  <p className="font-medium text-cafe-ink">{t.description}</p>
                  <p className="text-sm opacity-60">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className={`text-xl font-bold font-serif ${t.type === 'EARN' ? 'text-green-600' : 'text-cafe-caramel'}`}>
                {t.type === 'EARN' ? '+' : ''}{t.points}
              </div>
            </li>
          ))}
          {transactions.length === 0 && (
            <li className="px-6 py-8 text-center opacity-60 italic">No transactions yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
