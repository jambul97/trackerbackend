import StatusPendakianService from "../service/status_pendakianservice.js"


class StatusPendakianController {
 async GetStatusKuotaController(req, res) {
  try {
   const result = await StatusPendakianService.GetStatusKuotaHariIniService()
   res.json({success: true, data: result})
  } catch (err) {
   console.log(err)
   res.status(400).json({success: false, message: err.message})
  }
 }

 async UpsertStatusKuotaController(req, res) {
  try {
   const {status} = req.body
   if (!status) {
    return res.status(400).json({success: false, message: "Status wajib diisi"})
   }

   const result = await StatusPendakianService.UpsertStatusKuotaManualToday({status})
   res.json({success: true, data: result})
  } catch (err) {
   res.status(400).json({success: false, message: err.message})
  }
 }
}

export default new StatusPendakianController()

