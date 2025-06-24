import AdminController from "../controller/admincontroller.js"
import express from "express"

const router = express.Router()

router.post("/login", AdminController.LoginController)
router.post("/signup", AdminController.SignupController)


export default router
