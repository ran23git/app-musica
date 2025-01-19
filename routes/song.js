//importar dependencias
const express = require("express");


//cargar ROUTER
const router = express.Router();//y ya tengo acceso al Router para CREAR mis RUTAS

//importar mimddleware auth
const check = require("../middlewares/auth");

//importar CONTROLADOR
const SongController = require("../controllers/song");//y ya tengo acceso a todos los METODOS que tengo en mi controlador de SONGS
const { prueba } = require("../controllers/song");
const { uploadSong, audio } = require("../controllers/song"); // Debes importar desde 'song' y no 'album'
const upload = require("../config/multerConfig"); // Asegúrate de que 'multerConfig' esté correctamente configuradoxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//definir RUTAS
router.get("/prueba", SongController.prueba);
router.post("/save", check.auth, SongController.save);  
router.get("/one/:id", check.auth, SongController.one);  
router.get("/list/:albumId", check.auth, SongController.list);  
router.put("/update/:id", check.auth, SongController.update);  
<<<<<<< HEAD
router.delete("/remove/:id", check.auth, SongController.remove);  
=======
router.delete("/remove/:id", check.auth, SongController.remove);


// Para subir la canción
router.put('/upload/:id', [check.auth, upload.single('file0')], SongController.uploadSong);
router.get('/audio/:file', SongController.audio);
>>>>>>> e06abdaa1da064075d6ad77fa056473ae7f0bbf6

//exportar ROUTES
module.exports = router;

