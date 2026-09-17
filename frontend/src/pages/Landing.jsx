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

        {/* Demo Rewards Grid */}
        <div className="w-full max-w-4xl mx-auto mt-8 transform translate-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="reward-card-flat flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all bg-cafe-surface hover:border-cafe-caramel cursor-default hover:shadow-md border border-cafe-border rounded-2xl">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-[#F3E6DF]">
                <span className="text-2xl">☕</span>
              </div>
              <p className="font-bold text-cafe-ink mb-1">Coffee</p>
              <p className="text-sm font-medium text-cafe-caramel">100 pts</p>
            </div>

            <div className="reward-card-flat flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all bg-cafe-surface hover:border-cafe-caramel cursor-default hover:shadow-md border border-cafe-border rounded-2xl">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-[#E8ECEF]">
                <span className="text-2xl">🧊</span>
              </div>
              <p className="font-bold text-cafe-ink mb-1">Cold Coffee</p>
              <p className="text-sm font-medium text-cafe-caramel">150 pts</p>
            </div>

            <div className="reward-card-flat flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all bg-cafe-surface hover:border-cafe-caramel cursor-default hover:shadow-md border border-cafe-border rounded-2xl">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-[#F3E7CB]">
                <span className="text-2xl">🥪</span>
              </div>
              <p className="font-bold text-cafe-ink mb-1">Sandwich</p>
              <p className="text-sm font-medium text-cafe-caramel">200 pts</p>
            </div>

            <div className="reward-card-flat flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all bg-cafe-surface hover:border-cafe-caramel cursor-default hover:shadow-md border border-cafe-border rounded-2xl">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-[#F9E8E8]">
                <span className="text-2xl">🍰</span>
              </div>
              <p className="font-bold text-cafe-ink mb-1">Cake</p>
              <p className="text-sm font-medium text-cafe-caramel">300 pts</p>
            </div>
          </div>
        </div>
      </main>

      {/* Information Sections */}
      <section className="bg-white py-20 px-6 border-t border-cafe-border">
        <div className="max-w-4xl mx-auto space-y-16 text-cafe-ink">
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">The Problem</h2>
              <p className="text-cafe-muted leading-relaxed">
                Manual loyalty tracking in cafés often leads to incorrect point calculations, double-spending, negative balances, and incredibly slow workflows at the counter. Paper cards get lost, and messy spreadsheets create friction between staff and loyal customers.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold mb-4">The Solution</h2>
              <p className="text-cafe-muted leading-relaxed">
                CafeRewards provides a simple, robust, and integer-accurate loyalty platform that handles point mathematics automatically based on a member's lifetime tier. It maintains strict data integrity and allows staff to manage accounts instantly.
              </p>
            </div>
          </div>

          <div className="border-t border-cafe-border pt-12">
            <h2 className="font-serif text-3xl font-bold mb-6 text-center">Target Audience</h2>
            <p className="text-cafe-muted leading-relaxed text-center max-w-2xl mx-auto">
              This system is built specifically for **café managers, baristas, and counter staff** who need an incredibly fast, highly accurate, and beautifully simple point-of-sale companion to manage customer loyalty during a busy morning rush.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 border-t border-cafe-border pt-12">
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc pl-5 text-cafe-muted space-y-2">
                <li>Instant phone number lookups</li>
                <li>Dynamic earning tiers (Bronze to Platinum)</li>
                <li>Strict point expiry after 90 days</li>
                <li>Transactional outbox for reliable notifications</li>
                <li>Immutable ledger of all member history</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">How It Helps</h2>
              <ul className="list-disc pl-5 text-cafe-muted space-y-2">
                <li>Prevents mathematically impossible negative balances</li>
                <li>Drives customer retention via gamified tiers</li>
                <li>Saves counter time with lightning-fast searches</li>
                <li>Builds trust through total point transparency</li>
              </ul>
            </div>
          </div>

          <div className="bg-cafe-surface p-8 rounded-2xl border border-cafe-border mt-12">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Future Improvements</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-bold mb-2">Customer Mobile App</h3>
                <p className="text-sm text-cafe-muted">Allow members to view their own balances and generate QR codes for faster scanning.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Automated Notifications</h3>
                <p className="text-sm text-cafe-muted">WhatsApp/SMS receipt notifications instantly delivered for every purchase or redemption.</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Manager Analytics</h3>
                <p className="text-sm text-cafe-muted">Advanced graphical reporting and CSV exports to track daily loyalty liability.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
