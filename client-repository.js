import DBLocal from "db-local";
const { Schema } = new DBLocal({path:'./db'})
import crypto from 'crypto';

// Definición del esquema del cliente
const Client = Schema('Client', {
    _id: { type: String },
    name: { type: String },
    lastname: { type: String },
    age: { type: Number },
    celphone: { type: String },
    photo: { type: String },
    dpi: { type: String },
    email: { type: String },
    credits:{ type: Array, default: [
        {
            _id: { type: String },
            monto: { type: Number },
            montoAtrasado: { type: Number },
            Mora: { type: Number },
            OtrosCargos: { type: Number },
            Total: { type: Number },
        }
    ]},
});

export class ClientRepository {
    static crearUsuario({ name, lastname, age, celphone, photo, dpi,email, credits }) {
       // Validar si el cliente ya existe
       const existingUser = Client.findOne({ dpi });
       if (existingUser) {
           throw new Error('Client already exists');
       }

       // Generar ID único para el usuario
       const idUser = crypto.randomUUID();

       // Validar y procesar créditos
       const mappedCredits = credits.map((credit) => {
           if (
               typeof credit.monto !== 'number' ||
               typeof credit.montoAtrasado !== 'number' ||
               typeof credit.Mora !== 'number' ||
               typeof credit.OtrosCargos !== 'number' ||
               typeof credit.Total !== 'number'
           ) {
               throw new Error('Invalid credit format');
           }
           return {
               _id: crypto.randomUUID(),
               ...credit,
           };
       });

       // Crear el usuario con los créditos procesados
       Client.create({
           _id: idUser,
           name,
           lastname,
           age,
           celphone,
           photo,
           dpi,
           email,
           credits: mappedCredits, // Guardar los créditos como array genérico
       }).save();

       return idUser;
    }

    static obtenerUsuario(dpi) {
        const client = Client.findOne({ dpi });
        return client
    }

    static obtenerUsuarios() {
        return Client.find();
    }

    static actualizarCreditos(idCredit, monto, DPI) {
        const user = Client.findOne({ dpi: DPI });
        if (!user) {
            throw new Error('User not found');
        }
        const credits = user.credits;
        const credit = credits.find(credit => credit._id.toString() === idCredit.toString());
        
        if (!credit) {
            throw new Error('Credit not found');
        }
        
        // Actualizar el monto del crédito
        credit.Total = credit.Total - monto;
         user.save();
        
        return true;
    }

    static obtenerCreditosPorUsuario(DPI) {
        const user = Client.findOne({ dpi: DPI });
        if (!user) {
            throw new Error('User not found');
        }
        return user.credits;
    }

    static searchCreditById(idCredit, DPI) {
        const user = Client.findOne({ dpi: DPI });
        if (!user) {
            throw new Error('User not found');
        }
        const credits = user.credits;
        const credit = credits.find(credit => credit._id.toString() === idCredit.toString());
        
        if (!credit) {
            throw new Error('Credit not found');
        }
        return credit;
    }
}
