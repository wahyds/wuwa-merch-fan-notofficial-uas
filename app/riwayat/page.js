// 🧾 OrderHistoryPage.js - Stylish Order History UI

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const router = useRouter()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('order_history')) || []
    setOrders(data.reverse())
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-100 to-white">
      <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      <h2 className="text-3xl font-bold text-center mb-8 text-blue-800 drop-shadow">Riwayat Pesanan</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <div key={i} className="bg-white border-l-4 border-blue-500 p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500 mb-2">🕒 Tanggal: {new Date(order.date).toLocaleString()}</p>
              <p className="font-semibold text-lg text-blue-700">👤 Penerima: {order.recipient}</p>
              <p className="text-gray-600 mb-2">🏠 Alamat: {order.address}</p>

              <ul className="list-disc list-inside text-gray-700 mb-2">
                {order.items.map((item, j) => (
                  <li key={j}>🛍️ {item.name} - Rp {item.price.toLocaleString()}</li>
                ))}
              </ul>

              <p className="text-gray-700">🚚 Kurir: {order.courier}</p>
              <p className="text-gray-700">📦 Ongkir: Rp {order.shippingCost.toLocaleString()}</p>
              <p className="text-gray-700">🎁 Diskon: -Rp {order.discount.toLocaleString()}</p>
              <p className="font-bold text-xl text-red-600 mt-2">💰 Total: Rp {order.total.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
