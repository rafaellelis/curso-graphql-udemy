const db = require('../../config/db')

module.exports = {
  perfis(parent, args, context) {
    context && context.validarAdmin()

    return db('perfis')
  },
  perfil(_, { filtro }, context) {
    context && context.validarAdmin()

    if (filtro) {
      const { id, nome } = filtro

      return db('perfis')
        .where((qb) => {
          if (id) {
            qb.where({ id })
          } else if (nome) {
            qb.where({ nome })
          }
        })
        .first()
    }

    return null
  },
}
