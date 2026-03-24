import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'

function App() {

  return (
    <BrowserRouter>
      <section className="flex w-screen h-screen gap-4">
        <aside>
          <nav className="flex flex-col gap-2 p-4 bg-gray-200">
            <a href="/" className="text-blue-500 hover:underline">Home</a>
            <a href="/about" className="text-blue-500 hover:underline">About</a>
          </nav>
        </aside>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </section>
    </BrowserRouter>
  )
}

export default App
