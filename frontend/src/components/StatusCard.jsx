import { useEffect, useState } from 'react';
import { fetchStatus } from '../services/learningPathsService.js';

export default function StatusCard() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus()
      .then((data) => setStatus(data))
      .catch(() => setError('No se pudo contactar el backend. Verifica que esté corriendo.'));
  }, []);

  if (error) {
    return <p style={{ color: '#b91c1c' }}>{error}</p>;
  }

  if (!status) {
    return <p>Cargando estado del backend...</p>;
  }

  return (
    <section style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem', marginTop: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Estado del servicio</h3>
      <ul>
        <li>Servicio: {status.service}</li>
        <li>Estado: {status.status}</li>
        <li>Última actualización: {new Date(status.timestamp).toLocaleString()}</li>
      </ul>
    </section>
  );
}
