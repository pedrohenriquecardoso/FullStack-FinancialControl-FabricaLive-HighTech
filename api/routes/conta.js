const express = require("express");
const Conta = require("../models/conta");
const router = express.Router();

router.get("/all", async (req, res) => {
  await Conta.find((err, all = []) => {
    if (err) res.send("ERRO PARA BUSCAR");
    res.json(all);
  });
});

router.post("/", (req, res) => {
  const conta = new Conta(req.body);
  conta
    .save()
    .then((savedConta) => res.json(savedConta))
    .catch(() => res.send("ERRO AO CADASTRAR"));
});

router.put("/:id", (req, res) => {
  console.log("ID:" + req.params.id);
  console.log("BODY:" + JSON.stringify(req.body));
  Conta.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.send("ATUALIZADO COM SUCESSO"))
    .catch(() => res.send("ERRO AO ATUALIZAR"));
});

router.delete("/:id", (req, res) => {
  Conta.findByIdAndDelete(req.params.id)
    .then(() => res.send("REMOVIDO COM SUCESSO"))
    .catch(() => res.send("ERRO AO REMOVER"));
});

module.exports = router;