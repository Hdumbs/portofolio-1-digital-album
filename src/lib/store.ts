'use client';

import { useState, useEffect } from 'react';
import { AcademicYear, ClassItem, Student, ClassPhoto, UserSession } from '@/types';
import { INITIAL_ACADEMIC_YEARS, INITIAL_CLASSES, INITIAL_STUDENTS, INITIAL_PHOTOS } from './mockData';

const KEYS = {
  YEARS: 'skye_yearbook_years',
  CLASSES: 'skye_yearbook_classes',
  STUDENTS: 'skye_yearbook_students',
  PHOTOS: 'skye_yearbook_photos',
  SESSION: 'skye_yearbook_session',
};

export function useYearbookStore() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [photos, setPhotos] = useState<ClassPhoto[]>([]);
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch initial data from API, with localStorage fallback
  const fetchAllData = async () => {
    try {
      const [resYears, resClasses, resStudents, resPhotos, resSession] = await Promise.all([
        fetch('/api/academic-years').then((r) => r.ok ? r.json() : null),
        fetch('/api/classes').then((r) => r.ok ? r.json() : null),
        fetch('/api/students').then((r) => r.ok ? r.json() : null),
        fetch('/api/photos').then((r) => r.ok ? r.json() : null),
        fetch('/api/auth/me').then((r) => r.ok ? r.json() : null),
      ]);

      if (resYears && resYears.length > 0) {
        setAcademicYears(resYears);
        localStorage.setItem(KEYS.YEARS, JSON.stringify(resYears));
      } else {
        const storedYears = localStorage.getItem(KEYS.YEARS);
        setAcademicYears(storedYears ? JSON.parse(storedYears) : INITIAL_ACADEMIC_YEARS);
      }

      if (resClasses && resClasses.length > 0) {
        setClasses(resClasses);
        localStorage.setItem(KEYS.CLASSES, JSON.stringify(resClasses));
      } else {
        const storedClasses = localStorage.getItem(KEYS.CLASSES);
        setClasses(storedClasses ? JSON.parse(storedClasses) : INITIAL_CLASSES);
      }

      if (resStudents && resStudents.length > 0) {
        setStudents(resStudents);
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify(resStudents));
      } else {
        const storedStudents = localStorage.getItem(KEYS.STUDENTS);
        setStudents(storedStudents ? JSON.parse(storedStudents) : INITIAL_STUDENTS);
      }

      if (resPhotos && resPhotos.length > 0) {
        setPhotos(resPhotos);
        localStorage.setItem(KEYS.PHOTOS, JSON.stringify(resPhotos));
      } else {
        const storedPhotos = localStorage.getItem(KEYS.PHOTOS);
        setPhotos(storedPhotos ? JSON.parse(storedPhotos) : INITIAL_PHOTOS);
      }

      const storedSessionRaw = localStorage.getItem(KEYS.SESSION);
      const storedSession = storedSessionRaw ? JSON.parse(storedSessionRaw) : null;

      if (storedSession && storedSession.role !== 'viewer') {
        setSession(storedSession);
      } else if (resSession?.session) {
        setSession(resSession.session);
        localStorage.setItem(KEYS.SESSION, JSON.stringify(resSession.session));
      } else {
        setSession({ role: 'viewer', name: 'Tamu / Viewer' });
      }
    } catch {
      // Fallback local storage
      const storedYears = localStorage.getItem(KEYS.YEARS);
      const storedClasses = localStorage.getItem(KEYS.CLASSES);
      const storedStudents = localStorage.getItem(KEYS.STUDENTS);
      const storedPhotos = localStorage.getItem(KEYS.PHOTOS);
      const storedSession = localStorage.getItem(KEYS.SESSION);

      setAcademicYears(storedYears ? JSON.parse(storedYears) : INITIAL_ACADEMIC_YEARS);
      setClasses(storedClasses ? JSON.parse(storedClasses) : INITIAL_CLASSES);
      setStudents(storedStudents ? JSON.parse(storedStudents) : INITIAL_STUDENTS);
      setPhotos(storedPhotos ? JSON.parse(storedPhotos) : INITIAL_PHOTOS);
      setSession(storedSession ? JSON.parse(storedSession) : { role: 'viewer', name: 'Tamu / Viewer' });
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const saveYears = (data: AcademicYear[]) => {
    setAcademicYears(data);
    localStorage.setItem(KEYS.YEARS, JSON.stringify(data));
  };

  const saveClasses = (data: ClassItem[]) => {
    setClasses(data);
    localStorage.setItem(KEYS.CLASSES, JSON.stringify(data));
  };

  const saveStudents = (data: Student[]) => {
    setStudents(data);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data));
  };

  const savePhotos = (data: ClassPhoto[]) => {
    setPhotos(data);
    localStorage.setItem(KEYS.PHOTOS, JSON.stringify(data));
  };

  const loginAs = async (newSession: UserSession, password?: string) => {
    setSession(newSession);
    localStorage.setItem(KEYS.SESSION, JSON.stringify(newSession));

    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newSession.role,
          usernameOrNisn: newSession.nisnOrNip,
          password: password || '123456',
          studentId: newSession.studentId,
          isLeader: newSession.role === 'class_leader',
        }),
      });
    } catch (e) {
      console.warn('API login sync warning:', e);
    }
  };

  const logout = async () => {
    const defaultSession: UserSession = { role: 'viewer', name: 'Tamu / Viewer' };
    setSession(defaultSession);
    localStorage.setItem(KEYS.SESSION, JSON.stringify(defaultSession));

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('API logout sync warning:', e);
    }
  };

  const addClass = async (newClass: Omit<ClassItem, 'id'>) => {
    const tempId = `class-${Date.now()}`;
    const item: ClassItem = { ...newClass, id: tempId };
    saveClasses([...classes, item]);

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      });
      if (res.ok) {
        const saved = await res.json();
        saveClasses(classes.map((c) => (c.id === tempId ? saved : c)));
      }
    } catch (e) {
      console.warn('API addClass error:', e);
    }
  };

  const updateClass = async (updatedClass: ClassItem) => {
    saveClasses(classes.map((c) => (c.id === updatedClass.id ? updatedClass : c)));

    try {
      await fetch('/api/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClass),
      });
    } catch (e) {
      console.warn('API updateClass error:', e);
    }
  };

  const deleteClass = async (id: string) => {
    saveClasses(classes.filter((c) => c.id !== id));

    try {
      await fetch(`/api/classes?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API deleteClass error:', e);
    }
  };

  const archiveAcademicYear = async (yearId: string) => {
    const updatedYears = academicYears.map((y) => {
      if (y.id === yearId) return { ...y, isArchived: true, isActive: false };
      return y;
    });
    saveYears(updatedYears);

    try {
      await fetch('/api/academic-years', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: yearId, isArchived: true, isActive: false }),
      });
    } catch (e) {
      console.warn('API archiveAcademicYear error:', e);
    }
  };

  const addAcademicYear = async (name: string) => {
    const tempYear: AcademicYear = {
      id: `ay-${Date.now()}`,
      name,
      isArchived: false,
      isActive: true,
    };
    saveYears([...academicYears, tempYear]);

    try {
      const res = await fetch('/api/academic-years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const savedYear = await res.json();
        saveYears(academicYears.map((y) => (y.id === tempYear.id ? savedYear : y)));
      }
    } catch (e) {
      console.warn('API addAcademicYear error:', e);
    }
  };

  const updateStudentBiodata = async (updatedStudent: Student) => {
    saveStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));

    try {
      await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      });
    } catch (e) {
      console.warn('API updateStudentBiodata error:', e);
    }
  };

  const addPhoto = async (photo: Omit<ClassPhoto, 'id' | 'createdAt'>) => {
    const tempPhoto: ClassPhoto = {
      ...photo,
      id: `photo-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    savePhotos([tempPhoto, ...photos]);

    try {
      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo),
      });
      if (res.ok) {
        const savedPhoto = await res.json();
        savePhotos(photos.map((p) => (p.id === tempPhoto.id ? savedPhoto : p)));
      }
    } catch (e) {
      console.warn('API addPhoto error:', e);
    }
  };

  const updatePhotoStatus = async (photoId: string, status: 'approved' | 'rejected') => {
    savePhotos(photos.map((p) => (p.id === photoId ? { ...p, status } : p)));

    try {
      await fetch('/api/photos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: photoId, status }),
      });
    } catch (e) {
      console.warn('API updatePhotoStatus error:', e);
    }
  };

  const deletePhoto = async (photoId: string) => {
    savePhotos(photos.filter((p) => p.id !== photoId));

    try {
      await fetch(`/api/photos?id=${photoId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API deletePhoto error:', e);
    }
  };

  const updateClassInstagramUrl = async (classId: string, instagramUrl: string) => {
    saveClasses(classes.map((c) => (c.id === classId ? { ...c, instagramUrl } : c)));

    try {
      await fetch('/api/classes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: classId, instagramUrl }),
      });
    } catch (e) {
      console.warn('API updateClassInstagramUrl error:', e);
    }
  };

  const resetToDefault = () => {
    saveYears(INITIAL_ACADEMIC_YEARS);
    saveClasses(INITIAL_CLASSES);
    saveStudents(INITIAL_STUDENTS);
    savePhotos(INITIAL_PHOTOS);
  };

  return {
    isLoaded,
    academicYears,
    classes,
    students,
    photos,
    session,
    loginAs,
    logout,
    addClass,
    updateClass,
    deleteClass,
    archiveAcademicYear,
    addAcademicYear,
    updateStudentBiodata,
    addPhoto,
    updatePhotoStatus,
    deletePhoto,
    updateClassInstagramUrl,
    resetToDefault,
    refreshData: fetchAllData,
  };
}
