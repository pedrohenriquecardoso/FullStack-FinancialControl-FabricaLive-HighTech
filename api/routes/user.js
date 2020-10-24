const express = require("express");
const User = require("../models/user");
const router = express.Router();


router.get("/all", async (req, res) => {
  await User.find((err, all = []) => {
    if (err) res.send("ERRO PARA BUSCAR");
    res.json(all);
  });
});

router.post("/", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((savedUser) => res.json(savedUser))
    .catch(() => res.send("ERRO AO CADASTRAR"));
});

router.put("/:id", (req, res) => {
  console.log("ID:" + req.params.id);
  console.log("BODY:" + JSON.stringify(req.body));
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.send("ATUALIZADO COM SUCESSO"))
    .catch(() => res.send("ERRO AO ATUALIZAR"));
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.send("REMOVIDO COM SUCESSO"))
    .catch(() => res.send("ERRO AO REMOVER"));
});

module.exports = router;