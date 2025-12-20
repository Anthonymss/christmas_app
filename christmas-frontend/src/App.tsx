import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import Concurso from './pages/Concurso'
import NavidadFea from './pages/NavidadFea'
import Ranking from './pages/Ranking'
import Ruleta from './pages/Ruleta'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concurso" element={<Concurso />} />
        <Route path="/navidad-fea" element={<NavidadFea />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/ruleta" element={<Ruleta />} />
      </Routes>
    </Layout>
  )
}
