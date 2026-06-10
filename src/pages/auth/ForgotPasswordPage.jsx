import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30 mb-4">
            <GraduationCap size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-white/40 text-sm">Metropolitan University, Sylhet</p>
        </div>

        <div className="glass-card p-8">
          {!sent ? (
            <>
              <h2 className="font-display text-xl font-semibold text-white mb-2">Forgot your password?</h2>
              <p className="text-white/40 text-sm mb-6">Enter your university email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 font-medium mb-1.5 block">University Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      id="forgot-email"
                      type="email" required
                      placeholder="you@student.metrouni.edu.bd"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Mail size={16} /> Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-2">Email Sent!</h3>
              <p className="text-white/50 text-sm">
                If <span className="text-primary-400">{email}</span> is registered, you'll receive a password reset link shortly.
              </p>
              <p className="text-white/30 text-xs mt-3">(In this demo, no actual email is sent.)</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <Link to="/login" className="text-primary-400 hover:text-primary-300 text-sm flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
