import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.get("/eventos", notImplemented("GET /api/docente/eventos"));
router.post("/eventos", notImplemented("POST /api/docente/eventos"));
router.delete("/eventos/:id", notImplemented("DELETE /api/docente/eventos/:id"));

export default router;
