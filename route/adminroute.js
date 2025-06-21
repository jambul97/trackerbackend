import AdminController from "../controller/admincontroller.js"
import express from "express"

const router = express.Router()

router.post("/signup", AdminController.SignupController)
router.post("/login", AdminController.LoginController)

export default router
