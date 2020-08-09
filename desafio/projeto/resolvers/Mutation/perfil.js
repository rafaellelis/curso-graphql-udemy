const db = require('../../config/db')
const { perfil: obterPerfil } = require('../Query/perfil')

module.exports = {
  async novoPerfil(_, { dados }, context) {
    context && context.validarAdmin()

    try {
      const { qtde } = await db('perfis')
        .where({ nome: dados.nome })
        .count('* as qtde')
        .first()

      if (qtde > 0) {
        throw new Error(`Perfil já existe com o nome: ${dados.nome}`)
      }

      const [perfil] = await db('perfis').insert({ ...dados }, [
        'id',
        'nome',
        'rotulo',
      ])
      return perfil
    } catch (e) {
      throw new Error(e.sqlMessage)
    }
  },
  async excluirPerfil(_, { filtro }, contexto) {
    context && context.validarAdmin()

    if (!filtro.id && !filtro.nome) {
      throw new Error("Favor informar um 'id' ou 'nome' para exclusão")
    }

    const perfil = await obterPerfil(_, { filtro })

    if (!perfil) {
      return null
    }

    await db('usuarios_perfis').where({ perfil_id: perfil.id }).del()
    await db('perfis').where({ id: perfil.id }).del()
    return perfil
  },
  async alterarPerfil(_, { filtro, dados }, context) {
    context && context.validarAdmin()
    if (!filtro.id && !filtro.nome) {
      throw new Error("Favor informar um 'id' ou 'nome' para exclusão")
    }

    try {
      const perfil = await obterPerfil(_, { filtro })

      if (!perfil) {
        return null
      }

      const [perfilAlterado] = await db('perfis')
        .update({ ...perfil, ...dados }, ['id', 'nome', 'rotulo'])
        .where({ id: perfil.id })

      return perfilAlterado
    } catch (e) {
      throw new Error(e)
    }
  },
}
