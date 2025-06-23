'use client'

import { signOut } from 'next-auth/react'

export const logoutUser = async () => {
  try {
    localStorage.removeItem('user_data') // hapus data login manual

    // Logout Google
    await signOut({ callbackUrl: '/' })

    // Fallback redirect untuk manual login
    window.location.href = '/'
  } catch (err) {
    console.error('Gagal logout:', err)
    window.location.href = '/'
  }
}
