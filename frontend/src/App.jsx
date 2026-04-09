import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Cotizacion from './pages/Cotizacion'
import Seguimiento from './pages/Seguimiento'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/cotizar" element={<Cotizacion />} />
        <Route path="/seguimiento" element={<Seguimiento />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App