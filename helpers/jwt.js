//1-importar dependencias
  //JWT define un método para transmitir información segura entre partes como un objeto JSON. Es usado para autenticación y autorización en aplicaciones web.
  //JWT se usa en el contexto de Node.js, para manejar sesiones de usuario y autenticación en aplicaciones web
const jwt = require("jwt-simple"); //con jwt obtengo el TOKEN de manera sencilla
//const jwt = require("../services/jwt");

const moment = require("moment"); //libreria para  manejar y manipular fechas y horas de manera sencilla (en  formatos, como MM/DD/YYYY, YYYY-MM-DD).

//2-definir clave secreta para generar el TOKEN
const secret = "CLAVE_SECRETA_del_proyecto_DE_APP_de_MUSICA_987987";

//3-crear 1 funcion para generar TOKENS
//TOKEN: cadena cifrada de datos que se utiliza para autenticar y autorizar,que requieren que el servidor identifique y valide, a un usuario o servicio.
const createToken = (user) => { //recibe los datos(id,nmbre, etc) de 1 usuario (user)
    const   payload = {//payload es lo q voy a cargar dentro del TOKEN
        id:      user._id,    //en id   guardo el contenido de user._id
        name:    user.name, //en name guardo el contenido de user.name
        surname: user.surname,
        nick:    user.nick,
        email:   user.email,
        role:    user.role,
        image:   user.image,
        iat: moment().unix(),//iat hace referencia al momento(fecha) en el cual estoy CRENDO este PAYLOAD
        exp: moment().add(30, "days").unix()//exp es la fecha de EXPIRACION de este TOKEN, en este caso de 30 dias.
    };    

    return jwt.encode(payload, secret); //devolver JWT TOKEN codificado
}

//4-exportar modulo
module.exports = {  createToken,  secret };





