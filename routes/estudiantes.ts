import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { documentoIdentidad, nombre, carrera, correo, contrasena, enlaceRegistro } =
      req.body ?? {};

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const asignatura = await prisma.asignatura.findUnique({
      where: { enlaceRegistro: enlaceRegistro },
    });

    if (!asignatura) {
      return res.status(404).json({ message: "Asignatura no encontrada" });
    }

    await prisma.estudiante.create({
      data: {
        documentoIdentidad,
        nombre,
        carrera,
        correo,
        contrasena: hashedPassword,
        asignaturaId: asignatura.id,
        usuarioId: 1,
      },
    });

    return res.json({ message: "Estudiante registrado exitosamente" });
  } catch (error) {
    console.error("Error registrando estudiante", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
