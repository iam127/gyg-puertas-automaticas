import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import { ROUTES } from './constants'

// Páginas públicas
import Inicio from './pages/public/Inicio'
import Catalogo from './pages/public/Catalogo'
import DetalleProducto from './pages/public/DetalleProducto'
import Cotizacion from './pages/public/Cotizacion'
import Seguimiento from './pages/public/Seguimiento'
import Mantenimiento from './pages/public/Mantenimiento'
import Nosotros from './pages/public/Nosotros'
import Contacto from './pages/public/Contacto'
import Galeria from './pages/public/Galeria'
import Blog from './pages/public/Blog'
import GuiaPuerta from './pages/public/GuiaPuerta'
import Comparador from './pages/public/Comparador'

// Páginas admin
import AdminLogin from './pages/admin/AdminLogin'
import AdminPanel from './pages/admin/AdminPanel'
import AdminCotizaciones from './pages/admin/AdminCotizaciones'
import AdminMantenimientos from './pages/admin/AdminMantenimientos'
import AdminTecnicos from './pages/admin/AdminTecnicos'
import AdminProductos from './pages/admin/AdminProductos'
import AdminReportes from './pages/admin/AdminReportes'
import AdminContenido from './pages/admin/AdminContenido'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
          <Route path={ROUTES.ADMIN_PANEL} element={<AdminLayout><AdminPanel /></AdminLayout>} />
          <Route path="/admin/cotizaciones" element={<AdminLayout><AdminCotizaciones /></AdminLayout>} />
          <Route path="/admin/mantenimientos" element={<AdminLayout><AdminMantenimientos /></AdminLayout>} />
          <Route path="/admin/tecnicos" element={<AdminLayout><AdminTecnicos /></AdminLayout>} />
          <Route path="/admin/productos" element={<AdminLayout><AdminProductos /></AdminLayout>} />
          <Route path="/admin/reportes" element={<AdminLayout><AdminReportes /></AdminLayout>} />
          <Route path="/admin/contenido" element={<AdminLayout><AdminContenido /></AdminLayout>} />

          {/* Públicas */}
          <Route path={ROUTES.HOME} element={<PublicLayout><Inicio /></PublicLayout>} />
          <Route path={ROUTES.CATALOGO} element={<PublicLayout><Catalogo /></PublicLayout>} />
          <Route path={ROUTES.CATALOGO_DETALLE} element={<PublicLayout><DetalleProducto /></PublicLayout>} />
          <Route path={ROUTES.COTIZAR} element={<PublicLayout><Cotizacion /></PublicLayout>} />
          <Route path={ROUTES.SEGUIMIENTO} element={<PublicLayout><Seguimiento /></PublicLayout>} />
          <Route path={ROUTES.MANTENIMIENTO} element={<PublicLayout><Mantenimiento /></PublicLayout>} />
          <Route path={ROUTES.NOSOTROS} element={<PublicLayout><Nosotros /></PublicLayout>} />
          <Route path={ROUTES.CONTACTO} element={<PublicLayout><Contacto /></PublicLayout>} />
          <Route path={ROUTES.GALERIA} element={<PublicLayout><Galeria /></PublicLayout>} />
          <Route path={ROUTES.BLOG} element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path={ROUTES.GUIA} element={<PublicLayout><GuiaPuerta /></PublicLayout>} />
          <Route path={ROUTES.COMPARADOR} element={<PublicLayout><Comparador /></PublicLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App