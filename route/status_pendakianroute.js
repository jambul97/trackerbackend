import express from "express"
import StatusPendakianController from "../controller/status_pendakiancontroller.js"

const router = express.Router()

// Ambil status otomatis harian (untuk homepage simaksi)
router.get("/status", StatusPendakianController.GetStatusKuotaController)

// Admin override status (open/tutup)
router.post("/status", StatusPendakianController.UpsertStatusKuotaController)

export default router
