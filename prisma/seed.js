const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Skye Digital Yearbook database...');

  // Reset database tables
  await prisma.classPhoto.deleteMany();
  await prisma.student.deleteMany();
  await prisma.classItem.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create Super Admin & Wali Kelas Accounts
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({
    data: {
      nip: 'admin',
      name: 'Super Admin Sekolah',
      password: adminPassword,
      role: 'admin',
    },
  });

  await prisma.adminUser.create({
    data: {
      nip: 'wali_pplg',
      name: 'Bu Rani, S.Kom (Wali Kelas 11 PPLG)',
      password: adminPassword,
      role: 'wali_kelas',
      classId: 'class-11-pplg-25',
    },
  });

  await prisma.adminUser.create({
    data: {
      nip: 'wali_retail',
      name: 'Pak Agus, M.M (Wali Kelas 10 Retail)',
      password: adminPassword,
      role: 'wali_kelas',
      classId: 'class-10-retail-25',
    },
  });

  // Create Academic Years
  const ayActive = await prisma.academicYear.create({
    data: {
      id: 'ay-2025-2026',
      name: 'Tahun Ajaran 2025/2026',
      isArchived: false,
      isActive: true,
    },
  });

  const ayArchived = await prisma.academicYear.create({
    data: {
      id: 'ay-2024-2025',
      name: 'Tahun Ajaran 2024/2025',
      isArchived: true,
      isActive: false,
    },
  });

  // Create Classes
  const class11PPLG = await prisma.classItem.create({
    data: {
      id: 'class-11-pplg-25',
      name: '11 PPLG',
      level: 'SMK',
      grade: 11,
      major: 'PPLG',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Bu Rani, S.Kom',
      tagline: 'Coding today, transforming tomorrow.',
      description: 'Kelas unggulan SMK Skye jurusan Pengembangan Perangkat Lunak & Gim. Berfokus pada mobile & web development.',
      classLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/11pplg.skye',
    },
  });

  const class10Retail = await prisma.classItem.create({
    data: {
      id: 'class-10-retail-25',
      name: '10 Retail',
      level: 'SMK',
      grade: 10,
      major: 'Retail',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Pak Agus, M.M',
      tagline: 'Mastering modern digital commerce.',
      description: 'Generasi muda pencipta ekosistem bisnis digital dan e-commerce modern SMK Skye Digitalpreneur.',
      classLogo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/10retail.skye',
    },
  });

  const class12PO = await prisma.classItem.create({
    data: {
      id: 'class-12-po-25',
      name: '12 Project Officer',
      level: 'SMK',
      grade: 12,
      major: 'Project Officer',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Bu Maya, S.T',
      tagline: 'Leading innovation & managing future projects.',
      description: 'Para manajer proyek masa depan yang dilatih mengeksekusi ide kreatif menjadi produk nyata.',
      classLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/12po.skye',
    },
  });

  const class7A = await prisma.classItem.create({
    data: {
      id: 'class-7a-25',
      name: '7A Skye Junior',
      level: 'SMP',
      grade: 7,
      major: 'General',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Pak Hendra, S.Pd',
      tagline: 'Awal langkah generasi digital unggul.',
      description: 'Siswa kelas 7 SMP Skye yang aktif, penuh semangat, dan antusias menyambut dunia digital.',
      classLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/7a.skyejunior',
    },
  });

  // Create Students
  const defaultPassword = await bcrypt.hash('123456', 10);

  const studentDimas = await prisma.student.create({
    data: {
      id: 'std-dimas',
      nisn: '0071234567',
      password: defaultPassword,
      name: 'Dimas Anggara',
      classId: class11PPLG.id,
      academicYearId: ayActive.id,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      quote: '"Bukan sekadar ngoding, tapi membuat karya yang berdampak luas."',
      ambition: 'Senior Fullstack Software Engineer & Tech Founder',
      hobbies: 'Coding, Main Game Valorant, Desain UI/UX',
      socialMedia: '@dimas.pplg',
      email: 'dimas@skye.sch.id',
      bio: 'Ketua Kelas 11 PPLG & Web Club SMK Skye Digitalpreneur.',
      funAward: 'Ter-Coding Master 💻',
      isClassLeader: true,
    },
  });

  const studentSiti = await prisma.student.create({
    data: {
      id: 'std-siti',
      nisn: '0071234568',
      password: defaultPassword,
      name: 'Siti Rahmawati',
      classId: class11PPLG.id,
      academicYearId: ayActive.id,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      quote: '"Desain yang baik adalah yang tidak terlihat rumit tapi solutif."',
      ambition: 'Product Designer & UI/UX Specialist',
      hobbies: 'Sketching, Photography, Listening to Podcast',
      socialMedia: '@siti.design',
      email: 'siti@skye.sch.id',
      bio: 'Anggota aktif OSIS bidang Publikasi & Komunikasi.',
      funAward: 'Ter-Estetik UI/UX 🎨',
      isClassLeader: false,
    },
  });

  const studentRizky = await prisma.student.create({
    data: {
      id: 'std-rizky',
      nisn: '0071234569',
      password: defaultPassword,
      name: 'Rizky Pratama',
      classId: class11PPLG.id,
      academicYearId: ayActive.id,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      quote: '"Debugging adalah seni menemukan kebenaran dari tumpukan error."',
      ambition: 'Cyber Security Specialist',
      hobbies: 'CTF Challenge, Chess, Basketball',
      socialMedia: '@rizky.sec',
      email: 'rizky@skye.sch.id',
      bio: 'Pecinta keamanan siber dan jaringan.',
      funAward: 'Ter-Cyber Security 🔒',
      isClassLeader: false,
    },
  });

  const studentAnisa = await prisma.student.create({
    data: {
      id: 'std-anisa',
      nisn: '0082345678',
      password: defaultPassword,
      name: 'Anisa Putri',
      classId: class10Retail.id,
      academicYearId: ayActive.id,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      quote: '"Bisnis digital adalah kunci menguasai pasar masa depan."',
      ambition: 'E-commerce Business Director',
      hobbies: 'Digital Marketing, Content Creator',
      socialMedia: '@anisa.retail',
      email: 'anisa@skye.sch.id',
      bio: 'Ketua Kelas 10 Retail & Spesialis live streaming commerce.',
      funAward: 'Ter-Live Commerce 🚀',
      isClassLeader: true,
    },
  });

  // Create Photos
  await prisma.classPhoto.createMany({
    data: [
      {
        id: 'photo-1',
        classId: class11PPLG.id,
        academicYearId: ayActive.id,
        uploaderId: studentDimas.id,
        uploaderName: studentDimas.name,
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
        caption: 'Momen pengerjaan project Web Hackathon Skye 2025 bareng tim PPLG.',
        status: 'approved',
      },
      {
        id: 'photo-2',
        classId: class11PPLG.id,
        academicYearId: ayActive.id,
        uploaderId: studentSiti.id,
        uploaderName: studentSiti.name,
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        caption: 'Presentasi UI/UX App Showcase di hadapan para guru dan coach.',
        status: 'approved',
      },
      {
        id: 'photo-3',
        classId: class11PPLG.id,
        academicYearId: ayActive.id,
        uploaderId: studentRizky.id,
        uploaderName: studentRizky.name,
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
        caption: 'Foto kebersamaan sekelas saat class meeting semester ganjil.',
        status: 'approved',
      },
    ],
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
