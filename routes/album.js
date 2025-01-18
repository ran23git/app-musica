//importar dependencias
const express = require("express");
const ArtistController = require("../controllers/artists");

//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS
const check = require("../middlewares/auth");

//####################################################################################
        //A-configuracion de subida del metodo disskStorage (MULTER)
        const multer = require("multer"); //permite subir archivos al servidor
        const storage = multer.diskStorage({//storage es donde se guardaran los archivos
            destination: (req, file,cb) => {
                    cb (null, "./uploads/albums/") //destination indica a multer DONDE se guardaran las imagenes
            },

            filename: (req, file,cb) => {//filename dice cual sera el NOMBRE de cada 1 de mis archivos
                cb (null, "album-."+Date.now()+"-"+file.originalname) 
            }
        })
        //B- ahora APLICO esa configuracion al MULTER creando el MIDDLEWARE uploads
        const uploads = multer({storage});
//####################################################################################

//importar CONTROLADOR
const AlbumController = require("../controllers/album");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de USUARIO
const { prueba } = require("../controllers/album");

//definir RUTAS
router.get("/prueba", AlbumController.prueba)
router.post("/save", check.auth, AlbumController.save);  //grabar album
router.get("/one/:id", check.auth, AlbumController.one);  //recuperar 1 album
router.get("/list/:artistId", check.auth, AlbumController.list);  //recuperar TODOS los albums
router.put("/update/:albumId", check.auth, AlbumController.update);  //ACTUALIZA un album
router.post("/upload/:id", [check.auth, uploads.single("file0")],   AlbumController.upload);  //sube imagen
router.get("/image/:file",  AlbumController.image);   //Lee       info en backend de UN usuario

//exportar ROUTES
module.exports = router;