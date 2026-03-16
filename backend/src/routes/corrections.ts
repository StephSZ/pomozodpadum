import { Router } from "express";
import {
  getCorrections,
  submitCorrection,
} from "../controllers/correctionsController";

const router = Router();

router.post("/", submitCorrection);
router.get("/", getCorrections);

export default router;
