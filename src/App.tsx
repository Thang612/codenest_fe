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
import { useAuthStore } from './store/auth.store'
import { useEffect } from 'react'
import AdminRoute from './route/AdminRoute'
import ManageCourse from './pages/ManageCourse'
import ManageClass from './pages/ManageClass'
import NotFound from './pages/NotFound'
import UpdateCourse from './pages/UpdateCourse'

function App() {
  const getProfile = useAuthStore((s) => s.getProfile);

  useEffect(() => {
    getProfile();
  }, []);

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
              <Route path="/courses" >
                <Route index element={<ManageCourse />} />
                <Route path=":id" element={<UpdateCourse />} />
              </Route>
              <Route path="/classes" element={<ManageClass />} />


              <Route path="/users" >
                <Route index element={<ManageUser />} />

                <Route path="teachers" element={
                  <AdminRoute>
                    <ManageTeacher />
                  </AdminRoute>
                } />

              </Route>
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>
          <Toaster position="top-right" richColors closeButton />
        </section>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
