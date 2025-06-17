import UsersController from '../controller/userscontroller.js'
import UsersMiddleware from '../middleware/users.js'
import express from 'express'

const router = express.Router()

router.post("/signup", UsersMiddleware.SignupUserMiddleware, UsersController.SignUpUserController)
router.post("/login", UsersMiddleware.LoginUserMiddleware, UsersController.LoginUserController)
router.post("/google-login", UsersController.GoogleLoginController)
router.get("/", UsersController.GetAllUserController)
router.get("/:user_id", UsersController.GetUserByIdController)
router.delete("/:user_id", UsersController.DeleteUserController)
router.put("/:user_id",  UsersController.UpdateUserController)
router.post("/reset-password",  UsersController.ResetPasswordController)



export default router



