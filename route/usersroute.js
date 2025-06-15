import UsersController from '../controller/userscontroller.js'
import UsersMiddleware from '../middleware/users.js'
import express from 'express'

const router = express.Router()

router.post("/signup", UsersMiddleware.SignupUserMiddleware, UsersController.SignUpUserController)
router.post("/login", UsersMiddleware.LoginUserMiddleware, UsersController.LoginUserController)

export default router



