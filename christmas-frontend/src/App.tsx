import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import Concurso from './pages/Concurso'
import NavidadFea from './pages/NavidadFea'
import Ranking from './pages/Ranking'
import Ruleta from './pages/Ruleta'
import Villancicos from './pages/Villancicos'
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concurso" element={<Concurso />} />
        <Route path="/navidad-fea" element={<NavidadFea />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/ruleta" element={<Ruleta />} />
        <Route path="/villancicos" element={<Villancicos />} />
      </Routes>
    </Layout>
  )
}
