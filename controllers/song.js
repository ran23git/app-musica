const Song = require("../models/song");

const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde CONTROLLER/song.js"
    });
}


//GRABAR############################################
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

module.exports = {prueba, save}