const {Schema, model} = require("mongoose");
const artirst = require("./artirst");
const { image } = require("../controllers/artists");

const AlbumSchema = Schema({
    artist: {
        type: Schema.ObjectId,
        ref: "Artist"
    },
    title:       { type: String,   required: true         },
    description:         String,   
    year:        { type: Number,   required: true         },
    image:       { type: String,   default: "default.png" },
    created_at:  { type: Date,     default: Date.now      }
});

module.exports = model("Album", AlbumSchema, "albums");
//El METODO model dice q este modelo se:
//  llamara ALBUM, 
// usará el esquema ALBUMSCHEMA y
// se guardará en la coleccion "ALBUMS"