const Album = require("../models/album");


const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde CONTROLLER/album.js"
    });
}


//CREAR ALBUMES###########################################################################
const save = async (req, res) => {
    try {
                let params = req.body;// Tomar los datos del BODY
        
        let album = new Album(params);// Crear objeto con los parámetros
        
        const albumStored = await album.save();// Guardar el álbum (esto es ahora una promesa)
        
        if (!albumStored) {// Si el álbum no se guarda correctamente, responde con error
            return res.status(500).send({
                status: "error",
                message: "ERROR al guardar el ALBUM"
            });
        }
        
        return res.status(200).send({// Responder con éxito si se guarda correctamente
            status: "success",
            message: "Método de GUARDAR 1 ALBUM",
            album: albumStored
        });

    } catch (error) { // Manejo de errores en caso de que ocurra algo inesperado       
        return res.status(500).send({
            status: "error",
            message: "ERROR al guardar el ALBUM",
            error: error.message
        });
    }
};


//MOSTRAR ALBUMES y obtener info del ARTISTA ###########################################################################
const one = async (req, res) => {
    try {
        // Obtener el ID del álbum desde los parámetros de la URL
        const albumId = req.params.id;

        // Buscar el álbum por su ID y hacer el populate del artista
        const album = await Album.findById(albumId).populate("artist");  // Usamos async/await aquí

        if (!album) {
            return res.status(404).send({
                status: "error",
                message: "No se ha encontrado el ALBUM"
            });
        }

        // Responder con el álbum encontrado
        return res.status(200).send({
            status: "success",
            album
        });
        
    } catch (error) {
        // Manejo de errores en caso de que ocurra algo inesperado
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el álbum",
            error: error.message
        });
    }
};


// MOSTRAR todos los ALBUMES de 1 ARTISTA ###########################################################################
const list = async (req, res) => {
    try {
        // Obtener el id del artista de la URL
        const artistId = req.params.artistId;

        // Verificar si el id del artista existe
        if (!artistId) {
            return res.status(404).send({
                status: "error",
                message: "NO se ha encontrado el ARTISTA"
            });
        }

        // Obtener todos los álbumes de la BBDD de un artista en concreto
        const albums = await Album.find({ artist: artistId }).populate("artist");

        // Si no se encuentran álbumes
        if (!albums || albums.length === 0) {
            return res.status(404).send({
                status: "error",
                message: "NO se han encontrado ALBUMS"
            });
        }

        // Devolver los resultados
        return res.status(200).send({
            status: "success",
            albums
        });

    } catch (error) {
        // Manejar cualquier error que ocurra durante la ejecución
        return res.status(500).send({
            status: "error",
            message: "Hubo un error al obtener los álbumes",
            error: error.message
        });
    }
};


// ACTUALIZAR 1 album ###########################################################################
const update = async (req, res) => {
    try {
        // Obtener parámetros de la URL
        const albumId = req.params.albumId;

        // Obtener el body (los datos a actualizar)
        const data = req.body;
        
        // Usar el modelo de Album para buscar y actualizar el álbum
        const albumUpdated = await Album.findByIdAndUpdate(albumId, data, { new: true });

        // Si no se encontró el álbum
        if (!albumUpdated) {
            return res.status(404).send({
                status: "error",
                message: "No se encontró el álbum"
            });
        }

        // Si se actualizó correctamente
        return res.status(200).send({
            status: "success",
            message: "Método ACTUALIZAR album",
            albumId,
            albumUpdated
        });

    } catch (error) {
        // Manejo de errores en caso de fallar la operación
        return res.status(500).send({
            status: "error",
            message: "Error al actualizar el álbum",
            error: error.message
        });
    }
}


module.exports = { prueba, save, one, list, update };


