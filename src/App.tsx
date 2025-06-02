import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import DrawerAppBar from './components/DrawerAppBar'
import Dashboard from './pages/Dashboard'
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
    </Route>
  </Routes>
  </Router>
  )
}

export default App
