'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useYearbookStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { ClassItem, Level, Major } from '@/types';
import { Shield, Plus, Archive, CheckCircle, XCircle, Trash2, Edit3, ShieldAlert, Layers, RefreshCw, X, Image as ImageIcon, BookOpen, KeyRound } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    session,
    logout,
    isLoaded,
    academicYears,
    classes,
    photos,
    addClass,
    updateClass,
    deleteClass,
    archiveAcademicYear,
    addAcademicYear,
    updatePhotoStatus,
    deletePhoto,
    resetToDefault
  } = useYearbookStore();

  const [activeTab, setActiveTab] = useState<'classes' | 'moderation' | 'archiving' | 'resets'>('classes');
  const [passwordResets, setPasswordResets] = useState<any[]>([]);

  const fetchPasswordResets = async () => {
    try {
      const res = await fetch('/api/admin/password-resets');
      if (res.ok) {
        const data = await res.json();
        setPasswordResets(data);
      }
    } catch (e) {
      console.warn('Fetch password resets error:', e);
    }
  };

  // Modal State for Class Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  // Form Fields
  const [className, setClassName] = useState('');
  const [classLevel, setClassLevel] = useState<Level>('SMK');
  const [classGrade, setClassGrade] = useState<number>(11);
  const [classMajor, setClassMajor] = useState<Major>('PPLG');
  const [homeroomTeacher, setHomeroomTeacher] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [classLogo, setClassLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [classError, setClassError] = useState('');

  // Form state for new Academic Year
  const [newYearName, setNewYearName] = useState('');
  const [archiveSuccessMsg, setArchiveSuccessMsg] = useState('');

  useEffect(() => {
    document.title = "Dashboard Admin & Moderasi | Skye Digital Yearbook";
    fetchPasswordResets();
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E9898]"></div>
      </div>
    );
  }

  // Guard Check (Allows Super Admin & Wali Kelas)
  const isAuthorized = session && (session.role === 'admin' || session.role === 'wali_kelas');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between">
        <Header session={session} onLogout={logout} />
        <div className="max-w-md mx-auto my-auto p-8 bg-white border border-red-300 rounded-3xl text-center space-y-4 shadow-xl">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="text-2xl font-black text-[#27272A]">403 - Akses Ditolak</h2>
          <p className="text-xs text-gray-600 font-medium">
            Anda harus masuk sebagai Admin Sekolah atau Wali Kelas terdaftar untuk mengakses Panel Kontrol ini.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#9E9898] text-white font-extrabold text-xs rounded-2xl hover:bg-[#888282] transition-colors"
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  const isWaliKelas = session.role === 'wali_kelas';
  const assignedClassId = session.classId;

  const activeAcademicYear = academicYears.find((y) => y.isActive) || academicYears[0];

  // Scoped filtering for Wali Kelas vs Super Admin
  const relevantClasses = isWaliKelas
    ? classes.filter((c) => c.id === assignedClassId)
    : classes.filter((c) => c.academicYearId === activeAcademicYear?.id);

  const pendingPhotos = isWaliKelas
    ? photos.filter((p) => p.status === 'pending' && p.classId === assignedClassId)
    : photos.filter((p) => p.status === 'pending');

  const approvedPhotos = isWaliKelas
    ? photos.filter((p) => p.status === 'approved' && p.classId === assignedClassId)
    : photos.filter((p) => p.status === 'approved');

  const openClassModal = (c?: ClassItem) => {
    setClassError('');
    if (c) {
      setEditingClass(c);
      setClassName(c.name);
      setClassLevel(c.level);
      setClassGrade(c.grade);
      setClassMajor(c.major || 'General');
      setHomeroomTeacher(c.homeroomTeacher);
      setTagline(c.tagline || '');
      setDescription(c.description || '');
      setInstagramUrl(c.instagramUrl || '');
      setClassLogo(c.classLogo || '');
      setCoverImage(c.coverImage || '');
    } else {
      setEditingClass(null);
      setClassName('');
      setClassLevel('SMK');
      setClassGrade(11);
      setClassMajor('PPLG');
      setHomeroomTeacher('');
      setTagline('');
      setDescription('');
      setInstagramUrl('');
      setClassLogo('');
      setCoverImage('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setClassError('');
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    setClassError('');

    if (!className.trim() || !homeroomTeacher.trim()) {
      setClassError('Nama kelas dan Wali kelas wajib diisi.');
      return;
    }

    // Check duplicate name in same academic year
    const isDuplicate = classes.some(
      (c) =>
        c.name.toLowerCase() === className.trim().toLowerCase() &&
        c.academicYearId === activeAcademicYear.id &&
        c.id !== editingClass?.id
    );

    if (isDuplicate) {
      setClassError(`Kelas dengan nama "${className}" sudah ada di tahun ajaran ini.`);
      return;
    }

    let formattedIg = instagramUrl.trim();
    if (formattedIg && !formattedIg.startsWith('http://') && !formattedIg.startsWith('https://')) {
      formattedIg = `https://instagram.com/${formattedIg.replace('@', '')}`;
    }

    if (editingClass) {
      updateClass({
        ...editingClass,
        name: className.trim(),
        level: classLevel,
        grade: Number(classGrade) || 10,
        major: classLevel === 'SMK' ? classMajor : 'General',
        homeroomTeacher: homeroomTeacher.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        instagramUrl: formattedIg,
        classLogo: classLogo.trim(),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      });
    } else {
      addClass({
        name: className.trim(),
        level: classLevel,
        grade: Number(classGrade) || 10,
        major: classLevel === 'SMK' ? classMajor : 'General',
        academicYearId: activeAcademicYear.id,
        homeroomTeacher: homeroomTeacher.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        instagramUrl: formattedIg,
        classLogo: classLogo.trim(),
        coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      });
    }

    closeModal();
  };

  const handleResetAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/password-resets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      const json = await res.json();
      if (res.ok) {
        alert(json.message);
        fetchPasswordResets();
      } else {
        alert(json.error || 'Gagal memproses riset password.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    }
  };

  const handleArchiveYear = (yearId: string) => {
    if (confirm('Apakah Anda yakin ingin mengarsipkan tahun ajaran ini? Seluruh kelas dan foto akan dipindahkan ke tab Arsip dan terlindungi dari pengeditan siswa.')) {
      archiveAcademicYear(yearId);
      setArchiveSuccessMsg('Tahun ajaran berhasil diarsipkan dalam hitungan detik! Data tetap tersimpan aman.');
      setTimeout(() => setArchiveSuccessMsg(''), 5000);
    }
  };

  const handleCreateAcademicYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;
    addAcademicYear(newYearName.trim());
    setNewYearName('');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between selection:bg-[#9E9898] selection:text-white">
      <Header session={session} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ADMIN DASHBOARD HEADER */}
        <div className="bg-[#9E9898] text-white border border-gray-300 rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-white text-xs font-black uppercase tracking-widest mb-1">
              <Shield className="w-4 h-4 text-white" />
              <span>Dashboard Admin / Moderasi Sekolah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Pengelolaan Skye Digital Yearbook</h1>
            <p className="text-xs text-gray-100 mt-1 font-semibold">
              Tahun Ajaran Aktif: <strong className="text-white">{activeAcademicYear?.name}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-white/20 p-1.5 rounded-2xl border border-white/30">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'classes' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
              }`}
            >
              Manajemen Kelas
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all relative ${
                activeTab === 'moderation' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
              }`}
            >
              Moderasi Foto
              {pendingPhotos.length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black">
                  {pendingPhotos.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('resets')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all relative ${
                activeTab === 'resets' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
              }`}
            >
              Riset Password
              {passwordResets.filter((r) => r.status === 'pending').length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-black">
                  {passwordResets.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('archiving')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'archiving' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
              }`}
            >
              Arsip Tahun Ajaran
            </button>
            <button
              onClick={() => router.push('/admin/portal')}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-[#27272A] text-white hover:bg-[#18181B] transition-all shadow-sm flex items-center space-x-1"
              title="Portal Rahasia Penambahan Siswa & Admin"
            >
              <span>+ User/Admin Baru</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MANAJEMEN STRUKTUR KELAS & JURUSAN */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-300 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-[#27272A] flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#9E9898]" />
                  <span>Struktur Jenjang & Kelas ({activeAcademicYear?.name})</span>
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Tambah dan kelola data kelas SMP & SMK dengan logo, wali kelas, dan jurusan.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => resetToDefault()}
                  className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5 border border-gray-300"
                  title="Reset data ke default"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
                <button
                  onClick={() => openClassModal()}
                  className="px-5 py-2.5 bg-[#9E9898] text-white font-extrabold text-xs rounded-xl hover:bg-[#888282] transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kelas Baru</span>
                </button>
              </div>
            </div>

            {/* CLASS LIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes
                .filter((c) => c.academicYearId === activeAcademicYear?.id)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="p-6 space-y-4">
                      {/* Logo / Cover preview */}
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.classLogo || item.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'}
                          alt={item.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#9E9898] shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-[#27272A] text-white">
                              {item.level}
                            </span>
                            {item.major && item.major !== 'General' && (
                              <span className="text-xs font-black text-[#9E9898]">
                                {item.major}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-black text-[#27272A] truncate">{item.name}</h3>
                          <p className="text-xs text-gray-600 font-semibold truncate">Wali: {item.homeroomTeacher}</p>
                        </div>
                      </div>

                      {item.tagline && (
                        <p className="text-xs text-gray-500 italic font-medium bg-gray-50 p-3 rounded-xl border border-gray-200">
                          &quot;{item.tagline}&quot;
                        </p>
                      )}

                      {item.instagramUrl && (
                        <div className="flex items-center space-x-1.5 text-xs text-pink-600 font-extrabold">
                          <InstagramIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.instagramUrl.replace('https://', '')}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                      <button
                        onClick={() => router.push(`/class/${item.id}`)}
                        className="text-xs font-extrabold text-[#9E9898] hover:text-[#27272A] flex items-center space-x-1 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Buka Album</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => openClassModal(item)}
                          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center space-x-1 shadow-sm"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#9E9898]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus kelas ${item.name}?`)) deleteClass(item.id);
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors"
                          title="Hapus Kelas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* MODAL EDIT / TAMBAH KELAS BEAUTIFUL POPUP DIALOG */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-300 space-y-6 relative animate-in fade-in zoom-in duration-200">
              
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-gray-200 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#9E9898] text-white px-2.5 py-0.5 rounded-md">
                  Panel Pengelola Kelas
                </span>
                <h3 className="text-xl font-black text-[#27272A] mt-1">
                  {editingClass ? `Edit Kelas: ${editingClass.name}` : 'Tambah Kelas Baru'}
                </h3>
              </div>

              {classError && (
                <div className="p-3.5 bg-red-100 border border-red-300 text-red-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>{classError}</span>
                </div>
              )}

              <form onSubmit={handleSaveClass} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      Nama Kelas *
                    </label>
                    <input
                      type="text"
                      placeholder="cth: 11 PPLG / 10 Retail"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      Wali Kelas *
                    </label>
                    <input
                      type="text"
                      placeholder="cth: Bu Rani, S.Kom"
                      value={homeroomTeacher}
                      onChange={(e) => setHomeroomTeacher(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      Jenjang Sekolah
                    </label>
                    <select
                      value={classLevel}
                      onChange={(e) => {
                        const lvl = e.target.value as Level;
                        setClassLevel(lvl);
                        if (lvl === 'SMP') setClassMajor('General');
                      }}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                    >
                      <option value="SMK">SMK Skye</option>
                      <option value="SMP">SMP Skye</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      Angkatan / Kelas Ke-
                    </label>
                    <select
                      value={classGrade}
                      onChange={(e) => setClassGrade(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                    >
                      {classLevel === 'SMP' ? (
                        <>
                          <option value={7}>Kelas 7 SMP</option>
                          <option value={8}>Kelas 8 SMP</option>
                          <option value={9}>Kelas 9 SMP</option>
                        </>
                      ) : (
                        <>
                          <option value={10}>Kelas 10 SMK</option>
                          <option value={11}>Kelas 11 SMK</option>
                          <option value={12}>Kelas 12 SMK</option>
                        </>
                      )}
                    </select>
                  </div>

                  {classLevel === 'SMK' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                        Jurusan SMK
                      </label>
                      <select
                        value={classMajor}
                        onChange={(e) => setClassMajor(e.target.value as Major)}
                        className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                      >
                        <option value="PPLG">PPLG (Pengembangan Perangkat Lunak & Gim)</option>
                        <option value="Retail">Retail (Digital Commerce)</option>
                        <option value="Project Officer">Project Officer (Manajemen Project)</option>
                      </select>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      Tagline / Slogan Kelas
                    </label>
                    <input
                      type="text"
                      placeholder="cth: Coding today, transforming tomorrow."
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      Deskripsi Singkat Kelas
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ceritakan profil dan keunggulan kelas..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      URL Instagram Resmi Kelas
                    </label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/..."
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                      URL Logo / Avatar Kelas
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={classLogo}
                      onChange={(e) => setClassLogo(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#9E9898] text-white text-xs font-extrabold rounded-xl hover:bg-[#888282] shadow-sm"
                  >
                    {editingClass ? 'Simpan Perubahan' : 'Buat Kelas'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: MODERASI FOTO SISWA */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-gray-300 shadow-sm">
              <h2 className="text-lg font-black text-[#27272A] flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#9E9898]" />
                <span>Panel Moderasi Foto Siswa</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Setujui atau tolak foto yang di-upload oleh siswa sebelum dipublikasikan di album kelas.
              </p>
            </div>

            {/* Pending Photos Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#9E9898] uppercase tracking-wider">
                Menunggu Persetujuan ({pendingPhotos.length})
              </h3>
              {pendingPhotos.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-300 text-center text-xs text-gray-500 font-bold shadow-sm">
                  Tidak ada foto yang sedang menunggu persetujuan.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingPhotos.map((photo) => (
                    <div key={photo.id} className="bg-white border border-amber-300 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="aspect-video relative bg-black">
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-black">
                          Pending
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="text-xs text-gray-800 font-bold line-clamp-2">{photo.caption}</p>
                        <p className="text-[11px] text-gray-500 font-semibold">Uploader: <strong className="text-[#9E9898]">{photo.uploaderName}</strong></p>
                      </div>
                      <div className="bg-gray-50 p-3 border-t border-gray-200 flex items-center justify-between">
                        <button
                          onClick={() => updatePhotoStatus(photo.id, 'rejected')}
                          className="px-3.5 py-1.5 bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 text-xs font-extrabold rounded-xl flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Tolak</span>
                        </button>
                        <button
                          onClick={() => updatePhotoStatus(photo.id, 'approved')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl flex items-center space-x-1 shadow-sm"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Setujui</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Photos Section */}
            <div className="space-y-4 pt-6 border-t border-gray-300">
              <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                Foto Terpublikasi / Approved ({approvedPhotos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {approvedPhotos.map((photo) => (
                  <div key={photo.id} className="bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
                    <div className="aspect-video bg-black relative">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 text-xs space-y-1">
                      <p className="text-gray-800 line-clamp-1 font-bold">{photo.caption}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-gray-500 font-semibold">{photo.uploaderName}</span>
                        <button
                          onClick={() => {
                            if (confirm('Hapus foto ini dari album?')) deletePhoto(photo.id);
                          }}
                          className="text-red-600 hover:text-red-800 text-[10px] font-black"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARSIP TAHUN AJARAN */}
        {activeTab === 'archiving' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-300 shadow-sm space-y-2">
              <h2 className="text-lg font-black text-[#27272A] flex items-center space-x-2">
                <Archive className="w-5 h-5 text-[#9E9898]" />
                <span>Pengarsipan Tahun Ajaran Tanpa Kehilangan Data</span>
              </h2>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Fitur ini memungkinkan Admin mengarsipkan tahun ajaran yang telah selesai dalam waktu <strong>&lt; 15 menit</strong>. Data kelas, foto, dan biodata siswa tetap utuh dan dipindahkan ke halaman Arsip (Read-Only).
              </p>

              {archiveSuccessMsg && (
                <div className="mt-4 p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-2xl flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{archiveSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Academic Years List */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider">Daftar Tahun Ajaran Sekolah</h3>
              <div className="space-y-3">
                {academicYears.map((ay) => (
                  <div
                    key={ay.id}
                    className="bg-white border border-gray-300 rounded-2xl p-5 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-black text-[#27272A]">{ay.name}</h4>
                        {ay.isActive && (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black rounded-md">
                            Tahun Ajaran Aktif
                          </span>
                        )}
                        {ay.isArchived && (
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-black rounded-md">
                            Tersimpan di Arsip
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-semibold">
                        Total Kelas: {classes.filter((c) => c.academicYearId === ay.id).length} Kelas
                      </p>
                    </div>

                    <div>
                      {!ay.isArchived && (
                        <button
                          onClick={() => handleArchiveYear(ay.id)}
                          className="px-4 py-2 bg-[#9E9898] hover:bg-[#888282] text-white text-xs font-extrabold rounded-xl flex items-center space-x-1.5 shadow-sm"
                        >
                          <Archive className="w-4 h-4" />
                          <span>Arsipkan Sekarang</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New Academic Year */}
            <div className="bg-white border border-gray-300 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-black text-[#27272A] uppercase tracking-wider">Buat Tahun Ajaran Baru</h3>
              <form onSubmit={handleCreateAcademicYear} className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="cth: Tahun Ajaran 2026/2027"
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  className="flex-1 bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#9E9898] text-white text-xs font-extrabold rounded-xl hover:bg-[#888282] shrink-0 shadow-sm"
                >
                  Tambah Tahun Ajaran
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: PERMINTAAN RISET PASSWORD SISWA */}
        {activeTab === 'resets' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-gray-300 shadow-sm">
              <h2 className="text-lg font-black text-[#27272A] flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-[#9E9898]" />
                <span>Panel Konfirmasi Riset Password Siswa</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Setujui atau tolak permintaan riset password baru dari siswa yang lupa password.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#9E9898] uppercase tracking-wider">
                Permintaan Menunggu Konfirmasi ({passwordResets.filter((r) => r.status === 'pending').length})
              </h3>

              {passwordResets.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-gray-300 text-center text-xs text-gray-500 font-bold shadow-sm">
                  Tidak ada permintaan riset password yang sedang pending.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {passwordResets
                    .filter((r) => r.status === 'pending')
                    .map((item) => (
                      <div key={item.id} className="bg-white border border-amber-300 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                              Klaim Lupa Password
                            </span>
                            <span className="text-[10px] text-gray-400 font-semibold">{new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                          </div>
                          <h4 className="text-base font-black text-[#27272A]">{item.studentName}</h4>
                          <p className="text-xs text-gray-600 font-semibold">NISN: <strong>{item.nisn}</strong> • Kelas: {item.className}</p>
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs">
                            <span className="text-[10px] text-gray-500 font-bold block uppercase">Password Baru Yang Diminta:</span>
                            <code className="font-mono text-xs font-black text-emerald-700">{item.newPassword}</code>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleResetAction(item.id, 'reject')}
                            className="flex-1 py-2 bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center space-x-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>
                          <button
                            onClick={() => handleResetAction(item.id, 'approve')}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center space-x-1 shadow-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Setujui Password</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Approved/Rejected History */}
            <div className="space-y-4 pt-6 border-t border-gray-300">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                Riwayat Konfirmasi Riset Password ({passwordResets.filter((r) => r.status !== 'pending').length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {passwordResets
                  .filter((r) => r.status !== 'pending')
                  .map((item) => (
                    <div key={item.id} className="bg-white border border-gray-300 p-4 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <h5 className="font-black text-[#27272A]">{item.studentName}</h5>
                        <p className="text-[10px] text-gray-500 font-semibold">NISN: {item.nisn} ({item.className})</p>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${
                          item.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {item.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-gray-300 py-6 bg-[#9E9898] text-center text-xs text-white font-semibold">
        © 2026 SMP-SMK Skye Digitalpreneur. Skye Digital Yearbook Platform.
      </footer>
    </div>
  );
}
