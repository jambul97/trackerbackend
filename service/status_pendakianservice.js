import StatusPendakianModel from "../model/status_pendakianmodel.js"
import {getLocalTimestamp} from "../utils/time.js"

class StatusPendakianService {
 async EnsureTodayStatusExists() {
  const today = new Date().toISOString().slice(0, 10)
  const existing = await StatusPendakianModel.GetStatusHariIniModel()
  if (!existing) {
   await StatusPendakianModel.UpsertStatusKuotaManual({
    tanggal_pendakian: today,
    status: "Dibuka",
    kuota_max: 500 // Default
   })
  }
 }

 async GetStatusKuotaHariIniService() {
  try {
   await this.EnsureTodayStatusExists()
   const statusRow = await StatusPendakianModel.GetStatusHariIniModel()
   console.log("statusrow", statusRow)

   const totalPeserta = await StatusPendakianModel.HitungJumlahPesertaHariIni()

   const kuota_tersisa = statusRow.kuota_max - totalPeserta

   const status_dinamis = statusRow.status === "Ditutup" ? "Ditutup" : kuota_tersisa <= 0 ? "Ditutup" : "Dibuka"

   const payload = {
    tanggal_pendakian: new Date().toISOString().slice(0, 10),
    status: status_dinamis,
    kuota_max: statusRow.kuota_max,
    kuota_terpakai: totalPeserta,
    kuota_tersisa: Math.max(0, kuota_tersisa),
    updated_at: statusRow.updated_at
   }
   console.log('payload', payload)
   return payload
  } catch (err) {
   console.log("from service", err)
   throw new Error(err.message)
  }
 }

 async UpsertStatusKuotaManualToday({status}) {
  try {
   const today = new Date().toISOString().slice(0, 10)
   const existing = await StatusPendakianModel.GetStatusHariIniModel()
   if (!existing) {
    throw new Error("Kuota maksimal belum diatur sebelumnya.")
   }

   const kuota_max = existing.kuota_max
   return await StatusPendakianModel.UpsertStatusKuotaManual({
    tanggal_pendakian: today,
    status,
    kuota_max,
    updated_at: new Date().toISOString()
   })
  } catch (err) {
   console.log("from service", err)
   throw new Error(err.message)
  }
 }
}

export default new StatusPendakianService()
