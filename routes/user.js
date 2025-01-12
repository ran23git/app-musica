//importar dependencias
const express = require("express");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar CONTROLADOR
const UserController = require("../controllers/user");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de USUARIO

const { register } = require("../controllers/user");

//definir RUTAS
router.post("/register", UserController.register);//guarda info en backend
router.post("/login",    UserController.login);   //Lee    info en backend

router.get("/profile/:id",    UserController.profile);   //Lee    info en backend de UN usuario

//exportar ROUTES
module.exports = router;