import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Coffee } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-cafe-base flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Coffee className="h-12 w-12 text-cafe-caramel mx-auto" />
        <h2 className="mt-6 text-3xl font-extrabold font-serif text-cafe-ink">Register Staff Account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cafe-surface py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-cafe-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium opacity-80">Full Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-cafe-border rounded-lg shadow-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-cafe-caramel focus:border-cafe-caramel sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium opacity-80">Email address</label>
              <div className="mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-cafe-border rounded-lg shadow-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-cafe-caramel focus:border-cafe-caramel sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium opacity-80">Password</label>
              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-cafe-border rounded-lg shadow-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-cafe-caramel focus:border-cafe-caramel sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Register
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p>Already have an account? <Link to="/login" className="text-cafe-caramel font-medium hover:underline">Log in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
