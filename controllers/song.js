const Song = require("../models/song");
<<<<<<< HEAD
const mongoose = require('mongoose');
=======
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const upload = require("../config/multerConfig"); // Correcto


>>>>>>> e06abdaa1da064075d6ad77fa056473ae7f0bbf6

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde CONTROLLER/song.js"
    });
}


//GRABAR una cancion ############################################
const save = async (req, res) => {
    try {
        // Recoger los parámetros que me llegan del cuerpo de la solicitud
        let params = req.body;

        // Crear objeto con el modelo Song
        let song = new Song(params);

        // Guardar la canción en la base de datos
        let songStored = await song.save(); // Usar `await` para esperar a que se guarde

        // Verificar si la canción se guardó correctamente
        if (!songStored) {
            return res.status(500).send({
                status: "error",
                message: "La canción NO se ha guardado"
            });
        }

        // Responder con éxito si la canción se guardó correctamente
        return res.status(200).send({
            status: "success",
            song: songStored
        });

    } catch (error) {
        // Manejar cualquier error que ocurra durante el proceso
        return res.status(500).send({
            status: "error",
            message: "Error al guardar la canción",
            error: error.message
        });
    }
};


//MOSTRAR una cancion ############################################
const one = async (req, res) => {
    try {
        let songId = req.params.id;

        // Usamos `await` para esperar el resultado de la búsqueda
        const song = await Song.findById(songId).populate("album");

        // Si no se encuentra la canción, se retorna un error 404
        if (!song) {
            return res.status(404).send({
                status: "error",
                message: "La canción NO EXISTE"
            });
        }

        // Si todo sale bien, retornamos la canción
        return res.status(200).send({
            status: "success",
            song
        });

    } catch (error) {
        // Si ocurre algún error, retornamos un error 500
        return res.status(500).send({
            status: "error",
            message: "Error al obtener la canción",
            error
        });
    }
};


// //LISTADOS de canciones ############################################
const list = async (req, res) => {
    try {
        // Recoger id del album
        let albumId = req.params.albumId;

        // Hacer consulta con await
        const songs = await Song.find({ album: albumId }).sort("track");

        // Comprobar si no hay canciones
        if (!songs || songs.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "NO hay canciones"
            });
        }

        // Si todo sale bien, devolver las canciones
        return res.status(200).send({
            status: "success",
            songs
        });

    } catch (error) {
        // Si ocurre un error en la consulta
        return res.status(500).send({
            status: "error",
            message: "Error al obtener las canciones",
            error
        });
    }
};

// ACTUALIZAR canciones ############################################
const update = async (req, res) => {
    try {
        // parámetro url id de canción
        let songId = req.params.id;

        // datos para guardar
        let data = req.body;

        // búsqueda y actualización usando async/await
        const songUpdated = await Song.findByIdAndUpdate(songId, data, { new: true });

        // Si no se encontró o no se actualizó la canción
        if (!songUpdated) {
            return res.status(500).send({
                status: "error",
                message: "La canción NO se ha actualizado"
            });
        }

        // Respuesta exitosa
        return res.status(200).send({
            status: "success",
            song: songUpdated
        });

    } catch (error) {
        // Manejo de errores
        return res.status(500).send({
            status: "error",
            message: "Hubo un error al intentar actualizar la canción",
            error: error.message
        });
    }
};

<<<<<<< HEAD
// BORRRADO de canciones ############################################
// const remove = async (req, res) => {
//     try {
//         // parámetro url id de canción
//         let songId = req.params.id;

//         //eliminacion
//         const songRemoved = await Song.findByIdDelete(songId);

//         //si no se encontro o no se elimino la cancion
//         if(!songRemoved){
//             return res.status(500).send({
//                 status: "error",
//                 message: "NO se ha borrado a cancion"
//             });
//         }

//         //respuesta exitosa
//         return res.status(200).send({
//             status: "success",
//             song:songRemoved
//         });
//     }catch(error){
//         //manejo de errores
//         return res.status(500).send({
//             status: "error",
//             message: "Hubo un ERROR al intentar BORRAR la cancion"
//         });
//     }
// };

const remove = async (req, res) => {
    try {
        // Parámetro URL id de la canción
        let songId = req.params.id;

        // Validación del ID
        if (!mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).send({
                status: "error",
                message: "El ID de la canción no es válido"
            });
        }

        // Eliminación de la canción
=======

// BORRADO de  canciones ############################################
const remove = async (req, res) => {
    try {
        // parámetro url id de canción
        let songId = req.params.id;

        // eliminación usando async/await con findByIdAndDelete
>>>>>>> e06abdaa1da064075d6ad77fa056473ae7f0bbf6
        const songRemoved = await Song.findByIdAndDelete(songId);

        // Si no se encontró o no se eliminó la canción
        if (!songRemoved) {
<<<<<<< HEAD
            return res.status(404).send({
                status: "error",
                message: "No se encontró la canción con ese ID"
=======
            return res.status(500).send({
                status: "error",
                message: "NO se ha borrado la canción"
>>>>>>> e06abdaa1da064075d6ad77fa056473ae7f0bbf6
            });
        }

        // Respuesta exitosa
        return res.status(200).send({
            status: "success",
            song: songRemoved
        });
<<<<<<< HEAD
    } catch (error) {
        // Manejo de errores
        console.error(error);  // Imprime detalles del error en la consola
        return res.status(500).send({
            status: "error",
            message: "Hubo un ERROR al intentar BORRAR la canción"
=======

    } catch (error) {
        // Manejo de errores
        return res.status(500).send({
            status: "error",
            message: "Hubo un error al intentar borrar la canción",
            error: error.message
>>>>>>> e06abdaa1da064075d6ad77fa056473ae7f0bbf6
        });
    }
};


<<<<<<< HEAD
module.exports = {prueba, save, one, list, update, remove}
=======






// Método de RUTA y SUBIR avatar #####################################################################################################################



// Método para subir una canción
const uploadSong = async (req, res) => {
    let songId = req.params.id;

    try {
        if (!req.file) {
            return res.status(404).send({
                status: "error",
                message: "La petición NO incluye la canción"
            });
        }

        let song = req.file.originalname;
        const songSplit = song.split(".");
        const extension = songSplit[songSplit.length - 1].toLowerCase();
        const validExtensions = ["mp3", "ogg"]; // Extensiones válidas para la canción

        if (!validExtensions.includes(extension)) {
            const filePath = req.file.path;
            fs.unlinkSync(filePath); // Eliminar el archivo si la extensión no es válida

            return res.status(400).send({
                status: "error",
                message: "EXTENSIÓN del archivo INVALIDA."
            });
        }

        const songUpdated = await Song.findOneAndUpdate(
            { _id: songId },
            { audio: req.file.filename }, // Guardar el nombre del archivo en la base de datos
            { new: true }
        );

        if (!songUpdated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la SUBIDA de la canción"
            });
        }

        return res.status(200).send({
            status: "success",
            song: songUpdated,
            file: req.file
        });

    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Se produjo un error en el servidor.",
            error: error.message
        });
    }
};

// Método para recuperar y enviar la canción desde el servidor
const audio = (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, '..', 'uploads', 'songs', file);

    fs.stat(filePath, (error) => {
        if (error) {
            return res.status(404).send({
                status: "error",
                message: "NO EXISTE la canción",
                filePath, // Mostrar la ruta completa
                file      // Mostrar el nombre del archivo
            });
        }

        return res.sendFile(filePath);
    });
};

// Exportación de las funciones del controlador
module.exports = { prueba, save, one, list, update, remove, audio, uploadSong, upload };
>>>>>>> e06abdaa1da064075d6ad77fa056473ae7f0bbf6
