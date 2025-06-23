'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { logoutUser } from '@/utils/logout'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('') // alamat dari peta
  const [detailAddress, setDetailAddress] = useState('') // tambahan alamat manual
  const [location, setLocation] = useState(null)
  const [photo, setPhoto] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    const savedAddress = localStorage.getItem('user_address') || ''
    const savedDetail = localStorage.getItem('user_detail_address') || ''
    const savedName = localStorage.getItem('user_fullname') || ''
    const savedPhone = localStorage.getItem('user_phone') || ''
    const savedLocation = JSON.parse(localStorage.getItem('user_location')) || null
    const savedPhoto = localStorage.getItem('user_photo') || ''

    setAddress(savedAddress)
    setDetailAddress(savedDetail)
    setFullName(savedName)
    setPhone(savedPhone)
    setLocation(savedLocation)
    setPhoto(savedPhoto)
  }, [status])

  const handleSave = () => {
    localStorage.setItem('user_address', address)
    localStorage.setItem('user_detail_address', detailAddress)
    localStorage.setItem('user_fullname', fullName)
    localStorage.setItem('user_phone', phone)
    localStorage.setItem('user_location', JSON.stringify(location))
    localStorage.setItem('user_photo', photo)
    alert('Profil berhasil disimpan')
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result)
    reader.readAsDataURL(file)
  }

  // fungsi reverse geocoding ke alamat text
  const convertCoordsToAddress = async () => {
    if (!location) {
      alert('Lokasi belum dipilih di peta.')
      return
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`)
      const data = await response.json()
      if (data?.display_name) {
        setAddress(data.display_name)
      } else {
        alert('Alamat tidak ditemukan.')
      }
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil alamat dari koordinat.')
    }
  }

  if (status === 'loading') return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>


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

      <h2 className="text-2xl font-bold mb-4">Profil Saya</h2>
      <p className="mb-4">
        Email: <strong>{session?.user?.email}</strong>
      </p>

      <input
        className="w-full border p-2 rounded mb-2"
        type="text"
        placeholder="Nama Lengkap"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-2"
        type="text"
        placeholder="No. Telepon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="block font-semibold mb-1 mt-4">Alamat Otomatis (dari peta)</label>
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={2}
        placeholder="Alamat dari peta akan muncul di sini..."
        value={address}
        readOnly
      />

      <label className="block font-semibold mb-1">Detail Alamat (opsional)</label>
      <textarea
        className="w-full border p-2 rounded mb-4"
        rows={2}
        placeholder="Contoh: Blok A no.5, Lantai 2, dekat warung..."
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
      />

      <h3 className="text-lg font-semibold mt-4 mb-2">Pilih Lokasi di Peta</h3>
      <div className="h-64 w-full rounded shadow mb-2">
        <Map location={location} setLocation={setLocation} />
      </div>

      <button
        onClick={convertCoordsToAddress}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
      >
        Gunakan Lokasi Ini
      </button>

      <div className="flex gap-4">
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
