import { Router } from "express";
import { getWaste } from "../controllers/wasteController";

const router = Router();

router.get("/:id", getWaste);

export default router;
