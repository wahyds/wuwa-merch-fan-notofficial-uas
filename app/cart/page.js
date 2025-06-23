'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CartPage() {
  const [items, setItems] = useState([])
  const [recipient, setRecipient] = useState('')
  const [address, setAddress] = useState('')
  const [courier, setCourier] = useState('JNE')
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  const [useVoucher, setUseVoucher] = useState(false)
  const [voucherCode, setVoucherCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [shippingCost, setShippingCost] = useState(20000)

  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const withQty = cart.map(item => ({ ...item, qty: item.qty ?? 1 }))
    setItems(withQty)

    setRecipient(localStorage.getItem('user_fullname') || '')
    setAddress(localStorage.getItem('user_address') || '')

    if (!session) router.push('/login')
  }, [session])

  const updateCart = (newCart) => {
    setItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const handleQtyChange = (index, value) => {
    const qty = Math.max(1, parseInt(value) || 1)
    const newCart = [...items]
    newCart[index].qty = qty
    updateCart(newCart)
  }

  const removeItem = (index) => {
    const newCart = [...items]
    newCart.splice(index, 1)
    updateCart(newCart)
  }

  const subtotal = items.reduce((acc, item) => acc + (item.stock === 0 ? 0 : item.price * item.qty), 0)
  const total = subtotal + shippingCost - (useVoucher ? discount : 0)

  const handleCheckout = () => {
    if (!recipient || !address) {
      alert('Nama penerima dan alamat wajib diisi.')
      return
    }

    const newOrder = {
      items,
      recipient,
      address,
      courier,
      shippingCost,
      discount: useVoucher ? discount : 0,
      total,
      paymentMethod,
      date: new Date().toISOString(),
    }

    const history = JSON.parse(localStorage.getItem('order_history')) || []
    history.push(newOrder)
    localStorage.setItem('order_history', JSON.stringify(history))
    localStorage.removeItem('cart')

    setItems([])
    alert('Checkout berhasil!')
    router.push('/riwayat')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white p-6">
      <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">🛒 Keranjang Belanja</h2>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center">Keranjang kosong</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className={`border p-3 rounded-lg flex justify-between items-center ${
                  item.stock === 0 ? 'bg-gray-100 opacity-60' : 'bg-slate-50'
                }`}
              >
                <div className="w-2/3">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-600">Stok: {item.stock ?? 'N/A'}</p>
                  {item.stock === 0 ? (
                    <p className="text-sm text-red-500 mt-1">Produk ini habis.</p>
                  ) : (
                    <div className="flex items-center mt-2 gap-2">
                      <label htmlFor={`qty-${i}`} className="text-sm">Qty:</label>
                      <input
                        id={`qty-${i}`}
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.qty}
                        onChange={(e) => handleQtyChange(i, e.target.value)}
                        className="w-16 border rounded p-1 text-center"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-red-500 font-semibold">
                    Rp {(item.price * item.qty).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(i)}
                    className="text-xs text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            {/* Checkout Form */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
              <textarea
                className="w-full border rounded p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tentukan lokasi kamu"
              />
              <input
                className="w-full mt-2 border rounded p-2"
                type="text"
                placeholder="Nama Penerima"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />

              <div className="mt-4">
                <label className="block mb-1">Kurir Pengiriman</label>
                <select
                  className="w-full border p-2 rounded"
                  value={courier}
                  onChange={(e) => {
                    const selected = e.target.value
                    setCourier(selected)
                    if (selected === 'JNE') setShippingCost(20000)
                    else if (selected === 'J&T') setShippingCost(18000)
                    else if (selected === 'SiCepat') setShippingCost(22000)
                  }}
                >
                  <option value="JNE">JNE - Rp20.000</option>
                  <option value="J&T">J&T - Rp18.000</option>
                  <option value="SiCepat">SiCepat - Rp22.000</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block mb-1">Metode Pembayaran</label>
                <select
                  className="w-full border p-2 rounded"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="DANA">DANA</option>
                  <option value="GoPay">GoPay</option>
                  <option value="COD">Bayar di Tempat (COD)</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={useVoucher}
                    onChange={() => setUseVoucher(!useVoucher)}
                  /> Gunakan Voucher
                </label>
                {useVoucher && (
                  <input
                    type="text"
                    className="w-full mt-2 border rounded p-2"
                    placeholder="Masukkan kode voucher"
                    value={voucherCode}
                    onChange={(e) => {
                      const code = e.target.value
                      setVoucherCode(code)
                      setDiscount(code === 'DISKON10' ? 10000 : 0)
                    }}
                  />
                )}
              </div>

              <div className="mt-6 space-y-1 text-sm">
                <p>Subtotal: Rp {subtotal.toLocaleString()}</p>
                <p>Ongkir: Rp {shippingCost.toLocaleString()}</p>
                <p className="text-green-600">Diskon: -Rp {(useVoucher ? discount : 0).toLocaleString()}</p>
                <p className="font-bold text-lg mt-2">Total: Rp {total.toLocaleString()}</p>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow"
              >
                ✅ Checkout Sekarang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
