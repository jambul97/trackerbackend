import TrakingController from "../controller/trakingcontroller.js"
import express from "express";

const router = express.Router();

router.post("/create", TrakingController.CreateTrakingController);
router.post("/batch", TrakingController.InsertTrakingBatchController);
router.get("/getall", TrakingController.GetTrakingController);
router.get("/user/:user_id", TrakingController.GetTrakingByUserIdController);

export default router;
