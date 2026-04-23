import { describe, it, expect } from 'vitest'
import {
    hitungTagihanPerOrang,
    hitungTransaksi,
    formatRupiah,
    getInisial
} from '../utils/calculate'

// ============================================================
// formatRupiah
// ============================================================
describe('formatRupiah', () => {
    it('memformat angka ribuan dengan titik', () => {
        expect(formatRupiah(1000)).toBe('Rp 1.000')
    })

    it('memformat angka puluhan ribu', () => {
        expect(formatRupiah(22500)).toBe('Rp 22.500')
    })

    it('memformat angka ratusan ribu', () => {
        expect(formatRupiah(100000)).toBe('Rp 100.000')
    })

    it('memformat angka jutaan', () => {
        expect(formatRupiah(1500000)).toBe('Rp 1.500.000')
    })

    it('memformat angka nol', () => {
        expect(formatRupiah(0)).toBe('Rp 0')
    })

    it('memformat angka di bawah 1000', () => {
        expect(formatRupiah(500)).toBe('Rp 500')
    })
})

// ============================================================
// getInisial
// ============================================================
describe('getInisial', () => {
    it('nama 1 kata → 2 huruf pertama uppercase', () => {
        expect(getInisial('Kejo', ['Kejo'])).toBe('KJ')
        expect(getInisial('Renz', ['Renz'])).toBe('RE')
        expect(getInisial('Aldi', ['Aldi'])).toBe('AL')
    })

    it('nama 2 kata → huruf pertama tiap kata', () => {
        expect(getInisial('John Doe', ['John Doe'])).toBe('JD')
        expect(getInisial('Budi Kusuma', ['Budi Kusuma'])).toBe('BK')
    })

    it('nama pendek 1 huruf → tidak crash', () => {
        const result = getInisial('A', ['A'])
        expect(result).toBeTruthy()
        expect(result.length).toBeGreaterThan(0)
    })

    it('nama bentrok → inisial unik', () => {
        const peserta = ['Kejo', 'Kendo', 'Renz', 'Aldi']
        const inisialKejo = getInisial('Kejo', peserta)
        const inisialKendo = getInisial('Kendo', peserta)
        expect(inisialKejo).not.toBe(inisialKendo)
    })

    it('tidak bentrok → tidak diubah', () => {
        const peserta = ['Kejo', 'Renz', 'Aldi']
        expect(getInisial('Kejo', peserta)).toBe('KJ')
        expect(getInisial('Renz', peserta)).toBe('RE')
        expect(getInisial('Aldi', peserta)).toBe('AL')
    })
})

// ============================================================
// hitungTagihanPerOrang
// ============================================================
describe('hitungTagihanPerOrang', () => {
    it('split rata semua orang', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz', 'Aldi'],
            items: [
                { id: '1', nama: 'Bakso', harga: 60000, peserta: ['Kejo', 'Renz', 'Aldi'] }
            ]
        }
        const result = hitungTagihanPerOrang(sesi)
        expect(result['Kejo']).toBe(20000)
        expect(result['Renz']).toBe(20000)
        expect(result['Aldi']).toBe(20000)
    })

    it('item assign ke sebagian orang', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz', 'Aldi'],
            items: [
                { id: '1', nama: 'Bakso', harga: 60000, peserta: ['Kejo', 'Renz', 'Aldi'] },
                { id: '2', nama: 'Es Teh', harga: 30000, peserta: ['Renz', 'Aldi'] }
            ]
        }
        const result = hitungTagihanPerOrang(sesi)
        expect(result['Kejo']).toBe(20000)
        expect(result['Renz']).toBe(35000)
        expect(result['Aldi']).toBe(35000)
    })

    it('item hanya untuk 1 orang', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz'],
            items: [
                { id: '1', nama: 'Pizza', harga: 100000, peserta: ['Kejo'] }
            ]
        }
        const result = hitungTagihanPerOrang(sesi)
        expect(result['Kejo']).toBe(100000)
        expect(result['Renz']).toBe(0)
    })

    it('tidak ada item → semua nol', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz'],
            items: []
        }
        const result = hitungTagihanPerOrang(sesi)
        expect(result['Kejo']).toBe(0)
        expect(result['Renz']).toBe(0)
    })

    it('multiple items per orang dijumlahkan', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz'],
            items: [
                { id: '1', nama: 'Bakso', harga: 40000, peserta: ['Kejo', 'Renz'] },
                { id: '2', nama: 'Jus', harga: 20000, peserta: ['Kejo', 'Renz'] }
            ]
        }
        const result = hitungTagihanPerOrang(sesi)
        expect(result['Kejo']).toBe(30000)
        expect(result['Renz']).toBe(30000)
    })
})

// ============================================================
// hitungTransaksi
// ============================================================
describe('hitungTransaksi', () => {
    it('kasus dasar: 1 orang nalangin, sisanya hutang', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz', 'Aldi'],
            nalangin: 'Kejo',
            items: [
                { id: '1', nama: 'Bakso', harga: 60000, peserta: ['Kejo', 'Renz', 'Aldi'] },
                { id: '2', nama: 'Es Teh', harga: 30000, peserta: ['Renz', 'Aldi'] }
            ]
        }
        // Kejo: 20.000 tagihan
        // Renz: 35.000 tagihan
        // Aldi: 35.000 tagihan
        // Kejo nalangin 90.000, porsinya 20.000 → menerima 70.000
        const result = hitungTransaksi(sesi)

        expect(result).toHaveLength(2)

        const renzTxn = result.find(t => t.dari === 'Renz')
        expect(renzTxn).toBeDefined()
        expect(renzTxn.ke).toBe('Kejo')
        expect(renzTxn.jumlah).toBe(35000)

        const aldiTxn = result.find(t => t.dari === 'Aldi')
        expect(aldiTxn).toBeDefined()
        expect(aldiTxn.ke).toBe('Kejo')
        expect(aldiTxn.jumlah).toBe(35000)
    })

    it('semua bayar sama rata → tidak ada transaksi', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz'],
            nalangin: 'Kejo',
            items: [
                { id: '1', nama: 'Makan', harga: 100000, peserta: ['Kejo', 'Renz'] }
            ]
        }
        // Kejo nalangin 100.000, porsinya 50.000 → menerima 50.000
        // Renz hutang 50.000 ke Kejo
        const result = hitungTransaksi(sesi)
        expect(result).toHaveLength(1)
        expect(result[0].dari).toBe('Renz')
        expect(result[0].ke).toBe('Kejo')
        expect(result[0].jumlah).toBe(50000)
    })

    it('1 orang menanggung item sendiri → orang lain tidak hutang', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz'],
            nalangin: 'Kejo',
            items: [
                { id: '1', nama: 'Pizza', harga: 100000, peserta: ['Kejo'] }
            ]
        }
        // Hanya Kejo yang makan, Kejo juga yang nalangin
        // Renz tidak makan apapun → tidak hutang
        const result = hitungTransaksi(sesi)
        expect(result).toHaveLength(0)
    })

    it('jumlah transaksi minimum (greedy)', () => {
        const sesi = {
            peserta: ['A', 'B', 'C', 'D'],
            nalangin: 'A',
            items: [
                { id: '1', nama: 'Test', harga: 120000, peserta: ['A', 'B', 'C', 'D'] }
            ]
        }
        // Semua tagihan sama: 30.000
        // A nalangin 120.000, porsi 30.000 → menerima 90.000
        // B, C, D masing-masing hutang 30.000 ke A
        const result = hitungTransaksi(sesi)
        expect(result).toHaveLength(3)
        result.forEach(t => {
            expect(t.ke).toBe('A')
            expect(t.jumlah).toBe(30000)
        })
    })

    it('tidak ada item → tidak ada transaksi', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz'],
            nalangin: 'Kejo',
            items: []
        }
        const result = hitungTransaksi(sesi)
        expect(result).toHaveLength(0)
    })

    it('hasil transaksi selalu positif', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz', 'Aldi'],
            nalangin: 'Kejo',
            items: [
                { id: '1', nama: 'Makan', harga: 90000, peserta: ['Kejo', 'Renz', 'Aldi'] }
            ]
        }
        const result = hitungTransaksi(sesi)
        result.forEach(t => {
            expect(t.jumlah).toBeGreaterThan(0)
        })
    })

    it('nalangin tidak ada di peserta → tidak crash', () => {
        const sesi = {
            peserta: ['Kejo', 'Renz'],
            nalangin: 'ORANG_TIDAK_ADA',
            items: [
                { id: '1', nama: 'Test', harga: 50000, peserta: ['Kejo', 'Renz'] }
            ]
        }
        // Harus tidak crash, boleh return [] atau handle gracefully
        expect(() => hitungTransaksi(sesi)).not.toThrow()
    })
})
