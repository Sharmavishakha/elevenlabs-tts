'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })

    const data = await res.json()
    if (data.success) {
      const botMsg = { role: 'bot', text: data.reply }
      setMessages(prev => [...prev, botMsg])
    } else {
      alert("Gemini failed")
    }

    setLoading(false)
  }

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Or 'hi-IN' for Hindi
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInput(speechText);  // Autofill the input box
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.start();
  };


  const playAudio = async (text) => {
    const res = await fetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    const data = await res.json()
    if (data.success) {
      const audio = new Audio(data.audio + '?v=' + Date.now())
      audio.play()
    }
  }

  const handleEndChat = async () => {
    const res = await fetch('/api/emotion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const data = await res.json();

    if (data.success) {
      const botMsg = {
        role: 'bot',
        text: data.content,  // full Gemini-generated response
      };

      setMessages((prev) => [...prev, botMsg]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "Sorry, I couldn’t analyze your mood this time.",
        },
      ]);
    }
  };



  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 Chatbot with Voice</h1>

      <div className="space-y-4 mb-6">
        {/* {messages.map((msg, i) => (
          <div key={i} className={`p-4 rounded ${msg.role === 'user' ? 'bg-blue-600 text-right' : 'bg-gray-700 text-left'}`}>
            <p>{msg.text}</p>
            {msg.role === 'bot' && (
              <button
                onClick={() => playAudio(msg.text)}
                className="text-sm mt-1 text-blue-600 hover:underline"
              >
                🔊 Listen
              </button>
            )}
          </div>
        ))} */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded max-w-[80%] whitespace-pre-line ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white self-end ml-auto text-right'
                : 'bg-gray-700 text-white self-start text-left'
            }`}
          >
            <p>{msg.text}</p>
            {msg.role === 'bot' && !msg.text.includes("Sorry") && (
              <button
                onClick={() => playAudio(msg.text)}
                className="text-sm mt-2 text-blue-300 hover:underline"
              >
                🔊 Listen
              </button>
            )}
          </div>
        ))}

      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          type="button"
          onClick={startListening}
          className="bg-gray-800 text-white px-3 py-2 rounded hover:bg-gray-700"
        >
          🎤
        </button>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500" disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
        <button
          onClick={handleEndChat}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded hover:opacity-90"
        >
          End Chat 💬
        </button>

      </form>
    </main>
  )
}
