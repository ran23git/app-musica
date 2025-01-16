//importar dependencias
const express = require("express"); //importo express para crear las rutas de la API
const check = require("../middlewares/auth");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar CONTROLADOR
const ArtistController = require("../controllers/artists");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de ARTISTAS
//ArtistController es un objeto que agrupa las funciones o métodos que manejarán las solicitudes (requests) y respuestas (responses) para 
// la logica de las rutas relacionadas con los artistas
//ArtistController es el objeto que contiene la función prueba (y cualquier otra que agregues en el futuro en artists.js). 
// Y luego, en las rutas, puedes acceder a esas funciones usando ArtistController.<función>.

//const { prueba }       = require("../controllers/artists");//Desestructuración para importar SOLO y específicamente la función prueba del controlador de ARTISTAS
//es decir, De todo lo que se exporta en /controllers/artists.js, solo quiero la función prueba".

//definir RUTAS
//router.get("/prueba", ArtistController.prueba); //ArtistController.prueba está accediendo a la función prueba definida en controllers/artists.js.
console.log("Cargando rutas de artistas...");  // Agrega este log para verificar
router.post("/save", ArtistController.save);  //grabar artista
router.get("/one/:id", check.auth, ArtistController.one); //obtener artista
router.get("/list/:page?", check.auth, ArtistController.list); //listados de artistas
router.put("/update/:id", check.auth, ArtistController.update);  //editar artista

//exportar ROUTES
module.exports = router;

