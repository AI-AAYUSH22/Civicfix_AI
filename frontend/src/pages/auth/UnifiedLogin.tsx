import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  HardHat,
  Smartphone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockContractors, wards } from '@/data/mockData';

interface UnifiedLoginProps {
  initialRole?: 'citizen' | 'contractor' | 'municipal';
  onSuccess: (role: 'citizen' | 'contractor' | 'municipal') => void;
  onBackToLanding: () => void;
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({
  initialRole = 'citizen',
  onSuccess,
  onBackToLanding,
}) => {
  const { loginEngineer, loginContractor, loginCitizen, registerCitizen } = useApp();
  const [activeTab, setActiveTab] = useState<'citizen' | 'contractor' | 'municipal'>(initialRole);

  // Citizen State
  const [citizenMode, setCitizenMode] = useState<'login' | 'register'>('login');
  const [citizenPhone, setCitizenPhone] = useState('9820012345');
  const [citizenPassword, setCitizenPassword] = useState('citizen123');
  const [citizenName, setCitizenName] = useState('');
  const [citizenWard, setCitizenWard] = useState('G/N');

  // Contractor State
  const [selectedWardId, setSelectedWardId] = useState<string>('G/N');
  const [contractorId, setContractorId] = useState<string>('contractor_g_n');
  const [contractorPassword, setContractorPassword] = useState<string>('password123');

  // Municipal Engineer State
  const [employeeId, setEmployeeId] = useState('BMC-ENG-4001');
  const [engineerPassword, setEngineerPassword] = useState('Engineer@123');

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Ward Selection for Contractor
  const handleWardChange = (wardId: string) => {
    setSelectedWardId(wardId);
    const found = mockContractors.find((c) => c.wardId === wardId);
    if (found) {
      setContractorId(found.contractorId);
    } else {
      const slug = wardId.toLowerCase().replace(/[^a-z0-9]/g, '_');
      setContractorId(`contractor_${slug}`);
    }
  };

  // Submit Handlers
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (citizenMode === 'register') {
        if (!citizenName.trim() || !citizenPhone.trim() || !citizenPassword) {
          throw new Error('Please fill in your Full Name, Mobile Number, and Password.');
        }
        await registerCitizen({
          name: citizenName,
          phone: citizenPhone,
          wardId: citizenWard,
          password: citizenPassword,
        });
        setSuccessMsg('Registration successful! Redirecting to Citizen Portal...');
      } else {
        if (!citizenPhone.trim() || !citizenPassword) {
          throw new Error('Please enter your Mobile Number and Password.');
        }
        await loginCitizen(citizenPhone, citizenPassword);
      }
      setTimeout(() => onSuccess('citizen'), 400);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleContractorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!contractorId.trim() || !contractorPassword) {
        throw new Error('Please enter Contractor ID and Password.');
      }
      await loginContractor(contractorId, contractorPassword, selectedWardId);
      onSuccess('contractor');
    } catch (err: any) {
      setError(err?.message || 'Contractor login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEngineerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!employeeId.trim() || !engineerPassword) {
        throw new Error('Please enter Employee ID and Password.');
      }
      await loginEngineer(employeeId.trim(), engineerPassword);
      onSuccess('municipal');
    } catch (err: any) {
      setError(err?.message || 'Engineer login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center font-bold text-white text-xs shadow-md group-hover:scale-105 transition-transform">
            CF
          </div>
          <span className="font-bold text-sm text-white tracking-tight">CivicFix AI</span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">← Landing Page</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-medium text-teal-400 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-800">
          <ShieldCheck size={13} />
          <span>Unified Civic Gateway</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto z-10 my-6">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#131B2E] border border-slate-700/80 rounded-2xl mb-6 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('citizen');
              setError(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'citizen'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Smartphone size={16} />
            <span>Citizen Portal</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('contractor');
              setError(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'contractor'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <HardHat size={16} />
            <span>Contractor App</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('municipal');
              setError(null);
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'municipal'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Building2 size={16} />
            <span>Ward Engineer</span>
          </button>
        </div>

        {/* Card Form Body */}
        <div className="bg-[#172033]/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 flex items-start gap-2.5 text-xs text-emerald-200 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: CITIZEN PORTAL */}
          {activeTab === 'citizen' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <Smartphone size={20} className="text-teal-400" />
                    <span>Citizen Portal Login</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Sign in with Mobile Number to report issues & track repair status.
                  </p>
                </div>
                <div className="flex bg-[#0D1525] p-1 rounded-xl border border-slate-700 text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setCitizenMode('login')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      citizenMode === 'login' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setCitizenMode('register')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      citizenMode === 'register' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleCitizenSubmit} className="space-y-4">
                {citizenMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
                      <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full bg-[#0D1525] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile Number (10 digits)
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="tel"
                      value={citizenPhone}
                      onChange={(e) => setCitizenPhone(e.target.value)}
                      placeholder="e.g. 9820012345"
                      className="w-full bg-[#0D1525] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                {citizenMode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Home Ward / Locality
                    </label>
                    <select
                      value={citizenWard}
                      onChange={(e) => setCitizenWard(e.target.value)}
                      className="w-full bg-[#0D1525] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      {wards.slice(0, 48).map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="password"
                      value={citizenPassword}
                      onChange={(e) => setCitizenPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0D1525] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-teal-950 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>{citizenMode === 'register' ? 'Register & Enter Portal' : 'Sign In as Citizen'}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: CONTRACTOR DASHBOARD (48 Wards Data) */}
          {activeTab === 'contractor' && (
            <div className="space-y-5">
              <div className="border-b border-slate-700/60 pb-3">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <HardHat size={20} className="text-amber-400" />
                  <span>Contractor Login (48 Wards)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select any of the 48 Ward Contractors to open that specific ward's repair dashboard.
                </p>
              </div>

              <form onSubmit={handleContractorSubmit} className="space-y-4">
                {/* 48 Ward Dropdown Picker */}
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1.5 flex items-center justify-between">
                    <span>Select Ward Contractor (1 to 48 Wards)</span>
                    <span className="text-[10px] text-slate-400 font-mono">48 Ward Accounts</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedWardId}
                      onChange={(e) => handleWardChange(e.target.value)}
                      className="w-full bg-[#0D1525] border border-amber-600/40 rounded-xl px-3.5 py-2.5 text-xs text-amber-100 font-medium focus:outline-none focus:border-amber-500"
                    >
                      {mockContractors.map((c) => (
                        <option key={c.id} value={c.wardId}>
                          Ward {c.wardId} — {c.name} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contractor ID / Username
                  </label>
                  <input
                    type="text"
                    value={contractorId}
                    onChange={(e) => setContractorId(e.target.value)}
                    placeholder="e.g. contractor_g_n"
                    className="w-full bg-[#0D1525] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={contractorPassword}
                    onChange={(e) => setContractorPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full bg-[#0D1525] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/40 text-[11px] text-amber-200/90 space-y-1">
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>Selected Contractor:</span>
                  </div>
                  <div>ID: <span className="font-mono text-white">{contractorId}</span></div>
                  <div>Ward: <span className="font-medium text-white">{mockContractors.find(c => c.wardId === selectedWardId)?.wardName || selectedWardId}</span></div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-lg shadow-amber-950 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Open Ward Contractor Dashboard</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WARD ENGINEER / MUNICIPAL */}
          {activeTab === 'municipal' && (
            <div className="space-y-5">
              <div className="border-b border-slate-700/60 pb-3">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Building2 size={20} className="text-indigo-400" />
                  <span>Ward Engineer Login</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  MCGM Official Gateway for Ward Officers & Sub-Engineers.
                </p>
              </div>

              <form onSubmit={handleEngineerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="BMC-ENG-4001"
                    className="w-full bg-[#0D1525] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={engineerPassword}
                    onChange={(e) => setEngineerPassword(e.target.value)}
                    placeholder="Engineer@123"
                    className="w-full bg-[#0D1525] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmployeeId('BMC-ENG-4001');
                      setEngineerPassword('Engineer@123');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-[10px] text-indigo-300 hover:bg-indigo-900/60 transition-colors"
                  >
                    Ward G/N (Dadar) Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmployeeId('BMC-ENG-4007');
                      setEngineerPassword('Engineer@123');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-[10px] text-indigo-300 hover:bg-indigo-900/60 transition-colors"
                  >
                    Ward H/W (Bandra) Demo
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-950 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Open Ward Engineer Dashboard</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-500 text-xs z-10 py-2">
        CivicFix AI Decoupled Municipal Verification System • MCGM Mumbai
      </footer>
    </div>
  );
};
