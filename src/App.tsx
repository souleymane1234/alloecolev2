import './App.css'
import Home from './pages/Home'
import Emissions from './pages/Emissions'
import EmissionsDetails from './pages/EmissionDetail'
import CompetDetail from './pages/CompetDetail'
import Actualities from './pages/Actualities'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import About from './pages/About'
import VotingComponent from './pages/Vote'
import PaymentReturn from './pages/PaymentReturn'
import InstallPrompt from './components/InstallPrompt'
import UpdateNotification from './components/UpdateNotification' // Nouveau composant
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

function App() {

  return (
    <>
      {/* Composant de notification de mise à jour PWA */}
      <UpdateNotification />
      
      <Router>
        <Routes>
          <Route
            path="/*"
            element={<Layout />}
          >
            <Route index element={<Home />} />
            <Route path="emissions" element={<Emissions />} />
            <Route path="VotingComponent" element={<VotingComponent />} />
            <Route path="emissions/detail/:code_emission" element={<EmissionsDetails />} />
            <Route path="competitions/:code_competition/detail" element={<CompetDetail />} />
            <Route path="actualities" element={<Actualities />} />
            <Route path="a-propos" element={<About />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="payment/return" element={<PaymentReturn />} />
            {/* Ajoute d'autres routes ici si nécessaire */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Routes>
        
        {/* Composant d'invitation d'installation PWA */}
        <InstallPrompt />
      </Router>
    </>
  )
}

export default App