import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import type { DecodedToken } from "../server/utils/jwt";

const router = Router();
const jwtSecret = process.env.JWT_SECRET || "fallback_secret";

const signToken = (payload: Omit<DecodedToken, "iat" | "exp">) =>
  jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña son requeridos" });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: email },
      select: { id: true, contrasena: true, rol: true },
    });

    if (usuario) {
      const valid = await bcrypt.compare(password, usuario.contrasena);
      if (!valid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = signToken({ userId: usuario.id, role: usuario.rol });
      return res.json({ token, role: usuario.rol, userId: usuario.id });
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: { correo: email },
      select: { id: true, contrasena: true, asignaturaId: true },
    });

    if (estudiante) {
      const valid = await bcrypt.compare(password, estudiante.contrasena);
      if (!valid) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = signToken({
        userId: estudiante.id,
        role: "ESTUDIANTE",
        asignaturaId: estudiante.asignaturaId,
      });

      return res.json({
        token,
        role: "ESTUDIANTE",
        asignaturaId: estudiante.asignaturaId,
        userId: estudiante.id,
      });
    }

    return res.status(401).json({ message: "Credenciales inválidas" });
  } catch (error) {
    console.error("Error en /api/auth/login", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.post("/register", async (req, res) => {
  const { documentoIdentidad, nombre, correo, telefono = "", contrasena } =
    req.body ?? {};

  if (!documentoIdentidad || !nombre || !correo || !contrasena) {
    return res.status(400).json({
      message: "Documento, nombre, correo y contraseña son requeridos",
    });
  }

  try {
    const hashed = await bcrypt.hash(contrasena, 10);
    const user = await prisma.usuario.create({
      data: {
        documentoIdentidad,
        nombre,
        correo,
        telefono,
        contrasena: hashed,
        rol: "DOCENTE",
      },
    });

    return res.status(201).json({ message: "Docente creado", userId: user.id });
  } catch (error: any) {
    console.error("Error en /api/auth/register", error);
    return res.status(500).json({
      message: `Error al crear el docente: ${error?.message ?? "desconocido"}`,
    });
  }
});

router.post("/refresh", (req, res) => {
  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    const { userId, role, asignaturaId } = decoded;
    const newToken = signToken({ userId, role, asignaturaId });
    return res.json({ token: newToken, role, asignaturaId, userId });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
});

export default router;
