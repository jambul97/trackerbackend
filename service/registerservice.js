import RegisterModel from "../model/registermodel.js"
import UsersService from "./usersservice.js"
import {generateAndUploadPDF} from "../utils/pdf.js"
import {sendLoginEmail, sendBookingEmail} from "../utils/sendemail.js"

class RegisterService {
 async CreateRegisterService({
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
  try {
   const newRegister = await RegisterModel.CreateRegisterModel({
    nama,
    telepon,
    alamat,
    tanggal_pendakian,
    tanggal_turun,
    no_ktp,
    jumlah_anggota,
    peserta,
    users_booking_id
   })
   return newRegister
  } catch (error) {
   throw new Error(error.message)
  }
 }

 async GetAllRegisterService() {
  try {
   const allRegister = await RegisterModel.GetAllRegisterModel()
   return allRegister
  } catch (error) {
   throw new Error(error.message)
  }
 }

//  async GetRegisterByIdService(register_id) {
//   try {
//    const register = await RegisterModel.GetRegisterByIdModel(register_id)
//    return register
//   } catch (error) {
//    throw new Error(error.message)
//   }
//  }

 async ApproveRegisterService(register_id) {
  const register = await RegisterModel.GetRegisterByIdModel(register_id)
  if (register.status === "diterima") {
   throw new Error("Booking Sudah disetujui Silahkan Cek email anda")
  }
  const pesertaList = register.peserta

  if (!Array.isArray(pesertaList) || pesertaList.length === 0) {
   throw new Error("Data peserta tidak valid atau kosong")
  }

  const createdUsers = []
  const errors = []

  for (const peserta of pesertaList) {
   try {
    // Validasi dasar email (opsional)
    if (!peserta.email || !peserta.email.includes("@gmail.com")) {
     throw new Error("Email peserta tidak valid")
    }

    // Generate unik username
    const username = peserta.nama.replace(/\s+/g, "") + Math.floor(Math.random() * 10000)
    const password = Math.random().toString(36).slice(-8)

    // Simpan user
    await UsersService.SignUpUserService({
     ...peserta,
     username,
     password,
     register_id
    })

    // Kirim email
    await sendLoginEmail({
     email: peserta.email,
     nama: peserta.nama,
     username,
     password
    })

    createdUsers.push({nama: peserta.nama, username, email: peserta.email})
   } catch (err) {
    errors.push({nama: peserta.nama, error: err.message})
   }
  }

  // Setelah loop selesai, lanjut kirim email booking dan update register
  const pdfUrl = await generateAndUploadPDF({
   register: {
    nama: register.nama,
    email: register.users_booking.email,
    telepon: register.telepon,
    alamat: register.alamat,
    tanggal_pendakian: register.tanggal_pendakian,
    tanggal_turun: register.tanggal_turun,
    no_ktp: register.no_ktp,
    jumlah_anggota: register.jumlah_anggota,
    peserta: register.peserta
   },
   pesertaList: pesertaList
  })

  console.log("📄 Akan kirim PDF dari URL:", pdfUrl)

  await sendBookingEmail({
   email: register.users_booking.email,
   nama: register.nama,
   pdfUrl
  })

  await RegisterModel.ApproveRegisterModel(register_id, pdfUrl)

  return {
   message: "Proses approval selesai",
   berhasil: createdUsers.length,
   gagal: errors.length,
   errors // detail error peserta
  }
 }
}

export default new RegisterService()
