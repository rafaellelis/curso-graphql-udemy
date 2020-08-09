const jwt = require('jwt-simple')
const { perfis: obterPerfis } = require('../Type/Usuario')

//gera o token
module.exports = {
  async getUsuarioLogado(usuario) {
    const perfis = await obterPerfis(usuario)
    const agora = Math.floor(Date.now() / 1000)

    const usuarioInfo = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfis: perfis.map((p) => p.nome),
      iat: agora,
      exp: agora + (3 * 24 * 60 * 60) //3 dias
    }

    const authSecret = process.env.APP_AUTH_SECRET

    return {
        ...usuarioInfo,
        token: jwt.encode(usuarioInfo, authSecret)
    }
  },
}
