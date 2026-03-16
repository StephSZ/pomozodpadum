import { Router } from "express";
import {
  getAllContainers,
  getContainer,
} from "../controllers/containersController";

const router = Router();

router.get("/", getAllContainers);
router.get("/:type", getContainer);

export default router;
