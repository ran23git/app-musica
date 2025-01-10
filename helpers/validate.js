const validator = require("validator");


const validate = (params) => {
let resultado = false; //defino la variable resultado

    //si toda esta condicion da TRUE, lo guardo en name
    let name = !validator.isEmpty (params.name) &&// si params.name NO esta vacio Y
                validator.isLength(params.name, {min:3, max: undefined}) &&//el nombre tenga por lo menos 3 letras Y
                validator.isAlpha (params.name, "es-ES");//que sea alfabetico

    //si toda esta condicion da TRUE, lo guardo en nick
    let nick = !validator.isEmpty (params.nick) &&
                validator.isLength(params.nick, {min:2, max: 60}) ;

    //si toda esta condicion da TRUE, lo guardo en email
    let email = !validator.isEmpty (params.email) &&
                validator.isEmail(params.email); //si params.email es un email

    //si toda esta condicion da TRUE, lo guardo en password
    let password = !validator.isEmpty (params.password);

    //si llega surname
    if(params.surname){ //si toda esta condicion da TRUE, lo guardo en surname
        let surname = !validator.isEmpty (params.surname) &&// si params.surname NO esta vacio Y
                       validator.isLength(params.surname, {min:3, max: undefined}) &&//el nombre tenga por lo menos 3 letras Y
                       validator.isAlpha (params.surname, "es-ES");//que sea alfabetico

        //si toda esta condicion(surname) me da FALSE, lanzo un ERROR
        if(!surname){
            throw new Error("NO se ha superado la validacion por apellido INCORRECTO");
            resultado = false;//NO HACE FALTA darle el valor de false, xq por defecto ya es FALSE
        }else{
            console.log("Validacion SUPERADA en el apellido");
        }
    }

    if(!name || !nick || !email || !password) {
        throw new Error("NO se ha superado la validacion");
        resultado = true;
    }else{
        console.log("Validacion SUPERADA");
        resultado = true;
    }
    
    return resultado;
}

module.exports= validate;