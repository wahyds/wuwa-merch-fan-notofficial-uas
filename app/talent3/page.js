'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'
import InnerImageZoom from 'react-inner-image-zoom'

// Komponen pembungkus aman untuk InnerImageZoom
function ZoomImageSafe({ src, alt = 'Product' }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full rounded hidden"
        onLoad={() => setLoaded(true)}
      />
      {loaded && (
        <InnerImageZoom
          src={src}
          zoomSrc={src}
          zoomType="hover"
          zoomScale={1.2}
          className="w-full"
        />
      )}
    </>
  )
}

const defaultProducts = [
  { id: 1, name: 'Kaos Eksklusif Carthethyia', price: 150000, image: '/kaos3.jpeg', stock: 10 },
  { id: 2, name: 'Acrylic Stand Carthethyia', price: 95000, image: '/stand3.jpg', stock: 5 },
  { id: 3, name: 'Carthethyia Figure Eksklusif', price: 250000, image: '/figure.jpg', stock: 10 }
]

export default function Talent3Page() {
  const [products, setProducts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user_data'))
    setIsAdmin(userData?.email === 'admin@gmail.com')

    const saved = JSON.parse(localStorage.getItem('talent3_products'))
    setProducts(saved || defaultProducts)
  }, [])

  const saveToStorage = (data) => {
    localStorage.setItem('talent3_products', JSON.stringify(data))
  }

  const handleAdminChange = (index, key, value) => {
    const updated = [...products]
    updated[index][key] = parseInt(value)
    setProducts(updated)
    saveToStorage(updated)
  }

  const addToCart = (item) => {
    if (item.stock <= 0) return alert('Stok habis!')
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    cart.push(item)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Ditambahkan ke keranjang!')
  }

  const handleReset = () => {
    localStorage.removeItem('talent3_products')
    setProducts(defaultProducts)
    saveToStorage(defaultProducts)
    alert('Produk Talent 3 direset!')
    window.location.reload()
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom, #f9e79f, white)' }}>
      <button
        onClick={() => router.push('/Dashboard')}
        className="mb-4 inline-flex items-center gap-2 text-white bg-yellow-700 hover:bg-yellow-800 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      {/* Banner */}
      <div
        className="relative w-full h-40 rounded-xl overflow-hidden flex items-center justify-center shadow-lg mb-8"
        style={{ backgroundImage: 'url(/banners/banner3.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <h1 className="text-white text-4xl font-extrabold drop-shadow-lg bg-black/50 px-6 py-3 rounded-xl">
          💅 Carthethyia Merchandise
        </h1>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {products.map((p, i) => (
          <div key={p.id} className="bg-white shadow rounded-2xl p-5 flex flex-col">
            <div className="rounded-xl overflow-hidden mb-4">
              <ZoomImageSafe src={p.image} alt={p.name} />
            </div>

            <div className="bg-yellow-700 text-white text-lg font-bold text-center px-2 py-2 rounded mb-2 drop-shadow">
              {p.name}
            </div>

            <p className="text-red-600 font-bold">Rp {p.price.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mb-2">
              Stok: {p.stock > 0 ? p.stock : <span className="text-red-500">Habis</span>}
            </p>

            {/* Admin Control */}
            {isAdmin && (
              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <label>Harga:</label>
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => handleAdminChange(i, 'price', e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label>Stok:</label>
                  <input
                    type="number"
                    value={p.stock}
                    onChange={(e) => handleAdminChange(i, 'stock', e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => addToCart(p)}
              disabled={p.stock <= 0}
              className={`mt-auto px-4 py-2 rounded-xl text-white transition ${
                p.stock > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              🛒 Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>

      {/* Tombol Reset Admin */}
      {isAdmin && (
        <div className="mt-10 text-center">
          <button
            onClick={handleReset}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg shadow transition"
          >
            🔄 Reset Produk Talent 3
          </button>
        </div>
      )}
    </div>
  )
}
