'use client';

import React, { useState, useEffect } from 'react';
import { useYearbookStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { YearbookView } from '@/components/YearbookView';
import { Archive, Calendar, Lock } from 'lucide-react';

export default function ArchivePage() {
  const { session, logout, isLoaded, academicYears, classes, students, photos } = useYearbookStore();

  const archivedYears = academicYears.filter((y) => y.isArchived);
  const [selectedArchivedYearId, setSelectedArchivedYearId] = useState<string>(archivedYears[0]?.id || '');

  useEffect(() => {
    document.title = "Arsip Tahun Ajaran | Skye Digital Yearbook";
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9E9898]"></div>
      </div>
    );
  }

  const selectedYear = academicYears.find((y) => y.id === selectedArchivedYearId) || archivedYears[0];
  const yearClasses = classes.filter((c) => c.academicYearId === selectedYear?.id);
  const yearStudents = students.filter((s) => s.academicYearId === selectedYear?.id);
  const yearPhotos = photos.filter((p) => p.academicYearId === selectedYear?.id);

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-gray-800 flex flex-col justify-between">
      <Header session={session} onLogout={logout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Archive Selector Banner */}
        <div className="bg-[#9E9898] text-white border border-gray-300 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-white text-xs font-bold uppercase tracking-wider">
              <Archive className="w-4 h-4 text-white" />
              <span>Arsip Lintas Tahun Ajaran</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Galeri Tahun Ajaran Sebelumnya</h1>
            <p className="text-xs text-gray-100 font-medium">
              Data tersimpan permanen dan terlindungi (Read-Only) untuk nostalgia alumni dan viewer.
            </p>
          </div>

          {/* Academic Year Picker */}
          <div className="flex items-center space-x-2 bg-white text-gray-800 px-3 py-2 rounded-xl border border-gray-300 shadow-sm">
            <Calendar className="w-4 h-4 text-[#9E9898] shrink-0" />
            <select
              value={selectedArchivedYearId}
              onChange={(e) => setSelectedArchivedYearId(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none cursor-pointer pr-2"
            >
              {archivedYears.map((y) => (
                <option key={y.id} value={y.id} className="bg-white text-gray-800">
                  {y.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedYear ? (
          <YearbookView
            classes={yearClasses}
            students={yearStudents}
            photos={yearPhotos}
            academicYearName={`${selectedYear.name} (Arsip)`}
            isReadOnly={true}
          />
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-300 text-center text-gray-500 space-y-3 shadow-sm">
            <Lock className="w-10 h-10 mx-auto text-gray-400" />
            <p className="text-sm font-medium">Belum ada tahun ajaran yang diarsipkan.</p>
          </div>
        )}

      </main>

      <footer className="border-t border-gray-300 py-6 bg-[#9E9898] text-center text-xs text-white">
        <div className="max-w-7xl mx-auto px-4 font-medium">
          © 2026 SMP-SMK Skye Digitalpreneur. Skye Digital Yearbook Platform.
        </div>
      </footer>
    </div>
  );
}
