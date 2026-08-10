import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap, Mail, Phone, ArrowLeft, CheckCircle2,
  KeyRound, ShieldCheck, AlertCircle, RefreshCw, Lock
} from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { resetPasswordWithOTP, students } = useAuth();
  const navigate = useNavigate();

  // Wizard Steps: 1 = Email/Phone, 2 = Enter OTP, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  // Generate random 6 digit OTP
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return code;
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const input = emailOrPhone.trim().toLowerCase();
    if (!input) {
      setErrorMsg('Please enter your registered email or phone number.');
      return;
    }

    // Find student or admin
    let foundEmail = input;
    if (!input.includes('@')) {
      // Find by phone
      const student = students.find(s => s.phone === input);
      if (student) {
        foundEmail = student.email;
      }
    }

    setTargetEmail(foundEmail);
    generateNewOtp();
    setStep(2);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (enteredOtp.trim() !== generatedOtp) {
      setErrorMsg('Invalid OTP code. Please check the code shown in the banner above and try again.');
      return;
    }
    setStep(3);
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const res = await resetPasswordWithOTP(targetEmail, newPassword);
    if (res.success) {
      setStep(4);
    } else {
      setErrorMsg(res.error || 'Password reset failed.');
    }
  };

  const handleResendOtp = () => {
    generateNewOtp();
    setErrorMsg('');
    setResendTimer(60);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30 mb-4">
            <GraduationCap size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-white/40 text-sm">Metropolitan University, Sylhet</p>
        </div>

        {/* Demo Simulated OTP Alert Banner for Step 2 */}
        {step === 2 && (
          <div className="mb-4 glass-card p-4 border-amber-500/30 bg-amber-500/10 animate-bounce-short">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
                📩
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Simulated OTP Notification</p>
                <p className="text-sm font-mono text-white">Your OTP Code is: <span className="font-bold text-amber-400 text-base">{generatedOtp}</span></p>
              </div>
            </div>
          </div>
        )}

        <div className="glass-card p-8">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Enter Email/Phone */}
          {step === 1 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white mb-1">Forgot your password?</h2>
              <p className="text-white/40 text-sm mb-6">Enter your university email or phone number to receive a 6-digit OTP code.</p>
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 font-medium mb-1.5 block">Email or Phone Number</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      required
                      placeholder="you@student.metrouni.edu.bd or 017..."
                      value={emailOrPhone}
                      onChange={e => setEmailOrPhone(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <ShieldCheck size={16} /> Send OTP Code
                </button>
              </form>
            </>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white mb-1">Enter Verification OTP</h2>
              <p className="text-white/40 text-sm mb-6">
                Enter the 6-digit code sent to <span className="text-primary-400 font-medium">{targetEmail}</span>
              </p>
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 font-medium mb-1.5 block">6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={enteredOtp}
                      onChange={e => setEnteredOtp(e.target.value)}
                      className="input-field pl-10 font-mono text-lg tracking-widest text-center"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 pt-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-primary-400 hover:text-primary-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <RefreshCw size={12} /> Resend OTP
                  </button>
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Verify OTP
                </button>
              </form>
            </>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <>
              <h2 className="font-display text-xl font-semibold text-white mb-1">Set New Password</h2>
              <p className="text-white/40 text-sm mb-6">Choose a strong new password for your account.</p>
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <div>
                  <label className="text-xs text-white/50 font-medium mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 font-medium mb-1.5 block">Confirm New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <KeyRound size={16} /> Update Password
                </button>
              </form>
            </>
          )}

          {/* STEP 4: Reset Complete Success */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white mb-1">Password Reset Done!</h3>
                <p className="text-white/50 text-sm">
                  Your password has been updated successfully. You can now log in with your new password.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                Go to Login Page
              </button>
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
