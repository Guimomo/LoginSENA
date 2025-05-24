import bodyParser from 'body-parser';
import express, { response } from 'express';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const app = express();

app.use(bodyParser.json());


app.use(express.urlencoded({extended:true}));

app.post ('/login', async (req,res)=>{
    //console.log("hola mundo");

    const email = req.body.email;
    const password = req.body.pass_word;
    //const contrasena = await bcrypt.hash(password, 10);
    

    console.log(email,password);

    const [rows] = await conexion.query ("Select * from usuarios where email = ?", [email]);

    console.log(rows);

    const esValido = wait bcrypt.compare(password, usuario.pass_word);
    if (esValido){

        console.log('Autenticado');
        
    } else {

        console.log('no autenticado');
        
    }
    

    return res.json ({"hola" : "mundo"});
    
});

app.post('/registro', async (req,res)=>{

    const nombre = req.body.nombre;
    const correo = req.body.email;
    const contrasena = req.body.pass_word;
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    console.log(nombre,correo,contrasenaHash);
    response = conexion.query("insert into usuarios(nombre, email, pass_word) values (?,?,?)", [nombre, correo, contrasenaHash]);
    console.log(response);
    return res.json ({"registro" : true});

});

const conexion = await mysql.createConnection({

    host: "localhost",
    user: "Guille_2824003",
    password:"Aprendiz2025",
    database: "node_2824003",

});

app.listen(3000)