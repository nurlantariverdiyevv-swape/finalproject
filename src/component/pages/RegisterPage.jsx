import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { registerWithEmail } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phone: '',
    stayInLoopEmail: true,
    stayInLoopText: false,
    categories: []
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableCategories = [
    'Gravel Running',
    'Nordic Skiing',
    'Alpine Skiing',
    'Hiking',
    'Road Running',
    'Freeskiing & Ski Touring',
    'Snowboarding',
    'Sportstyle',
    'Trail Running'
  ];

  const passwordValidations = [
    { label: 'Minimum 8 characters', valid: formData.password.length >= 8 },
    { label: 'At least 1 uppercase letter', valid: /[A-Z]/.test(formData.password) },
    { label: 'At least 1 lowercase letter', valid: /[a-z]/.test(formData.password) },
    { label: 'At least 1 number', valid: /[0-9]/.test(formData.password) },
    { label: 'At least 1 special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(formData.password) },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryToggle = (category) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(category);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error: authError } = await registerWithEmail(formData.email, formData.password);

    if (authError) {
      setLoading(false);
      setError(authError);
      return;
    }

    const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ');
    if (user && fullName) {
      try {
        await updateProfile(user, { displayName: fullName });
      } catch {
        // Ad yenilənməsə də qeydiyyat uğurludur, bu addım kritik deyil
      }
    }

    setLoading(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-10 sm:py-14">
        <div className="border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black mb-2 leading-tight">
            SIGN UP FOR FREE
          </h1>

          <p className="text-xs text-gray-600 leading-relaxed mb-8">
            Create your free account for instant access to free shipping, special rewards, and more. It's quick and easy to join.
          </p>

          {error && (
            <div className="mb-5 rounded-md bg-red-50 border border-red-200 text-[#c8102e] text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2">
                Email address <span className="text-[#c8102e]">*</span>
              </label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-black mb-2">
                Password <span className="text-[#c8102e]">*</span>
              </label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChange} required className="w-full border border-gray-300 rounded-md px-4 py-3 pr-11 text-sm text-black focus:outline-none focus:border-black transition-colors" />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-black cursor-pointer">
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>

              {/* Password Tələbləri */}
              <div className="mt-3 flex flex-col gap-1.5">
                {passwordValidations.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={14} className={item.valid ? 'text-black fill-black/10' : 'text-gray-300'} />
                    <span className={item.valid ? 'text-black font-medium' : 'text-gray-500'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold text-black mb-2">
                First name
              </label>
              <input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold text-black mb-2">
                Last name
              </label>
              <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dob" className="block text-sm font-bold text-black mb-2">
                Date of birth
              </label>
              <input id="dob" name="dob" type="date" value={formData.dob} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-bold text-black mb-2">
                Gender
              </label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors bg-white cursor-pointer">
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>

            {/* Stay in the Loop */}
            <div className="mt-2 flex flex-col gap-4">
              <span className="block text-sm font-bold text-black">Stay in the loop</span>
              
              {/* By Email Hissəsi */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="stayInLoopEmail" checked={formData.stayInLoopEmail} onChange={handleInputChange} className="accent-black w-4 h-4 cursor-pointer" />
                  <span className="text-xs font-bold text-black">By email</span>
                </label>

                <p className="text-xs text-gray-700 leading-relaxed">
                  Yes, I want to receive personalized commercial offers from Salomon via email or social media based on my profile, interests and recent interactions with the Salomon brand. I can unsubscribe at any time (for more information, please consult our <Link to="/privacy" className="underline">Privacy Policy</Link>).
                </p>
              </div>

              {/* By Text Hissəsi */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="stayInLoopText" checked={formData.stayInLoopText} onChange={handleInputChange} className="accent-black w-4 h-4 cursor-pointer" />
                  <span className="text-xs font-bold text-black">By text</span>
                </label>

                {/* By Text seçildikdə birbaşa kvadratın altından başlayan hissə */}
                {formData.stayInLoopText && (
                  <div className="flex flex-col gap-3 mt-1">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      By providing my number, I agree to receive recurring automated promotional and personalized marketing text messages (e.g. cart reminders) from Salomon at this number. Consent is not a condition of any purchase. Reply HELP for help and STOP to cancel. Message frequency varies. Message & data rates may apply. View <Link to="/terms" className="underline">Terms of service</Link> and <Link to="/privacy" className="underline">Privacy</Link>.
                    </p>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-black mb-2">
                        Phone number
                      </label>
                      <input id="phone" name="phone" type="tel" placeholder="+1 (201) 555-0123" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tell us more about your interests */}
            <div className="mt-4 flex flex-col gap-3">
              <span className="block text-sm font-bold text-black">Tell us more about your interests</span>
              <div className="flex flex-col gap-2.5">
                {availableCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={formData.categories.includes(cat)} onChange={() => handleCategoryToggle(cat)} className="accent-black w-4 h-4 cursor-pointer rounded" />
                    <span className="text-xs text-gray-800">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-full py-3.5 text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>Sign up</span>
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-black mt-8">
          Already have an account?{' '}
          <Link to="/login" className="underline underline-offset-4 font-bold">
            Log in to your account
          </Link>
        </p>

        <p className="text-xs text-gray-500 leading-relaxed mt-8">
          By clicking on "Sign up", I accept the{' '}
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

export default RegisterPage;