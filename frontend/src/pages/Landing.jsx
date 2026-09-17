import { Link } from 'react-router-dom';
import { Coffee, CheckCircle, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-cafe-base min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-cafe-caramel rounded-full flex items-center justify-center text-white font-serif font-bold text-xl">
            C
          </div>
          <span className="font-serif font-bold text-xl text-cafe-ink">CafeRewards</span>
        </div>
        <Link to="/login" className="px-6 py-2.5 bg-cafe-ink text-white rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors">
          Staff Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center max-w-4xl mx-auto">
        <p className="text-cafe-caramel font-medium mb-6">
          Every purchase. Every point. Always accurate.
        </p>
        <h1 className="text-6xl sm:text-7xl md:text-[80px] font-serif text-cafe-ink leading-[1.1] mb-8">
          The counter that<br/>never<br/>gets the math wrong.
        </h1>
        <p className="text-lg sm:text-xl text-cafe-muted max-w-2xl mx-auto mb-12 leading-relaxed">
          A loyalty platform built for the register, not the boardroom. Look up a member, ring a purchase, hand over the reward — the balance is always exactly right.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link to="/login" className="btn-primary">
            Staff Login
          </Link>
          <Link to="/members" className="btn-ghost bg-white">
            See how it works
          </Link>
        </div>

        {/* Demo Preview Card */}
        <div className="w-full max-w-md mx-auto text-left transform translate-y-8">
          <div className="loyalty-card">
            <div className="loyalty-card-accent bg-[var(--color-tier-gold)]"></div>
            
            <div className="p-8 pb-6">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-xl font-bold text-cafe-ink">Rohan Mehta</h2>
                  <p className="text-cafe-muted text-sm mt-1">+91 98765 43210</p>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-full bg-[var(--color-tier-gold-tint)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-tier-gold)] mr-2"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-tier-gold)]">
                    Gold &middot; 1.5x
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-[10px] uppercase tracking-[0.1em] font-semibold text-cafe-muted mb-2">Current Balance</div>
                <div className="flex items-baseline">
                  <span className="text-7xl font-serif text-cafe-ink leading-none">1,500</span>
                  <span className="ml-2 text-sm font-medium text-cafe-ink">pts</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-6 dashed-divider">
                <div>
                  <p className="text-[10px] text-cafe-muted mb-1">Lifetime earned</p>
                  <p className="text-sm font-medium text-cafe-ink">2,000 pts</p>
                </div>
                <div>
                  <p className="text-[10px] text-cafe-muted mb-1">Tier</p>
                  <p className="text-sm font-medium text-cafe-ink">Gold</p>
                </div>
                <div>
                  <p className="text-[10px] text-cafe-muted mb-1">Member since</p>
                  <p className="text-sm font-medium text-cafe-ink">Mar 2025</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 flex gap-3 justify-center">
              <div className="flex items-center px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-tier-gold-tint)] text-[var(--color-tier-gold)]">
                <CheckCircle className="h-3 w-3 mr-1.5" /> Coffee
              </div>
              <div className="flex items-center px-3 py-1.5 rounded text-xs font-medium bg-[var(--color-tier-gold-tint)] text-[var(--color-tier-gold)]">
                <CheckCircle className="h-3 w-3 mr-1.5" /> Cake
              </div>
              <div className="flex items-center px-3 py-1.5 rounded text-xs font-medium border border-dashed border-cafe-border text-cafe-muted bg-transparent">
                Sandwich
              </div>
              <div className="flex items-center px-3 py-1.5 rounded text-xs font-medium border border-dashed border-cafe-border text-cafe-muted bg-transparent">
                Cold Coffee
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-cafe-muted mt-12 mb-8 italic">
            Design direction preview — not the final app, just the new visual language.
          </p>
        </div>
      </main>
    </div>
  );
}
