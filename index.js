//importar la BASE de DATOS
const connection = require("./database/conection");

//Importar DEPENDENCIAS
const express = require("express"); //framework web que se usará para gestionar las rutas y peticiones.
const cors    = require("cors");   //paquete que ayuda a permitir solicitudes de otros dominios

//Mensaje de bienvenida
console.log("API REST con Node para la app d musica arrancada!!!"); 

//Ejecutar la CONEXION a la BASE de DATOS
connection();//Se ejecuta la función de conexión a la base de datos para que la aplicación se conecte a la base de datos al iniciar.

//crear SERVIDOR de NODE
const app = express(); //se crea una instancia de la aplicación Express (app)
const port = 3910;

//configuarar el CORS
app.use(cors());//con esto ejecuto el cors antes de ejecutar cualquier ruta
//Se configura CORS (Cross-Origin Resource Sharing) para permitir que las peticiones a la API puedan ser realizadas desde otros dominios.
//  Esto es necesario para que tu API pueda ser consumida desde navegadores que ejecutan aplicaciones en otros dominios.

app.use(express.json());//convierte los datos del BODY de cada una de las peticiones a OBJETOS js
app.use(express.urlencoded({extended: true}));//tambien cuando reciba datos en x-www-form-urlencoded

//cargar la configurtacion de RUTAS
//Se importan las rutas para user, artists, album y song. 
// Cada uno de estos archivos de rutas define las rutas específicas para esas entidades dentro de la API.
const UserRoutes    = require("./routes/user");   //cargue asi el archivo de rutas de user
const ArtistsRoutes = require("./routes/artists");//cargue asi el archivo de rutas de artists
const AlbumRoutes   = require("./routes/album");  //cargue asi el archivo de rutas de album
const SongRoutes    = require("./routes/song");   //cargue asi el archivo de rutas de song

//usaer esas rutas dentro de expres con use
//Se asocian las rutas importadas a la aplicación Express utilizando app.use(). Esto le dice a Express que 
// cuando una solicitud llegue a una de las rutas prefijadas (/api/user, /api/artists, etc.), debe utilizar
//  las rutas definidas en los archivos correspondientes.
app.use("/api/user",       UserRoutes);
app.use("/api/artists", ArtistsRoutes);
app.use("/api/album",     AlbumRoutes);
app.use("/api/song",       SongRoutes);




//se ARRANCA el SERVIDOR!!!
//poner el SERVIDOR a escuchar peticiones HTP
//crear servidor y escuchar peticiones http (al 1°parametro le paso elpuerto, el 2° parametro es 1 callback q envia mensaje)
app.listen(port,() =>{
    console.log("el SERVIDOR de NODE esta corriendo en el puerto " + port);
}); 

  