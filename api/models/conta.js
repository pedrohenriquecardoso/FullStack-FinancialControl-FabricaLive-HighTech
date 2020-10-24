const mongoose = require("mongoose");

const conta = mongoose.model("conta", {
    descricao: String,
    tipo: String,
    valor: Number,
    data: Date,
    observacoes: String
    
});

module.exports = conta;