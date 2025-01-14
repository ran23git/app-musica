//importaciones
const validate = require("../helpers/validate");//importo la funcion para hacer validaciones
const bcrypt = require("bcryptjs"); // librería para encriptar contraseñas,
const path = require("path");
const fs = require('fs');  

const User = require("../models/user"); // modelo de datos para interactuar con la base de datos
//const jwt =  require("../helpers/jwt");//importo jwt para crear token
const jwt = require("jsonwebtoken"); // Importa jsonwebtoken, no tu helper personalizado
const argon2 = require("argon2");


//1-REGISTRAR un usuario  ######################################################################################################
//register realiza una petición HTTP para registrar un nuevo usuario. Recibe como parámetros req (la solicitud) y res (la respuesta).
const register = async (req, res) => {
    //1-recoger los datos de la peticion
    let params = req.body;//asi recojo todo lo que me llega por el body

    //2-comprobar q me llegan bien ######################################################################################################
    if (!params.name || !params.nick || !params.email || !params.password) {//si no exitiera nombre o nick o email o password, devolver un estatus 400
        return res.status(400).send({
            status: "error",
            message: "FALTAN datos por enviar"
        });
    }

    //3-validar los datos ######################################################################################################
    try {
        validate(params);//params contiene datos del usuario enviados en la solicitud HTTP. 
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Validacion NO SUPERADA"
        });
    }

    //4-controlar usuarios duplicados ######################################################################################################
    //await espera a q se realice la consulta a la base de datos. 
    //User es el modelo de usuario
    //findOne es un método de Mongoose que busca UN solo documento en la base de datos que cumpla con los criterios
    //                        que se pasan como argumento. En este caso, busca un usuario cuyo campo email coincida 
    //           con el valor de params.email (es decir, el correo electrónico que el usuario envió en la solicitud).
    const existingUser = await User.findOne({ email: params.email });
    if (existingUser) {//si existingUser tiene algún valor la condición será verdadera.
        //Si existingUser contiene un objeto (lo que ocurre cuando se encuentra un usuario con el mismo correo electrónico
        //              en la base de datos), la condición if (existingUser) será VERDADERA(osea habra usuarios DUPLICADOS).
        return res.status(400).send({
            status: "error",
            message: "El correo electrónico ya está registrado"
        });
    }

    // 5. Cifrar la contraseña ######################################################################################################
    //bcrypt.hash devuelve una promesa, y await hace que JavaScript espere a que la contraseña se haya CIFRADO antes de asignar el resultado a hashedPassword.
    const hashedPassword = await bcrypt.hash(params.password, 10); // Usa libreria bcryptjs para cifrar la contraseña
    //hash: El método hash de bcrypt toma dos parámetros
    //params.password: contiene la contraseña del usuario que se ha recibido en la solicitud 
    //10 Es el número de veces que se aplica un proceso de hashing a la contraseña.

    // 6. Crear el objeto del usuario ######################################################################################################
    const user = new User({// crea una nueva instancia del modelo User
        //El objeto user será un documento de base de datos que se guardará más tarde usando el método save() 

        //name es una propiedad del objeto que representa al usuario. Se está asignando el valor de params.name, que proviene de 
        // los datos enviados en el cuerpo de la solicitud HTTP. Este es el nombre del usuario que será almacenado en la base de datos.
        name: params.name,
        surname: params.surname || "", // Si no se proporciona, el apellido será una cadena vacía
        nick: params.nick,    //Se le asigna el valor de params.nick
        email: params.email,   //Se le asigna el valor de params.email
        password: hashedPassword, // Guardamos la contraseña YA cifrada
        role: params.role || "role_user",   // Si no se proporciona un rol, el rol por DEFECTO será "role_user"
        image: params.image || "default.png", // Si no se proporciona una imagen, la imagen por DEFECTO será "default.png"
    });

    // 7. Guardar el usuario en la base de datos ######################################################################################################
    try {//try envuelve el código que puede generar un error, que si llega a ocurrir, pasara al bloque catch
        //await user.save(); // El método SAVE() de Mongoose guarda el nuevo documento (USER) en la base de datos.
        const userStored = await user.save(); //guarda, en userStored, el registro con todos los campos ya definidos en el objeto user en la base de datos.

        //8-LIMPIAR el objeto a devolver ######################################################################################################
        let userCreated = userStored.toObject();
        //userStored es el objeto que se guarda en la base de datos(este documento de Mongoose, tiene algunas propiedades adicionales)
        //.toObject() convierte este documento de Mongoose en un objeto JavaScript simple, es decir, elimina esos métodos internos y metadatos,
        //  dejando solo las propiedades del documento que se guardaron en la base de datos (por ejemplo: name, email, role, etc.).
        //toObject() te da una versión más simple del documento, sin los metadatos de Mongoose, para que puedas manipularlo o devolverlo en una respuesta.

        //La palabra clave delete se usa para eliminar una propiedad de un objeto en JavaScript.
        //delete userCreated.password elimina la propiedad password del objeto userCreated que contiene todos los datos del usuario guardado.
        //En resumen: Está eliminando la contraseña del objeto antes de enviarlo en la respuesta. 
        delete userCreated.password;
        delete userCreated.role;

        return res.status(200).send({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userCreated // Podrías devolver el objeto del usuario si es necesario
        });
    } catch (error) {//captura cualquier error que ocurra dentro del bloque try
        return res.status(500).send({
            status: "error",
            message: "Error al registrar el usuario",
            error: error.message
        });
    }
};

//9-hacer LOGIN #################################################################################################################################

const login = async (req, res) => {
    // 1-recoger los parámetros de la petición
    let params = req.body;

    // 2-comprobar que me llegan los datos correctamente
    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "FALTAN datos por enviar"
        });
    }

    try {
        // 3-buscar en la base de datos si existe el email
        // const user = await User.findOne({ email: params.email });
        const user = await User.findOne({ email: params.email }).select('+password');
        //.select('+password') para sobrescribir el select: false del modelo y asegurarnos de que la contraseña se incluya en el resultado de la consulta.

        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "No existe el usuario"
            });
        }

        // Validar que la contraseña del usuario exista
        if (!user.password) {
            return res.status(500).send({
                status: "error",
                message: "La contraseña del usuario no está definida"
            });
        }

        // 4-comprobar la contraseña
        const isPasswordValid = await bcrypt.compare(params.password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({
                status: "error",
                message: "Contraseña incorrecta"
            });
        }

        //10-creacion de TOKEN #####################################################################################################################
        const jwt = require("jsonwebtoken");
        const libjwt = require("../helpers/jwt");
        const secret = libjwt.secret;
        //10-creacion de TOKEN #####################################################################################################################
        // Aquí puedes añadir la lógica para generar un token JWT si es necesario
        // Ejemplo de cómo generar un JWT:
        //const token = jwt.sign({ id: user._id }, "mi_clave_secreta", { expiresIn: '1h' });
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

        // 5-devolver datos del usuario (sin la contraseña) y el token si es necesario
        let userData = user.toObject();
        delete userData.password; // Eliminar la contraseña de la respuesta

        return res.status(200).send({
            status: "success",
            message: "Login exitoso",
            user: userData,
            token: token // Descomentar si quieres devolver el token JWT
        });
    } catch (error) {
        console.error(error);  // Agregar un log para ver el error exacto
        return res.status(500).send({
            status: "error",
            message: "Error al iniciar sesión",
            error: error.message
        });
    }
};






// Conseguir los datos del perfil de UN usuario #####################################################################################################################
const profile = async (req, res) => {

    //1-recoger ID usuario URL
    const id = req.params.id;
    //2-consulta apra sacar los datos del perfil
    try {
        // Consulta para obtener los datos del usuario, excluyendo password y role
        const userProfile = await User.findById(id).select('-password -role').exec();

        // Comprobar si se encontró el usuario---------------------------------------
        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "El usuario NO existe"
            });
        }

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            user: userProfile
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error en el servidor",
            error: error.message
        });
    }
    //3-devolver el resultado
    return res.status(200).send({
        status: "succes",
        message: "PRUEBA del perfil",
        id
    });
}


// MIDDLEWARE auth #####################################################################################################################
// MIDDLEWARE auth #####################################################################################################################


// Método de ACTUALIZAR usuario #####################################################################################################################
const update = async (req, res) => {
    const userIdentity = req.user; // Recoger la IDENTIDAD del usuario a actualizar (ID, etc)
    let userToUpdate = req.body;   // Registra lo que me llega del usuario

    // Eliminar propiedades no necesarias
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;

    // Validar que el email existe en userToUpdate
    if (userToUpdate.email) {
        userToUpdate.email = userToUpdate.email.toLowerCase(); //typeof userToUpdate.email === 'string': se asegura de que el valor de email sea de tipo string
    } else {   //Si la condición anterior se cumple, el email se convierte a minúsculas utilizando el método toLowerCase().
        return res.status(400).json({
            status: "error",
            message: "El email es requerido"
        });
    }

    // 3° Controlar y buscar usuarios duplicados-----------------------------------------------------------
    try {
        const existingUser = await User.findOne({ //existingUser que almacenará el resultado de la consulta a la base de datos
            $or: [   //await: Indica que la operación es asíncrona. Se espera que la promesa devuelta por
                //$or: al menos una de las condiciones dentro de la matriz debe ser verdadera.
                //User.findOne se resuelva antes de continuar. Esto significa que el código siguiente no se ejecutará hasta que se obtenga el resultado de la búsqueda.  
                //User.findOne: Este es un método de un modelo de Mongoose que busca un único documento en la colección User

                { email: userToUpdate.email },  // se busca un usuario cuyo email coincida con userToUpdate.email. 
                //Esto significa que se está buscando un usuario que tenga el mismo correo electrónico que el que se está tratando de actualizar.

                { nick: userToUpdate.nick ? userToUpdate.nick.toLowerCase() : null } //Aquí se busca un usuario cuyo nick coincida con userToUpdate.nick, 
                //pero antes de buscar, se convierte userToUpdate.nick a minúsculas utilizando toLowerCase(). 
                //Esto es útil para asegurar que la comparación sea insensible a mayúsculas y minúsculas

            ]
        });
        //Comprobar el Nick y el mail que si es el mismo, me permita actualizarlo, asi no sale mensaje de “usuario ya existe”-------------------------
        let userIsset = false; //Aquí se declara una variable llamada userIsset y se inicializa con el valor false. Esta variable podría usarse más adelante en el 
        //código para indicar si un usuario con las características especificadas ya existe en la base de datos (es decir, si existingUser contiene un documento).
        //si existingUser existe (no es null o undefined) y si su identificador (_id) es diferente de userIdentity.id.
        //existingUser: se refiere al usuario que se encontró previamente en la base de datos.


        if (existingUser && existingUser._id != userIdentity.id) {  //se asegura de que el _id del usuario encontrado no sea el mismo que el id del usuario que se está intentando actualizar.
            userIsset = true; //Si la condición anterior es verdadera, se establece la variable userIsset a true. Esto indica que se encontró un usuario existente con el mismo email o nick, 
            //y que no es el mismo usuario que está realizando la actualización

        }

        if (userIsset) {  //se evalúa si userIsset es true. Si es así, significa que se encontró un usuario existente con el mismo email o nick que no es el usuario actual.
            return res.status(400).json({
                status: "error",
                message: "El usuario ya existe"
            });
        }

        // 4° Cifrar la contraseña****************************************************************************************
        // Actualizar la contraseña si se ha proporcionado
        if (userToUpdate.password) { //si es verdadera la contraseña de ESE usuario, cifro la contraseña
            //Esto significa que solo se procederá a actualizar la contraseña si se ha proporcionado un nuevo valor para ella

            userToUpdate.password = await argon2.hash(userToUpdate.password); //Hashing de la contraseña: Si la condición anterior 
            //es verdadera, se utiliza el módulo argon2 para hashear la nueva contraseña. El método hash toma la contraseña en 
            //texto plano y la convierte en un formato seguro (hash), que es lo que se almacenará en la base de datos

        }

        // BUSCAR  y ACTUALIZAR**********
        //la constante userUpdated que ALMACENARÁ el resultado de la operación de ACTIALIZACIÓN-------------------------------------
        const userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });
        //User.findByIdAndUpdate: Este método busca un usuario en la base de datos por su ID (en este caso, userIdentity.id)
        // y lo ACTUALIZA con los datos de userToUpdate.
        //{ new: true }: Esta opción le dice a Mongoose que devuelva el documento actualizado en lugar del original. 
        //Así, userUpdated contendrá los datos del usuario después de la actualización.

        if (!userUpdated) {
            return res.status(404).json({
                status: "error",
                message: "No se pudo actualizar el usuario"
            });
        }

        //contiene la información del usuario después de la actualización
        return res.status(200).json({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: userUpdated
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
};








// Método de RUTA y SUBIR avatar #####################################################################################################################

const upload = async (req, res) => {
    //1-configuracion de subida(MULTER)---------------------------------------------------
    //2-recoger el fichro de imagen y comprobar si existe----------------------------------
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
        const userUpdated = await User.findOneAndUpdate( //usca un usuario en la base de datos por su ID y actualiza su campo image con el 
            //nombre del archivo subido. La operación es asíncrona y espera el resultado.

            { _id: req.user.id }, // Se busca un usuario cuyo _id coincide con el ID del usuario de la solicitud.
            { image: req.file.filename }, //Especifica que se quiere actualizar el campo image con el nombre del archivo subido (req.file.filename).
            { new: true }  // indica que se debe devolver el documento actualizado.
        );

        if (!userUpdated) {  //Si no se encontró un usuario o hubo un error, se ejecuta el bloque dentro del if.
            return res.status(500).send({
                status: "error",
                message: "Error en la SUBIDA del avatar"
            });
        }
        //7-devolver una RESPUESTA---------------------------------------------------------------------------
        return res.status(200).send({
            status: "success",
            user: userUpdated,
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
    const avatar = (req, res) => {   //se define una función llamada avatar, que recibe dos parámetros: req (la solicitud) y 
        //res (la respuesta). Esta función se usará como un controlador en un servidor.
        // 1° Sacar el PARAMETRO de la url--------------
        const file = req.params.file; //Se extrae el parámetro file de la URL de la solicitud. Este parámetro se espera 
        //que contenga el nombre del archivo que se quiere acceder.

        // 2° Montar el PATH real de la imagen----------------
        //const filePath = path.join(__dirname, 'uploads', 'avatars', file); //Se construye la ruta completa hacia el archivo de imagen. path.join combina
        // el directorio actual (__dirname) con las carpetas uploads y avatars, y el nombre del archivo, creando una ruta absoluta.
       // const filePath = "./uploads/avatars/" + file;
        const filePath = path.join(__dirname, '..', 'uploads', 'avatars', file);
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




module.exports = { register, login, profile, update, upload, avatar };
