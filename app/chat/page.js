'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Deteksi user dari localStorage
    const raw = localStorage.getItem('user_data')
    try {
      const user = JSON.parse(raw)
      setEmail(user?.email || raw || '')
      if (user?.email === 'admin@gmail.com' || raw === 'admin@gmail.com') {
        setIsAdmin(true)
      }
    } catch (err) {
      setEmail(raw || '')
      if (raw === 'admin@gmail.com') {
        setIsAdmin(true)
      }
    }

    // Load message
    const savedMessages = JSON.parse(localStorage.getItem('chat_messages')) || []
    setMessages(savedMessages)
  }, [])

  const sendMessage = () => {
    if (newMessage.trim() === '') return

    const newEntry = {
      text: newMessage,
      sender: isAdmin ? 'admin' : 'user',
      timestamp: new Date().toISOString(),
      email, // siapa pengirimnya
    }

    const updated = [...messages, newEntry]
    setMessages(updated)
    localStorage.setItem('chat_messages', JSON.stringify(updated))
    setNewMessage('')
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
       <button
        onClick={() => router.push('/Dashboard')}
        className="mb-6 inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow"
      >
        ← Kembali ke Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">💬 Chat {isAdmin ? 'dengan User' : 'dengan Admin'}</h2>

      <div className="h-80 overflow-y-auto bg-white border p-4 rounded shadow mb-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs p-2 rounded ${
              msg.sender === (isAdmin ? 'admin' : 'user')
                ? 'bg-blue-100 ml-auto text-right'
                : 'bg-gray-200 mr-auto text-left'
            }`}
          >
            <div className="text-sm">{msg.text}</div>
            <div className="text-xs text-gray-500 mt-1">{msg.sender === 'admin' ? 'Admin' : msg.email}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder={isAdmin ? "Balas ke user..." : "Tulis pesan ke admin..."}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Kirim
        </button>
      </div>
    </div>
  )
}
