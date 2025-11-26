import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'

const prisma = new PrismaClient()
const jwtSecret = process.env.JWT_SECRET || 'fallback_secret'

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body ?? {}

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
      const usuario = await prisma.usuario.findUnique({
        where: { correo: email },
        select: { id: true, contrasena: true, rol: true },
      })

      if (usuario) {
        const isPasswordValid = await bcrypt.compare(password, usuario.contrasena)

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ userId: usuario.id, role: usuario.rol }, jwtSecret, {
          expiresIn: '1h',
        })

        return res.status(200).json({ token, role: usuario.rol, userId: usuario.id })
      }

      const estudiante = await prisma.estudiante.findUnique({
        where: { correo: email },
        select: { id: true, contrasena: true, asignaturaId: true },
      })

      if (estudiante) {
        const isPasswordValid = await bcrypt.compare(password, estudiante.contrasena)

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
          { userId: estudiante.id, role: 'ESTUDIANTE', asignaturaId: estudiante.asignaturaId },
          jwtSecret,
          { expiresIn: '1h' }
        )

        return res
          .status(200)
          .json({ token, role: 'ESTUDIANTE', asignaturaId: estudiante.asignaturaId, userId: estudiante.id })
      }

      return res.status(401).json({ message: 'Invalid credentials' })
    } catch (error) {
      next(error)
    }
  }
}
