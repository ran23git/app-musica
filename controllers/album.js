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


module.exports = { prueba, save, one };

