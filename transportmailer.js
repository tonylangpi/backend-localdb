import nodemailer from 'nodemailer';
import { config } from "dotenv";
config();

const {USER_EMAIL,
  USER_PASSWORD} = process.env;

 export  let transporter = nodemailer.createTransport({
   service: "Outlook365",
   host: "smtp.office365.com",
   port: "587",
   tls: {
     ciphers: "SSLv3",
     rejectUnauthorized: false,
   },
   auth: {
     user: USER_EMAIL,
     pass: USER_PASSWORD,
   },
 });
  
  transporter.verify().then(()=>{

    console.log('Listo para enviar Correo');

  })