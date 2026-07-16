import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getFirebaseApp } from './firebase'

// Initialize Firebase (Auth / Firestore / Storage) for datingpro-c8638
getFirebaseApp()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
