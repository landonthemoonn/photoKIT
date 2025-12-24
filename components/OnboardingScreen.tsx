import React, { useState } from 'react';
import { IconCheck, IconUpload } from './Icons';

interface OnboardingScreenProps {
  onComplete: (userData: { name: string; email: string; password: string; organization?: string }) => void;
  authError?: string;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, authError }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState('');

  const handleComplete = () => {
    setError('');

    // Validation
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onComplete({ name, email, password, organization: organization || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-pk-orange/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-pk-orange/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl">
        {/* Logo & Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-black rounded-2xl shadow-2xl shadow-pk-orange/20 border border-white/40 dark:border-white/10 mb-6 backdrop-blur-xl">
            <img src={`${import.meta.env.BASE_URL}images/photokit-icon.svg`} alt="PhotoKIT" className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-pk-black dark:text-white mb-3">
            Photo<span className="text-pk-orange">KIT</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Professional Digital Asset Management</p>
        </div>

        {/* Onboarding Card */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 dark:border-white/20 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">

          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-pk-black dark:text-white mb-3 uppercase tracking-tight">Welcome to PhotoKIT</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Let's get you set up in just a few seconds</p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/40 dark:border-white/10 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 bg-pk-orange/20 rounded-xl flex items-center justify-center">
                    <IconUpload className="w-6 h-6 text-pk-orange" />
                  </div>
                  <h3 className="font-bold text-pk-black dark:text-white text-sm uppercase mb-1">Organize</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Smart tagging & categorization</p>
                </div>

                <div className="bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/40 dark:border-white/10 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 bg-pk-orange/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-pk-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-pk-black dark:text-white text-sm uppercase mb-1">Search</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Find photos instantly</p>
                </div>

                <div className="bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/40 dark:border-white/10 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 bg-pk-orange/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-pk-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold text-pk-black dark:text-white text-sm uppercase mb-1">Export</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Share & collaborate</p>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-pk-orange to-pk-orange/80 hover:from-pk-orange/90 hover:to-pk-orange/70 text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-xl shadow-pk-orange/30 hover:shadow-pk-orange/50 hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-pk-black dark:text-white mb-3 uppercase tracking-tight">Create Your Profile</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Tell us a bit about yourself</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Your Name <span className="text-pk-orange">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border-2 border-white/40 dark:border-white/20 focus:border-pk-orange rounded-xl px-5 py-4 text-pk-black dark:text-white placeholder-slate-400 focus:outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-pk-orange/20"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Email Address <span className="text-pk-orange">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border-2 border-white/40 dark:border-white/20 focus:border-pk-orange rounded-xl px-5 py-4 text-pk-black dark:text-white placeholder-slate-400 focus:outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-pk-orange/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Password <span className="text-pk-orange">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border-2 border-white/40 dark:border-white/20 focus:border-pk-orange rounded-xl px-5 py-4 text-pk-black dark:text-white placeholder-slate-400 focus:outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-pk-orange/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Confirm Password <span className="text-pk-orange">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border-2 border-white/40 dark:border-white/20 focus:border-pk-orange rounded-xl px-5 py-4 text-pk-black dark:text-white placeholder-slate-400 focus:outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-pk-orange/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                    Organization <span className="text-slate-400 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Your Company Name"
                    className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border-2 border-white/40 dark:border-white/20 focus:border-pk-orange rounded-xl px-5 py-4 text-pk-black dark:text-white placeholder-slate-400 focus:outline-none transition-all duration-300 shadow-sm focus:ring-4 focus:ring-pk-orange/20"
                  />
                </div>
              </div>

              {(error || authError) && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-4">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error || authError}</p>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/40 dark:bg-black/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-black/60 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl uppercase tracking-wider transition-all duration-300 border border-white/40 dark:border-white/20"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!name || !email || !password || !confirmPassword}
                  className={`flex-1 font-bold py-4 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
                    name && email && password && confirmPassword
                      ? 'bg-gradient-to-r from-pk-orange to-pk-orange/80 hover:from-pk-orange/90 hover:to-pk-orange/70 text-white shadow-pk-orange/30 hover:shadow-pk-orange/50 hover:scale-105 active:scale-95'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>Complete Setup</span>
                  <IconCheck className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step === 1 ? 'bg-pk-orange w-8' : 'bg-slate-300 dark:bg-slate-700'}`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step === 2 ? 'bg-pk-orange w-8' : 'bg-slate-300 dark:bg-slate-700'}`} />
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
