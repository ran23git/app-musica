//importar dependencias
const express = require("express");


//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar mimddleware auth
const check = require("../middlewares/auth");

//importar CONTROLADOR
const SongController = require("../controllers/song");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de SONGS
const { prueba } = require("../controllers/song");
 
//definir RUTAS
router.get("/prueba", SongController.prueba);
router.post("/save", check.auth, SongController.save);  
router.get("/one/:id", check.auth, SongController.one);  
router.get("/list/:albumId", check.auth, SongController.list);  
router.put("/update/:id", check.auth, SongController.update);  

//exportar ROUTES
module.exports = router;