const db = require("../config/db")

const camposUsuario = ["id", "nome", "email", "senha", "ativo", "data_criacao"]

const camposPerfil = ["id", "nome", "rotulo"]

//adiciona ou altera
async function salvarUsuario(nome, email, senha) {
  const table = db("usuarios")
  const usuario = await table.where("email", "=", email).first()

  let usuarioAlterado
  if (usuario) {
    usuarioAlterado = await table
      .where({ email: email })
      .update({ nome, senha }, [...camposUsuario])
  } else {
    usuarioAlterado = await table.insert({ nome, email, senha }, [
      ...camposUsuario,
    ])
  }

  return usuarioAlterado[0]
}

//adiciona ou altera
async function salvarPerfil(nome, rotulo) {
  const table = db("perfis")
  const perfil = await table.where("nome", "=", nome).first()

  let perfilAlterado

  if (perfil) {
    perfilAlterado = await table
      .where({ nome: nome })
      .update({ rotulo }, [...camposPerfil])
  } else {
    perfilAlterado = await table.insert({ nome, rotulo }, [...camposPerfil])
  }

  return perfilAlterado[0]
}

async function adicionarPerfis(usuario, ...perfis) {
  const table = db("usuarios_perfis")
  for (const perfil of perfis) {
    console.log(`${usuario.id}:${perfil.id}`)
    
    const { qtde } = await table
      .where({
        usuario_id: usuario.id,
        perfil_id: perfil.id,
      })
      .count("* as qtde")
      .first()

      console.log(`quantidade: ${qtde}`)

    if (qtde > 0) {
      console.log("já existe o relacionamento")
    } else {
      await table.insert({ usuario_id: usuario.id, perfil_id: perfil.id })
    }
    
  }
}

async function executar() {
  const usuario = await salvarUsuario("Ana2", "ana@empresa.com.br", "123456")
  const perfilA = await salvarPerfil("rh", "Pessoal")
  const perfilB = await salvarPerfil("fin", "Financeiro")

  console.log(usuario)
  console.log(perfilA)
  console.log(perfilB)

  await adicionarPerfis(usuario, perfilA, perfilB)
}

executar()
  .catch((err) => console.log(err))
  .finally(() => db.destroy())
