import { Router } from "express";
import { notImplemented } from "./utils";

const router = Router();

router.get("/", notImplemented("GET /api/news"));

export default router;
