import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Phone, Lock, CheckCircle, AlertCircle,
  Save, KeyRound, Shield, GraduationCap, Hash, Calendar, Building2
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, updateUserProfile, changePassword } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '01700000000',
  });
  const [profileMsg, setProfileMsg] = useState(null);

  // Password Form state
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdMsg, setPwdMsg] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!profileForm.name.trim()) {
      setProfileMsg({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    const res = await updateUserProfile({
      name: profileForm.name,
      phone: profileForm.phone,
    });
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMsg(null);
    if (!pwdForm.currentPassword) {
      setPwdMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    const res = await changePassword(pwdForm.currentPassword, pwdForm.newPassword);
    if (res.success) {
      setPwdMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPwdMsg({ type: 'error', text: res.error || 'Failed to change password.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-primary-900/40 via-surface-800 to-accent-900/20 border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-primary-500/30 border-2 border-white/20">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">{currentUser?.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1
                ${isAdmin ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'}`}>
                {isAdmin ? <Shield size={12}/> : <GraduationCap size={12}/>}
                {currentUser?.role}
              </span>
            </div>

            <p className="text-white/60 text-sm mb-3">{currentUser?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/50">
              {currentUser?.studentId && (
                <span className="flex items-center gap-1.5 bg-surface-700/60 px-2.5 py-1 rounded-lg border border-white/5">
                  <Hash size={12} className="text-primary-400" /> ID: {currentUser.studentId}
                </span>
              )}
              <span className="flex items-center gap-1.5 bg-surface-700/60 px-2.5 py-1 rounded-lg border border-white/5">
                <Building2 size={12} className="text-primary-400" /> Dept: {currentUser?.dept || 'CSE'}
              </span>
              {!isAdmin && (
                <span className="flex items-center gap-1.5 bg-surface-700/60 px-2.5 py-1 rounded-lg border border-white/5">
                  <Calendar size={12} className="text-primary-400" /> Batch {currentUser?.batch || '61'} (Sec {currentUser?.section || 'F'})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Info & Edit Form */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400">
              <User size={18} />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Edit Personal Profile</h2>
              <p className="text-xs text-white/40">Update your account display name and contact phone number</p>
            </div>
          </div>

          {profileMsg && (
            <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in
              ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {profileMsg.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">University Email (Read-only)</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  disabled
                  value={profileForm.email}
                  className="input-field pl-10 opacity-60 bg-surface-900/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="e.g. 01712345678"
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-9 h-9 rounded-xl bg-accent-500/20 flex items-center justify-center text-accent-400">
              <KeyRound size={18} />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Change Password</h2>
              <p className="text-xs text-white/40">Keep your account secure by updating your password</p>
            </div>
          </div>

          {pwdMsg && (
            <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in
              ${pwdMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {pwdMsg.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
              {pwdMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">Current Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  value={pwdForm.currentPassword}
                  onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="Enter current password"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  required
                  value={pwdForm.newPassword}
                  onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="At least 6 characters"
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
                  value={pwdForm.confirmPassword}
                  onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="btn-secondary flex items-center gap-2 text-white hover:bg-surface-700">
                <KeyRound size={16} /> Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
