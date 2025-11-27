import { Router } from "express";
import bcrypt from "bcrypt";
import { Prisma, Rol } from "@prisma/client";
import prisma from "../lib/prisma";
import { authenticate } from "./utils";

const router = Router();

router.get("/users", authenticate(["ADMIN", "DOCENTE", "ANY"]), async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 50);
  const search = String(req.query.search ?? "").toLowerCase();

  const whereClause = {
    rol: Rol.DOCENTE,
    OR: [
      { nombre: { contains: search } },
      { correo: { contains: search } },
      { telefono: { contains: search } },
      { documentoIdentidad: { contains: search } },
    ],
  };

  const totalUsers = await prisma.usuario.count({ where: whereClause });
  const users = await prisma.usuario.findMany({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      documentoIdentidad: true,
      nombre: true,
      correo: true,
      telefono: true,
      rol: true,
      contrasena: true,
    },
  });

  return res.json({ users, total: totalUsers, page, totalPages: Math.ceil(totalUsers / limit) });
});

router.post("/users", authenticate(["ADMIN", "ANY"]), async (req, res) => {
  const { documentoIdentidad, nombre, correo, telefono = "", contrasena } = req.body ?? {};

  if (!documentoIdentidad || !nombre || !correo || !contrasena) {
    return res.status(400).json({ message: "Todos los campos son obligatorios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const user = await prisma.usuario.create({
      data: { documentoIdentidad, nombre, correo, telefono, contrasena: hashedPassword, rol: Rol.DOCENTE },
    });
    return res.status(201).json({ message: "Docente creado exitosamente", userId: user.id });
  } catch (error: any) {
    console.error("Error al crear docente", error);
    return res.status(500).json({ message: `Error al crear el docente: ${error?.message ?? "desconocido"}` });
  }
});

router.put("/users", authenticate(["ADMIN", "ANY"]), async (req, res) => {
  const { id, nombre, correo, telefono, documentoIdentidad, contrasena } = req.body ?? {};
  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : undefined;
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: { nombre, correo, telefono, documentoIdentidad, contrasena: hashedPassword },
    });
    return res.json({ message: "Usuario actualizado correctamente", user: updatedUser });
  } catch (error) {
    console.error("Error actualizando usuario", error);
    return res.status(500).json({ message: "Error al actualizar el usuario" });
  }
});

router.delete("/users", authenticate(["ADMIN", "ANY"]), async (req, res) => {
  const { id } = req.body ?? {};
  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    await prisma.usuario.delete({ where: { id } });
    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario", error);
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
});

router.delete("/select/users", authenticate(["ADMIN", "ANY"]), async (req, res) => {
  const { ids } = req.body ?? {};
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "IDs inválidos" });
  }

  try {
    await prisma.usuario.deleteMany({ where: { id: { in: ids } } });
    return res.json({ message: "Usuarios eliminados correctamente" });
  } catch (error) {
    console.error("Error eliminando usuarios", error);
    return res.status(500).json({ message: "Error al eliminar los usuarios" });
  }
});

router.get("/asignaturas", authenticate(["ADMIN", "ANY"]), async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 50);
  const search = String(req.query.search ?? "");

  const whereClause = {
    docente: { is: { rol: Rol.DOCENTE } },
    OR: [
      { nombre: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { carrera: { contains: search, mode: Prisma.QueryMode.insensitive } },
      { docente: { is: { nombre: { contains: search, mode: Prisma.QueryMode.insensitive } } } },
    ],
  };

  const totalAsignaturas = await prisma.asignatura.count({ where: whereClause });
  const asignaturas = await prisma.asignatura.findMany({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
    include: { docente: { select: { id: true, nombre: true } } },
  });

  return res.json({
    asignaturas,
    total: totalAsignaturas,
    page,
    totalPages: Math.ceil(totalAsignaturas / limit),
  });
});

router.delete("/asignaturas/:id", authenticate(["ADMIN", "ANY"]), async (req, res) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ message: "ID de asignatura inválido" });
  }

  try {
    await prisma.estudiante.deleteMany({ where: { asignaturaId: id } });
    await prisma.asignatura.delete({ where: { id } });
    return res.json({ message: "Asignatura y estudiantes eliminados exitosamente" });
  } catch (error) {
    console.error("Error eliminando asignatura", error);
    return res.status(500).json({ message: "Error al eliminar la asignatura" });
  }
});

export default router;
