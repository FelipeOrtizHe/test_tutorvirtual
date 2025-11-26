import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.get("/", notImplemented("GET /api/asignaturas"));
router.get("/:id", notImplemented("GET /api/asignaturas/:id"));
router.post("/create", notImplemented("POST /api/asignaturas/create"));
router.post("/generate-link", notImplemented("POST /api/asignaturas/generate-link"));
router.post(
  "/:asignaturaId/generate-link",
  notImplemented("POST /api/asignaturas/:asignaturaId/generate-link")
);
router.delete("/:id", notImplemented("DELETE /api/asignaturas/:id"));
router.delete("/delete", notImplemented("DELETE /api/asignaturas/delete"));

export default router;
