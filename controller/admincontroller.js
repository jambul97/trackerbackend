import AdminService from "../service/adminservice.js"

class AdminController {
 async SignupController(req, res) {
  try {
   const {username, email, password} = req.body
   console.log("from controller", req.body)
   const adminData = await AdminService.SignupService({username, email, password})
   console.log("from controller", adminData)
   res.status(200).json({messege: "Admin berhasil didaftarkan", data: adminData})
  } catch (error) {
   console.log(error.message)
   res.status(500).json({messege: error.message})
  }
 }
 async LoginController(req, res) {
  try {
   const {username, password} = req.body
   console.log("FROM CONTROLLER REQ", req.body)

   const admin = await AdminService.LoginService({username, password})
   const {token, ...adminData} = admin

   res.status(200).json({
    message: "Admin berhasil login",
    token,
    admin: adminData
   })
  } catch (error) {
   console.log("error from controller", error.message)
   res.status(400).json({message: error.message})
  }
 }
}
export default new AdminController()
