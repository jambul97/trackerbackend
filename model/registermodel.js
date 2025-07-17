import db from "../config/db.js"

class RegisterModel {
 async CreateRegisterModel({
  nama,
  telepon,
  alamat,
  tanggal_pendakian,
  tanggal_turun,
  no_ktp,
  jumlah_anggota,
  peserta,
  users_booking_id
 }) {
  const {data, error} = await db
   .from("register")
   .insert([
    {
     nama,
     telepon,
     alamat,
     tanggal_pendakian,
     tanggal_turun,
     no_ktp,
     jumlah_anggota,
     peserta,
     status: "perlu verifikasi",
     users_booking_id
    }
   ])
   .select()
   .single() // ✅ tambahkan ini

  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async GetAllRegisterModel() {
  const {data, error} = await db.from("register").select("*")
  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async GetRegisterByIdModel(register_id) {
  const {data, error} = await db
   .from("register")
   .select(
    `*,
            users_booking: users_booking (
            email
            )
            `
   )
   .eq("register_id", register_id)
   .maybeSingle()
  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async ApproveRegisterModel(register_id, pdfUrl) {
  const {data, error} = await db
   .from("register")
   .update({
    status: "diterima",
    bukti_booking: pdfUrl // ✅ penting!
   })
   .eq("register_id", register_id)
   .select()

  if (error) throw new Error(error.message)
  return data
 }

 async RejectRegisterModel(register_id) {
  const {data, error} = await db.from("register").update({status: "ditolak"}).eq("register_id", register_id)
  if (error) {
   throw new Error(error.message)
  }
  return data
 }

 async GetStatusRegisterModel() {
  const {data, error} = await db.from("register").select("status").eq("status", "diterima").or("status.eq.ditolak")
  if (error) {
   throw new Error(error.message)
  }
  return data
 }
}

export default new RegisterModel()
