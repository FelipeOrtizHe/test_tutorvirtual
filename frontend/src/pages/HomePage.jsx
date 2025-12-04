import StatusCard from '../components/StatusCard.jsx';

export default function HomePage() {
  return (
    <main>
      <h2>Bienvenido al frontend React</h2>
      <p>
        Esta vista demuestra cómo consumir el backend Express mediante componentes funcionales y hooks.
        Asegúrate de tener el backend encendido para ver el estado del servicio.
      </p>
      <StatusCard />
    </main>
  );
}
