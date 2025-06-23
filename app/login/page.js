'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaValue, setCaptchaValue] = useState(null)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/Dashboard')
  }, [session])

  if (session) return null

  const handleManualLogin = (e) => {
    e.preventDefault()

    if (email === 'admin@gmail.com' && password === '12345') {
      localStorage.setItem('user_data', JSON.stringify({ email }))
      alert('Login admin berhasil!')
      router.push('/Dashboard')
      return
    }

    if (!captchaValue) return alert('Harap isi captcha terlebih dahulu')

    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser?.email === email && storedUser?.password === password) {
      localStorage.setItem('user_data', JSON.stringify({ email }))
      alert('Login berhasil!')
      router.push('/Dashboard')
    } else {
      alert('Email atau password salah!')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleManualLogin} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Masuk Akun</h2>

        <button
          type="button"
          onClick={() => signIn('google')}
          className="w-full bg-blue-600 text-white py-2 rounded mb-4"
        >
          Masuk dengan Google
        </button>

        <div className="mb-4 text-center text-gray-500">atau masuk manual</div>
        <h3 className="font-semibold mb-2">Email</h3>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded mb-4" />
        <h3 className="font-semibold mb-2">Password</h3>
        <input type="password" placeholder="Kata Sandi" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border rounded mb-4" />

        {!(email === 'admin@gmail.com' && password === '12345') && (
          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={(val) => setCaptchaValue(val)} />
        )}

        <button type="submit" className="bg-red-600 text-white w-full py-2 rounded mt-4">
          Masuk
        </button>
      </form>
    </div>
  )
}
