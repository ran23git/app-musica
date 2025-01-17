const Album = require("../models/album");


const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde CONTROLLER/album.js"
    });
}

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

module.exports = { prueba, save };

