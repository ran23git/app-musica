const Artist = require("../models/artirst"); // Nota que corrigí el nombre de 'artirst' a 'artist'
const Album = require("../models/album"); 
const Song = require("../models/song");  // Ajusta la ruta si es necesario

const mongoosePagination = require("mongoose-pagination");
const path = require('path');
const fs = require('fs');


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



// LISTADO de artistas con PAGINACION-----------------------------------------------------------------------------------
const list = async (req, res) => {
    try {
        // Obtener el número de la página desde los parámetros de la URL
        let page = parseInt(req.params.page) || 1;

        // Definir el número de elementos por página
        const itemsPerPage = 5;

        // Definir los saltos y límites para la paginación
        const skip = (page - 1) * itemsPerPage;

        // Obtener el número total de artistas
        const totalArtists = await Artist.countDocuments();

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalArtists / itemsPerPage);

        // Buscar los artistas con paginación
        const artists = await Artist.find()
            .skip(skip) // Salto de registros
            .limit(itemsPerPage) // Límite de registros por página
            .sort("name"); //ordena por campo name de la A a la Z
            //.exec(); // Ejecutar la consulta

        return res.status(200).send({
            status: "success",
            message: "Listado de artistas",
            page,
            itemsPerPage,
            totalPages,
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

// EDITAR / ACTUALIZAR artista-----------------------------------------
const update = async (req, res) => {
    try {
        // Recoger el ID del artista desde la URL
        const id = req.params.id;

        // Recoger los datos del body
        const data = req.body;

        // Buscar y actualizar el artista
        const artistUpdated = await Artist.findByIdAndUpdate(id, data, { new: true });

        // Si no se encuentra el artista o ocurre un error
        if (!artistUpdated) {
            return res.status(404).send({
                status: "error",
                message: "No se encontró el artista para actualizar"
            });
        }

        // Responder con éxito
        return res.status(200).send({
            status: "success",
            message: "El artista ha sido actualizado",
            artist: artistUpdated
        });
    } catch (error) {
        // Manejo de errores
        return res.status(500).send({
            status: "error",
            message: "Error al actualizar el artista",
            error: error.message
        });
    }
};




//ELIMINAR artista el ALBU, y las CANCIONES #####################################################################################################################
// const remove = async (req, res) => {
//     try {
//         // Obtener el id del artista de la URL
//         const id = req.params.id;

//         // Buscar el artista
//         const artistDeleted = await Artist.findByIdAndDelete(id);

//         // Si no se encuentra el artista con ese ID
//         if (!artistDeleted) {
//             return res.status(404).send({
//                 status: "error",
//                 message: "No se encontró el artista con el ID proporcionado"
//             });
//         }

       
//         // Buscar todos los álbumes del artista
//         const albums = await Album.find({ artist: id });

//         // Eliminar todos los álbumes del artista
//         const albumsDeleted = await Album.deleteMany({ artist: id });

//         // Obtener los IDs de los álbumes eliminados
//         const albumIds = albums.map(album => album._id);

//         // Eliminar todas las canciones asociadas a esos álbumes
//         const songsDeleted = await Song.deleteMany({ album: { $in: albumIds } });

//         // Devolver una respuesta exitosa
//         return res.status(200).send({
//             status: "success",
//             message: "El artista ha sido eliminado",
//             artist: artistDeleted,
//             albumsDeleted, // Muestra los álbumes eliminados
//             songsDeleted   // Muestra las canciones eliminadas
//         });
//     } catch (error) {
//         // Manejo de errores
//         return res.status(500).send({
//             status: "error",
//             message: "Error al eliminar el artista",
//             error: error.message
//         });
//     }
// };

const remove = async (req, res) => {
    try {
        // Obtener el id del artista de la URL
        const id = req.params.id;

        // Buscar el artista
        const artistDeleted = await Artist.findByIdAndDelete(id);

        // Si no se encuentra el artista con ese ID
        if (!artistDeleted) {
            return res.status(404).send({
                status: "error",
                message: "No se encontró el artista con el ID proporcionado"
            });
        }

        try {
            // Buscar todos los álbumes del artista
            const albums = await Album.find({ artist: id });

            // Arreglo para almacenar los álbumes eliminados y canciones eliminadas
            const albumsDeleted = [];
            const songsDeleted = [];

            // Eliminar todos los álbumes del artista
            for (const album of albums) {
                // Eliminar todas las canciones asociadas al álbum
                const songs = await Song.deleteMany({ album: album._id });
                songsDeleted.push(songs.deletedCount); // Almacenar el número de canciones eliminadas

                // Eliminar el álbum
                const albumDeleted = await album.delete();
                albumsDeleted.push(albumDeleted); // Almacenar el álbum eliminado
            }

            // Devolver una respuesta exitosa con la información del artista, álbumes y canciones eliminadas
            return res.status(200).send({
                status: "success",
                message: "El artista y sus álbumes han sido eliminados",
                artist: artistDeleted,
                albumsDeleted, // Muestra los álbumes eliminados
                songsDeleted   // Muestra las canciones eliminadas
            });

        } catch (error) {
            // Manejo de errores en la eliminación de álbumes y canciones
            return res.status(500).send({
                status: "error",
                message: "Error al eliminar los álbumes o canciones",
                error: error.message
            });
        }
    } catch (error) {
        // Manejo de errores en la eliminación del artista
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar el artista",
            error: error.message
        });
    }
};






// Método de RUTA y SUBIR avatar #####################################################################################################################

const upload = async (req, res) => {
    //1-configuracion de subida(MULTER)---------------------------------------------------
    //2-recoger el fichro de imagen y comprobar si existe----------------------------------
   let artistId = req.params.id;
   
    try {
        if (!req.file) {
            return res.status(404).send({
                status: "error",
                message: "La peticion NO incluye la IMAGEN"
            });
        }
        //3-conseguir el nombre del archivo------------------------------------------------------
        // Conseguir el NOMBRE del archivo
        let image = req.file.originalname; //Guarda el nombre original del archivo subido en la variable image.
        // (filename es el campo q tiene el NUEVO nombre )

        //4-tomar info de la imagen---------------------------------------------------------------
        // Conseguir la EXTENSION del archivo
        const imageSplit = image.split("."); //Divide el nombre del archivo en partes usando el punto (.) como separador, 
        //creando un array que contiene el nombre y la extensión.

        const extension = imageSplit[imageSplit.length - 1].toLowerCase(); // Obtener la extensión en minúsculas
        //Obtiene la última parte del array (la extensión) y la convierte a minúsculas.

        //5-Comprobar que la EXTENSION es correcta--------------------------------------------------
        const validExtensions = ["png", "jpg", "jpeg", "gif"]; //Define un array con las extensiones de archivo válidas que se permiten.

        if (!validExtensions.includes(extension)) {
            // si la extensión del archivo no está en la lista de extensiones válidas, se ejecuta el bloque dentro del if.

            // Borra archivo subido porque tiene extensión incorrecta
            const filePath = req.file.path; //Guarda la ruta del archivo subido en la variable filePath
            
            fs.unlinkSync(filePath); //Usa el módulo fs para eliminar el archivo del sistema de archivos de manera sincrónica, xq la extensión no es válida.

            // Devuelve una respuesta negativa
            return res.status(400).send({
                status: "error",
                message: "EXTENSION del archivo INVALIDA."
            });
        }
        //6-Si la extensión es correcta, GUARDAR en la BASE de DATOS*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
        const artistUpdated = await Artist.findOneAndUpdate( //usca un usuario en la base de datos por su ID y actualiza su campo image con el 
            //nombre del archivo subido. La operación es asíncrona y espera el resultado.

            { _id: artistId }, // Se busca un usuario cuyo _id coincide con el ID del usuario de la solicitud.
            { image: req.file.filename }, //Especifica que se quiere actualizar el campo image con el nombre del archivo subido (req.file.filename).
            { new: true }  // indica que se debe devolver el documento actualizado.
        );

        if (!artistUpdated) {  //Si no se encontró un usuario o hubo un error, se ejecuta el bloque dentro del if.
            return res.status(500).send({
                status: "error",
                message: "Error en la SUBIDA del avatar"
            });
        }
        //7-devolver una RESPUESTA---------------------------------------------------------------------------
        return res.status(200).send({
            status: "success",
            artist: artistUpdated,
            file: req.file
        });

    } catch (error) { //Captura cualquier error que ocurra dentro del bloque try.
        return res.status(500).send({
            status: "error",
            message: "Se produjo un error en el servidor."
        });
    }





    // return res.status(200).json({
    //     status: "success",
    //     message: "metodo SUBIR IMAGENES",
    //     file: req.file
    // });
}




//SACAR el AVATAR y mostrarlo en el ENDPOINT#####################################################################################################################

    // Si fs ya está importado en otra parte del archivo, no lo vuelvas a declarar
    const image = (req, res) => {   //se define una función llamada avatar, que recibe dos parámetros: req (la solicitud) y 
        //res (la respuesta). Esta función se usará como un controlador en un servidor.
        // 1° Sacar el PARAMETRO de la url--------------
        const file = req.params.file; //Se extrae el parámetro file de la URL de la solicitud. Este parámetro se espera 
        //que contenga el nombre del archivo que se quiere acceder.

        // 2° Montar el PATH real de la imagen----------------
        //const filePath = path.join(__dirname, 'uploads', 'avatars', file); //Se construye la ruta completa hacia el archivo de imagen. path.join combina
        // el directorio actual (__dirname) con las carpetas uploads y avatars, y el nombre del archivo, creando una ruta absoluta.
       // const filePath = "./uploads/avatars/" + file;
        const filePath = path.join(__dirname, '..', 'uploads', 'artists', file);
        //funciono con el path ultimo

        // 3° Comprobar que el archivo EXISTE------------------
        fs.stat(filePath, (error) => { //Se utiliza fs.stat para verificar si el archivo en la ruta filePath existe. Si hay un 
            //error (por ejemplo, si el archivo no se encuentra), se ejecuta la función de callback.

            if (error) { //Si hay un error, se devuelve una respuesta con el estado HTTP 404 (No encontrado)
                return res.status(404).send({
                    status: "error",
                    message: "NO EXISTE la imagen",
                    filePath, //muestra el path con el nombre del archivo
                    file,     //muestra el nombre del archivo
                    __dirname //muestra el path
                });
            }

            // 4° Si SI existe, devolver un FILE---------------
            //Si el archivo existe, se envía como respuesta al cliente usando res.sendFile, que envía el archivo como una respuesta HTTP.
            return res.sendFile(filePath);
        });
    };


module.exports = { save, one, list, update, remove, upload, image };
 