const Artist = require("../models/artirst"); // Nota que corrigí el nombre de 'artirst' a 'artist'



//GUARDAR un artista-----------------------------------------------------------------------------------
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

// OBTENER un artista -----------------------------------------------------------------------------------
// Función actualizada para usar async/await correctamente
const one = async (req, res) => {
    try {
        // Obtener 1 parámetro por URL
        const artistId = req.params.id;

        // Buscar al artista por ID usando async/await (sin callback)
        const artist = await Artist.findById(artistId);  // Aquí usamos await

        // Si no se encuentra el artista
        if (!artist) {
            return res.status(404).send({
                status: "error",
                message: "NO existe el ARTISTA"
            });
        }

        // Si se encuentra el artista
        return res.status(200).send({
            status: "success",
            message: "Acción de OBTENER un ARTISTA exitosa",
            artist  // Enviar el artista encontrado
        });
    } catch (error) {
        // Manejo de errores
        return res.status(400).send({
            status: "error",
            message: "Error al obtener el ARTISTA",
            error: error.message  // Incluir el mensaje de error
        });
    }
};



// LISTADO de artistas con paginación-----------------------------------------------------------------------------------
const list = async (req, res) => {
    try {
        // Obtener el número de la página desde los parámetros de la URL
        let page = parseInt(req.params.page) || 1;

        // Definir el número de elementos por página
        const itemsPerPage = 5;

        // Definir los saltos y límites para la paginación
        const skip = (page - 1) * itemsPerPage;

        // Buscar los artistas con paginación
        const artists = await Artist.find()
            .skip(skip) // Salto de registros
            .limit(itemsPerPage) // Límite de registros por página
            .sort("name") //ordena por campo name de la A a la Z
            .exec(); // Ejecutar la consulta

        return res.status(200).send({
            status: "success",
            message: "Listado de artistas",
            page,
            artists
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener los artistas",
            error: error.message
        });
    }
};

module.exports = { save, one, list };
