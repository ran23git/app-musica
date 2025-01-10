//importar dependencias
const express = require("express");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar CONTROLADOR
const UserController = require("../controllers/user");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de USUARIO
const { prueba } = require("../controllers/user");

//definir RUTAS
router.get("/prueba", UserController.prueba)

//exportar ROUTES
module.exports = router;