import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Header from './components/Header';
import Dashboard from './components/DashBoard';
import Transactions from './components/Transactions';
import Reports from './components/Report';
import Profile from './components/Profile';
import Telegram from './components/Telegram';
import './App.css';

function Layout() {
  const location = useLocation();
  // The header will still be hidden on the login and signup pages
  const hideHeaderPaths = ['/', '/signup'];
  const isLoginPage = hideHeaderPaths.includes(location.pathname);


  return (
    <>
      {!isLoginPage && <Header />}
      <main className="main-content">
        <Routes>
          {/* All routes are now public. */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/telegram" element={<Telegram />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;