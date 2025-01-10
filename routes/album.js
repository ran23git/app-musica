//importar dependencias
const express = require("express");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar CONTROLADOR
const AlbumController = require("../controllers/album");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de USUARIO
const { prueba } = require("../controllers/album");

//definir RUTAS
router.get("/prueba", AlbumController.prueba)

//exportar ROUTES
module.exports = router;