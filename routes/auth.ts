import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.post("/login", notImplemented("POST /api/auth/login"));
router.post("/register", notImplemented("POST /api/auth/register"));

export default router;
