import { Router } from "express";
import { getAllTips, getTodayTip } from "../controllers/tipsController";

const router = Router();

router.get("/", getAllTips);
router.get("/today", getTodayTip);

export default router;
