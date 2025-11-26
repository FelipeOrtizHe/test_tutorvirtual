import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.post("/upload", notImplemented("POST /api/files/upload"));

export default router;
