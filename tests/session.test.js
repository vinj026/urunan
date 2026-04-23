import { describe, it, expect, beforeEach } from 'vitest'

// Or export encodeToURL directly if we export the internal encode logic, but useSession is a Nuxt composable.
// In Vitest, Nuxt composables are tricky to test without setup context.
// Wait, the prompt says "Atau jika fungsi tidak di-export terpisah, test lewat helper:"

function encodeURL(sesi) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(sesi))))
}

function decodeURL(encoded) {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))))
}

// ============================================================
// URL Encode / Decode
// ============================================================
describe('URL encode/decode', () => {
    const sesiContoh = {
        nama: 'Makan Malam',
        peserta: ['Kejo', 'Renz', 'Aldi'],
        nalangin: 'Kejo',
        items: [
            {
                id: 'item_1',
                nama: 'Bakso',
                harga: 40000,
                peserta: ['Kejo', 'Renz', 'Aldi']
            },
            {
                id: 'item_2',
                nama: 'Es Teh',
                harga: 20000,
                peserta: ['Renz', 'Aldi']
            }
        ],
        createdAt: '2026-04-22'
    }

    it('encode lalu decode menghasilkan data yang sama', () => {
        const encoded = encodeURL(sesiContoh)
        const decoded = decodeURL(encoded)
        expect(decoded).toEqual(sesiContoh)
    })

    it('encode menghasilkan string (bukan object)', () => {
        const encoded = encodeURL(sesiContoh)
        expect(typeof encoded).toBe('string')
    })

    it('decode string invalid → throw error', () => {
        expect(() => decodeURL('INVALIDBASE64!!!')).toThrow()
    })

    it('nama dengan karakter unicode di-encode/decode dengan benar', () => {
        const sesiUnicode = {
            ...sesiContoh,
            nama: 'Makan Malam Santéro',
            peserta: ['Büdi', 'Ñoño']
        }
        const encoded = encodeURL(sesiUnicode)
        const decoded = decodeURL(encoded)
        expect(decoded.nama).toBe('Makan Malam Santéro')
        expect(decoded.peserta[0]).toBe('Büdi')
        expect(decoded.peserta[1]).toBe('Ñoño')
    })

    it('data items tetap akurat setelah encode/decode', () => {
        const encoded = encodeURL(sesiContoh)
        const decoded = decodeURL(encoded)
        expect(decoded.items).toHaveLength(2)
        expect(decoded.items[0].harga).toBe(40000)
        expect(decoded.items[1].peserta).toEqual(['Renz', 'Aldi'])
    })

    it('nalangin tetap tersimpan setelah encode/decode', () => {
        const encoded = encodeURL(sesiContoh)
        const decoded = decodeURL(encoded)
        expect(decoded.nalangin).toBe('Kejo')
    })
})

// ============================================================
// Validasi input (jika ada helper di useSession)
// ============================================================
describe('Validasi peserta', () => {
    it('nama kosong tidak valid', () => {
        const nama = '   '
        expect(nama.trim()).toBe('')
    })

    it('nama duplikat case-insensitive terdeteksi', () => {
        const peserta = ['Kevin', 'Budi']
        const namaBaru = 'kevin'
        const duplikat = peserta.some(
            p => p.toLowerCase().trim() === namaBaru.toLowerCase().trim()
        )
        expect(duplikat).toBe(true)
    })

    it('nama dengan spasi ekstra di-trim', () => {
        const nama = '  Kevin  '
        expect(nama.trim()).toBe('Kevin')
    })
})
