import { useState, useRef, useEffect } from 'react'
import { FaTimes, FaPaperPlane, FaCommentDots } from 'react-icons/fa'
import api from '../services/api'

const limpiarMarkdown = (texto) => {
  return texto
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6} /g, '')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .trim()
}

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
    <>
      <style>{`
        .btn-enviar-chat:hover { background: #FDE047 !important; }
        .btn-enviar-chat { transition: background .2s; }
        .input-chat:focus { outline: none; border-color: #FACC15 !important; }
        .input-chat { transition: border-color .2s; }
        .btn-chat-toggle:hover { transform: scale(1.08); }
        .btn-chat-toggle { transition: transform .2s, box-shadow .2s; }
      `}</style>

      {/* Ventana del chat */}
      {abierto && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px',
          zIndex: 1000,
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          width: '320px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', border: '1px solid #E8E5E0',
          height: '460px',
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}>
          {/* Header */}
          <div style={{
            background: '#111', color: '#fff',
            padding: '14px 18px', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Asistente GyG</span>
            </div>
            <button
              onClick={() => setAbierto(false)}
              style={{
                color: '#888', background: 'transparent',
                border: 'none', cursor: 'pointer',
                padding: '4px', display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
            >
              <FaTimes size={15} />
            </button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '16px', display: 'flex',
            flexDirection: 'column', gap: '10px',
            background: '#FAFAF8',
          }}>
            {mensajes.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.rol === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  background: msg.rol === 'user' ? '#FACC15' : '#fff',
                  color: msg.rol === 'user' ? '#111' : '#333',
                  border: msg.rol === 'user' ? 'none' : '1px solid #EEECEA',
                  fontWeight: msg.rol === 'user' ? 600 : 400,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.rol === 'assistant' ? limpiarMarkdown(msg.contenido) : msg.contenido}
                </div>
              </div>
            ))}
            {cargando && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: '#fff', color: '#999',
                  padding: '10px 14px', borderRadius: '12px',
                  fontSize: '13px', border: '1px solid #EEECEA',
                  fontStyle: 'italic',
                }}>
                  Escribiendo...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={enviarMensaje} style={{
            borderTop: '1px solid #EEECEA',
            padding: '12px 14px', display: 'flex',
            gap: '8px', background: '#fff', flexShrink: 0,
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="input-chat"
              style={{
                flex: 1, border: '1.5px solid #E8E5E0',
                borderRadius: '8px', padding: '9px 12px',
                fontSize: '13px', background: '#FAFAF8', color: '#111',
              }}
            />
            <button
              type="submit"
              disabled={cargando}
              className="btn-enviar-chat"
              style={{
                background: '#FACC15', color: '#111',
                padding: '9px 14px', borderRadius: '8px',
                border: 'none', cursor: cargando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center',
                opacity: cargando ? 0.5 : 1,
              }}
            >
              <FaPaperPlane size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="btn-chat-toggle"
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          zIndex: 1001,
          background: '#FACC15', color: '#111',
          width: '54px', height: '54px',
          borderRadius: '50%',
          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', border: 'none',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <FaCommentDots size={22} />
      </button>
    </>
  )
}

export default Chatbot