// /pages/api/verify-captcha.js
import axios from 'axios'

export default async function handler(req, res) {
  const { token } = req.body

  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  )

  const data = response.data

  if (data.success) {
    res.status(200).json({ success: true })
  } else {
    res.status(400).json({ success: false, message: 'Verifikasi captcha gagal' })
  }
}
