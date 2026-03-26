import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import { ThemeProvider } from './components/common/theme-provider'
import Sidebar from './components/layout/Sidebar'
import ManageTeacher from './pages/ManageTeacher'
import ManageUser from './pages/ManageTeacher'
import { Toaster } from './components/ui/sonner'
import LoginPage from './pages/LoginPage'

function App() {

  return (
    <ThemeProvider>
      <BrowserRouter>
        <section className="bg-background flex w-screen h-screen gap-4 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-4 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/users" >
                <Route index element={<ManageUser />} />
                <Route path="teachers" element={<ManageTeacher />} />
              </Route>
              <Route path="/manage-teacher" element={<ManageTeacher />} />
            </Routes>
          </main>
          <Toaster position="top-right" richColors closeButton />
        </section>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
