'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { logoutUser } from '@/utils/logout'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [detailAddress, setDetailAddress] = useState('')
  const [location, setLocation] = useState(null)
  const [photo, setPhoto] = useState('')

  // Load data dari localStorage saat pertama kali
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    setFullName(localStorage.getItem('user_fullname') || '')
    setPhone(localStorage.getItem('user_phone') || '')
    setAddress(localStorage.getItem('user_address') || '')
    setDetailAddress(localStorage.getItem('user_detail_address') || '')
    setLocation(JSON.parse(localStorage.getItem('user_location')) || null)
    setPhoto(localStorage.getItem('user_photo') || '')
  }, [status])

  const handleSave = () => {
    localStorage.setItem('user_fullname', fullName)
    localStorage.setItem('user_phone', phone)
    localStorage.setItem('user_address', address)
    localStorage.setItem('user_detail_address', detailAddress)
    localStorage.setItem('user_location', JSON.stringify(location))
    localStorage.setItem('user_photo', photo)
    alert('Profil berhasil disimpan.')
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  const convertCoordsToAddress = async () => {
    if (!location) {
      alert('Silakan pilih lokasi di peta terlebih dahulu.')
      return
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
      )
      const data = await res.json()
      if (data?.display_name) {
        setAddress(data.display_name)
      } else {
        alert('Alamat tidak ditemukan dari koordinat.')
      }
    } catch (error) {
      console.error(error)
      alert('Gagal mengambil alamat dari koordinat.')
    }
  }

  if (status === 'loading') {
    return <p className="text-center mt-10">Memuat data profil...</p>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      {/* Foto Profil */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={photo || '/default-avatar.png'}
          alt="Foto Profil"
          className="w-24 h-24 rounded-full border object-cover"
        />
        <label className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded shadow text-sm cursor-pointer">
          Ganti Foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </label>
      </div>

      {/* Info Akun */}
      <h2 className="text-2xl font-bold mb-4">Profil Saya</h2>
      <p className="mb-4 text-sm text-gray-600">
        Email: <strong>{session?.user?.email}</strong>
      </p>

      {/* Form Profil */}
      <input
        type="text"
        placeholder="Nama Lengkap"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="text"
        placeholder="Nomor Telepon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />

      <label className="block font-semibold mb-1 mt-4">Alamat dari Peta</label>
      <textarea
        className="w-full border p-2 rounded mb-3"
        rows={2}
        value={address}
        placeholder="Klik 'Gunakan Lokasi Ini' setelah pilih lokasi di peta"
        readOnly
      />

      <label className="block font-semibold mb-1">Detail Alamat (Opsional)</label>
      <textarea
        className="w-full border p-2 rounded mb-4"
        rows={2}
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
        placeholder="Contoh: Blok C no.12, dekat masjid, lantai 2"
      />

      {/* Peta */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Pilih Lokasi di Peta</h3>
      <div className="h-64 w-full rounded shadow mb-3">
        <Map location={location} setLocation={setLocation} />
      </div>

      <button
        onClick={convertCoordsToAddress}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        Gunakan Lokasi Ini
      </button>

      {/* Tombol Aksi */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Simpan Profil
        </button>
        <button
          onClick={logoutUser}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
