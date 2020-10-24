const mongoose = require("mongoose");

const user = mongoose.model("user", {
    username: String,
    nome: String,
    senha: String,
    email: String,
    ativo: Boolean
});

module.exports = user;