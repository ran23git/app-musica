const Album = require("../models/album");
const fs = require('fs');
const path = require('path');  // Asegúrate de agregar esta línea

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







// Método de RUTA y SUBIR avatar #####################################################################################################################

const upload = async (req, res) => {
    //1-configuracion de subida(MULTER)---------------------------------------------------
    //2-recoger el fichro de imagen y comprobar si existe----------------------------------
   let albumId = req.params.id;
   
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
        const albumUpdated = await Album.findOneAndUpdate( //usca un usuario en la base de datos por su ID y actualiza su campo image con el 
            //nombre del archivo subido. La operación es asíncrona y espera el resultado.

            { _id: albumId }, // Se busca un usuario cuyo _id coincide con el ID del usuario de la solicitud.
            { image: req.file.filename }, //Especifica que se quiere actualizar el campo image con el nombre del archivo subido (req.file.filename).
            { new: true }  // indica que se debe devolver el documento actualizado.
        );

        if (!albumUpdated) {  //Si no se encontró un usuario o hubo un error, se ejecuta el bloque dentro del if.
            return res.status(500).send({
                status: "error",
                message: "Error en la SUBIDA del avatar"
            });
        }
        //7-devolver una RESPUESTA---------------------------------------------------------------------------
        return res.status(200).send({
            status: "success",
            artist: albumUpdated,
            file: req.file
        });

    } catch (error) { //Captura cualquier error que ocurra dentro del bloque try.
        return res.status(500).send({
            status: "error",
            message: "Se produjo un error en el servidor."
        });
    }


}




//SACAR el AVATAR y mostrarlo en el ENDPOINT#####################################################################################################################

      const image = (req, res) => {
        // 1° Sacar el PARAMETRO de la URL--------------
        const file = req.params.file; // Se extrae el parámetro file de la URL de la solicitud.
    
        // 2° Montar el PATH real de la imagen----------------
        const filePath = path.join(__dirname, '..', 'uploads', 'albums', file);
        // path.join se usa para crear una ruta completa y correcta sin importar el sistema operativo.
    
        // 3° Comprobar que el archivo EXISTE------------------
        fs.stat(filePath, (error) => {
            if (error) { 
                // Si hay un error, como que el archivo no exista, se responde con error 404.
                return res.status(404).send({
                    status: "error",
                    message: "NO EXISTE la imagen",
                    filePath, // Muestra el path con el nombre del archivo
                    file,     // Muestra el nombre del archivo
                    __dirname // Muestra el directorio actual
                });
            }
    
            // 4° Si el archivo existe, devolver el archivo---------------
            return res.sendFile(filePath); // Si el archivo existe, se envía como respuesta
        });
    };


    //BORRAR ALBUM y todas las canciones que tengan que ver con ese album #####################################################################################################################
const remove = async (req, res) => {
    try {
        // Obtener el id del album de la URL
        const id = req.params.id;

        // Buscar el album
        const albumDeleted = await Album.findByIdAndDelete(id);

        // Si no se encuentra el album con ese ID
        if (!albumDeleted) {
            return res.status(404).send({
                status: "error",
                message: "No se encontró el album con el ID proporcionado"
            });
        }

        try {
            // Buscar todos los álbumes del album
            const albums = await Album.find({ album: id });

            // Arreglo para almacenar los álbumes eliminados y canciones eliminadas
            const albumsDeleted = [];
            const songsDeleted = [];

            // Eliminar todos los álbumes del album
            for (const album of albums) {
                // Eliminar todas las canciones asociadas al álbum
                const songs = await Song.deleteMany({ album: album._id });
                songsDeleted.push(songs.deletedCount); // Almacenar el número de canciones eliminadas

                // Eliminar el álbum
                const albumDeleted = await album.delete();
                albumsDeleted.push(albumDeleted); // Almacenar el álbum eliminado
            }

            // Devolver una respuesta exitosa con la información del album, álbumes y canciones eliminadas
            return res.status(200).send({
                status: "success",
                message: "El album y sus álbumes han sido eliminados",
                album: albumDeleted,
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
        // Manejo de errores en la eliminación del album
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar el album",
            error: error.message
        });
    }
};




module.exports = { prueba, save, one, list, update, upload, image, remove };


