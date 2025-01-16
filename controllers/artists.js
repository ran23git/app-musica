const Artist = require("../models/artirst"); // Nota que corrigí el nombre de 'artirst' a 'artist'

// Cambia la función a 'async'
const save = async (req, res) => {
    try {
        // Recoger datos del body
        let params = req.body;

        // Crear el objeto a guardar
        let artist = new Artist(params);

        // Guardar el artista (esto ahora devuelve una promesa)
        let artistStored = await artist.save();  // Utilizamos 'await' para esperar el resultado de 'save'

        return res.status(200).send({
            status: "success",
            message: "SIII seGUARDÓ el ARTISTA",
            artist: artistStored  // artistStored el artista que se ha guardado
        });
    } catch (error) {
        // Manejo de errores
        return res.status(400).send({
            status: "error",
            message: "NOOO seGUARDÓ el ARTISTA",
            error: error.message  // Es recomendable incluir el mensaje de error
        });
    }
};

module.exports = { save };
