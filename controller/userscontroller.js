import UsersService from "../service/usersservice.js"

class UsersController {
 async SignUpUserController(req, res) {
  try {
   const {nama, alamat, tanggal_lahir, umur, username, email, password, telepon} = req.body
   const user = await UsersService.SignUpUserService({
    nama,
    alamat,
    tanggal_lahir,
    umur,
    username,
    email,
    password,
    telepon
   })
   res.status(201).json({
    success: true,
    message: "Berhasil membuat akun",
    token: user.token
   })
  } catch (error) {
   return res.status(400).json({message: error.message})
  }
 }

 async LoginUserController(req, res) {
  try {
   const {usernameOremail, password} = req.body
   const user = await UsersService.LoginUserService({usernameOremail, password})
   res.status(200).json({
    success: true,
    message: "Berhasil login",
    token: user.token,
    user: {
     username: user.username,
     user_id: user.user_id
    }
   })
  } catch (error) {
   return res.status(400).json({message: error.message})
  }
 }
}
export default new UsersController()
