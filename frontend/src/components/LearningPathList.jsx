import { useEffect, useState } from 'react';
import { fetchLearningPathById, fetchLearningPaths } from '../services/learningPathsService.js';

export default function LearningPathList() {
  const [paths, setPaths] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLearningPaths()
      .then((items) => setPaths(items))
      .catch(() => setError('No se pudo cargar el catálogo. ¿El backend está activo?'));
  }, []);

  const handleSelect = async (id) => {
    try {
      const detail = await fetchLearningPathById(id);
      setSelected(detail);
    } catch (err) {
      setError('No se pudo cargar el detalle.');
    }
  };

  if (error) {
    return <p style={{ color: '#b91c1c' }}>{error}</p>;
  }

  if (!paths.length) {
    return <p>Cargando rutas de aprendizaje...</p>;
  }

  return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {paths.map((path) => (
          <li
            key={path.id}
            style={{
              padding: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              backgroundColor: selected?.id === path.id ? '#eef2ff' : 'white'
            }}
            onClick={() => handleSelect(path.id)}
          >
            <h3 style={{ marginTop: 0, marginBottom: '.5rem' }}>{path.title}</h3>
            <p style={{ margin: 0, color: '#4b5563' }}>{path.description}</p>
            <small>Duración: {path.durationHours} horas</small>
          </li>
        ))}
      </ul>

      <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '1rem', minHeight: '150px' }}>
        <h3 style={{ marginTop: 0 }}>Detalle</h3>
        {selected ? (
          <article>
            <h4 style={{ marginTop: 0 }}>{selected.title}</h4>
            <p>{selected.description}</p>
            <p style={{ fontWeight: 600 }}>Duración estimada: {selected.durationHours} horas</p>
          </article>
        ) : (
          <p>Selecciona una ruta para ver más información.</p>
        )}
      </div>
    </section>
  );
}
