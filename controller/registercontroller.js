import {register} from "module"
import RegisterService from "../service/registerservice.js"

class RegisterController {
 async CreateRegisterController(req, res) {
  try {
   const users_booking_id = req.user.userId // ✅ dari JWT melalui middleware
   const result = await RegisterService.CreateRegisterService({
    ...req.body,
    users_booking_id // ✅ tambahkan ini
   })

   res.status(201).json({success: true, register: result})
  } catch (err) {
   res.status(400).json({success: false, message: err.message})
  }
 }

 async GetAllRegisterController(req, res) {
  try {
   const result = await RegisterService.GetAllRegisterService()
   res.status(200).json({success: true, register: result})
  } catch (err) {
   res.status(400).json({success: false, message: err.message})
  }
 }

//  async GetRegisterByIdController(req, res) {
//   try {
//    const user_id = req.user.userId // ✅ dari JWT
//    const result = await RegisterService.GetRegisterByUserService(user_id)
//    res.status(200).json({success: true, data: result})
//   } catch (err) {
//    res.status(400).json({success: false, message: err.message})
//   }
//  }

 async ApproveRegisterController(req, res) {
  try {
   const {register_id} = req.params
   const result = await RegisterService.ApproveRegisterService(register_id)
   res.status(200).json({success: true, message: "Grup disetujui dan akun dikirim", register: result})
  } catch (err) {
   res.status(400).json({success: false, message: err.message})
  }
 }
}

export default new RegisterController()
