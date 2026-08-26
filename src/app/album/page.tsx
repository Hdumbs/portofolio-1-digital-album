'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useYearbookStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Level } from '@/types';
import { Search, Filter, BookOpen, ChevronRight, Layers } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export default function ClassDirectoryPage() {
  const { session, logout, isLoaded, academicYears, classes } = useYearbookStore();

  const [selectedLevel, setSelectedLevel] = useState<Level | 'ALL'>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "Direktori Kelas | Skye Digital Yearbook";
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E9898]"></div>
      </div>
    );
  }

  // Active academic year
  const activeYear = academicYears.find((y) => y.isActive) || academicYears[0];
  const activeClasses = classes.filter((c) => c.academicYearId === activeYear?.id);

  // Filtering
  const filteredClasses = activeClasses.filter((c) => {
    if (selectedLevel !== 'ALL' && c.level !== selectedLevel) return false;
    if (selectedGrade !== 'ALL' && c.grade !== Number(selectedGrade)) return false;
    if (searchQuery) {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.major?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between selection:bg-[#9E9898] selection:text-white">
      <Header session={session} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* DIRECTORY HEADER BANNER */}
        <div className="bg-[#9E9898] text-white p-6 sm:p-8 rounded-3xl border border-gray-300 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-white text-xs font-black uppercase tracking-widest mb-1.5">
              <Layers className="w-4 h-4" />
              <span>Direktori Kelas Skye</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{activeYear?.name}</h1>
            <p className="text-xs sm:text-sm text-gray-100 mt-1 font-semibold">
              Pilih kelas untuk membuka web album digital terpisah (lengkap dengan galeri & biodata siswa).
            </p>
          </div>

          {/* LEVEL & GRADE FILTER CONTROLS */}
          <div className="flex flex-wrap items-center gap-2 bg-white/20 p-2 rounded-2xl border border-white/30 w-full md:w-auto">
            {/* Level Filter */}
            <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => {
                  setSelectedLevel('ALL');
                  setSelectedGrade('ALL');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  selectedLevel === 'ALL' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => {
                  setSelectedLevel('SMP');
                  setSelectedGrade('ALL');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  selectedLevel === 'SMP' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
                }`}
              >
                SMP
              </button>
              <button
                onClick={() => {
                  setSelectedLevel('SMK');
                  setSelectedGrade('ALL');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  selectedLevel === 'SMK' ? 'bg-white text-[#27272A] shadow-sm' : 'text-white hover:bg-white/20'
                }`}
              >
                SMK
              </button>
            </div>

            {/* Grade Filter */}
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="bg-white text-[#27272A] font-extrabold text-xs px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Kelas / Angkatan</option>
              {selectedLevel === 'SMP' && (
                <>
                  <option value={7}>Kelas 7 SMP</option>
                  <option value={8}>Kelas 8 SMP</option>
                  <option value={9}>Kelas 9 SMP</option>
                </>
              )}
              {selectedLevel === 'SMK' && (
                <>
                  <option value={10}>Kelas 10 SMK</option>
                  <option value={11}>Kelas 11 SMK</option>
                  <option value={12}>Kelas 12 SMK</option>
                </>
              )}
              {selectedLevel === 'ALL' && (
                <>
                  <option value={7}>Kelas 7</option>
                  <option value={8}>Kelas 8</option>
                  <option value={9}>Kelas 9</option>
                  <option value={10}>Kelas 10</option>
                  <option value={11}>Kelas 11</option>
                  <option value={12}>Kelas 12</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-black text-[#27272A] uppercase tracking-wider flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#9E9898]" />
            <span>Daftar Kelas ({filteredClasses.length}):</span>
          </h2>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama kelas atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:outline-none focus:border-[#9E9898] shadow-sm"
            />
          </div>
        </div>

        {/* CLASS CARDS GRID (Sesuai Permintaan: Logo/Foto Kelas, Nama Kelas, Deskripsi & Link IG) */}
        {filteredClasses.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-300 text-center text-gray-500 space-y-2 shadow-sm">
            <p className="text-sm font-bold">Tidak ada kelas yang cocok dengan filter kamu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-300 hover:border-[#9E9898] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* CLASS CARD TOP BODY */}
                <div className="p-6 space-y-4">
                  
                  {/* Logo Kelas / Avatar Banner */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-[#9E9898] overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <img
                        src={item.classLogo || item.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
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
                      <p className="text-[11px] text-gray-500 font-semibold truncate">Wali: {item.homeroomTeacher}</p>
                    </div>
                  </div>

                  {/* Deskripsi Kelas */}
                  <p className="text-xs text-gray-600 font-medium leading-relaxed line-clamp-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    {item.description || item.tagline || 'Kelas unggulan SMP-SMK Skye Digitalpreneur.'}
                  </p>

                  {/* Link Instagram Kelas */}
                  {item.instagramUrl ? (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-extrabold text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200 transition-colors"
                    >
                      <InstagramIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.instagramUrl.replace('https://', '')}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-medium italic block">
                      Belum dikaitkan Instagram
                    </span>
                  )}
                </div>

                {/* CARD FOOTER: LINK TERPISAH KE WEB ALBUM KELAS */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <Link
                    href={`/class/${item.id}`}
                    className="w-full py-3 px-4 bg-[#9E9898] hover:bg-[#888282] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-sm group-hover:bg-[#27272A]"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Buka Web Album Kelas</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            ))}
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
