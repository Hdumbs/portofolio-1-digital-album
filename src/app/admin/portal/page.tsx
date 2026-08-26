'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useYearbookStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Shield, UserPlus, Lock, Key, CheckCircle, AlertCircle, ArrowLeft, Crown, Trash2 } from 'lucide-react';

export default function HiddenAdminPortalPage() {
  const router = useRouter();
  const { session, logout, isLoaded, classes, academicYears, students, refreshData } = useYearbookStore();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passError, setPassError] = useState('');

  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  // New Student Form
  const [studentNisn, setStudentNisn] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPassword, setStudentPassword] = useState('123456');
  const [studentClassId, setStudentClassId] = useState('');
  const [studentIsLeader, setStudentIsLeader] = useState(false);

  // New Admin Form
  const [adminNip, setAdminNip] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');

  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    document.title = "Portal Rahasia Pembuatan Akun | Skye Digital Yearbook";
    if (classes.length > 0 && !studentClassId) {
      setStudentClassId(classes[0].id);
    }
  }, [classes, studentClassId]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E9898]"></div>
      </div>
    );
  }

  // Guard Check - Admin Role Only
  if (!session || session.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between">
        <Header session={session} onLogout={logout} />
        <div className="max-w-md mx-auto my-auto p-8 bg-white border border-red-300 rounded-3xl text-center space-y-4 shadow-xl">
          <Lock className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="text-2xl font-black text-[#27272A]">403 - Portal Terkunci</h2>
          <p className="text-xs text-gray-600 font-medium">
            Halaman ini khusus untuk Pengelola Sekolah terotorisasi.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#9E9898] text-white font-extrabold text-xs rounded-2xl hover:bg-[#888282]"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  const handleUnlockPortal = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (adminPasswordInput === 'admin123' || adminPasswordInput === 'admin') {
      setIsUnlocked(true);
    } else {
      setPassError('Password verifikasi admin salah!');
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const targetClass = classes.find((c) => c.id === studentClassId);
    if (!targetClass) {
      setSubmitError('Pilih kelas terlebih dahulu.');
      return;
    }

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'student',
          adminSecretPassword: adminPasswordInput,
          data: {
            nisn: studentNisn.trim(),
            name: studentName.trim(),
            password: studentPassword.trim() || '123456',
            classId: targetClass.id,
            academicYearId: targetClass.academicYearId,
            isClassLeader: studentIsLeader,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || 'Gagal menambahkan siswa');
        return;
      }

      setSubmitSuccess(json.message);
      setStudentNisn('');
      setStudentName('');
      setStudentIsLeader(false);
      await refreshData();
      setTimeout(() => setSubmitSuccess(''), 5000);
    } catch {
      setSubmitError('Terjadi kesalahan jaringan.');
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus siswa "${studentName}" dari database?`)) return;

    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch(`/api/admin/create-user?studentId=${studentId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || 'Gagal menghapus siswa.');
        return;
      }
      setSubmitSuccess(json.message || `Siswa ${studentName} berhasil dihapus.`);
      await refreshData();
      setTimeout(() => setSubmitSuccess(''), 5000);
    } catch {
      setSubmitError('Terjadi kesalahan koneksi.');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetType: 'admin',
          adminSecretPassword: adminPasswordInput,
          data: {
            nip: adminNip.trim(),
            name: adminName.trim(),
            password: adminNewPassword.trim(),
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error || 'Gagal menambahkan admin');
        return;
      }

      setSubmitSuccess(json.message);
      setAdminNip('');
      setAdminName('');
      setAdminNewPassword('');
      await refreshData();
      setTimeout(() => setSubmitSuccess(''), 5000);
    } catch {
      setSubmitError('Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between selection:bg-[#9E9898] selection:text-white">
      <Header session={session} onLogout={logout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* LOCK SCREEN STEP */}
        {!isUnlocked ? (
          <div className="max-w-md mx-auto my-12 bg-white border border-gray-300 rounded-3xl p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-[#9E9898]/10 border border-[#9E9898]/30 flex items-center justify-center text-[#27272A] mx-auto">
                <Key className="w-8 h-8 text-[#9E9898]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#27272A] text-white px-2.5 py-0.5 rounded">
                Restricted Admin Portal
              </span>
              <h1 className="text-2xl font-black text-[#27272A]">Portal Rahasia Pembuatan Akun</h1>
              <p className="text-xs text-gray-500 font-medium">
                Masukkan password verifikasi admin untuk memunculkan formulir penambahan Siswa Baru & Admin Baru.
              </p>
            </div>

            {passError && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockPortal} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  Password Verifikasi Admin
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password admin (cth: admin123)"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#9E9898] hover:bg-[#888282] text-white font-extrabold text-xs rounded-2xl transition-all shadow-sm flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4" />
                <span>Buka Kunci Portal Rahasia</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED PORTAL SECTION */
          <div className="space-y-6">
            
            {/* PORTAL HEADER */}
            <div className="bg-[#9E9898] text-white p-6 sm:p-8 rounded-3xl border border-gray-300 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-white text-xs font-black uppercase tracking-widest mb-1">
                  <UserPlus className="w-4 h-4" />
                  <span>Portal Rahasia Terbuka</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black">Penambahan Siswa & Admin Baru</h1>
                <p className="text-xs text-gray-100 font-medium mt-1">
                  Tersimpan langsung secara permanen ke database SQLite / REST API.
                </p>
              </div>

              <button
                onClick={() => router.push('/admin')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#27272A] hover:bg-[#18181B] text-white text-xs font-extrabold rounded-xl shadow-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Admin</span>
              </button>
            </div>

            {/* TAB SELECTOR (SISWA BARU vs ADMIN BARU) */}
            <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-gray-300 shadow-sm">
              <button
                onClick={() => {
                  setActiveTab('student');
                  setSubmitError('');
                  setSubmitSuccess('');
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'student'
                    ? 'bg-[#9E9898] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Siswa Baru</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('admin');
                  setSubmitError('');
                  setSubmitSuccess('');
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'admin'
                    ? 'bg-[#27272A] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>+ Tambah Admin Baru</span>
              </button>
            </div>

            {submitSuccess && (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-2xl flex items-center space-x-2 shadow-sm animate-in fade-in">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-2xl flex items-center space-x-2 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* FORM 1: TAMBAH SISWA BARU */}
            {activeTab === 'student' && (
              <div className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-black text-[#27272A]">Formulir Pendaftaran Siswa Baru</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Siswa yang ditambahkan akan otomatis terdaftar di kelas yang dipilih.
                  </p>
                </div>

                <form onSubmit={handleCreateStudent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        NISN Siswa
                      </label>
                      <input
                        type="text"
                        placeholder="cth: 0089876543"
                        value={studentNisn}
                        onChange={(e) => setStudentNisn(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        Nama Lengkap Siswa
                      </label>
                      <input
                        type="text"
                        placeholder="cth: Ahmad Fauzi"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        Pilih Kelas
                      </label>
                      <select
                        value={studentClassId}
                        onChange={(e) => setStudentClassId(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.level} - Wali: {c.homeroomTeacher})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        Password Awal Siswa
                      </label>
                      <input
                        type="text"
                        placeholder="Default: 123456"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <input
                      type="checkbox"
                      id="isLeaderNew"
                      checked={studentIsLeader}
                      onChange={(e) => setStudentIsLeader(e.target.checked)}
                      className="w-4 h-4 accent-[#9E9898] cursor-pointer"
                    />
                    <label htmlFor="isLeaderNew" className="text-xs font-bold text-[#27272A] cursor-pointer flex items-center space-x-1">
                      <Crown className="w-4 h-4 text-[#9E9898]" />
                      <span>Tetapkan sebagai Ketua Kelas (Memiliki akses mengedit link IG kelas)</span>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#9E9898] text-white font-extrabold text-xs rounded-xl hover:bg-[#888282] transition-all shadow-sm"
                    >
                      + Simpan Siswa Baru
                    </button>
                  </div>
                </form>

                {/* DAFTAR SISWA TERDAFTAR & AKSI HAPUS */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#27272A]">
                    Daftar Siswa Terdaftar (Total: {students.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {students.map((s) => {
                      const c = classes.find((item) => item.id === s.classId);
                      return (
                        <div key={s.id} className="bg-gray-50 border border-gray-200 p-3 rounded-2xl flex items-center justify-between shadow-sm">
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-black text-[#27272A] truncate">{s.name}</span>
                              {s.isClassLeader && <Crown className="w-3.5 h-3.5 text-[#9E9898] shrink-0" />}
                            </div>
                            <p className="text-[10px] text-gray-500 font-semibold truncate">
                              NISN: {s.nisn} • Kelas: {c?.name || 'Utama'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(s.id, s.name)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* FORM 2: TAMBAH ADMIN BARU */}
            {activeTab === 'admin' && (
              <div className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-black text-[#27272A]">Formulir Pendaftaran Admin Baru</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    Admin baru akan memiliki hak akses penuh untuk mengelola kelas dan moderasi foto.
                  </p>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        NIP / Username Admin
                      </label>
                      <input
                        type="text"
                        placeholder="cth: admin2"
                        value={adminNip}
                        onChange={(e) => setAdminNip(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        Nama Lengkap Admin
                      </label>
                      <input
                        type="text"
                        placeholder="cth: Pak Budi, S.Pd"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        Password Admin
                      </label>
                      <input
                        type="password"
                        placeholder="Password rahasia admin..."
                        value={adminNewPassword}
                        onChange={(e) => setAdminNewPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#27272A] text-white font-extrabold text-xs rounded-xl hover:bg-[#18181B] transition-all shadow-sm"
                    >
                      + Simpan Admin Baru
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

      </main>

      <footer className="border-t border-gray-300 py-6 bg-[#9E9898] text-center text-xs text-white font-semibold">
        © 2026 SMP-SMK Skye Digitalpreneur. Skye Digital Yearbook Platform.
      </footer>
    </div>
  );
}
