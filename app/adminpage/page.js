// ✅ AdminPage.js - Daftar Admin

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [admins, setAdmins] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Ambil data admin dari localStorage atau default
    const data = JSON.parse(localStorage.getItem('admin_list')) || [
      { id: 1, name: 'Super Admin', email: 'admin@gmail.com' }
    ]
    setAdmins(data)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-6">
      <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">👑 Daftar Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="border-l-4 border-blue-500 bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{admin.name}</h2>
            <p className="text-sm text-gray-600">📧 {admin.email}</p>
          </div>
        ))}
      </div>

      {admins.length === 0 && (
        <p className="text-gray-500 text-center mt-10">Tidak ada admin terdaftar.</p>
      )}
    </div>
  )
}
