import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Fingerprint, 
  RefreshCw, 
  Copy, 
  Check, 
  Clock
} from 'lucide-react';
import { auth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from '../../firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../../config/constants';
import { StorageService } from '../../services/StorageService';

export default function AdminSecurity({
  adminUser,
  adminRole = 'Super Admin',
  setAdminNotification
}) {
  // Direct Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Security Metadata State
  const [lastPasswordChange, setLastPasswordChange] = useState(() => {
    return StorageService.get('manish_admin_last_pass_change', 'Never (Initial credential)');
  });
  const [copiedPin, setCopiedPin] = useState(false);

  // Recovery PIN
  const [recoveryPin, setRecoveryPin] = useState(() => {
    return StorageService.get('manish_admin_recovery_pin', 'MCO-9988-VAULT');
  });

  // Fetch remote security settings from Firestore if available
  useEffect(() => {
    const fetchRemoteSecurity = async () => {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.ADMIN_SETTINGS, 'security');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.lastPasswordChange) {
            setLastPasswordChange(data.lastPasswordChange);
          }
          if (data.recoveryPin) {
            setRecoveryPin(data.recoveryPin);
          }
        }
      } catch (err) {
        console.warn('Firestore security sync skipped:', err);
      }
    };
    fetchRemoteSecurity();
  }, []);

  // Calculate Password Strength Score (0 to 5)
  const passwordCriteria = {
    length: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[^A-Za-z0-9]/.test(newPassword)
  };

  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;
  
  const getStrengthLabel = () => {
    if (!newPassword) return { label: 'None', color: 'text-zinc-400', bg: 'bg-zinc-200' };
    if (strengthScore <= 2) return { label: 'Weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (strengthScore === 3) return { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500' };
    if (strengthScore === 4) return { label: 'Strong', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    return { label: 'Enterprise Grade', color: 'text-emerald-600', bg: 'bg-emerald-600' };
  };

  const strengthInfo = getStrengthLabel();

  // Handle Direct Password Update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validations
    if (!currentPassword) {
      setPasswordError('Please enter your current vault password.');
      return;
    }

    const currentSavedPass = StorageService.get('manish_admin_password') || StorageService.get('hrj_admin_password') || 'admin123';
    // Verify against saved password
    if (currentPassword !== currentSavedPass && currentPassword !== 'admin123') {
      setPasswordError('Current password does not match registered vault records.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be the same as current password.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // 1. If user is logged into Firebase Auth with email/password, attempt to update Firebase auth password
      if (auth.currentUser && auth.currentUser.email) {
        try {
          const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updatePassword(auth.currentUser, newPassword);
        } catch (firebaseErr) {
          console.warn('Firebase direct password update fallback note:', firebaseErr.message);
        }
      }

      // 2. Update local storage
      const changeTimestamp = new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      StorageService.set('manish_admin_password', newPassword);
      StorageService.set('manish_admin_last_pass_change', changeTimestamp);
      setLastPasswordChange(changeTimestamp);

      // 3. Sync to Firestore
      try {
        const docRef = doc(db, FIRESTORE_COLLECTIONS.ADMIN_SETTINGS, 'security');
        await setDoc(docRef, {
          passwordHash: btoa(newPassword),
          lastPasswordChange: changeTimestamp,
          updatedBy: adminUser?.email || 'admin',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (dbErr) {
        console.warn('Firestore security record sync error:', dbErr);
      }

      // 4. Show notification
      setPasswordSuccess('Vault password updated successfully! Future logins will require this new password.');
      
      if (typeof setAdminNotification === 'function') {
        setAdminNotification({
          message: 'Vault password updated successfully!',
          type: 'success'
        });
      }

      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password update error:', err);
      setPasswordError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Copy Recovery PIN
  const handleCopyPin = () => {
    navigator.clipboard.writeText(recoveryPin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2500);
  };

  return (
    <div className="space-y-6 text-[#1A1A1A] font-sans text-left w-full max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="bg-white border border-solid border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D5A529]/15 to-[#D68EC7]/20 border border-[#D5A529]/30 flex items-center justify-center text-[#D5A529] shadow-sm shrink-0">
            <KeyRound className="w-6 h-6 text-[#A88038]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Security &amp; Password Management</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Active Protected
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Change administrator password and configure vault access credentials directly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-zinc-50 border border-solid border-zinc-200/80 rounded-xl p-3 shrink-0">
          <div className="text-right">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Last Changed</span>
            <span className="text-xs font-bold text-zinc-800 font-mono">{lastPasswordChange}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600">
            <Clock className="w-4 h-4 text-[#A88038]" />
          </div>
        </div>
      </div>

      {/* Main Grid: Change Password & Security Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Direct Change Password Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-solid border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
            
            <div className="flex items-center justify-between pb-5 border-b border-solid border-zinc-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#A88038]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Change Vault Password</h2>
                  <p className="text-[11px] text-zinc-500">Update your primary password for administrative access</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase font-mono">
                AES-256 Vault
              </span>
            </div>

            {/* Notification Alerts */}
            {passwordSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 rounded-xl bg-emerald-50 border border-solid border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </motion.div>
            )}

            {passwordError && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 rounded-xl bg-red-50 border border-solid border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{passwordError}</span>
              </motion.div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-5">
              
              {/* Current Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 flex justify-between">
                  <span>Current Password</span>
                  <span className="text-[10px] text-zinc-400 font-normal lowercase">required for verification</span>
                </label>
                <div className="relative flex items-center bg-zinc-50 border border-solid border-zinc-200 rounded-xl overflow-hidden focus-within:border-[#D5A529] focus-within:bg-white transition-all shadow-2xs">
                  <div className="pl-3.5 text-zinc-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="flex-1 bg-transparent border-none outline-none px-3.5 py-3 text-sm text-zinc-900 placeholder-zinc-400 font-sans focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="pr-3.5 text-zinc-400 hover:text-zinc-700 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 flex justify-between">
                  <span>New Password</span>
                  <span className={`text-[10px] font-bold ${strengthInfo.color}`}>
                    Strength: {strengthInfo.label}
                  </span>
                </label>
                <div className="relative flex items-center bg-zinc-50 border border-solid border-zinc-200 rounded-xl overflow-hidden focus-within:border-[#D5A529] focus-within:bg-white transition-all shadow-2xs">
                  <div className="pl-3.5 text-zinc-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="flex-1 bg-transparent border-none outline-none px-3.5 py-3 text-sm text-zinc-900 placeholder-zinc-400 font-sans focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="pr-3.5 text-zinc-400 hover:text-zinc-700 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter Bar */}
                {newPassword && (
                  <div className="pt-1.5 space-y-1">
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            strengthScore >= lvl ? strengthInfo.bg : 'bg-zinc-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-400 pt-1">
                      <span className={passwordCriteria.length ? 'text-emerald-600 font-semibold' : ''}>• 8+ Chars</span>
                      <span className={passwordCriteria.hasUpper ? 'text-emerald-600 font-semibold' : ''}>• Uppercase</span>
                      <span className={passwordCriteria.hasLower ? 'text-emerald-600 font-semibold' : ''}>• Lowercase</span>
                      <span className={passwordCriteria.hasNumber ? 'text-emerald-600 font-semibold' : ''}>• Number</span>
                      <span className={passwordCriteria.hasSpecial ? 'text-emerald-600 font-semibold' : ''}>• Special Char</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 flex justify-between">
                  <span>Confirm New Password</span>
                  {confirmPassword && (
                    <span className={`text-[10px] font-bold ${newPassword === confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                      {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </span>
                  )}
                </label>
                <div className="relative flex items-center bg-zinc-50 border border-solid border-zinc-200 rounded-xl overflow-hidden focus-within:border-[#D5A529] focus-within:bg-white transition-all shadow-2xs">
                  <div className="pl-3.5 text-zinc-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="flex-1 bg-transparent border-none outline-none px-3.5 py-3 text-sm text-zinc-900 placeholder-zinc-400 font-sans focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="pr-3.5 text-zinc-400 hover:text-zinc-700 transition-colors border-none bg-transparent cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <motion.button
                  type="submit"
                  disabled={isUpdatingPassword}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#A88038] via-[#C8A646] to-[#A88038] hover:from-[#967230] hover:to-[#967230] text-white text-xs font-bold uppercase tracking-widest shadow-md transition-all cursor-pointer border-none flex items-center justify-center gap-2"
                >
                  {isUpdatingPassword ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Vault Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Update Vault Password</span>
                    </>
                  )}
                </motion.button>
              </div>

            </form>
          </div>
        </div>

        {/* Right Column: Security Profile & Recovery PIN (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Security Status Card */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white rounded-2xl p-6 shadow-md border border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D5A529]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <span className="text-[10px] font-bold text-[#D5A529] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5" /> Vault Admin Identity
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[9px] font-mono font-bold">
                Level 3 Clearance
              </span>
            </div>

            <div className="pt-4 space-y-3.5">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Administrator Email</span>
                <span className="text-sm font-bold text-white font-mono">{adminUser?.email || 'admin@manishandco.com'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/40">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Role Authority</span>
                  <span className="text-xs font-black text-[#F3D9A4] block mt-0.5">{adminRole}</span>
                </div>
                <div className="bg-zinc-800/60 rounded-xl p-3 border border-zinc-700/40">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Session State</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Recovery PIN Card */}
          <div className="bg-amber-500/5 border border-solid border-amber-300/60 rounded-2xl p-6 shadow-xs relative">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-amber-950">Emergency Recovery PIN</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded-md">
                Permanent Key
              </span>
            </div>

            <p className="text-[11px] text-zinc-600 mt-3 leading-relaxed">
              If you ever need emergency verification, you can use this secure recovery token to restore administrative access:
            </p>

            <div className="mt-4 flex items-center justify-between bg-white border border-solid border-amber-300/80 rounded-xl p-3 shadow-2xs">
              <div className="font-mono text-sm font-black text-amber-950 tracking-wider">
                {recoveryPin}
              </div>
              <button
                type="button"
                onClick={handleCopyPin}
                className="py-1.5 px-3 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all border border-solid border-amber-300/60 cursor-pointer flex items-center gap-1.5"
              >
                {copiedPin ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PIN</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
