import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "./utils";

const router = Router();

router.get("/:id", authenticate(["DOCENTE", "ESTUDIANTE", "ADMIN", "ANY"]), async (req, res) => {
  const idAsignatura = parseInt(req.params.id, 10);
  if (Number.isNaN(idAsignatura)) {
    return res.status(400).json({ message: "El ID de la asignatura no es válido." });
  }

  const materiales = await prisma.material.findMany({ where: { idAsignatura } });
  return res.json(materiales);
});

router.delete("/:id", authenticate(["DOCENTE", "ADMIN", "ANY"]), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "ID de material inválido" });
  }

  await prisma.material.delete({ where: { id } });
  return res.json({ message: "Material eliminado" });
});

export default router;
