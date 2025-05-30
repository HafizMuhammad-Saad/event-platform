import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { set } from 'date-fns';
import { supabase } from '../services/supabase';

// Signup component
function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [role, setRole] = useState('customer'); // Default role
  const [error, setError] = useState(null);
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const user = await signUp(firstName, lastName, email, password, role);

     if (!user) {
setError('Signup failed');
    return;      }
    // setSuccessMsg('Account created successfully! Please check your email for confirmation.');
    await supabase
  .from('profiles2')
  .upsert([
    {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      role: role,
    }
  ], { onConflict: ['id'] });
  
  setSuccessMsg('Account created successfully! Please check your email for confirmation.');
setTimeout(() => navigate('/login'), 4000);
    
  };

  if (successMsg) {
    return (
    <div className="toast">
  <div className="alert alert-info">
    <span>{successMsg}</span>
  </div>
</div>

    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side - Beautiful Image */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
            <h1 className="text-3xl font-bold mt-4 text-center">Welcome To our Platform</h1>
            <p className="text-base-content/70 mt-2">Sign Up to access your account</p>
          </div>

          {error && (
            <div className="alert alert-error shadow-lg mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">First Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/50"
                  placeholder="Muhammad"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Last Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/50"
                  placeholder="Saad"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/50"
                  placeholder="you@example.com"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                  </svg>
                </span>
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                  required
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M8 7a5 5 0 013.61 1.5c.131.09.248.19.35.3A5 5 0 0115 12a5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5m0 2a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              {/* <label className="label">
                <a href="/forgot-password" className="label-text-alt link link-hover text-primary">Forgot password?</a>
              </label> */}
            </div>
            
            <div className="form-control mt-8">
              <button 
  type="submit" 
  className="btn btn-primary btn-block gap-2 hover:shadow-lg transition-all duration-300"
  disabled={loading} // Disable when loading
>
  {loading ? ( // Show spinner when loading
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ) : (
    // Show normal icon when not loading
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h9.5A2.25 2.25 0 0117 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-9.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0114.75 18h-9.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
    </svg>
  )}
  Sign Up
</button>
            </div>
          </form>
          
          <div className="divider my-6 text-base-content/40">OR CONTINUE WITH</div>
          
          <div className="flex flex-col space-y-3">
            <button className="btn btn-outline gap-2 hover:bg-base-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="btn btn-outline gap-2 hover:bg-base-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
          
          <p className="text-center mt-8 text-sm text-base-content/70">
            Already have an account?{' '}
            {/* <a href="/login" className="link link-primary font-medium">Login</a> */}
            <Link to='/login' className='link link-success font-medium'>Login</Link>
          </p>
        </div>
        

        {/* Right Side - Login Form */}
        <div className="hidden md:block md:w-1/2 bg-primary/10 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-secondary/30"></div>
          <img 
            src="https://img.freepik.com/free-photo/psychedelic-paper-shapes-with-copy-space_23-2149378308.jpg?semt=ais_hybrid&w=740" 
            alt="Financial security illustration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-3xl font-bold mb-2">Welcome to EventNest</h2>
            <p className="opacity-90">Manage your events with ease and security</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;