'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReCAPTCHA from 'react-google-recaptcha'
import { signIn } from 'next-auth/react'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaValue, setCaptchaValue] = useState(null)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()

    const isAdmin = email === 'admin@gmail.com' && password === '12345'
    const role = isAdmin ? 'admin' : 'user'

    if (!isAdmin && !captchaValue) {
      return alert('Harap centang captcha dulu')
    }

    const newUser = { email, password, role }
    localStorage.setItem('user', JSON.stringify(newUser))

    alert(isAdmin ? 'Admin berhasil dibuat!' : 'Akun berhasil dibuat!')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Daftar Akun</h2>

        <label className="font-semibold mb-2 block">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <label className="font-semibold mb-2 block">Password</label>
        <input
          type="password"
          placeholder="Kata Sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />

        {!isAdmin(email, password) && (
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(val) => setCaptchaValue(val)}
          />
        )}

        <button type="submit" className="bg-red-600 text-white w-full py-2 rounded mt-4">
          Daftar
        </button>

        <button
          type="button"
          onClick={() => signIn('google')}
          className="w-full bg-blue-600 text-white py-2 rounded mt-3"
        >
          Daftar dengan Google
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Sudah punya akun?{' '}
          <a href="/login" className="text-blue-500 underline">
            Masuk
          </a>
        </p>
      </form>
    </div>
  )
}

function isAdmin(email, password) {
  return email === 'admin@gmail.com' && password === '12345'
}
