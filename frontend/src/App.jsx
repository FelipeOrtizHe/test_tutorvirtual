import { Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LearningPathsPage from './pages/LearningPathsPage.jsx';

const navStyles = ({ isActive }) => ({
  color: isActive ? '#2563eb' : '#111827',
  textDecoration: 'none',
  fontWeight: isActive ? 700 : 500,
  marginRight: '1rem'
});

export default function App() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', margin: '0 auto', maxWidth: '960px', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>TutorVirtual React</h1>
        <nav aria-label="Navegación principal">
          <NavLink to="/" style={navStyles} end>
            Inicio
          </NavLink>
          <NavLink to="/learning-paths" style={navStyles}>
            Rutas de aprendizaje
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learning-paths" element={<LearningPathsPage />} />
      </Routes>
    </div>
  );
}
