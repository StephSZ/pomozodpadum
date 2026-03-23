import { Router } from "express";
import {
  getGlossary,
  getGlossaryTerm,
  searchGlossary,
} from "../controllers/glossaryController";

const router = Router();

router.get("/", getGlossary);
router.get("/search", searchGlossary);
router.get("/:id", getGlossaryTerm);

export default router;
