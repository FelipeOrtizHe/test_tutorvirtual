import { getLearningPath, listLearningPaths } from '../services/learningPathService.js';

export function list(req, res) {
  const items = listLearningPaths();
  res.json({ items });
}

export function detail(req, res, next) {
  const item = getLearningPath(req.params.id);

  if (!item) {
    return next({ status: 404, message: 'Ruta de aprendizaje no encontrada' });
  }

  res.json(item);
}
