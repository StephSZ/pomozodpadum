import { Router } from "express";
import { analyzeWaste } from "../controllers/analyzeController";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", upload.single("image"), analyzeWaste);

export default router;
