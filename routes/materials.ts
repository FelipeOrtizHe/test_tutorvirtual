import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.get("/:id", notImplemented("GET /api/materials/:id"));
router.delete("/:id", notImplemented("DELETE /api/materials/:id"));

export default router;
