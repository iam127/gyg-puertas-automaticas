import { useState, useRef, useEffect } from 'react'
import { FaTimes, FaPaperPlane, FaCommentDots } from 'react-icons/fa'
import api from '../services/api'

function Chatbot() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([
    { rol: 'assistant', contenido: '¡Hola! Soy el asistente virtual de GyG Puertas Automáticas. ¿En qué puedo ayudarte?' }
  ])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviarMensaje = async (e) => {
    e.preventDefault()
    if (!input.trim() || cargando) return
    const nuevoMensaje = { rol: 'user', contenido: input }
    const nuevosMensajes = [...mensajes, nuevoMensaje]
    setMensajes(nuevosMensajes)
    setInput('')
    setCargando(true)
    try {
      const res = await api.post('/chatbot/', {
        mensaje: input,
        historial: mensajes
      })
      setMensajes([...nuevosMensajes, { rol: 'assistant', contenido: res.data.respuesta }])
    } catch {
      setMensajes([...nuevosMensajes, { rol: 'assistant', contenido: 'Lo siento, ocurrió un error. Por favor intenta de nuevo.' }])
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {abierto && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 mb-4 flex flex-col overflow-hidden border border-gray-200">
          <div className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-bold text-sm">Asistente GyG</span>
            </div>
            <button onClick={() => setAbierto(false)} className="text-gray-400 hover:text-white transition">
              <FaTimes size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-80">
            {mensajes.map((msg, i) => (
              <div key={i} className={`flex ${msg.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  msg.rol === 'user'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.contenido}
                </div>
              </div>
            ))}
            {cargando && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl text-sm">
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={enviarMensaje} className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
            <button
              type="submit"
              disabled={cargando}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setAbierto(!abierto)}
        className="bg-yellow-400 text-gray-900 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-300 transition"
      >
        {abierto ? <FaTimes size={22} /> : <FaCommentDots size={22} />}
      </button>
    </div>
  )
}

export default Chatbot