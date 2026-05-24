import { Router } from "express";
import * as batchController from "../controller/batch.controller.ts";


const router = Router();

router.get("/", batchController.getAllBatches);
router.post("/", batchController.createBatch);
router.get("/:batchId", batchController.getBatchById);
router.patch("/:batchId", batchController.updateBatch);

export default router;