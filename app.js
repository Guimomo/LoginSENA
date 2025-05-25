import bodyParser from 'body-parser';
import express, { response } from 'express';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import Jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());

app.use(express.urlencoded({extended:true}));

const validarToken = (req, res, nex) => {

    try {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.json({
            "mensaje": "solicitud sin token"
        });
    }

    const token = authHeader.split("  ")[1];
    const decode = Jwt.verify(token, 'secret');
    nex();
        
    } catch (error) {
        
        return res.json({
            "mensaje": "Token inválido o expirado"
        });
    }

    //console.log(req.headers.authorization)

}

const validarRefreshToken = (req, res, nex) => {

    try {

    const authHeader = req.headers.authorization;
    const correo = req.body.email;
    if (!authHeader || !authHeader.startsWith("Bearer  ")){
        return res.json({
            "mensaje": "solicitud sin token"
        });
    }
    const token = authHeader.split("  ")[1];
    const decode = Jwt.verify(token, 'secretRefresh');

    console.log(decode.data, correo);
    
    if( decode.data === correo ){

    }

    nex();
        
    } catch (error) {
        
        return res.json({
            "mensaje": "Refresh token invalido"
        });
    }
}

app.post ('/login', async (req,res)=>{
    //console.log("hola mundo");
    
    const correo = req.body.email;
    const contrasena = req.body.pass_word;

    const [rows] = await conexion.query ("Select * from usuarios where email = ?", [correo]);

    const esValido = await bcrypt.compare(contrasena, rows[0].pass_word);
    if (esValido) {
        console.log(rows[0]);
        
       const token = generarToken(rows[0]);
       const refresToken = refreshToken(rows[0]);
       const dbRefreshtoken = await conexion.query("UPDATE usuarios SET refresh_token = ? WHERE email = ?" , [refresToken,correo ])
       return res.json({
        mensaje : "Usuario Autenticado",
        token: token,
        refresToken : refresToken
       });
    } else {
        const token = generarToken();
        const refresToken = refreshToken();
        return res.json({
        mensaje : "Usuario No Autenticado",

       });
    }         
    //return res.json ({"hola" : "mundo"});
    
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

app.get('/privada', validarToken, (req, res) =>{
    return res.json({
        "mensaje": "Ingresamos a ruta privada"
    });
});

app.post('/refrescar', validarRefreshToken, (req, res) =>{

    return res.json({
        "mensaje": "Ingresamos a ruta refrescar"
    });
});

const conexion = await mysql.createConnection({

    host: "localhost",
    user: "Guille_2824003",
    password:"Aprendiz2025",
    database: "node_2824003",
});


const generarToken =(usuario)=>{
    
    return Jwt.sign({
        usuario 
    }, 'secret', {expiresIn: '1h'})

}

const refreshToken = (usuario) => {

    return Jwt.sign({
    //data: usuario.email 
    usuario
    }, 'secretRefresh', { expiresIn: '7d' });
}

//basado en el refresh que dura 7d tengo que volver actualizar el token

app.listen(3000)