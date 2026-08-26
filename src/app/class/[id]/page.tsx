'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useYearbookStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { YearbookView } from '@/components/YearbookView';
import { ArrowLeft, Edit, CheckCircle, ShieldAlert, UserCheck, PlusCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { session, logout, isLoaded, academicYears, classes, students, photos, updateClassInstagramUrl } = useYearbookStore();

  const [isEditingIg, setIsEditingIg] = useState(false);
  const [igInput, setIgInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const classItem = classes.find((c) => c.id === id);

  // Hook must always be called unconditionally at top level
  useEffect(() => {
    if (classItem) {
      document.title = `Album Web ${classItem.name} | Skye Digital Yearbook`;
    }
  }, [classItem]);

  // Early returns AFTER all hooks are called
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E9898]"></div>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between">
        <Header session={session} onLogout={logout} />
        <div className="max-w-md mx-auto my-auto p-8 bg-white border border-gray-300 rounded-2xl text-center space-y-4 shadow-md">
          <ShieldAlert className="w-12 h-12 text-[#9E9898] mx-auto" />
          <h2 className="text-2xl font-black text-[#27272A]">Kelas Tidak Ditemukan</h2>
          <p className="text-xs text-gray-600">Kelas yang Anda cari tidak ada atau telah dihapus.</p>
          <Link
            href="/album"
            className="inline-block px-5 py-2.5 bg-[#9E9898] text-white font-extrabold text-xs rounded-xl shadow-sm hover:bg-[#888282]"
          >
            Kembali ke Daftar Kelas
          </Link>
        </div>
      </div>
    );
  }

  const academicYear = academicYears.find((y) => y.id === classItem.academicYearId);
  const classStudents = students.filter((s) => s.classId === classItem.id);
  const classPhotos = photos.filter((p) => p.classId === classItem.id);

  // Check if current logged-in user can edit Instagram (Admin OR Ketua Kelas of this specific class)
  const canEditInstagram =
    session?.role === 'admin' ||
    (session?.role === 'class_leader' && session?.classId === classItem.id);

  // Check if current user is a student or leader in this class
  const isStudentInThisClass =
    (session?.role === 'student' || session?.role === 'class_leader') &&
    session?.classId === classItem.id;

  const handleSaveInstagram = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedIg = igInput.trim();
    if (formattedIg && !formattedIg.startsWith('http://') && !formattedIg.startsWith('https://')) {
      formattedIg = `https://instagram.com/${formattedIg.replace('@', '')}`;
    }
    updateClassInstagramUrl(classItem.id, formattedIg);
    setIsEditingIg(false);
    setSaveSuccessMsg('Link Instagram kelas berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between selection:bg-[#9E9898] selection:text-white">
      <Header session={session} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* TOP BAR / BACK LINK, STUDENT ACTION BUTTON & IG LINK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-300 shadow-sm">
          <Link
            href="/album"
            className="inline-flex items-center space-x-2 text-xs font-black text-[#27272A] hover:text-[#9E9898] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Semua Kelas</span>
          </Link>

          {/* ACTION BUTTONS (UPLOAD FOTO & EDIT BIODATA + INSTAGRAM) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Direct button for logged in student/leader to upload photo & edit biodata */}
            {isStudentInThisClass ? (
              <Link
                href="/student"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#9E9898] hover:bg-[#888282] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Upload Foto & Edit Biodata Saya</span>
              </Link>
            ) : (
              (session?.role === 'student' || session?.role === 'class_leader') && (
                <Link
                  href="/student"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-[#27272A] border border-gray-300 font-extrabold text-xs rounded-xl transition-all"
                >
                  <UserCheck className="w-4 h-4 text-[#9E9898]" />
                  <span>Halaman Siswa</span>
                </Link>
              )
            )}

            {/* INSTAGRAM LINK DISPLAY & EDIT */}
            {classItem.instagramUrl ? (
              <a
                href={classItem.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs rounded-xl shadow-sm hover:opacity-90 transition-opacity"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Kunjungi IG {classItem.name}</span>
              </a>
            ) : (
              <span className="text-xs text-gray-400 font-bold italic">Belum ada link Instagram kelas</span>
            )}

            {canEditInstagram && (
              <button
                onClick={() => {
                  setIgInput(classItem.instagramUrl || '');
                  setIsEditingIg(true);
                }}
                className="inline-flex items-center space-x-1 px-3 py-2 bg-[#27272A] text-white hover:bg-[#18181B] text-xs font-bold rounded-xl shadow-sm transition-colors"
                title="Edit Instagram Kelas (Ketua Kelas / Admin)"
              >
                <Edit className="w-3.5 h-3.5 text-[#9E9898]" />
                <span>Edit Link IG</span>
              </button>
            )}
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold rounded-2xl flex items-center space-x-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* EDIT INSTAGRAM MODAL */}
        {isEditingIg && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-300 space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-200 pb-3">
                <InstagramIcon className="w-5 h-5 text-pink-600" />
                <h3 className="text-base font-black text-[#27272A]">Kaitkan Instagram Kelas ({classItem.name})</h3>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                Masukkan URL Instagram resmi kelas ini (contoh: <code>https://instagram.com/11pplg.skye</code> atau <code>@11pplg.skye</code>).
              </p>
              <form onSubmit={handleSaveInstagram} className="space-y-4">
                <input
                  type="text"
                  placeholder="https://instagram.com/..."
                  value={igInput}
                  onChange={(e) => setIgInput(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#9E9898]"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingIg(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#9E9898] text-white font-extrabold text-xs rounded-xl hover:bg-[#888282] shadow-sm"
                  >
                    Simpan Link IG
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FULL 2-COLUMN YEARBOOK EXPERIENCE FOR THIS SINGLE CLASS */}
        <YearbookView
          classes={[classItem]}
          students={classStudents}
          photos={classPhotos}
          academicYearName={`${academicYear?.name || 'Tahun Ajaran Aktif'} - Halaman Album Web ${classItem.name}`}
          isReadOnly={academicYear?.isArchived}
        />

      </main>

      <footer className="border-t border-gray-300 py-6 bg-[#9E9898] text-center text-xs text-white">
        <div className="max-w-7xl mx-auto px-4 font-semibold">
          © 2026 SMP-SMK Skye Digitalpreneur. Skye Digital Yearbook Platform.
        </div>
      </footer>
    </div>
  );
}
