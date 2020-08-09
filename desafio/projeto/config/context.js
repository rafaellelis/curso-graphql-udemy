const jwt = require('jwt-simple')
const { usuarios } = require('../resolvers/Type/Perfil')

module.exports = async ({ req }) => {
  //dev
  //await require('./simularUsuarioLogado')(req)

  const auth = req.headers.authorization
  const token = auth && auth.substring(7)

  let usuario = null
  let admin = false

  if (token) {
    try {
      let conteudoToken = jwt.decode(token, process.env.APP_AUTH_SECRET)

      //verifica se o token está expirado
      if (new Date(conteudoToken.exp * 1000) > new Date()) {
        usuario = { ...conteudoToken }
      }
    } catch (error) {}
  }

  if (usuario && usuario.perfis) {
    admin = usuario.perfis.includes('admin')
  }

  const err = new Error('Acesso negado!')

  return {
    usuario,
    admin,
    validarUsuario() {
      if (!usuario) throw err
    },
    validarAdmin() {
      if (!admin) throw err
    },
    validarUsuarioFitro(filtro) {
      if (admin) return

      if (!usuario) throw err
      if (!filtro) throw err

      const { id, email } = filtro
      if (!id && !email) throw err

      if (id && id !== usuario.id) throw err
      if (email && email !== usuario.email) throw err
    },
  }
}
