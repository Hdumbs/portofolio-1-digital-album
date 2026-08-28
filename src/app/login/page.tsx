'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useYearbookStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Level } from '@/types';
import { Shield, UserCheck, Eye, ArrowRight, CheckCircle2, Sparkles, BookOpen, Layers, Users, Camera, KeyRound, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { session, loginAs, logout, isLoaded, students, classes, photos } = useYearbookStore();

  // Selected Akun Admin / Pengelola (Initial empty)
  const [nip, setNip] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Selected Akun Siswa (Initial empty)
  const [selectedStudentLevel, setSelectedStudentLevel] = useState<Level | 'ALL'>('ALL');
  const [selectedStudentClassId, setSelectedStudentClassId] = useState<string>('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentNisn, setStudentNisn] = useState('');

  const [loginError, setLoginError] = useState('');

  // Forgot Password Modal States
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotNisn, setForgotNisn] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Login Pengguna | Skye Digital Yearbook";
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center text-gray-800">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E9898] mx-auto"></div>
          <p className="text-sm font-bold text-gray-600">Memuat Skye Digital Yearbook...</p>
        </div>
      </div>
    );
  }

  // Filter students based on Level & Class dropdown
  const filteredStudentOptions = students.filter((s) => {
    const classItem = classes.find((c) => c.id === s.classId);
    if (selectedStudentLevel !== 'ALL' && classItem?.level !== selectedStudentLevel) return false;
    if (selectedStudentClassId !== 'ALL' && s.classId !== selectedStudentClassId) return false;
    return true;
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!nip.trim()) {
      setLoginError('NIP / Username Pengelola wajib diisi');
      return;
    }

    if (!adminPassword.trim()) {
      setLoginError('Password Pengelola wajib diisi');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: nip.trim() === 'admin' ? 'admin' : 'wali_kelas',
          usernameOrNisn: nip.trim(),
          password: adminPassword.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setLoginError(json.error || 'NIP atau Password Pengelola salah');
        return;
      }

      await loginAs(json.session);
      router.push('/admin');
    } catch {
      setLoginError('Gagal terhubung ke server');
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!selectedStudentId.trim()) {
      setLoginError('NISN / ID Siswa wajib diisi');
      return;
    }

    if (!studentNisn.trim()) {
      setLoginError('Password siswa wajib diisi');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'student',
          usernameOrNisn: selectedStudentId.trim(),
          password: studentNisn.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setLoginError(json.error || 'NISN atau Password siswa salah');
        return;
      }

      await loginAs(json.session);
      router.push(`/class/${json.session.classId}`);
    } catch {
      setLoginError('Gagal terhubung ke server');
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotNisn.trim() || !forgotNewPassword.trim()) {
      setForgotError('NISN dan Password Baru wajib diisi');
      return;
    }

    setIsForgotSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nisn: forgotNisn.trim(),
          newPassword: forgotNewPassword.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setForgotError(json.error || 'Gagal mengirimkan permintaan riset password.');
        setIsForgotSubmitting(false);
        return;
      }

      setForgotSuccess(json.message);
      setForgotNisn('');
      setForgotNewPassword('');
    } catch {
      setForgotError('Terjadi kesalahan koneksi.');
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  const handleViewerAccess = () => {
    loginAs({
      role: 'viewer',
      name: 'Tamu / Public Viewer',
    });
    router.push('/');
  };

  const approvedPhotoCount = photos.filter((p) => p.status === 'approved').length;

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-slate-800 flex flex-col justify-between selection:bg-[#9E9898] selection:text-white">
      <Header session={session} onLogout={logout} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col justify-center space-y-12">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#9E9898]/40 px-4 py-1.5 rounded-full text-xs font-extrabold text-[#333333] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#9E9898]" />
            <span>Portal Masuk Skye Digital Yearbook</span>
          </div>

          <div className="flex justify-center bg-white p-5 rounded-3xl border border-gray-200 shadow-md max-w-xs mx-auto">
            <Image
              src="/logo/Logo-Skye-Digipreneur-School-Landscape-Stroke-207x71.png"
              alt="Skye Digitalpreneur Logo"
              width={260}
              height={90}
              className="h-16 w-auto object-contain"
            />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#27272A] tracking-tight leading-tight">
            Masuk ke Akun <br className="hidden sm:inline" />
            <span className="text-[#9E9898] underline decoration-[#9E9898]/30 decoration-wavy">Skye Digital Yearbook</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Pilih akun dan masukkan password Anda di bawah ini untuk masuk ke halaman album digital.
          </p>

          {/* QUICK STATS COUNTER */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="bg-white px-5 py-2.5 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#9E9898]" />
              <span className="text-xs font-bold text-gray-700"><strong>{classes.length}</strong> Kelas Terdaftar</span>
            </div>
            <div className="bg-white px-5 py-2.5 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#9E9898]" />
              <span className="text-xs font-bold text-gray-700"><strong>{students.length}</strong> Biodata Siswa</span>
            </div>
            <div className="bg-white px-5 py-2.5 rounded-2xl border border-gray-200 shadow-sm flex items-center space-x-2">
              <Camera className="w-4 h-4 text-[#9E9898]" />
              <span className="text-xs font-bold text-gray-700"><strong>{approvedPhotoCount}</strong> Foto Galeri</span>
            </div>
          </div>
        </div>

        {/* ROLE SELECTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">

          {/* VIEWER CARD */}
          <div className="bg-white border border-gray-300 hover:border-[#9E9898] rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#27272A] group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9E9898]">Akses Publik</span>
                <h2 className="text-2xl font-black text-[#27272A] mt-1">Alumni & Viewer</h2>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-normal">
                  Jelajahi direktori kelas SMP & SMK Skye Digitalpreneur tanpa perlu login akun.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-700 font-medium pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9E9898] shrink-0" />
                  <span>Daftar kelas dengan logo & deskripsi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9E9898] shrink-0" />
                  <span>Buka web album 2 kolom tiap kelas</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleViewerAccess}
              className="mt-8 w-full py-3.5 px-4 bg-[#9E9898] hover:bg-[#888282] text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <span>Buka Album Publik</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* STUDENT CARD (WITH FILTER & FORGOT PASSWORD) */}
          <div className="bg-white border border-gray-300 hover:border-[#9E9898] rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#9E9898] text-[10px] font-extrabold tracking-widest text-white px-3.5 py-1.5 rounded-bl-2xl uppercase">
              Area Siswa / Ketua Kelas
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#27272A] group-hover:scale-110 transition-transform">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9E9898]">SMP / SMK</span>
                <h2 className="text-2xl font-black text-[#27272A] mt-1">Siswa & Ketua Kelas</h2>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-normal">
                  Isi biodata pribadi, upload foto kelas, dan pengait link Instagram khusus Ketua Kelas.
                </p>
              </div>

              {/* Student Login Form */}
              <form onSubmit={handleStudentLogin} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">NISN / Nomor ID Siswa:</label>
                  <input
                    type="text"
                    placeholder="Masukkan NISN (cth: 0071234567)"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Password Siswa:</label>
                  <input
                    type="password"
                    placeholder="Password Siswa (Default: 123456)"
                    value={studentNisn}
                    onChange={(e) => setStudentNisn(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#9E9898] placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>

                {/* LINK LUPA PASSWORD */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotError('');
                      setForgotSuccess('');
                      setIsForgotModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#9E9898] hover:text-[#27272A] flex items-center space-x-1 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Lupa Password Siswa?</span>
                  </button>
                </div>

                {loginError && <p className="text-xs text-red-600 font-bold">{loginError}</p>}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#27272A] hover:bg-[#18181B] text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <span>Masuk Akun Siswa</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* ADMIN CARD (Awal Kosong) */}
          <div className="bg-white border border-gray-300 hover:border-[#9E9898] rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#27272A] text-[10px] font-extrabold tracking-widest text-white px-3.5 py-1.5 rounded-bl-2xl uppercase">
              Admin / Wali Kelas
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-[#27272A] group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#9E9898]">Pengelola</span>
                <h2 className="text-2xl font-black text-[#27272A] mt-1">Admin Sekolah</h2>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed font-normal">
                  Kelola struktur kelas, link Instagram, moderasi foto & arsipkan tahun ajaran.
                </p>
              </div>

              {/* Admin Login Form */}
              <form onSubmit={handleAdminLogin} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Pilih Akun Pengelola:</label>
                  <select
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                    required
                  >
                    <option value="">-- Silakan Pilih Akun Pengelola --</option>
                    <option value="admin">Super Admin Sekolah (Semua Kelas)</option>
                    <option value="wali_pplg">Bu Rani (Wali Kelas 11 PPLG)</option>
                    <option value="wali_retail">Pak Agus (Wali Kelas 10 Retail)</option>
                  </select>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password Admin (Default: admin123)"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#9E9898] placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#9E9898] hover:bg-[#888282] text-white font-extrabold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <span>Masuk Akun Pengelola</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* FEATURE HIGHLIGHTS */}
        <div className="border-t border-gray-300 pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="w-7 h-7 text-[#9E9898] mx-auto mb-2" />
            <h4 className="text-sm font-extrabold text-[#27272A]">Album Web Terpisah</h4>
            <p className="text-xs text-gray-500 mt-1">Setiap kelas punya halaman album terpisah sendiri</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Layers className="w-7 h-7 text-[#9E9898] mx-auto mb-2" />
            <h4 className="text-sm font-extrabold text-[#27272A]">Kaitkan Instagram</h4>
            <p className="text-xs text-gray-500 mt-1">Admin & Ketua Kelas dapat mengaitkan IG kelas</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Shield className="w-7 h-7 text-[#9E9898] mx-auto mb-2" />
            <h4 className="text-sm font-extrabold text-[#27272A]">Filter SMP / SMK</h4>
            <p className="text-xs text-gray-500 mt-1">Filter teratur berdasarkan level & angkatan kelas</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Sparkles className="w-7 h-7 text-[#9E9898] mx-auto mb-2" />
            <h4 className="text-sm font-extrabold text-[#27272A]">Arsip Lintas Tahun</h4>
            <p className="text-xs text-gray-500 mt-1">Simpan memori aman tanpa kehilangan data</p>
          </div>
        </div>

      </main>

      {/* MODAL LUPA PASSWORD SISWA */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-300 space-y-5 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-200 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#9E9898] text-white px-2.5 py-0.5 rounded-md">
                Klaim Lupa Password
              </span>
              <h3 className="text-xl font-black text-[#27272A] mt-1">Permintaan Riset Password Siswa</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Masukkan NISN Anda dan password baru yang diinginkan. Permintaan akan dikirimkan ke Admin / Wali Kelas untuk disetujui.
              </p>
            </div>

            {forgotSuccess && (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotError && (
              <div className="p-3.5 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-2xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  NISN Siswa *
                </label>
                <input
                  type="text"
                  placeholder="Masukkan NISN siswa (cth: 0071234567)"
                  value={forgotNisn}
                  onChange={(e) => setForgotNisn(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  Password Baru Yang Diinginkan *
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password baru..."
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className="px-6 py-2.5 bg-[#9E9898] text-white text-xs font-extrabold rounded-xl hover:bg-[#888282] shadow-sm disabled:opacity-50"
                >
                  {isForgotSubmitting ? 'Mengirim...' : 'Kirim Permintaan Riset'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <footer className="border-t border-gray-300 py-6 bg-[#9E9898] text-center text-xs text-white font-semibold">
        © 2026 SMP-SMK Skye Digitalpreneur. Skye Digital Yearbook Platform.
      </footer>
    </div>
  );
}
