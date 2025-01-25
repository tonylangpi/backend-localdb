import express from "express";
import morgan from "morgan";
import cors from "cors";
import {ClientRepository} from "./client-repository.js";
import {transporter} from "./transportmailer.js"



const app = express();

app.use(express.static("public"));
app.use(cors()); 
app.use(morgan("dev"));
app.use(express.json());


app.get("/client", (req,res) => {
    res.send("Hola desde el cliente");
}
);

app.post("/createClient", (req,res) => {
    const {
    name,
    lastname,
    age,
    celphone,
    photo,
    dpi,
    email,
    credits} = req.body;

    try {
        const cliente = ClientRepository.crearUsuario({name, lastname, age, celphone, photo, dpi, email, credits});
        res.send("creado");
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
);

app.get("/client/:DPI", async (req, res) => {
    const { DPI } = req.params;
    try {
        const client = await ClientRepository.obtenerUsuario(DPI);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(200).json({ message: "No se encontro usuario con ese DPI" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/clients", (req,res) => {
    try {
        const clients = ClientRepository.obtenerUsuarios();
        res.json(clients);
        
    } catch (error) {
        res.status(400).json({error: error.message});
    }
   
});

app.get("/creditsClient/:DPI", async (req, res) => {
    const { DPI } = req.params;
    try {
        const client = await ClientRepository.obtenerCreditosPorUsuario(DPI);
        if (client) {
            res.status(200).json(client);
        } else {
            res.status(200).json({ message: "No se encontro usuario con ese DPI" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/update", async(req,res) => {
    const {idCredit, monto, DPI, email} = req.body;
    try {
        const client = ClientRepository.actualizarCreditos(idCredit, monto, DPI);
        const infoClient = ClientRepository.obtenerUsuario(DPI);
        const htmlContent = `<b>
        Info Cliente: ${infoClient.name}  ${infoClient.lastname} con dpi ${DPI},
        Ha pagado el monto de ${monto} en su crédito
       </b>`;
       const info = await transporter.sendMail({
           from: 'Bantrab <2020-010432@intecap.edu.gt>',
           to: email, // Usando el correo electrónico del destinatario proporcionado
           subject: "Pago de Crédito Comprobante ✔",
           html: htmlContent,
       });
       console.log(info)
        res.status(200).json({message: client});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

app.post("/emailAgent", async(req,res) => {
    const {email, creditNumber, DPI, Message} = req.body;
    
    try {
        const credit = ClientRepository.searchCreditById(creditNumber, DPI);
        const client = ClientRepository.obtenerUsuario(DPI);
        const htmlContent = `<b>
         El cliente ${client.name}  ${client.lastname} con dpi ${DPI},
         te ha contactado para revision de su credito, el mensaje del cliente es el siguiente:
         ${Message}
        </b>
        <h3>Contacta con el cliente por medio telefonico: ${client.celphone}</h3>`;
        const info = await transporter.sendMail({
            from: 'Bantrab <2020-010432@intecap.edu.gt>',
            to: email, // Usando el correo electrónico del destinatario proporcionado
            subject: "Derivar caso Agente ✔",
            html: htmlContent,
        });
        res.status(200).json({status: true})
        //res.status(200).json({message: client});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(" 🚀 El servidor ha despegado en el puerto ", port);
});