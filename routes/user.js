//importar dependencias
const express = require("express");
const check = require("../middlewares/auth");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar CONTROLADOR
const UserController = require("../controllers/user");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de USUARIO
const { register } = require("../controllers/user");


//####################################################################################
        //A-configuracion de subida del metodo disskStorage (MULTER)
        const multer = require("multer"); //permite subir archivos al servidor
        const storage = multer.diskStorage({//storage es donde se guardaran los archivos
            destination: (req, file,cb) => {
                    cb (null, "./uploads/avatars/") //destination indica a multer DONDE se guardaran las imagenes
            },

            filename: (req, file,cb) => {//filename dice cual sera el NOMBRE de cada 1 de mis archivos
                cb (null, "avatar."+Date.now()+"-"+file.originalname) 
            }
        })
        //B- ahora APLICO esa configuracion al MULTER creando el MIDDLEWARE uploads
        const uploads = multer({storage});
//####################################################################################

//definir RUTAS
router.post("/register",                 UserController.register);  //guarda    info en backend
router.post("/login",                    UserController.login);     //Lee       info en backend

router.get("/profile/:id", check.auth,   UserController.profile);   //Lee       info en backend de UN usuario
router.put("/update", check.auth,   UserController.update);         //Actualiza info usuario
//router.get("/avatar/:file", check.auth,   UserController.avatar); 
router.post("/upload/", [check.auth, uploads.single("file0")],   UserController.upload);  //sube imagen

//exportar ROUTES
module.exports = router;