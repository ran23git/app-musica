//importar dependencias
const express = require("express");
const ArtistController = require("../controllers/artists");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS
const check = require("../middlewares/auth");

//importar CONTROLADOR
const AlbumController = require("../controllers/album");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de USUARIO
const { prueba } = require("../controllers/album");

//definir RUTAS
router.get("/prueba", AlbumController.prueba)
router.post("/save", check.auth, AlbumController.save);  //grabar album
router.get("/one/:id", check.auth, AlbumController.one);  //recuperar 1 album
router.get("/list/:artistId", check.auth, AlbumController.list);  //recuperar TODOS los albums

//exportar ROUTES
module.exports = router;