const Song = require("../models/song");
const mongoose = require('mongoose');

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
        const songRemoved = await Song.findByIdAndDelete(songId);

        // Si no se encontró o no se eliminó la canción
        if (!songRemoved) {
            return res.status(404).send({
                status: "error",
                message: "No se encontró la canción con ese ID"
            });
        }

        // Respuesta exitosa
        return res.status(200).send({
            status: "success",
            song: songRemoved
        });
    } catch (error) {
        // Manejo de errores
        console.error(error);  // Imprime detalles del error en la consola
        return res.status(500).send({
            status: "error",
            message: "Hubo un ERROR al intentar BORRAR la canción"
        });
    }
};


module.exports = {prueba, save, one, list, update, remove}