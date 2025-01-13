//1-importar modulos
const jwt = require("jwt-simple");//maneja sesiones de usuario y autenticacion
const moment = require("moment");//gestiona fechas

//2-importar clave secreta
const libjwt = require("../helpers/jwt")
const secret = libjwt.secret;//asi consigo la clave secreta que tengo en libjwt

//3-Crear el METODO/FUNCION MIDDLEWARE(funcion) de autenticacion
exports.auth = (req, res, next) => { //next permite saltar al siguiente metodo o accion

    //3a-comprobar si me llega la cabecera de auth----------------------------------------------

    if (!req.headers.authorization)//si este valor no me llega hago return 403
        return res.status(403).send({
        status: "error",
            message: "La peticion NO tiene la cabecera de autenticacion"
    })
    //si pasa el punto 3a, decodifico el token
    //3b-limpiar el token--------------------------------------------------------------------------
    let token = req.headers.authorization.replace(/['"]+/g,'')//limpio las comillas q puede tener el token

    //3c-decodificar el token-----------------------------------------------------------------------
    try{
        let payload = jwt.decode(token, secret);//payload tiene todos los datos q se han cargado. Al metodo decode le paso mi TOKEN y CLAVE secreta
    //3dcomprobar EXPIRACION del token
    if(payload.exp <= moment().unix()){;//si la fehca de expiracion(paylod.exp) es mas ANTIGUA a la fecha actual devuelvo error 404
        return res.status(404).send({
            status: "error",
            message: "Token EXPIRADO",
            error
        })
    }
    //33-Agregar datos de usuarios a la request---------------------------------------------------------
    req.user = payload; //payload tiene todos los datos

    }catch(error){
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error
        })
    }
   

    //3f-pasar a la accion (ejecucion de la ruta en si, la accion en el controlador)-----------------------
    next();
}



