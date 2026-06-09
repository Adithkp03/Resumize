import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="text-foreground transition-colors hover:text-foreground/80 font-bold text-lg">
                Resumize
              </Link>
              <Link to="/history" className="text-foreground/60 transition-colors hover:text-foreground/80">
                History
              </Link>
            </nav>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
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
