const {Schema, model} = require("mongoose");
const artirst = require("./artirst");
const { image } = require("../controllers/artists");

const SongSchema = Schema({
    album: { //album contiene el objectId e identificicador del album al cual perntenee esta cancion 
        type: Schema.ObjectId,
        ref: "Album"//contiene id del modelo album
    },
    track:       { type: Number,   required: true    },
    name:        { type: String,   required: true    },
    duration:    { type: String,   required: true    },
    file:        { type: String,   required: true    },
    created_at:  { type: Date,     default: Date.now }
});

module.exports = model("Song", SongSchema, "songs");
//El METODO model dice q este modelo se:
//  llamara SONG, 
// usará el esquema SONGSCHEMA y
// se guardará en la coleccion "SONGS"