import { Router } from "express";
import {
  getAllTips,
  getCurrentSeasonalTips,
  getTodayTip,
} from "../controllers/tipsController";

const router = Router();

router.get("/", getAllTips);
router.get("/today", getTodayTip);
router.get("/seasonal", getCurrentSeasonalTips);

export default router;
