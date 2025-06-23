'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // ✅ tambahkan ini

export default function NotifikasiPage() {
  const [notifList, setNotifList] = useState([])
  const router = useRouter() // ✅ inisialisasi router

  useEffect(() => {
    const dummy = [
      { id: 1, title: 'Pesanan kamu sedang diproses', time: '10 menit yang lalu' },
      { id: 2, title: 'Selamat! Dapat diskon 20%', time: '1 jam yang lalu' },
    ]
    setNotifList(dummy)
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto">
     <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">🔔 Notifikasi</h2>
      {notifList.length === 0 ? (
        <p className="text-gray-500">Tidak ada notifikasi.</p>
      ) : (
        <ul className="space-y-4">
          {notifList.map((notif) => (
            <li key={notif.id} className="p-4 bg-white rounded shadow border border-yellow-300">
              <p className="font-medium">{notif.title}</p>
              <p className="text-sm text-gray-500">{notif.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
