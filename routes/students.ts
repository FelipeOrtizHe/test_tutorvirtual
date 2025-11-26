import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.get("/materials", notImplemented("GET /api/students/materials"));
router.get("/activities", notImplemented("GET /api/students/activities"));
router.get("/calendar", notImplemented("GET /api/students/calendar"));
router.post(
  "/chatStudents/chat",
  notImplemented("POST /api/students/chatStudents/chat")
);

export default router;
