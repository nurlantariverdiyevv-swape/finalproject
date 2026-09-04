import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthTopBar from '../inc/AuthTopBar';

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await resetPassword(email);

    setLoading(false);

    if (authError) {
      setError(authError);
      return;
    }
    setSent(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5]">
      <AuthTopBar />

      <div className="max-w-md mx-auto px-4 py-10 sm:py-14">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          {sent ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-3 leading-tight">
                Check your email
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                If an account exists for <span className="font-semibold text-black">{email}</span>, we've sent a
                password reset link to it. Open the email and follow the link to set a new password.
              </p>
              <Link to="/login" className="block w-full text-center bg-black text-white rounded-full py-3.5 text-sm font-bold hover:opacity-90 transition-opacity">
                Back to login
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-3 leading-tight">
                Reset password
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed mb-8">
                Type your email to reset your password
              </p>

              {error && (
                <div className="mb-5 rounded-md bg-red-50 border border-red-200 text-[#c8102e] text-sm px-4 py-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                    Email address <span className="text-[#c8102e]">*</span>
                  </label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-black text-white rounded-full py-3.5 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>Continue</span>
                </button>
              </form>

              <Link to="/login" className="block text-sm text-black underline underline-offset-4 hover:text-gray-600 mt-6">
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;