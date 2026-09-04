import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import AuthTopBar from '../inc/AuthTopBar';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, loginWithGoogle, loginWithApple } = useAuth();

  const redirectTo = location.state?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading('email');
    const { error: authError } = await loginWithEmail(email, password);
    setLoading(null);
    if (authError) {
      setError(authError);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading('google');
    const { error: authError, redirecting } = await loginWithGoogle(redirectTo);
    setLoading(null);
    if (authError) {
      setError(authError);
      return;
    }
   
    if (redirecting) return;
    navigate(redirectTo, { replace: true });
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoading('apple');
    const { error: authError, redirecting } = await loginWithApple(redirectTo);
    setLoading(null);
    if (authError) {
      setError(authError);
      return;
    }
    if (redirecting) return;
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <AuthTopBar />
      <div className="max-w-md mx-auto px-4 py-10 sm:py-14">
        {/* rounded-2xl applied to the outer card */}
        <div className="border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="font-heading-runova text-3xl sm:text-4xl font-black tracking-tight text-black mt-3 mb-8 leading-tight">
            ACCESS YOUR<br />ACCOUNT
          </h1>

          {error && (
            <div className="mb-5 rounded-md bg-red-50 border border-red-200 text-[#c8102e] text-sm px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button type="button" onClick={handleGoogleLogin} disabled={loading !== null} className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              {loading === 'google' ? <Loader2 size={18} className="animate-spin" /> : <FcGoogle size={20} />}
              <span>Continue with Google</span>
            </button>

            <button type="button" onClick={handleAppleLogin} disabled={loading !== null} className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              {loading === 'apple' ? <Loader2 size={18} className="animate-spin" /> : <FaApple size={20} />}
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-500 whitespace-nowrap">or login with</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                Email address <span className="text-[#c8102e]">*</span>
              </label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                Password <span className="text-[#c8102e]">*</span>
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-3 pr-11 text-sm text-black focus:outline-none focus:border-black transition-colors" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-black cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <Link to="/forgot-password" className="text-sm text-black underline underline-offset-4 hover:text-gray-600 -mt-2">
              Forgot your password?
            </Link>

            <button type="submit" disabled={loading !== null} className="w-full bg-black text-white rounded-full py-3.5 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading === 'email' && <Loader2 size={16} className="animate-spin" />}
              <span>Sign in</span>
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-bold text-black mt-8">
          Not a member yet?{' '}
          <Link to="/register" className="underline underline-offset-4 font-bold">
            Create your account
          </Link>
        </p>

        <p className="text-xs text-gray-500 leading-relaxed mt-8">
          By clicking on "Continue with Google" or "Continue with Apple", I accept the{' '}
          <Link to="/terms" className="underline underline-offset-2 hover:text-black">Terms and Conditions</Link>.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed mt-3">
          To learn more about how we manage your personal information and your rights, please see our{' '}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-black">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;