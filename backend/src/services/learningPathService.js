const mockLearningPaths = [
  {
    id: 1,
    title: 'Introducción a JavaScript',
    description: 'Conceptos básicos, variables, funciones y control de flujo.',
    durationHours: 8
  },
  {
    id: 2,
    title: 'Backend con Node y Express',
    description: 'Middlewares, rutas, controladores y buenas prácticas.',
    durationHours: 12
  }
];

export function listLearningPaths() {
  return mockLearningPaths;
}

export function getLearningPath(id) {
  return mockLearningPaths.find((item) => item.id === Number(id));
}
