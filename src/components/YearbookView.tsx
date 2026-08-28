'use client';

import React, { useState, useEffect } from 'react';
import { ClassItem, Student, ClassPhoto, Level } from '@/types';
import { User, Quote, Award, BookOpen, Camera, Search, Filter, X, Sparkles, Heart } from 'lucide-react';
import { DefaultAvatar } from '@/components/DefaultAvatar';

interface YearbookViewProps {
  classes: ClassItem[];
  students: Student[];
  photos: ClassPhoto[];
  academicYearName: string;
  isReadOnly?: boolean;
}

export const YearbookView: React.FC<YearbookViewProps> = ({
  classes,
  students,
  photos,
  academicYearName,
  isReadOnly = false,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('ALL');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'album' | 'photos' | 'students'>('album');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [detailPhoto, setDetailPhoto] = useState<ClassPhoto | null>(null);

  // Restore active tab from URL query param / sessionStorage on refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as 'album' | 'photos' | 'students' | null;
      const storedTab = sessionStorage.getItem('active_yearbook_tab') as 'album' | 'photos' | 'students' | null;

      if (tabParam && ['album', 'photos', 'students'].includes(tabParam)) {
        setActiveTab(tabParam);
      } else if (storedTab && ['album', 'photos', 'students'].includes(storedTab)) {
        setActiveTab(storedTab);
      }
    }
  }, []);

  const changeTab = (tab: 'album' | 'photos' | 'students') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('active_yearbook_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    if (classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes]);

  // Filter classes by level
  const filteredClasses = classes.filter((c) => {
    if (selectedLevel !== 'ALL' && c.level !== selectedLevel) return false;
    if (searchQuery) {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.major?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.homeroomTeacher.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const activeClass = classes.find((c) => c.id === selectedClassId) || filteredClasses[0] || classes[0];

  // Students and photos for active class
  const classStudents = students.filter((s) => s.classId === activeClass?.id);
  const classPhotos = photos.filter((p) => p.classId === activeClass?.id && p.status === 'approved');

  return (
    <div className="space-y-6">
      {/* YEAR & LEVEL FILTER HEADER */}
      <div className="bg-[#9E9898] text-white p-6 sm:p-8 rounded-3xl border border-gray-300 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-white text-xs font-black uppercase tracking-widest mb-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Digital Yearbook Album</span>
            {isReadOnly && (
              <span className="bg-[#27272A] text-white border border-gray-400 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                Mode Arsip (Read-Only)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{academicYearName}</h1>
          <p className="text-xs sm:text-sm text-gray-100 mt-1 font-semibold">
            {classes.length} Kelas Terdaftar • SMP & SMK Skye Digitalpreneur
          </p>
        </div>

        {/* LEVEL FILTERS (Only shown when viewing multiple classes) */}
        {classes.length > 1 && (
          <div className="flex items-center space-x-2 bg-white/20 p-1.5 rounded-2xl border border-white/30 w-full md:w-auto">
            <button
              onClick={() => setSelectedLevel('ALL')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedLevel === 'ALL'
                  ? 'bg-white text-[#27272A] shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Semua Level
            </button>
            <button
              onClick={() => setSelectedLevel('SMP')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedLevel === 'SMP'
                  ? 'bg-white text-[#27272A] shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              SMP Skye
            </button>
            <button
              onClick={() => setSelectedLevel('SMK')}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedLevel === 'SMK'
                  ? 'bg-white text-[#27272A] shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              SMK Skye
            </button>
          </div>
        )}
      </div>

      {/* CLASS SELECTOR BAR (Only shown when multiple classes are available) */}
      {classes.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-[#27272A] uppercase tracking-wider flex items-center space-x-2">
              <Filter className="w-4 h-4 text-[#9E9898]" />
              <span>Pilih Kelas Untuk Dibuka:</span>
            </h2>
            <div className="relative max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kelas, jurusan, wali..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:border-[#9E9898] shadow-sm"
              />
            </div>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
            {filteredClasses.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">Tidak ada kelas ditemukan.</p>
            ) : (
              filteredClasses.map((c) => {
                const isSelected = (activeClass?.id === c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClassId(c.id)}
                    className={`flex-shrink-0 px-4 py-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#9E9898] text-white border-[#27272A] shadow-md scale-[1.02]'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-[#9E9898] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-white text-[#27272A]' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {c.level}
                      </span>
                      {c.major && c.major !== 'General' && (
                        <span className={`text-[10px] font-extrabold ${isSelected ? 'text-white' : 'text-[#9E9898]'}`}>
                          {c.major}
                        </span>
                      )}
                    </div>
                    <div className="font-black text-sm mt-1">{c.name}</div>
                    <div className="text-[11px] opacity-90 mt-0.5 font-medium">Wali: {c.homeroomTeacher}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeClass && (
        <div className="bg-white border border-gray-300 rounded-3xl shadow-xl overflow-hidden">
          {/* ACTIVE CLASS BANNER */}
          <div className="relative bg-[#9E9898] text-white p-6 sm:p-8 overflow-hidden">
            {activeClass.coverImage && (
              <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${activeClass.coverImage})` }} />
            )}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-white text-[#27272A] font-black text-xs rounded-lg shadow-sm">
                    {activeClass.level}
                  </span>
                  {activeClass.major && activeClass.major !== 'General' && (
                    <span className="px-3 py-1 bg-[#27272A] text-white font-black text-xs rounded-lg border border-gray-500">
                      Jurusan {activeClass.major}
                    </span>
                  )}
                  <span className="text-xs text-gray-100 font-semibold">Wali Kelas: {activeClass.homeroomTeacher}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{activeClass.name}</h2>
                {activeClass.tagline && (
                  <p className="text-sm text-gray-100 italic font-semibold">
                    &quot;{activeClass.tagline}&quot;
                  </p>
                )}
              </div>

              {/* TAB NAVIGATION IN CLASS */}
              <div className="flex items-center space-x-1.5 bg-white/20 p-1.5 rounded-2xl border border-white/30">
                <button
                  onClick={() => changeTab('album')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'album'
                      ? 'bg-white text-[#27272A] shadow-sm'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Album 2 Kolom</span>
                </button>
                <button
                  onClick={() => changeTab('photos')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'photos'
                      ? 'bg-white text-[#27272A] shadow-sm'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Galeri Foto ({classPhotos.length})</span>
                </button>
                <button
                  onClick={() => changeTab('students')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
                    activeTab === 'students'
                      ? 'bg-white text-[#27272A] shadow-sm'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Daftar Siswa ({classStudents.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: 2-COLUMN YEARBOOK ALBUM VIEW */}
          {activeTab === 'album' && (
            <div className="p-4 sm:p-10 bg-[#F4F4F5] min-h-[600px]">
              <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-300 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
                
                {/* Book Spine Shadow on Desktop */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 opacity-70 shadow-inner pointer-events-none z-10" />

                {/* LEFT COLUMN: Galeri Foto Momen Kelas */}
                <div className="space-y-6 pr-0 md:pr-4">
                  <div className="border-b-2 border-[#9E9898] pb-3 flex items-center justify-between">
                    <h3 className="text-base font-black text-[#27272A] uppercase tracking-wider flex items-center space-x-2">
                      <Camera className="w-5 h-5 text-[#9E9898]" />
                      <span>Galeri Momen Kelas</span>
                    </h3>
                    <span className="text-xs font-bold text-gray-400">Halaman Kiri</span>
                  </div>

                  {classPhotos.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 text-xs font-bold">
                      Belum ada foto galeri approved di kelas ini.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {classPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => setDetailPhoto(photo)}
                          className="group relative bg-gray-900 rounded-2xl overflow-hidden shadow-md cursor-pointer border border-gray-300 aspect-square"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 p-3.5 flex flex-col justify-end">
                            <p className="text-white text-xs font-bold line-clamp-2">{photo.caption}</p>
                            <p className="text-[10px] text-gray-300 mt-1 font-semibold">Oleh: {photo.uploaderName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Grid Siswa & Biodata */}
                <div className="space-y-6 pl-0 md:pl-4">
                  <div className="border-b-2 border-[#9E9898] pb-3 flex items-center justify-between">
                    <h3 className="text-base font-black text-[#27272A] uppercase tracking-wider flex items-center space-x-2">
                      <User className="w-5 h-5 text-[#9E9898]" />
                      <span>Biodata Siswa</span>
                    </h3>
                    <span className="text-xs font-bold text-gray-400">Halaman Kanan</span>
                  </div>

                  {classStudents.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-500 text-xs font-bold">
                      Belum ada siswa terdaftar di kelas ini.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {classStudents.map((std) => (
                        <div
                          key={std.id}
                          onClick={() => setDetailStudent(std)}
                          className="bg-gray-50 border border-gray-200 hover:border-[#9E9898] rounded-2xl p-4 transition-all hover:shadow-md cursor-pointer flex items-start space-x-4 group"
                        >
                          <DefaultAvatar
                            src={std.avatar}
                            alt={std.name}
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#9E9898] shrink-0 group-hover:scale-105 transition-transform shadow-md"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-black text-[#27272A] group-hover:text-[#9E9898] transition-colors truncate">
                                {std.name}
                              </h4>
                              {std.funAward && (
                                <span className="bg-[#9E9898] text-white text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                                  {std.funAward}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 font-bold">NISN: {std.nisn}</p>
                            
                            <div className="mt-2 text-xs text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200 italic line-clamp-2 font-medium">
                              &quot;{std.quote || 'Belum ada quotes.'}&quot;
                            </div>

                            <div className="mt-2 flex items-center space-x-2 text-[11px] text-[#27272A] font-extrabold">
                              <Award className="w-3.5 h-3.5 text-[#9E9898] shrink-0" />
                              <span className="truncate">{std.ambition || 'Cita-cita'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: GALERI FOTO LENGKAP */}
          {activeTab === 'photos' && (
            <div className="p-6 sm:p-8 bg-gray-50">
              <h3 className="text-base font-black text-gray-800 mb-4 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-[#9E9898]" />
                <span>Foto-Foto Momen Kelas {activeClass.name}</span>
              </h3>
              {classPhotos.length === 0 ? (
                <p className="text-xs text-gray-500 font-medium">Belum ada foto approved.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {classPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => setDetailPhoto(photo)}
                      className="bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="aspect-video relative bg-gray-900 overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-bold text-gray-800 line-clamp-2">{photo.caption}</p>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 font-semibold pt-2 border-t border-gray-100">
                          <span>Oleh: {photo.uploaderName}</span>
                          <span>{photo.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DAFTAR SISWA LENGKAP (FOTO BESAR) */}
          {activeTab === 'students' && (
            <div className="p-6 sm:p-8 bg-gray-50">
              <h3 className="text-base font-black text-gray-800 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-[#9E9898]" />
                <span>Anggota Kelas {activeClass.name}</span>
              </h3>
              {classStudents.length === 0 ? (
                <p className="text-xs text-gray-500 font-medium">Belum ada siswa terdaftar.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {classStudents.map((std) => (
                    <div
                      key={std.id}
                      onClick={() => setDetailStudent(std)}
                      className="bg-white border border-gray-300 hover:border-[#9E9898] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      {/* Large Portrait Photo Banner */}
                      <div className="aspect-[4/5] relative bg-gray-900 overflow-hidden">
                        <DefaultAvatar
                          src={std.avatar}
                          alt={std.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-4 flex flex-col justify-end">
                          <h4 className="font-black text-lg text-white leading-tight">{std.name}</h4>
                          <p className="text-xs text-gray-300 font-semibold mt-0.5">NISN: {std.nisn}</p>
                          {std.funAward && (
                            <span className="mt-2 inline-block bg-[#9E9898] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full self-start shadow-sm">
                              {std.funAward}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs italic text-gray-700 line-clamp-3 font-medium">
                          &quot;{std.quote || 'Belum ada quotes.'}&quot;
                        </div>

                        <div className="flex items-center space-x-2 text-xs font-extrabold text-[#27272A] bg-gray-100 p-2.5 rounded-xl border border-gray-200">
                          <Award className="w-4 h-4 text-[#9E9898] shrink-0" />
                          <span className="truncate">{std.ambition || 'Cita-cita'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* STUDENT DETAIL MODAL */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-300 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setDetailStudent(null)}
              className="absolute top-3 right-3 bg-gray-800 text-white p-2 rounded-full transition-colors z-10 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-[#9E9898] p-6 text-white text-center relative">
              <DefaultAvatar
                src={detailStudent.avatar}
                alt={detailStudent.name}
                className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
              />
              <h3 className="text-xl font-black mt-3 text-white">{detailStudent.name}</h3>
              <p className="text-xs text-gray-100 font-bold">NISN: {detailStudent.nisn}</p>
              {detailStudent.funAward && (
                <span className="inline-block mt-2 bg-white text-[#27272A] text-xs font-black px-3 py-1 rounded-full shadow-md">
                  🏆 {detailStudent.funAward}
                </span>
              )}
            </div>

            <div className="p-6 space-y-4 text-gray-800">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center space-x-1 mb-1">
                  <Quote className="w-3.5 h-3.5 text-[#9E9898]" />
                  <span>Kata-kata Perpisahan / Quote</span>
                </div>
                <p className="text-sm font-semibold italic text-gray-900">
                  &quot;{detailStudent.quote || 'Belum diisi'}&quot;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Cita-Cita</span>
                  <p className="text-xs font-bold text-[#27272A] mt-0.5">{detailStudent.ambition || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Hobi</span>
                  <p className="text-xs font-bold text-[#27272A] mt-0.5">{detailStudent.hobbies || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Sosial Media</span>
                  <p className="text-xs font-bold text-[#27272A] mt-0.5">{detailStudent.socialMedia || '-'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Email</span>
                  <p className="text-xs font-bold text-gray-800 mt-0.5 truncate">{detailStudent.email || '-'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] font-black text-gray-500 uppercase">Nomor Telepon / WA</span>
                <p className="text-xs font-bold text-[#27272A] mt-0.5">{detailStudent.phone || '-'}</p>
              </div>

              {detailStudent.bio && (
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Tentang Saya</span>
                  <p className="text-xs text-gray-700 mt-0.5 font-medium">{detailStudent.bio}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-100 px-6 py-3.5 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setDetailStudent(null)}
                className="px-5 py-2 bg-[#9E9898] text-white text-xs font-extrabold rounded-xl hover:bg-[#888282] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHOTO DETAIL MODAL */}
      {detailPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-gray-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-300 relative">
            <button
              onClick={() => setDetailPhoto(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video relative bg-black flex items-center justify-center">
              <img
                src={detailPhoto.url}
                alt={detailPhoto.caption}
                className="max-h-[60vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6 space-y-2">
              <h4 className="text-base font-extrabold text-[#27272A]">{detailPhoto.caption}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200 font-semibold">
                <span>Di-upload oleh: <strong className="text-[#9E9898]">{detailPhoto.uploaderName}</strong></span>
                <span>Tanggal: {detailPhoto.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
