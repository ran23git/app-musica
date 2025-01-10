const {Schema, model} = require("mongoose"); //con la desestructuracion {} elijo solo lo q necesito (Schema y model)
const { default: isEmail } = require("validator/lib/isEmail");

//a UserSchema le paso el OBJETO Schema{}  con toda la INFO q va a tener c/u de los documentos q yo guarde en la BBDD 
const UserSchema = Schema({
    name:       {  type: String,        required: true         },
    surname: String,
    nick:       {  type: String,        required: true         },
    email:      {  type: String,        required: true         },
    password:   {  type: String,        required: true         },
    role:       {  type: String,        default: "role_user"   },
    image:      {  type: String,        default: "default.png" },
    created_at: {  type: Date,          default: Date.now      }
});


module.exports = model("User", UserSchema, "users" );
//mi modelo se llama User, 
// uso el molde o esquema (UserSchema) para crear objeto de este tipo, 
// y lo guardare en la base de daos en la coleccion users 
