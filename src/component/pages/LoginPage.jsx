import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend hazır olanda sign-in məntiqi burada işə düşəcək
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-10 sm:py-14">
        {/* Ümumi karta rounded-2xl verildi */}
        <div className="border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black mt-3 mb-8 leading-tight">
            ACCESS YOUR<br />ACCOUNT
          </h1>

          <div className="flex flex-col gap-3">
            <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors cursor-pointer">
              <FcGoogle size={20} />
              <span>Continue with Google</span>
            </button>

            <button type="button" className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors cursor-pointer">
              <FaApple size={20} />
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
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                Password <span className="text-[#c8102e]">*</span>
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-3 pr-11 text-sm text-black focus:outline-none focus:border-black transition-colors" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-black cursor-pointer" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <Link to="/forgot-password" className="text-sm text-black underline underline-offset-4 hover:text-gray-600 -mt-2">
              Forgot your password?
            </Link>

            <button type="submit" className="w-full bg-black text-white rounded-full py-3.5 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer">
              Sign in
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