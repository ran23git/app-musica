//importaciones
const validate = require("../helpers/validate");

//accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde CONTROLLER/user.js"
    });
}
//REGISTRAR un usuario
const register = (req, res) => {
    //1-recoger los datos de la peticion
    let params = req.body;//asi recojo todo lo que me llega por el body
    
    //2-comprobar q me llegan bien
if(!params.name || !params.nick || !params.email || !params.password) {//si no exitiera nombre o nick o email o password, devolver un estatus 400
    return res.status(400).send({
        status: "error",
        message: "FALTAN datos por enviar"
    });
}

    //3-validar los datos
   try{
    validate(params);
   }catch(error){
    return res.status(400).send({
        status: "error",
        message: "Validacion NO SUPERADA"
    });
   }

    //4-control usuarios duplicados
    //5-cifrar la contraseña
    //6-crear objeto del usuario
    //7-guardar usuario en la base de datos
    //8-limpiar el objeto a devolver
    //9-devolver el resultado

    return res.status(200).send({
        status: "success",
        message: "Metod de registro"
    });
}
''
module.exports = {prueba, register}