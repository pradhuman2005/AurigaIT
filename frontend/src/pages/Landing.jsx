import { Link } from 'react-router-dom';
import { Coffee, CheckCircle, Users } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-cafe-base min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto mb-24">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-cafe-ink leading-tight mb-6">
          Every purchase. Every point.<br/>Always accurate.
        </h1>
        <p className="text-xl text-cafe-muted max-w-2xl mx-auto mb-10">
          A crafted loyalty platform that eliminates errors, speeds up checkout, and ensures your regulars always have a crystal-clear view of their points.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="btn-primary">
            Staff Login
          </Link>
          <Link to="/members" className="btn-ghost">
            View Demo Members
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
        <div className="bg-cafe-surface p-8 rounded-2xl border border-cafe-border">
          <div className="h-10 w-10 bg-[var(--color-tier-bronze-tint)] rounded-lg flex items-center justify-center mb-6">
            <CheckCircle className="h-5 w-5 text-[var(--color-tier-bronze)]" />
          </div>
          <h3 className="text-lg font-medium text-cafe-ink mb-2">Automated Tiers</h3>
          <p className="text-cafe-muted">Seamless progression and dynamic point multipliers based on lifetime spending.</p>
        </div>
        <div className="bg-cafe-surface p-8 rounded-2xl border border-cafe-border">
          <div className="h-10 w-10 bg-[var(--color-tier-silver-tint)] rounded-lg flex items-center justify-center mb-6">
            <Users className="h-5 w-5 text-[var(--color-tier-silver)]" />
          </div>
          <h3 className="text-lg font-medium text-cafe-ink mb-2">Fast Lookups</h3>
          <p className="text-cafe-muted">Instant phone number search keeps the line moving during morning rushes.</p>
        </div>
        <div className="bg-cafe-surface p-8 rounded-2xl border border-cafe-border">
          <div className="h-10 w-10 bg-[var(--color-tier-gold-tint)] rounded-lg flex items-center justify-center mb-6">
            <Coffee className="h-5 w-5 text-[var(--color-tier-gold)]" />
          </div>
          <h3 className="text-lg font-medium text-cafe-ink mb-2">Secure Ledger</h3>
          <p className="text-cafe-muted">Double-spend-proof redemptions backed by an immutable transaction history.</p>
        </div>
      </div>
    </div>
  );
}
