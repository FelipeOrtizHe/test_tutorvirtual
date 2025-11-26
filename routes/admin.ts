import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.get("/asignaturas", notImplemented("GET /api/admin/asignaturas"));
router.delete(
  "/asignaturas/:id",
  notImplemented("DELETE /api/admin/asignaturas/:id")
);
router.delete(
  "/select/:users",
  notImplemented("DELETE /api/admin/select/:users")
);
router.get("/:users", notImplemented("GET /api/admin/:users"));
router.post("/:users", notImplemented("POST /api/admin/:users"));
router.put("/:users", notImplemented("PUT /api/admin/:users"));
router.delete("/:users", notImplemented("DELETE /api/admin/:users"));

export default router;
