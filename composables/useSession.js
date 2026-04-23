export function useSession() {
    const defaultSesi = {
        nama: "",
        peserta: [],
        items: [],
        pembayar: "", // Main Payer
        createdAt: new Date().toISOString().split('T')[0]
    }

    const sesi = useState('sesi', () => ({ ...defaultSesi }))

    const setSesi = (newSesi) => {
        sesi.value = { ...newSesi }
    }

    const setNama = (nama) => {
        sesi.value.nama = nama
    }

    const tambahPeserta = (nama) => {
        const trimmed = nama.trim()
        if (!trimmed) return
        const exists = sesi.value.peserta.some(p => p.toLowerCase() === trimmed.toLowerCase())
        if (!exists) {
            sesi.value.peserta.push(trimmed)
            // Default pembayar to the first person added
            if (!sesi.value.pembayar) sesi.value.pembayar = trimmed
        }
    }

    const hapusPeserta = (nama) => {
        sesi.value.peserta = sesi.value.peserta.filter(p => p !== nama)
        // Cleanup items
        sesi.value.items = sesi.value.items.map(item => ({
            ...item,
            peserta: item.peserta.filter(p => p !== nama)
        })).filter(item => item.peserta.length > 0)

        // Handle pembayar cleanup
        if (sesi.value.pembayar === nama) {
            sesi.value.pembayar = sesi.value.peserta[0] || ""
        }
    }

    const setPembayar = (nama) => {
        sesi.value.pembayar = nama
    }

    const tambahItem = (itemData) => {
        const item = {
            id: generateItemId(),
            nama: itemData.nama || "",
            harga: Number(itemData.harga) || 0,
            peserta: itemData.peserta || [...sesi.value.peserta]
        }
        sesi.value.items.push(item)
    }

    const hapusItem = (id) => {
        sesi.value.items = sesi.value.items.filter(item => item.id !== id)
    }

    const togglePesertaItem = (itemId, nama) => {
        const item = sesi.value.items.find(i => i.id === itemId)
        if (!item) return
        const idx = item.peserta.indexOf(nama)
        if (idx === -1) {
            item.peserta.push(nama)
        } else {
            if (item.peserta.length > 1) {
                item.peserta.splice(idx, 1)
            }
        }
    }

    const totalTagihan = computed(() => {
        return sesi.value.items.reduce((acc, item) => acc + (Number(item.harga) || 0), 0)
    })

    const encodeToURL = () => {
        try {
            const json = JSON.stringify(sesi.value)
            return btoa(unescape(encodeURIComponent(json)))
        } catch (e) {
            console.error('Encoding failed', e)
            return ''
        }
    }

    const decodeFromURL = (encoded) => {
        try {
            const json = decodeURIComponent(escape(atob(encoded)))
            return JSON.parse(json)
        } catch (e) {
            console.error('Decoding failed', e)
            throw e
        }
    }

    const saveToLocal = () => {
        if (process.client) {
            localStorage.setItem('splitttagih_sesi', JSON.stringify(sesi.value))
        }
    }

    const loadFromLocal = () => {
        if (process.client) {
            const stored = localStorage.getItem('splitttagih_sesi')
            if (stored) {
                try {
                    const parsed = JSON.parse(stored)
                    // Normalizing for older versions if necessary
                    if (parsed.items) {
                        parsed.items = parsed.items.map(i => ({
                            ...i,
                            peserta: i.peserta || i.dinikmatiOleh || []
                        }))
                    }
                    sesi.value = { ...defaultSesi, ...parsed }
                } catch (e) {
                    console.error('Failed to load locale', e)
                }
            }
        }
    }

    const clearLocal = () => {
        if (process.client) {
            localStorage.removeItem('splitttagih_sesi')
            sesi.value = { ...defaultSesi }
        }
    }

    const generateItemId = () => {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
    }

    return {
        sesi,
        setSesi,
        setNama,
        tambahPeserta,
        hapusPeserta,
        setPembayar,
        tambahItem,
        hapusItem,
        togglePesertaItem,
        totalTagihan,
        encodeToURL,
        decodeFromURL,
        saveToLocal,
        loadFromLocal,
        clearLocal,
        generateItemId,
    }
}
