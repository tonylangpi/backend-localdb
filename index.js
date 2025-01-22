import express from "express";
import morgan from "morgan";
import cors from "cors";
import {ClientRepository} from "./client-repository.js";


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
    credits} = req.body;

    try {
        const cliente = ClientRepository.crearUsuario({name, lastname, age, celphone, photo, dpi, credits});
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


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(" 🚀 El servidor ha despegado en el puerto ", port);
});