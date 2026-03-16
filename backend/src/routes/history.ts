import { Router } from "express";
import {
  clearHistory,
  deleteHistoryItem,
  getHistory,
} from "../controllers/historyController";

const router = Router();

router.get("/", getHistory);
router.delete("/:id", deleteHistoryItem);
router.delete("/", clearHistory);

export default router;
