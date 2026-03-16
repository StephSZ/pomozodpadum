import { Router } from "express";
import { getCatalog, getCatalogItem } from "../controllers/catalogController";

const router = Router();

router.get("/", getCatalog);
router.get("/:id", getCatalogItem);

export default router;
