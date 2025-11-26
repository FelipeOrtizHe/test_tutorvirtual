import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.post("/", notImplemented("POST /api/gemini"));

export default router;
