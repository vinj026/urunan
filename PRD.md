# PRD — SplitTagih

## 1. Overview

**SplitTagih** adalah web app sederhana untuk membagi tagihan dan menentukan siapa harus bayar siapa dalam suatu grup.

Fokus utama:
- Cepat digunakan
- Tidak perlu login
- Bisa langsung share hasil via link

---

## 2. Problem Statement

Saat makan atau aktivitas bareng:
- Satu orang biasanya bayar duluan
- Orang lain harus bayar balik
- Perhitungan sering ribet dan rawan salah

Solusi saat ini:
- Catatan manual
- Chat WhatsApp
- Aplikasi kompleks (overkill)

**Masalah utama:**
- Tidak jelas siapa harus bayar berapa
- Perhitungan manual tidak efisien

---

## 3. Goals

### Primary Goals
- User bisa membuat sesi split bill dalam < 1 menit
- User langsung tahu siapa bayar siapa
- Hasil bisa dibagikan via link

### Non-Goals
- Tidak ada sistem pembayaran
- Tidak ada tracking status pembayaran (di-implement sebagai fitur lokal v1.1)
- Tidak ada login / akun

---

## 4. Target User

- Mahasiswa
- Pekerja muda
- Grup kecil (2–10 orang)

Use case:
- Makan bareng
- Nongkrong
- Patungan

---

## 5. Core Features

### 5.1 Buat Sesi
User menginput:
- Nama acara
- Daftar peserta

Validasi:
- Minimal 2 peserta
- Nama tidak boleh kosong
- Tidak boleh duplikat

---

### 5.2 Input Item
User menambahkan:
- Nama item
- Harga
- Siapa saja yang ikut

Behavior:
- Harga dibagi rata ke peserta item
- Satu item bisa dipilih oleh sebagian peserta saja

---

### 5.3 Hitung Tagihan
System:
- Menghitung total per orang
- Menentukan siapa harus bayar ke siapa

Output:
- List transaksi minimal (optimized)

---

### 5.4 Ringkasan & Share
User bisa:
- Melihat hasil
- Copy link
- Share link
- Copy teks ringkasan

---

## 6. User Flow

### Flow Utama

1. Screen 1 — Buat Sesi
   - Input nama acara
   - Tambah peserta
   - Klik "Lanjut"

2. Screen 2 — Input Tagihan
   - Tambah item
   - Pilih peserta tiap item
   - Klik "Hitung"

3. Screen 3 — Ringkasan
   - Lihat siapa bayar siapa
   - Share link

---

## 7. UX Writing (Final Copy)

### Screen 1
- Title: **Buat Tagihan**
- Input: "Nama acara"
- Input: "Tambah peserta"
- Button: **Lanjut**

---

### Screen 2
- Title: **Detail Tagihan**
- Section: **Daftar item**
- Button: **Tambah item**
- Button: **Hitung**

---

### Screen 3

#### Section 1
**Transfer yang perlu dilakukan**

---

#### Section 2
**Yang sudah bayar duluan**

---

## 8. Data Model

```js
const sesi = {
  nama: string,
  peserta: string[],
  items: [
    {
      id: string,
      nama: string,
      harga: number,
      dinikmatiOleh: string[],
      dibayarOleh: string
    }
  ],
  createdAt: string
}
```

---

## 9. Calculation Logic

### 9.1 Tagihan Per Orang

* Harga item dibagi rata ke peserta item
* Semua item dijumlahkan per orang

---

### 9.2 Settlement (Siapa bayar siapa)

* Tentukan pembayar utama
* Hitung balance tiap orang
* Gunakan greedy algorithm untuk minimal transaksi

---

## 10. Technical Constraints

* No backend
* Data disimpan di:

  * localStorage
  * URL (encoded)

---

## 11. Edge Cases

1. Peserta duplikat → ditolak
2. Item tanpa peserta → tidak valid
3. Harga <= 0 → tidak valid
4. Hapus peserta → otomatis update item
5. Decode URL gagal → tampilkan error
6. Semua balance = 0 → tidak ada transaksi

---

## 12. Success Metrics

* User bisa selesai flow tanpa error
* Waktu input < 60 detik
* Link share bisa dibuka tanpa issue

---

## 13. Future Improvements (Out of Scope)

* Split tidak rata (custom share)
* Status pembayaran (paid/unpaid)
* Integrasi pembayaran (QRIS, dll)

---

## 14. Design Principles

* Minimal friction
* No jargon
* Fokus ke aksi, bukan sistem
* Harus bisa dipakai tanpa penjelasan
