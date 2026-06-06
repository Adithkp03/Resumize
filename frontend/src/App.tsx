import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground dark">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="text-foreground transition-colors hover:text-foreground/80 font-bold text-lg">
                AI Resume Analyzer
              </Link>
              <Link to="/history" className="text-foreground/60 transition-colors hover:text-foreground/80">
                History
              </Link>
            </nav>
          </div>
        </header>

        <main className="container max-w-screen-2xl mx-auto py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
