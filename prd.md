# Product Requirements Document: Skye Digital Yearbook

## Product Overview

**Product Vision:** Platform album digital (yearbook) berbasis web untuk SMP-SMK Skye Digitalpreneur, tempat setiap kelas punya "album" sendiri berisi foto dan biodata siswa, yang tetap tersimpan dan bisa diakses lintas tahun ajaran layaknya buku tahunan fisik.

**Target Users:** Siswa SMP (kelas 7-9) dan SMK (kelas 10-12), guru/wali kelas sebagai admin, serta alumni/orang tua/masyarakat umum sebagai viewer.

**Business Objectives:**
- Mendigitalkan tradisi buku tahunan sekolah agar lebih murah, cepat diakses, dan tidak hilang/rusak.
- Meningkatkan engagement siswa dalam mendokumentasikan momen kelas.
- Memberi sekolah arsip digital permanen lintas tahun ajaran.

**Success Metrics:**
- % siswa aktif upload foto & mengisi biodata per kelas.
- Jumlah foto ter-upload per tahun ajaran.
- Waktu admin menyelesaikan pergantian tahun ajaran (arsip) < 15 menit.
- Tidak ada laporan siswa mengedit/upload ke kelas lain (0 pelanggaran akses).

## User Personas

### Persona 1: Bu Rani (Admin/Guru)
- **Demografi:** 35 tahun, wali kelas, cukup melek teknologi dasar.
- **Tujuan:** Mengelola kelas per tahun ajaran, moderasi foto siswa, mengarsipkan tahun ajaran lama tanpa menghapus data.
- **Pain Points:** Takut salah hapus data lama, butuh kontrol foto yang tidak pantas, repot kalau harus atur manual tiap kelas.
- **User Journey:** Login sebagai admin → buat/atur kelas baru tiap tahun ajaran → pantau upload siswa → di akhir tahun ajaran, arsipkan kelas ke folder "Tahun Ajaran 20XX-20XX".

### Persona 2: Dimas (Siswa kelas 11 PPLG)
- **Demografi:** 16 tahun, siswa SMK jurusan PPLG, terbiasa pakai HP untuk semua hal.
- **Tujuan:** Upload foto kegiatan kelas, isi/edit biodata diri sendiri, lihat album kelasnya sendiri.
- **Pain Points:** Ribet kalau harus buka laptop, tidak mau foto pribadinya bisa diutak-atik orang lain.
- **User Journey:** Login sebagai siswa → masuk ke halaman kelas sendiri (11D PPLG) → upload foto ke galeri kelas → edit biodata pribadi (nama, foto profil, kata-kata perpisahan, dll).

### Persona 3: Alumni/Orang tua (Viewer)
- **Demografi:** Bervariasi, mengakses lewat link publik sekolah.
- **Tujuan:** Melihat-lihat album kelas, bernostalgia, melihat arsip tahun ajaran lama.
- **Pain Points:** Tidak butuh akun ribet, hanya ingin lihat.
- **User Journey:** Buka website → pilih tahun ajaran & kelas → lihat galeri foto & biodata (read-only).

## Feature Requirements

| Feature | Description | User Stories | Priority | Acceptance Criteria | Dependencies |
|---------|-------------|---------------|----------|----------------------|--------------|
| **Manajemen Struktur Kelas** | Admin membuat/mengedit struktur jenjang & kelas (SMP 7/8/9 A-C, SMK 10/11/12 dengan jurusan) | Sebagai admin, saya ingin menambah/mengubah kelas per tahun ajaran | Must | Admin bisa CRUD kelas, jurusan otomatis ter-tag (Retail/PPLG/Project Officer) | Auth role |
| **Role & Akses (Admin/Siswa/Viewer)** | 3 level akses berbeda | Sebagai siswa, saya hanya bisa mengubah data & kelas saya sendiri | Must | Siswa gagal akses/edit kelas lain (403), Viewer hanya bisa GET | Auth |
| **Upload & Galeri Foto per Kelas** | Siswa upload foto ke "album" kelasnya, tersusun seperti galeri yearbook | Sebagai siswa, saya ingin menambahkan foto ke album kelas saya | Must | Foto masuk moderasi admin (opsional), tampil di grid album kelas | Storage |
| **Moderasi Foto (Admin)** | Admin bisa approve/hapus foto yang di-upload siswa | Sebagai admin, saya ingin menghapus foto yang tidak pantas | Must | Admin bisa hapus foto siapapun di semua kelas | Upload feature |
| **Edit Biodata Siswa** | Siswa mengisi/edit biodata sendiri (foto profil, nama, cita-cita, quotes, dll) | Sebagai siswa, saya ingin mengisi biodata diri saya | Must | Siswa hanya bisa edit biodata miliknya sendiri | Auth |
| **Arsip Tahun Ajaran** | Saat tahun ajaran baru dimulai, admin memindahkan kelas lama ke arsip "Tahun Ajaran 20XX-20XX" (tidak dihapus) | Sebagai admin, saya ingin mengarsipkan tahun ajaran lalu tanpa kehilangan data | Must | Data lama tetap ada, dipindah ke tab/halaman arsip terpisah, read-only untuk siswa lama | Class management |
| **Halaman Arsip (Publik/Viewer)** | Daftar tahun ajaran lama yang bisa dibuka viewer | Sebagai viewer, saya ingin melihat album tahun ajaran sebelumnya | Should | List tahun ajaran terurut terbaru-terlama, klik → tampil kelas & foto seperti biasa | Arsip feature |
| **Tampilan Album (2 Kolom Kiri-Kanan)** | Layout kiri-kanan seperti buku yearbook, responsif mobile & desktop | Sebagai user, saya ingin pengalaman seperti membuka buku tahunan | Must | Layout 2 kolom di desktop, menyesuaikan (stack) di mobile | UI |
| **Landing / Pemilihan Peran** | Halaman awal untuk masuk sebagai admin/siswa/viewer | Sebagai user, saya ingin memilih peran saat masuk | Must | Redirect sesuai role setelah login | Auth |

## User Flows

### Flow 1: Admin Mengelola Tahun Ajaran Baru
1. Admin login ke dashboard
2. Admin membuat tahun ajaran baru & struktur kelas (SMP 7-9 A/B/C, SMK 10-12 sesuai jurusan)
3. Admin mengaktifkan tahun ajaran ini sebagai "aktif"
   - Alternatif: Admin mengedit kelas yang sudah ada (ubah nama, jurusan)
   - Error state: Nama kelas duplikat → sistem tolak & beri notifikasi

### Flow 2: Siswa Upload Foto & Edit Biodata
1. Siswa login, sistem otomatis arahkan ke halaman kelasnya sendiri
2. Siswa membuka tab "Galeri Kelas" → upload foto
3. Siswa membuka tab "Biodata Saya" → edit data pribadi & simpan
   - Alternatif: Siswa coba akses URL kelas lain → sistem tolak akses (403 / redirect)
   - Error state: Upload gagal (file terlalu besar/format salah) → pesan error jelas

### Flow 3: Admin Mengarsipkan Tahun Ajaran Lama
1. Admin membuka "Kelola Tahun Ajaran"
2. Admin memilih tahun ajaran yang berakhir → klik "Arsipkan"
3. Sistem memindahkan seluruh kelas & foto ke halaman Arsip dengan label "Tahun Ajaran 20XX-20XX", data tidak terhapus
   - Alternatif: Admin batal arsip sebelum konfirmasi akhir
   - Error state: Tahun ajaran masih berstatus aktif dengan siswa masih mengedit → sistem minta konfirmasi tambahan

### Flow 4: Viewer Menjelajah Album
1. Viewer membuka website tanpa login (atau login sebagai viewer)
2. Viewer memilih tahun ajaran (aktif atau arsip)
3. Viewer memilih jenjang & kelas → melihat galeri foto & biodata (read-only)

## Non-Functional Requirements

### Performance
- **Load Time:** < 2.5 detik untuk halaman album (dengan lazy-load gambar)
- **Concurrent Users:** Menampung minimal 300 user bersamaan (skala satu sekolah)
- **Response Time:** < 500ms untuk operasi CRUD non-upload

### Security
- **Authentication:** Login berbasis akun (NISN/NIP + password) untuk admin & siswa; viewer bisa akses publik atau akun ringan
- **Authorization:** Role-based access control (Admin, Siswa scoped ke kelas sendiri, Viewer read-only)
- **Data Protection:** Validasi siswa hanya bisa modifikasi resource miliknya (ownership check di setiap request)

### Compatibility
- **Devices:** Mobile (utama, karena siswa dominan akses via HP) & Desktop
- **Browsers:** Chrome, Safari, Edge (2 versi terakhir)
- **Screen Sizes:** 360px (mobile kecil) sampai 1920px (desktop)

### Accessibility
- **Compliance Level:** WCAG 2.1 AA (target dasar)
- **Specific Requirements:** Kontras warna cukup (abu #9E9898 di atas putih diperkuat dengan teks gelap), alt text untuk semua foto, navigasi bisa pakai keyboard

## Technical Specifications

### Frontend
- **Technology Stack:** Next.js (App Router) + React
- **Design System:** Diselaraskan dengan identitas visual resmi sekolah (skyedigipreneur.sch.id), bukan gaya "buku tahunan vintage":
  - **Warna:** Abu muda #9E9898 & putih (sesuai permintaan) dipadukan dengan navy/gelap sebagai warna teks/aksen berat dan emas (gold) sebagai aksen utama — konsisten dengan branding "Gold Season/Silver Season" PPDB sekolah
  - **Tipografi:** Sans-serif tegas & modern (bukan serif italic lembut), selaras dengan kesan profesional/corporate "sekolah pengusaha muda"
  - **Layout:** Clean-corporate, garis tegas, card solid — tetap memakai layout album 2 kolom kiri-kanan sesuai permintaan, namun nuansa lebih tegas/berkelas daripada kesan kertas vintage
- **Responsive Design:** 2 kolom kiri-kanan di desktop, menyesuaikan (stack vertikal) di mobile

### Backend
- **Technology Stack:** Node.js (Next.js API Routes) — dikerjakan setelah frontend selesai
- **API Requirements:** RESTful (auth, classes, students, photos, archive)
- **Database:** Relasional (PostgreSQL disarankan) — tabel: schools, academic_years, classes, students, photos, roles

### Infrastructure
- **Hosting:** Vercel (cocok untuk Next.js) atau VPS sekolah
- **Scaling:** Cukup dengan hosting standar untuk skala 1 sekolah; foto disimpan di object storage (S3-compatible)
- **CI/CD:** Deploy otomatis dari branch main (Vercel/GitHub Actions)

## Analytics & Monitoring

- **Key Metrics:** Jumlah foto per kelas, jumlah siswa yang sudah isi biodata, kelas paling aktif
- **Events:** photo_uploaded, biodata_updated, class_archived, login_by_role
- **Dashboards:** Dashboard admin: ringkasan aktivitas per kelas & per tahun ajaran
- **Alerting:** Notifikasi ke admin bila ada upload foto pending moderasi

## Release Planning

### MVP (v1.0)
- **Features:** Landing/role select, struktur kelas SMP & SMK sesuai jurusan, galeri foto per kelas (mock/local dulu), edit biodata siswa, halaman arsip tahun ajaran, layout album 2 kolom responsif
- **Timeline:** Frontend (mock data) dulu → lanjut integrasi backend
- **Success Criteria:** Semua role bisa menjalankan flow utama masing-masing di atas UI yang sudah jadi

### Future Releases
- **v1.1:** Backend + database asli, upload foto ke storage sungguhan, moderasi foto oleh admin
- **v1.2:** Notifikasi, komentar/ucapan di album, fitur "buku kenangan" cetak PDF
- **v2.0:** Multi-sekolah (SaaS), custom tema album per sekolah

## Open Questions & Assumptions

- **Question 1:** Apakah siswa login pakai akun yang dibuatkan admin, atau daftar mandiri lalu diverifikasi?
- **Question 2:** Apakah ada batas jumlah/ukuran foto per siswa per tahun ajaran?
- **Assumption 1:** Satu siswa hanya terdaftar di satu kelas per tahun ajaran.
- **Assumption 2:** Tahun ajaran baru dibuat manual oleh admin (bukan otomatis by tanggal).

## Appendix

### Competitive Analysis
- **Buku tahunan cetak konvensional:** Kekuatan: nostalgia fisik. Kelemahan: mahal, sekali cetak, gampang hilang/rusak.
- **Platform yearbook generik luar negeri:** Kekuatan: fitur lengkap. Kelemahan: tidak disesuaikan struktur kelas SMP/SMK Indonesia (jurusan, jenjang).

### User Research Findings
- **Finding 1:** Siswa SMK ingin identitas jurusan (Retail/PPLG/Project Officer) terlihat jelas di album, bukan cuma nama kelas.
- **Finding 2:** Admin butuh cara mengarsip tanpa risiko kehilangan data tahun sebelumnya.

### AI Conversation Insights
- **Conversation 1:** 26 Agustus 2026, Claude — menyusun struktur role (Admin/Siswa/Viewer), struktur kelas SMP-SMK sesuai jurusan, dan alur arsip tahun ajaran tanpa penghapusan data.
- **AI-Generated Edge Cases:** Siswa mencoba akses/edit kelas lain; admin arsip tahun ajaran yang masih aktif diedit siswa; nama kelas duplikat; upload foto gagal format/ukuran.
- **AI-Suggested Improvements:** Tab galeri terpisah dari tab biodata per siswa; halaman arsip terpisah dari daftar kelas aktif agar tidak campur aduk.

### Glossary
- **Album Kelas:** Kumpulan foto & biodata siswa dalam satu kelas pada satu tahun ajaran.
- **Arsip:** Kumpulan kelas dari tahun ajaran yang sudah berakhir, tetap tersimpan dan bisa dilihat tapi tidak bisa diedit siswa lama.
- **PPLG:** Pengembangan Perangkat Lunak dan Gim Jurusan SMK.
