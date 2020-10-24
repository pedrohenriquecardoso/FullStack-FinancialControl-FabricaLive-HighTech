const express = require("express");
var cors = require("cors");
const ConnectDB = require("./db/mongodb");
require('dotenv').config();

const user = require("./routes/user");
const conta = require("./routes/conta");

ConnectDB.conectarMongo();

const app = express();
app.use(express.json()); // middleware
app.use(cors()); // middleware

app.use("/user", user);
app.use("/conta", conta);

console.log("SERVIDOR INICIALIZADO");
app.listen(3000);