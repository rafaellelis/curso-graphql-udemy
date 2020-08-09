const { usuarios, proximoId } = require("../../data/db")

function indiceUsuario(filtro) {
  if (!filtro) return -1

  const { id, email } = filtro
  if (id) {
    return usuarios.findIndex((usuario) => usuario.id === id)
  } else if (email) {
    return usuarios.findIndex((usuario) => usuario.email === email)
  }

  return -1
}

module.exports = {
  // nome, email, idade
  novoUsuario(_, { dados }) {
    const emailExistente = usuarios.some(
      (usuario) => usuario.email === dados.email
    )

    if (emailExistente) {
      throw new Error("E-mail já cadastrado")
    }

    const novo = {
      id: proximoId(),
      ...dados,
      perfil_id: 1,
      status: "ATIVO",
    }

    usuarios.push(novo)
    return novo
  },
  excluirUsuario(_, { filtro }) {
    const index = indiceUsuario(filtro)

    if (index < 0) return null

    const excluidos = usuarios.splice(index, 1)
    return excluidos ? excluidos[0] : null
  },
  alterarUsuario(_, {filtro, dados}) {
    const index = indiceUsuario(filtro)

    if (index < 0) return null

    const usuario = {
      ...usuarios[index],
      ...dados,
    }

    usuarios.splice(index, 1, usuario)

    return usuario
  },
}
