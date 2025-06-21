import AdminService from "../service/adminservice.js"

class AdminController {
    async SignupController(req, res) {
        try {
            const {username, email, password} = req.body
            const adminData = await AdminService.SignupService({username, email, password})
            res.status(200).json({messege: "Admin berhasil didaftarkan", data: adminData})
        } catch (error) {
            res.status(500).json({messege: error.message})
        }
    }
    async LoginController(req, res) {
        try {
            const {usernameOremail, password} = req.body
            const {token, admin} = await AdminService.LoginService({usernameOremail, password})
            res.status(200).json({messege: "Admin berhasil login", data: {token, admin}})
        } catch (error) {
            res.status(500).json({messege: error.message})
        }
    }
}
export default new AdminController()



