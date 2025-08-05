# 📦 React Query Hook Structure

Proyek ini menggunakan struktur modular untuk query dan mutation menggunakan `@tanstack/react-query`. Setiap entitas (seperti `users`, `customers`, dll) memiliki folder khusus di dalam direktori `hooks/`.

---

## 📁 Struktur Direktori

```
src/
├── hooks/
│   ├── users/
│   │   ├── useUsers.ts          # Fetch semua user (GET)
│   │   ├── useUser.ts           # Fetch satu user berdasarkan ID (GET)
│   │   ├── useCreateUser.ts     # Tambah user (POST)
│   │   ├── useUpdateUser.ts     # Update user (PUT/PATCH)
│   │   └── useDeleteUser.ts     # Hapus user (DELETE)
│   ├── customers/
│   │   └── .gitkeep             # Placeholder (kosong sementara)
├── lib/
│   └── axios.ts                 # Konfigurasi axios instance
```

---

## ✅ Penamaan Hook

Setiap hook dinamai dengan konvensi:

| Hook                | Deskripsi                     |
|---------------------|-------------------------------|
| `useUsers`          | Mengambil list user           |
| `useUser`           | Mengambil detail user         |
| `useCreateUser`     | Menambah user baru            |
| `useUpdateUser`     | Mengubah data user            |
| `useDeleteUser`     | Menghapus user                |

---

## ⚙️ Teknologi Digunakan

- **React Query** – untuk `query` dan `mutation` async
- **Zustand** – state management
- **Zod** – validasi schema
- **React Hook Form** – manajemen form
- **Axios** – HTTP client
- **TypeScript** – dukungan tipe statis

---

## 📄 Contoh Penggunaan

> Contoh implementasi disediakan di masing-masing file hook (lihat `src/hooks/users/`).

---

## 📌 Catatan

- File `.gitkeep` digunakan agar folder kosong tetap masuk ke Git.
- Penamaan dan struktur ini scalable untuk banyak entitas dan mudah digunakan dalam proyek tim besar.

---
