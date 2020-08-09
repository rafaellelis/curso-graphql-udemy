const { perfis, proximoId } = require("../../data/db")

function indicePerfil(filtro) {
  if (!filtro) return -1

  const { id, nome } = filtro
  if (id) {
    return perfis.findIndex((perfil) => perfil.id === id)
  } else if (email) {
    return perfis.findIndex((perfil) => perfil.nome === nome)
  }

  return -1
}

module.exports = {
  novoPerfil(_, { dados }) {
    const nomeExistente = perfis.some((perfil) => perfil.nome === dados.nome)

    if (nomeExistente) throw new Error("Perfil já existente")

    const novoPerfil = {
      id: proximoId(),
      nome: dados.nome,
    }

    perfis.push(novoPerfil)

    return novoPerfil
  },
  excluirPerfil(_, { filtro }) {
    const index = indicePerfil(filtro)

    if (index < 0) return null

    const excluidos = perfis.splice(index, 1)

    return excluidos ? excluidos[0] : null
  },
  alterarPerfil(_, { filtro, dados }) {
    const index = indicePerfil(filtro)

    if (index < 0) return null

    const alterado = {
      ...perfis[index],
      ...dados,
    }

    perfis.splice(index, 1, alterado)

    return alterado
  },
}
