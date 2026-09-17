import { Link } from 'react-router-dom';
import { Coffee, CheckCircle, Smartphone, Award, History } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Coffee className="h-20 w-20 text-amber-600 mx-auto mb-6" />
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">CafeRewards</h1>
        <p className="text-2xl font-medium text-amber-800 mb-8">Every purchase. Every point. Always accurate.</p>
        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10">
          A simple loyalty platform that helps cafés manage members, purchases, rewards and points in real time.
        </p>
        <Link to="/login" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700">
          Staff Login
        </Link>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Streamline Your Counter</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
              Ditch the paper punch cards and messy spreadsheets. CafeRewards eliminates calculation errors, speeds up the checkout line with instant phone lookups, and ensures your regulars always have a crystal-clear view of their points.
            </p>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-3xl mx-auto">
              Our platform automates the entire loyalty lifecycle. From seamless tier progression and dynamic point multipliers to secure, double-spend-proof redemptions—all backed by an immutable transaction ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <CheckCircle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Accurate Points</h3>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <Award className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Tier-Based Rewards</h3>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <Smartphone className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Fast Phone Lookup</h3>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg text-center">
              <History className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Transaction History</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-orange-200 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Built for</h2>
        <p className="text-slate-600 mb-8">Café owners, café managers, and counter staff.</p>
        
        <h3 className="text-xl font-bold text-slate-900 mb-4">Future Features</h3>
        <ul className="text-slate-600">
          <li>Member mobile app</li>
          <li>Automated WhatsApp/SMS reward notifications</li>
          <li>Loyalty analytics and reporting</li>
        </ul>
      </div>
    </div>
  );
}
