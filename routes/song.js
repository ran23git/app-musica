//importar dependencias
const express = require("express");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar CONTROLADOR
const SongController = require("../controllers/song");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de SONGS
const { prueba } = require("../controllers/song");
 
//definir RUTAS
router.get("/prueba", SongController.prueba)

//exportar ROUTES
module.exports = router;