import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import { ThemeProvider } from './contexts/ThemeContext';
import Admin from './pages/Admin';
import AuthCallback from './pages/AuthCallback';
import Blog from './pages/Blog';
import ChangeLog from './pages/ChangeLog';
import Contact from './pages/Contact';
import Home from './pages/Home';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/changelog" element={<ChangeLog />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
