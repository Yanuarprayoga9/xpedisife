# React + Vite + Tailwind Starter

Starter kit untuk proyek React dengan Vite + TypeScript, didukung oleh ekosistem modern untuk pengembangan frontend yang efisien dan scalable.

---

## ✅ Teknologi yang Digunakan

| Library            | Fungsi                                   |
|--------------------|-------------------------------------------|
| React              | Library utama untuk UI                   |
| Vite               | Build tool cepat untuk pengembangan React |
| TypeScript         | Superset JavaScript dengan tipe statis   |
| Tailwind CSS       | Styling utility-first berbasis class     |
| Radix UI           | Komponen UI dasar (dialog, popover, dll) |
| Lucide React       | Ikon berbasis SVG                        |
| Zustand            | State management sederhana & scalable    |
| Zod                | Validasi schema dan data                 |
| React Hook Form    | Manajemen form yang ringan dan efisien   |
| React Query        | Query data async dan caching otomatis    |

---

## 🚀 Cara Menjalankan

```bash
# Clone proyek
git clone https://github.com/username/my-app.git
cd my-app

# Install dependensi
npm install

# Jalankan local dev server
npm run dev
```

---

## ⚙️ Konfigurasi Environment (.env)

Buat file `.env` di root proyek:

```env
VITE_BACKEND_URL=https://api.example.com
```

> **Catatan:** Gunakan prefix `VITE_` agar environment variable dapat diakses di browser.

---

## 📁 Struktur Direktori

```
src/
├── api/              # Semua fungsi fetching API
│   ├── user.ts       # Contoh API untuk user
│   └── order.ts      # Contoh API untuk order
├── types/            # TypeScript type & interface
│   ├── user.ts
│   └── order.ts
├── store/            # Zustand store
├── hooks/            # Custom hooks (termasuk React Query)
├── components/       # Komponen UI
├── pages/            # Halaman
├── lib/              # Helper umum
├── App.tsx
└── main.tsx

```

---

## 📄 Lisensi

MIT © 2025 – [Nama Anda]
