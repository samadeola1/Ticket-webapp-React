import React, { useState, useRef, useEffect } from 'react'; // ChangeEvent, FormEvent removed
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  // Corrected: Use React.ChangeEvent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value.trim() }));
    if (errors[name as keyof typeof errors]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Corrected: Use React.FormEvent
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!form.email) {
      newErrors.email = 'Email is required';
      valid = false;
    }
    else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = 'Email address is invalid';
        valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    const loginSuccess = login(form.email);

    if (!loginSuccess) {
      setErrors(prev => ({ ...prev, password: 'Invalid email or password' }));
      if (formContainerRef.current) {
        formContainerRef.current.classList.add('animate-shake');
        setTimeout(() => {
          formContainerRef.current?.classList.remove('animate-shake');
        }, 400);
      }
    } else {
      showToast('✅ Login successful!', 'success');
      // Redirect handled by useEffect
    }
  };

  // JSX remains the same
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-indigo-50 to-white px-6">
      <div ref={formContainerRef} className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email" value={form.email} onChange={handleChange} type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email" required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password" value={form.password} onChange={handleChange} type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password" required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-semibold">
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;