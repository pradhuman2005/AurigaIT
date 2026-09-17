import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Coffee, PlusCircle, ArrowLeft, ArrowDownCircle, ArrowUpCircle, Check } from 'lucide-react';
import api from '../services/api';

function useCountUp(end, duration = 1000) {
  const [count, setCount] = useState(0);
  const prevEndRef = useRef(end);
  useEffect(() => {
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
      setError('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/purchases', { memberId: id, amount: Number(purchaseAmount) });
      setPurchaseAmount('');
      setShowPurchaseForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record purchase');
    }
  };

  const handleRedeem = async (reward) => {
    if (!window.confirm(`Are you sure you want to redeem ${reward.name} for ${reward.pointsCost} points?`)) {
      return;
    }
    try {
      setError('');
      await api.post('/redemptions', { memberId: id, rewardId: reward._id });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to redeem reward');
    }
  };

  const getMultiplier = (tier) => {
    if (tier === 'Gold') return 1.5;
    if (tier === 'Silver') return 1.25;
    return 1.0;
  };

  const getTierColors = (tier) => {
    if (tier === 'Gold') return { bg: 'bg-[#C9A34E]', text: 'text-[#C9A34E]', tint: 'bg-[#F3E7CB]' };
    if (tier === 'Silver') return { bg: 'bg-[#8E9AA6]', text: 'text-[#8E9AA6]', tint: 'bg-[#E8ECEF]' };
    return { bg: 'bg-[#A9744F]', text: 'text-[#A9744F]', tint: 'bg-[#F3E6DF]' };
  };

  if (loading) return <div className="text-center p-8 opacity-70">Loading...</div>;
  if (!member) return <div className="text-center p-8 text-red-500">Member not found</div>;

  const estimatedPoints = purchaseAmount ? Math.floor((purchaseAmount / 10) * getMultiplier(member.tier)) : 0;
  const tierColors = getTierColors(member.tier);

  // Check which rewards have been redeemed historically
  const redeemedRewardNames = new Set(
    transactions.filter(t => t.type === 'REDEEM').map(t => {
      // E.g. "Redeemed Coffee"
      return t.description ? t.description.replace('Redeemed ', '') : '';
    })
  );

  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-16">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to members
      </button>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">{error}</div>}

      {/* Hero Loyalty Card (Ticket Stub) */}
      <div className="loyalty-card">
        <div className={`loyalty-card-accent ${tierColors.bg}`}></div>
        
        <div className="p-8 sm:p-12">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-xl font-bold font-sans text-cafe-ink">{member.name}</h2>
              <p className="opacity-60 text-sm mt-1">{member.phone}</p>
            </div>
            {/* Tier Seal */}
            <div className={`flex items-center px-3 py-1.5 rounded-full ${tierColors.tint}`}>
              <div className={`h-1.5 w-1.5 rounded-full ${tierColors.bg} mr-2`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${tierColors.text}`}>
                {member.tier} &middot; {getMultiplier(member.tier)}x
              </span>
            </div>
          </div>
          
          {/* Main Balance */}
          <div className="mb-10 text-center">
            <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-cafe-muted mb-2">Available Balance</div>
            <div className="flex items-baseline justify-center">
              <span className="text-7xl sm:text-[80px] font-serif font-bold text-cafe-ink tabular-nums leading-none">
                {animatedPoints.toLocaleString()}
              </span>
              <span className="ml-2 text-sm font-medium text-cafe-ink opacity-80">pts</span>
            </div>
          </div>
          
          {/* 3 Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-6 dashed-divider text-center">
            <div>
              <p className="text-[10px] text-cafe-muted mb-1">Lifetime earned</p>
              <p className="text-sm font-medium text-cafe-ink">{member.lifetimePoints.toLocaleString()} pts</p>
            </div>
            <div>
              <p className="text-[10px] text-cafe-muted mb-1">Tier</p>
              <p className="text-sm font-medium text-cafe-ink">{member.tier}</p>
            </div>
            <div>
              <p className="text-[10px] text-cafe-muted mb-1">Member since</p>
              <p className="text-sm font-medium text-cafe-ink">{new Date(member.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Punch Strip Footer */}
        <div className="bg-[#FAF6F0] p-6 border-t border-dashed border-cafe-border">
          <p className="text-xs uppercase tracking-wider opacity-50 mb-4 text-center">Reward Collection</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {rewards.map(reward => {
              const isRedeemed = redeemedRewardNames.has(reward.name);
              return (
                <div key={reward._id} className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                  isRedeemed 
                  ? 'bg-cafe-caramel text-white shadow-sm' 
                  : 'bg-transparent border border-dashed border-cafe-muted opacity-60 text-cafe-ink'
                }`}>
                  {isRedeemed ? <Check className="h-3 w-3 mr-1.5" /> : <div className="h-3 w-3 rounded-full border border-cafe-muted mr-1.5"></div>}
                  {reward.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-12 text-center">
        <h3 className="text-3xl font-serif text-cafe-ink mb-10">Redeem a reward</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {rewards.map(reward => {
            const affordable = member.currentPoints >= reward.pointsCost;
            return (
              <button
                key={reward._id}
                disabled={!affordable}
                onClick={() => handleRedeem(reward)}
                className={`reward-card-flat flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all ${
                  affordable ? 'hover:border-cafe-caramel cursor-pointer hover:shadow-md' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                  reward.name.includes('Coffee') && !reward.name.includes('Cold') ? 'bg-[#F3E6DF]' : 
                  reward.name.includes('Cold') ? 'bg-[#E8ECEF]' :
                  reward.name.includes('Sandwich') ? 'bg-[#F3E7CB]' : 'bg-[#F9E8E8]'
                }`}>
                  <span className="text-2xl">
                    {reward.name.includes('Coffee') && !reward.name.includes('Cold') ? '☕' : 
                     reward.name.includes('Cold') ? '🧊' :
                     reward.name.includes('Sandwich') ? '🥪' : '🍰'}
                  </span>
                </div>
                <p className="font-bold text-cafe-ink mb-1">{reward.name}</p>
                <p className="text-sm font-medium text-cafe-caramel">{reward.pointsCost} pts</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
        {/* Record Purchase Action */}
        <div>
          <h3 className="text-xl font-bold font-serif mb-4">Record Purchase</h3>
          {!showPurchaseForm ? (
            <button
              onClick={() => setShowPurchaseForm(true)}
              className="w-full py-6 border-2 border-dashed border-cafe-border rounded-xl text-cafe-ink opacity-70 hover:opacity-100 hover:border-cafe-caramel hover:text-cafe-caramel transition-colors font-medium bg-cafe-surface"
            >
              + Add new purchase
            </button>
          ) : (
            <form onSubmit={handlePurchase} className="space-y-4 bg-cafe-surface p-6 rounded-xl border border-cafe-border">
              <div>
                <label className="block text-sm font-medium opacity-70">Purchase Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="mt-2 focus:ring-0 focus:outline-none block w-full border-b border-cafe-border py-2 bg-transparent text-xl font-serif text-cafe-ink"
                  placeholder="e.g. 450"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
                {purchaseAmount && (
                  <p className="mt-3 text-sm text-cafe-caramel font-medium">
                    Estimated points: +{estimatedPoints}
                  </p>
                )}
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 btn-primary text-sm py-2">
                  Confirm
                </button>
                <button type="button" onClick={() => { setShowPurchaseForm(false); setPurchaseAmount(''); }} className="flex-1 btn-ghost text-sm py-2">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Ledger */}
      <div className="pt-16">
        <h3 className="text-xl font-bold font-serif mb-6">Transaction Ledger</h3>
        <div className="bg-cafe-surface rounded-xl border border-cafe-border overflow-hidden">
          <ul className="divide-y divide-cafe-border">
            {transactions.map(t => (
              <li key={t._id} className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center">
                  {t.type === 'EARN' ? (
                    <div className="h-8 w-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mr-4">
                      <ArrowUpCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#F3E6DF] border border-[#E8DFD2] flex items-center justify-center mr-4">
                      <ArrowDownCircle className="h-5 w-5 text-cafe-caramel" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-cafe-ink">{t.description}</p>
                    <p className="text-xs opacity-60 mt-1">{new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`text-xl font-bold font-serif ${t.type === 'EARN' ? 'text-green-600' : 'text-cafe-caramel'}`}>
                  {t.type === 'EARN' ? '+' : ''}{t.points}
                </div>
              </li>
            ))}
            {transactions.length === 0 && (
              <li className="px-6 py-8 text-center opacity-60 italic text-sm">No transactions yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
