import './App.css'
import Dashboard from './pages/Dashboard'
import Emissions from './pages/Emissions'
import EmissionsDetails from './pages/EmissionDetail'
import CompetDetail from './pages/CompetDetail'
import Actualities from './pages/Actualities'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import About from './pages/About'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

function App() {

  return (
    <Router>
    <Routes>
    <Route
      path="/*"
      element={<Layout />}
    >
      <Route index element={<Dashboard />} />
      <Route path="emissions" element={<Emissions />} />
      <Route path="emissions/detail/:code_emission" element={<EmissionsDetails />} />
      <Route path="competitions/detail" element={<CompetDetail />} />
      <Route path="actualities" element={<Actualities />} />
      <Route path="a-propos" element={<About />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      {/* Ajoute d'autres routes ici si nécessaire */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Route>
  </Routes>
  </Router>
  )
}

export default App
