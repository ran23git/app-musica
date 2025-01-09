//importar mongoose
const mongoose = require("mongoose");

//metodo de conexion (async xq es 1 metodo q va a ESPERAR 1 resultado)
const connection = async() => {
    try{
        await mongoose.connect("mongodb://localhost:27017/app_musica");//cuando haga la conexion, se crea app_musica, si no esta a creada
        console.log("Estas Conectado CORRECTAMENTE a la BD: app_musica");
    }catch(error){
        console.log(error);
        throw new Error("NO se pudo conectar a la BASE de DATOS!!!!");
    }
}


//exportar conexion
module.exports = connection;
