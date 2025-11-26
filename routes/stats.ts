import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.get(
  "/asignaturas/active-inactive",
  notImplemented("GET /api/stats/asignaturas/active-inactive")
);
router.get("/subjects/count", notImplemented("GET /api/stats/subjects/count"));
router.get("/materials/average", notImplemented("GET /api/stats/materials/average"));
router.get("/students/average", notImplemented("GET /api/stats/students/average"));
router.get("/students/count", notImplemented("GET /api/stats/students/count"));

export default router;
