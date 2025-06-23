'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import InnerImageZoom from 'react-inner-image-zoom'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'

const defaultProducts = [
  { id: 1, name: 'Kaos Eksklusif Talent 1', price: 150000, image: '/kaos1.jpeg', stock: 10 },
  { id: 2, name: 'Acrylic Stand Talent 1', price: 95000, image: '/stand1.jfif', stock: 0 },
  { id: 3, name: 'Tas Phoebe Theme 1', price: 350000, image: '/Tas.jpg', stock: 10 }
]

export default function Talent1Page() {
  const [products, setProducts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_data'))
    setIsAdmin(user?.email === 'admin@gmail.com')

    const saved = JSON.parse(localStorage.getItem('talent1_products'))
    setProducts(saved || defaultProducts)
  }, [])

  const saveToStorage = (data) => {
    localStorage.setItem('talent1_products', JSON.stringify(data))
  }

  const handleAdminChange = (index, field, value) => {
    const updated = [...products]
    updated[index][field] = parseInt(value)
    setProducts(updated)
    saveToStorage(updated)
  }

  const addToCart = (item) => {
    if (item.stock <= 0) return alert('Stok produk ini habis.')

    const cart = JSON.parse(localStorage.getItem('cart')) || []
    cart.push(item)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Produk ditambahkan ke keranjang!')
  }

  const handleReset = () => {
    localStorage.removeItem('talent1_products')
    setProducts(defaultProducts)
    saveToStorage(defaultProducts)
    alert('Data produk Talent 1 telah direset.')
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom, #3b82f6, white)' }}>
      <button
        onClick={() => router.push('/Dashboard')}
        className="mb-4 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      {/* Banner */}
      <div
        className="relative w-full h-40 rounded-xl overflow-hidden flex items-center justify-center shadow-lg mb-8"
        style={{
          backgroundImage: 'url(/banners/banner1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <h1 className="text-white text-4xl font-extrabold drop-shadow-lg bg-black/50 px-6 py-3 rounded-xl">
          💙 Phoebe Merchandise
        </h1>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {products.map((item, i) => (
          <div key={item.id} className="bg-white shadow-md rounded-2xl p-5 flex flex-col">
            <div className="rounded-xl overflow-hidden mb-4">
              <InnerImageZoom
                src={item.image}
                zoomSrc={item.image}
                zoomType="hover"
                zoomScale={1.2}
                className="w-full"
              />
            </div>

            <h3 className="bg-blue-600 text-white text-lg font-bold text-center px-3 py-2 rounded mb-2 drop-shadow">
              {item.name}
            </h3>
            <p className="text-red-600 font-bold mb-1">Rp {item.price.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-3">
              Stok: {item.stock > 0 ? item.stock : <span className="text-red-500">Habis</span>}
            </p>

            {/* Admin Control */}
            {isAdmin && (
              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <label className="w-16">Harga:</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleAdminChange(i, 'price', e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-16">Stok:</label>
                  <input
                    type="number"
                    value={item.stock}
                    onChange={(e) => handleAdminChange(i, 'stock', e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => addToCart(item)}
              disabled={item.stock <= 0}
              className={`mt-auto px-4 py-2 rounded-xl text-white transition ${
                item.stock > 0
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              🛒 Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>

      {/* Tombol Reset */}
      {isAdmin && (
        <div className="mt-10 text-center">
          <button
            onClick={handleReset}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg shadow transition"
          >
            🔄 Reset Produk Talent 1
          </button>
        </div>
      )}
    </div>
  )
}
