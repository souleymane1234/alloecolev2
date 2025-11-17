import './App.css'
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Bourse from './pages/Bourse.jsx'
import BourseDetails from './pages/BourseDetails.jsx'
import EtudeEtranger from './pages/EtudeEtranger.jsx'
import Permutation from './pages/Permutation.jsx'
import Profil from './pages/Profil.jsx'
import WebTv from './pages/WebTv.jsx'
import OrientationSimulator from './pages/OrientationSimulator.jsx'
import Schools from './pages/Schools.jsx'
import SchoolDetail from './pages/SchoolDetail.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import VideoDetail from './pages/VideoDetail.jsx'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
      {/* Composant de notification de mise à jour PWA */}
      
      <Router>
        <Routes>
          <Route
            path="/*"
            element={<Layout />}
          >
            <Route index element={<Home />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="bourses" element={<Bourse />} />
            <Route path="bourses/details/:id" element={<BourseDetails />} />
            {/* <Route path="bourses/details" element={<BourseDetails />} /> */}
            <Route path="etudes-etranger" element={<EtudeEtranger />} />
            <Route path="permutation" element={<Permutation />} />
            <Route path="profil" element={<Profil />} />
            <Route path="webtv" element={<WebTv />} />
            <Route path="schools" element={<Schools />} />
            <Route path="schools/:id" element={<SchoolDetail />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route path="webtv/video/:id" element={<VideoDetail />} />
            <Route path="questionnaires-interactifs" element={<OrientationSimulator />} />
            {/* Ajoute d'autres routes ici si nécessaire */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Route>
        </Routes>
        
        {/* Composant d'invitation d'installation PWA */}
      </Router>
      </QueryClientProvider>
    </>
  )
}

export default App