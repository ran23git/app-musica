const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde CONTROLLER/user.js"
    });
}
//REGISTRAR un usuario


module.exports = {prueba}