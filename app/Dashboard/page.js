'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { logoutUser } from '@/utils/logout'
import { motion, AnimatePresence } from 'framer-motion'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPhoto, setUserPhoto] = useState('')
  const bgmRef = useRef(null)
  const clickSoundRef = useRef(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true)

  const talents = [
    {
      id: 0,
      src: '/talent1.mp4',
      productImage: '/product1.jpg',
      name: 'Tas Phoebe',
      price: 'Rp 350.000'
    },
    {
      id: 1,
      src: '/talent2.mp4',
      productImage: '/product2.jpg',
      name: 'Mousepad Romantic Carlotta Packed',
      price: 'Rp 700.000'
    },
    {
      id: 2,
      src: '/talent3.mp4',
      productImage: '/product3.jpg',
      name: 'Figure Carthethyia Eksklusif',
      price: 'Rp 1.550.000'
    }
  ]

  const videoRefs = useRef([])
  const [showPopups, setShowPopups] = useState(Array(talents.length).fill(false))

  useEffect(() => {
    const raw = localStorage.getItem('user_data')
    const photo = localStorage.getItem('user_photo') || ''
    setUserPhoto(photo)

    try {
      const user = JSON.parse(raw)
      if (user?.email === 'admin@gmail.com') {
        setIsAdmin(true)
        setIsLoggedIn(true)
      } else if (user?.email) {
        setIsAdmin(false)
        setIsLoggedIn(true)
      }
    } catch {
      if (raw === 'admin@gmail.com') {
        setIsAdmin(true)
        setIsLoggedIn(true)
      } else if (raw) {
        setIsAdmin(false)
        setIsLoggedIn(true)
      }
    }

    if (session) {
      setIsLoggedIn(true)
    }
  }, [session])

  const toggleMusic = () => {
    if (bgmRef.current) {
      if (isMusicPlaying) {
        bgmRef.current.pause()
      } else {
        bgmRef.current.play()
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play()
    }
  }

  const NavButton = ({ href, icon, label }) => (
    <Link href={href} className="flex items-center gap-2 border px-3 py-2 rounded shadow hover:bg-gray-100 transition text-sm" onClick={playClickSound}>
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <audio ref={bgmRef} src="/bgm.mp3" autoPlay loop />
      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-red-600">WUTHERING WAVES</h1>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-800">☰</button>
        </div>
        <div className="hidden md:flex space-x-3 items-center">
          <NavButton href="/cart" icon="🛒" label="Keranjang" />
          <button onClick={toggleMusic} className="text-sm text-pink-600 font-semibold border px-3 py-2 rounded hover:bg-pink-100 transition">
            {isMusicPlaying ? '🔊 Musik Aktif' : '🔈 Mainkan Musik'}
          </button>
          {isLoggedIn ? (
            <>
              <NavButton href="/profile" icon="👤" label="Akun" />
              <NavButton href="/notifikasi" icon="🔔" label="Notifikasi" />
              <NavButton href="/riwayat" icon="📜" label="Riwayat" />
              <NavButton href="/lacak" icon="📦" label="Lacak" />
              <NavButton href="/chat" icon="💬" label="Pesan" />
              {isAdmin && <NavButton href="/adminpage" icon="⚙️" label="Admin Panel" />}
              <button onClick={logoutUser} className="text-red-600 font-semibold ml-2">Logout</button>
              {userPhoto && (
                <Link href="/profile">
                  <Image src={userPhoto} alt="Foto Profil" width={48} height={48} className="rounded-full border object-cover ml-4 hover:ring-2 ring-pink-400 transition" />
                </Link>
              )}
            </>
          ) : (
            <>
              <NavButton href="/login" icon="🔐" label="Login" />
              <NavButton href="/register" icon="📝" label="Daftar" />
            </>
          )}
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-white px-6 py-2 space-y-2 border-b">
          <NavButton href="/cart" icon="🛒" label="Keranjang" />
          {isLoggedIn ? (
            <>
              <NavButton href="/profile" icon="👤" label="Akun" />
              <NavButton href="/notifikasi" icon="🔔" label="Notifikasi" />
              <NavButton href="/riwayat" icon="📜" label="Riwayat" />
              <NavButton href="/lacak" icon="📦" label="Lacak" />
              <NavButton href="/chat" icon="💬" label="Pesan" />
              {isAdmin && <NavButton href="/admin/adminpage" icon="⚙️" label="Admin Panel" />}
              <button onClick={logoutUser} className="text-left text-red-600 font-semibold">Logout</button>
            </>
          ) : (
            <>
              <NavButton href="/login" icon="🔐" label="Login" />
              <NavButton href="/register" icon="📝" label="Daftar" />
            </>
          )}
        </div>
      )}

      {/* Banner */}
      <section className="relative text-white text-center">
        <video src="/bg.mp4" autoPlay muted loop playsInline className="w-full h-[300px] object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center">
          <h2 className="text-3xl md:text-4xl font-bold">ROAD TO WUTHERING WAVES FEST</h2>
          <p className="mt-2 text-lg md:text-xl">Diskon merch sampai 70% + ekstra 30%</p>
          <button className="mt-6 px-6 py-2 bg-white text-red-600 font-bold rounded-full">SHOP NOW</button>
        </div>
      </section>

      {/* Produk Talent */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
        {talents.map(({ id, src, productImage, name, price }) => (
          <div key={id} className="relative group rounded-xl overflow-hidden shadow border">
            <Link href={`/talent${id + 1}`} onClick={playClickSound}>
              <video
                ref={el => videoRefs.current[id] = el}
                src={src}
                muted
                playsInline
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onMouseEnter={() => videoRefs.current[id]?.play()}
                onMouseLeave={() => videoRefs.current[id]?.pause()}
                onEnded={() => {
                  const updated = [...showPopups]
                  updated[id] = true
                  setShowPopups(updated)
                }}
              />
            </Link>
            <AnimatePresence>
              {showPopups[id] && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center text-white p-4 z-10"
                >
                  <Image src={productImage} alt={name} width={128} height={128} className="rounded mb-4 object-cover" />
                  <h3 className="text-xl font-bold mb-2">{name}</h3>
                  <p className="mb-4">{price}</p>
                  <Link href={`/talent${id + 1}`} className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition" onClick={playClickSound}>Beli Sekarang</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white px-6 py-10 mt-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="text-left md:w-1/2">
            <h3 className="text-xl font-bold mb-4">WUTHERING WAVES MERCHANDISE STORE NON OFFICIAL</h3>
            <p className="text-sm leading-relaxed max-w-md">
              Wuthering Wave adalah game RPG bercerita tentang Rover yang memulai perjalanannya kembali sekali lagi untuk mencapai ending terbaik.
              Game ini dilengkapi dengan mekanik combat dan eksplorasi yang asik serta desain karakter keren dari Unreal Engine 4.
            </p>
          </div>
          <div className="text-right md:w-1/2 mt-6 md:mt-0">
            <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://x.com/yonri_1988" className="hover:underline">Twitter</a></li>
              <li><a href="https://www.instagram.com/yonri1988?igsh=cnc2MTFvcTF3eDk5" className="hover:underline">Instagram</a></li>
              <li><a href="https://www.youtube.com/@WutheringWaves" className="hover:underline">YouTube</a></li>
              <li><a href="#" className="hover:underline">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-10 text-xs text-gray-400">
          © {new Date().getFullYear()} Wahyu Project. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
