const db = require("../config/db")

const novoUsuario = {
  nome: "Maria",
  email: "maria@empresa.com",
  senha: "minhasenha123",
}

async function exercicio() {
  const { qtde } = await db("usuarios").count("* as qtde").first()

  if (qtde == 0) {
    await db("usuarios").insert(novoUsuario)
  }

  let { id } = await db("usuarios").select("id").limit(1).first()

  await db("usuarios").where({ id }).update({ nome: "Mariazinha" })

  return await db("usuarios").where({ id })
}

exercicio()
  .then((usuario) => console.log(usuario))
  .finally(() => db.destroy())
