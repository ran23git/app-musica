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

//####################################################################################
        //A-configuracion de subida del metodo disskStorage (MULTER)
        const multer = require("multer"); //permite subir archivos al servidor
        const storage = multer.diskStorage({//storage es donde se guardaran los archivos
            destination: (req, file,cb) => {
                    cb (null, "./uploads/artists/") //destination indica a multer DONDE se guardaran las imagenes
            },

            filename: (req, file,cb) => {//filename dice cual sera el NOMBRE de cada 1 de mis archivos
                cb (null, "artist-."+Date.now()+"-"+file.originalname) 
            }
        })
        //B- ahora APLICO esa configuracion al MULTER creando el MIDDLEWARE uploads
        const uploads = multer({storage});
//####################################################################################

//definir RUTAS
//router.get("/prueba", ArtistController.prueba); //ArtistController.prueba está accediendo a la función prueba definida en controllers/artists.js.
console.log("Cargando rutas de artistas...");  // Agrega este log para verificar
router.post("/save", ArtistController.save);  //grabar artista
router.get("/one/:id", check.auth, ArtistController.one); //obtener artista
router.get("/list/:page?", check.auth, ArtistController.list); //listados de artistas
router.put("/update/:id", check.auth, ArtistController.update);  //editar artista
router.delete("/remove/:id", check.auth, ArtistController.remove);  //borrar artista
router.post("/upload/:id", [check.auth, uploads.single("file0")],   ArtistController.upload);  //sube imagen
router.get("/image/:file",  ArtistController.image);   //Lee       info en backend de UN usuario
//exportar ROUTES
module.exports = router;

