'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
export default function LacakPage() {
  const [trackingInfo, setTrackingInfo] = useState(null)
const router = useRouter() // ✅ inisialisasi router


  useEffect(() => {
    const dummy = {
      code: 'TRK123456789',
      status: 'Dalam pengiriman',
      lastUpdate: '2 jam yang lalu',
    }
    setTrackingInfo(dummy)
  }, [])

  return (
       
    <div className="p-6 max-w-xl mx-auto">
         <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">📦 Lacak Pengiriman</h2>
      {trackingInfo ? (
        <div className="bg-white p-4 rounded shadow space-y-2 border border-blue-300">
          <p><strong>Kode Resi:</strong> {trackingInfo.code}</p>
          <p><strong>Status:</strong> {trackingInfo.status}</p>
          <p><strong>Pembaruan Terakhir:</strong> {trackingInfo.lastUpdate}</p>
        </div>
      ) : (
        <p className="text-gray-500">Tidak ada data pengiriman.</p>
      )}
    </div>
  )
}