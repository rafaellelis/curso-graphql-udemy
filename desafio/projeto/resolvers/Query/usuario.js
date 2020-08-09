const db = require('../../config/db')
const bcrypt = require('bcrypt-nodejs')
const { getUsuarioLogado } = require('../comum/usuario')

module.exports = {
  async login(_, { dados }) {
    const usuario = await db('usuarios').where({ email: dados.email }).first()

    if (!usuario) {
      throw new Error('Usuario/senha inválida')
    }

    const senhasIguais = bcrypt.compareSync(dados.senha, usuario.senha)

    if (!senhasIguais) {
      throw new Error('Usuario/senha inválida')
    }

    return getUsuarioLogado(usuario)
  },
  usuarios(parent, args, context) {
    context && context.validarAdmin()

    return db('usuarios')
  },
  usuario(_, { filtro }, context) {
    context && context.validarUsuarioFitro(filtro)

    if (filtro) {
      const { id, email } = filtro

      return db('usuarios')
        .where((qb) => {
          if (id) {
            qb.where({ id })
          } else if (email) {
            qb.where({ email })
          }
        })
        .first()
    }

    return null
  },
}
