'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useYearbookStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Student } from '@/types';
import { UserCheck, Upload, Save, CheckCircle, AlertCircle, Camera, ShieldAlert, Award, Quote, Image as ImageIcon } from 'lucide-react';
import { DefaultAvatar } from '@/components/DefaultAvatar';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { session, logout, isLoaded, students, classes, photos, updateStudentBiodata, addPhoto } = useYearbookStore();

  const [activeTab, setActiveTab] = useState<'biodata' | 'upload' | 'myphotos'>('biodata');

  // Ownership Check & Student retrieval
  const student = students.find((s) => s.id === session?.studentId);
  const studentClass = classes.find((c) => c.id === student?.classId);

  // Form states for biodata edit
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state for photo upload
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    document.title = "Halaman Siswa & Biodata | Skye Digital Yearbook";
  }, []);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        quote: student.quote,
        ambition: student.ambition,
        hobbies: student.hobbies,
        socialMedia: student.socialMedia,
        email: student.email,
        phone: student.phone,
        bio: student.bio,
        avatar: student.avatar,
        funAward: student.funAward,
      });
    }
  }, [student]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E9898]"></div>
      </div>
    );
  }

  // 403 Forbidden Access Guard (Must be logged in as student or class leader)
  const isAllowed = session && (session.role === 'student' || session.role === 'class_leader') && student;

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between">
        <Header session={session} onLogout={logout} />
        <div className="max-w-md mx-auto my-auto p-8 bg-white border border-red-300 rounded-2xl text-center space-y-4 shadow-xl">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto" />
          <h2 className="text-2xl font-extrabold text-[#333333]">403 - Akses Ditolak</h2>
          <p className="text-sm text-gray-600">
            Anda harus masuk sebagai siswa terdaftar untuk mengedit biodata dan mengunggah foto.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 bg-[#9E9898] text-white font-bold rounded-xl hover:bg-[#888282] transition-colors"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  const myPhotos = photos.filter((p) => p.uploaderId === student.id);

  // File upload reader helper (convert to base64 data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'photo' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Ukuran foto terlalu besar. Maksimal 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (targetField === 'photo') {
          setPhotoUrl(result);
        } else {
          setFormData((prev) => ({ ...prev, avatar: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBiodataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentBiodata({
      ...student,
      ...formData as Student,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handlePhotoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!photoUrl) {
      setUploadError('Silakan pilih berkas foto dari HP/perangkat atau masukkan URL foto.');
      return;
    }
    if (!photoCaption.trim()) {
      setUploadError('Keterangan / caption foto wajib diisi.');
      return;
    }

    addPhoto({
      classId: student.classId,
      academicYearId: student.academicYearId,
      uploaderId: student.id,
      uploaderName: student.name,
      url: photoUrl,
      caption: photoCaption.trim(),
      status: 'pending', // Requires admin moderation
    });

    setPhotoUrl('');
    setPhotoCaption('');
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 4500);
  };

  const samplePhotoUrls = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between selection:bg-[#9E9898] selection:text-white">
      <Header session={session} onLogout={logout} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Student Profile Banner */}
        <div className="bg-[#9E9898] text-white border border-gray-300 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <DefaultAvatar
            src={formData.avatar || student.avatar}
            alt={student.name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="bg-white text-[#27272A] text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-sm">
                {session.role === 'class_leader' ? 'Ketua Kelas' : 'Siswa Aktif'}
              </span>
              <span className="text-xs text-gray-100 font-semibold">NISN: {student.nisn}</span>
            </div>
            <h1 className="text-2xl font-black text-white">{student.name}</h1>
            <p className="text-xs text-gray-100 font-medium">
              Kelas: <strong className="text-white">{studentClass?.name || '11 PPLG'}</strong> • {studentClass?.level} ({studentClass?.major})
            </p>
            <p className="text-xs text-gray-100 font-medium">
              Wali Kelas: {studentClass?.homeroomTeacher}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 bg-white/20 p-1.5 rounded-2xl border border-white/30 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('biodata')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'biodata' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
              }`}
            >
              Edit Biodata Saya
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'upload' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
              }`}
            >
              Upload Foto Kelas
            </button>
            <button
              onClick={() => setActiveTab('myphotos')}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === 'myphotos' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
              }`}
            >
              Foto Saya ({myPhotos.length})
            </button>
          </div>
        </div>

        {/* TAB 1: EDIT BIODATA FORM */}
        {activeTab === 'biodata' && (
          <div className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#27272A] flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-[#9E9898]" />
                  <span>Biodata & Profil Buku Tahunan Saya</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Ubah data dan foto profil di bawah ini. Perubahan akan langsung tampil di album kelasmu.
                </p>
              </div>

              {saveSuccess && (
                <div className="flex items-center space-x-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-extrabold animate-in fade-in shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Biodata berhasil disimpan & diperbarui!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleBiodataSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                    required
                  />
                </div>

                {/* Avatar File Picker / URL */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Foto Profil (Avatar)
                  </label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'avatar')}
                      className="text-xs text-gray-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#9E9898] file:text-white hover:file:bg-[#888282] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.avatar || ''}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#9E9898]"
                      placeholder="Atau tempel URL foto profil..."
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1 flex items-center space-x-1">
                    <Quote className="w-3.5 h-3.5 text-[#9E9898]" />
                    <span>Kata-kata Perpisahan / Quote</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.quote || ''}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    placeholder='contoh: "Bukan sekadar ngoding, tapi membuat karya yang berdampak."'
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1 flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-[#9E9898]" />
                    <span>Penghargaan Kelas (Fun Award Badge)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.funAward || ''}
                    onChange={(e) => setFormData({ ...formData, funAward: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                    placeholder="cth: Ter-Coding Master 💻 / Ter-Estetik UI 🎨"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1 flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-[#9E9898]" />
                    <span>Cita-cita / Target Masa Depan</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ambition || ''}
                    onChange={(e) => setFormData({ ...formData, ambition: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    placeholder="cth: Fullstack Engineer & Founder"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Hobi / Kegemaran
                  </label>
                  <input
                    type="text"
                    value={formData.hobbies || ''}
                    onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    placeholder="cth: Coding, Basketball, Photography"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Sosial Media (Instagram/LinkedIn)
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia || ''}
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Email Aktif
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    placeholder="nama@skye.sch.id"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    placeholder="081234567890"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Deskripsi Singkat / Tentang Diri (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                    placeholder="Ceritakan sedikit tentang dirimu semasa sekolah di Skye..."
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#9E9898] text-white font-extrabold rounded-xl hover:bg-[#888282] transition-all flex items-center space-x-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Biodata</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: UPLOAD FOTO FORM */}
        {activeTab === 'upload' && (
          <div className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-black text-[#27272A] flex items-center space-x-2">
                <Upload className="w-5 h-5 text-[#9E9898]" />
                <span>Upload Foto Kebersamaan Kelas ({studentClass?.name})</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Pilih foto langsung dari HP/perangkat kamu atau gunakan link URL foto.
              </p>
            </div>

            {uploadSuccess && (
              <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-start space-x-3 text-emerald-800 text-xs font-bold shadow-sm">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-sm">Foto Berhasil Di-upload!</strong>
                  <span>Foto kamu telah terkirim dan menunggu moderasi persetujuan dari Admin / Wali Kelas.</span>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-2xl flex items-center space-x-3 text-red-800 text-xs font-bold shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handlePhotoUploadSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  1. Pilih Foto Dari Perangkat (HP / Laptop)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  className="w-full text-xs text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#27272A] file:text-white hover:file:bg-[#18181B] cursor-pointer bg-gray-50 p-2 border border-gray-300 rounded-xl"
                />

                <div className="mt-4">
                  <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                    Atau Masukkan URL Foto
                  </label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                  />
                </div>

                {/* Preview Box */}
                {photoUrl && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-2xl border border-gray-300 max-w-xs">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Preview Foto:</span>
                    <img src={photoUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}
                
                {/* Preset samples for easy demo testing */}
                <div className="mt-3">
                  <span className="text-[11px] text-gray-500 block mb-1 font-bold">Atau pilih contoh foto demo:</span>
                  <div className="flex flex-wrap gap-2">
                    {samplePhotoUrls.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoUrl(url)}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-300 font-bold truncate max-w-[200px]"
                      >
                        Sampel Foto {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">
                  2. Keterangan / Caption Foto
                </label>
                <textarea
                  rows={3}
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Ceritakan momen seru di foto ini..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#9E9898]"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#9E9898] text-white font-extrabold rounded-xl hover:bg-[#888282] transition-all flex items-center space-x-2 shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>Kirim Foto ke Galeri Kelas</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LIST FOTO SISWA SENDIRI */}
        {activeTab === 'myphotos' && (
          <div className="bg-white border border-gray-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-black text-[#27272A] flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#9E9898]" />
                <span>Foto-Foto Yang Kamu Upload ({myPhotos.length})</span>
              </h2>
            </div>

            {myPhotos.length === 0 ? (
              <p className="text-xs text-gray-500 py-8 text-center font-bold">Kamu belum mengunggah foto apapun.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {myPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-gray-50 border border-gray-300 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div className="aspect-video relative bg-black">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                      <span
                        className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                          photo.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : photo.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {photo.status === 'approved' && 'Telah Disetujui'}
                        {photo.status === 'pending' && 'Menunggu Moderasi'}
                        {photo.status === 'rejected' && 'Ditolak Admin'}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-gray-800 font-bold line-clamp-2">{photo.caption}</p>
                      <span className="text-[10px] text-gray-500 mt-3 block font-semibold">
                        Tanggal Upload: {photo.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <footer className="border-t border-gray-300 py-6 bg-[#9E9898] text-center text-xs text-white">
        <div className="max-w-7xl mx-auto px-4 font-semibold">
          © 2026 SMP-SMK Skye Digitalpreneur. Skye Digital Yearbook Platform.
        </div>
      </footer>
    </div>
  );
}
