//importar la BASE de DATOS
const connection = require("./database/conection");

//Importar DEPENDENCIAS
const express = require("express");
const cors = require("cors");

//Mensaje de bienvenida
console.log("API REST con Node para la app d musica arrancada!!!"); 

//Ejecutar la CONEXION a la BASE de DATOS
connection();

//crear SERVIDOR de NODE
const app = express();
const port = 3910;

//configuarar el CORS
app.use(cors());//con esto ejecuto el cors antes de ejecutar cualquier ruta


app.use(express.json());//convierte los datos del BODY de cada una de las peticiones a OBJETOS js
app.use(express.urlencoded({extended: true}));//tambien cuando reciba datos en URLENCODED

//cargar la configurtacion de RUTAS
app.get("/ruta-probando", (req, res)=> { //app es EXPRESS y get permite solicitar informacion del backend, es decir una RUTA normal
//y creo la ruta-probando
    return res.status(200).send({
        "id": 12,
        "nombre":"Victor",
        "apellido": "Robles"  
    });
});


//ruta de prueba

//poner el SERVIDOR a escuchar peticiones HTP
//crear servidor y escuchar peticiones http (al 1°parametro le paso elpuerto, el 2° parametro es 1 callback q envia mensaje)
app.listen(port,() =>{
    console.log("el SERVIDOR de NODE esta corriendo en el puerto " + port);
}); 

  