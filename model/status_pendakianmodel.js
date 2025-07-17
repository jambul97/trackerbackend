import db from "../config/db.js"

class StatusPendakianModel {
 async GetStatusHariIniModel() {
  const today = new Date().toISOString().slice(0, 10)
  console.log("Tanggal yang dicek:", today)
  const {data, error} = await db.from("pendakian_status").select("*").eq("tanggal_pendakian", today).maybeSingle() // atau .order('id').limit(1).single() kalau duplikat

  if (error) {
   console.log("from controler", error)
   throw new Error(error.message)
  }
  console.log("from model", data)
  return data
 }

 async UpsertStatusKuotaManual({tanggal_pendakian, status, kuota_max}) {
  const {data, error} = await db
   .from("pendakian_status")
   .upsert([{tanggal_pendakian, status, kuota_max}], {onConflict: ["tanggal_pendakian"]})
  if (error) throw new Error(error.message)
  return data
 }

 async HitungJumlahPesertaHariIni() {
  const today = new Date().toISOString().slice(0, 10)
  const {data, error} = await db
   .from("register")
   .select("jumlah_anggota")
   .eq("tanggal_pendakian", today)
   .eq("status", "diterima")
  if (error) throw new Error(error.message)
  return data.reduce((sum, r) => sum + r.jumlah_anggota, 0)
 }
}

export default new StatusPendakianModel()
