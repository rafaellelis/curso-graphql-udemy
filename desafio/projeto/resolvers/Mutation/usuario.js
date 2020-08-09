const db = require('../../config/db')
const { usuario: obterUsuario } = require('../Query/usuario')
const { perfil: obterPerfil } = require('../Query/perfil')
const bcrypt = require('bcrypt-nodejs')

const mutations = {
  registrarUsuario(_, { dados }) {
    return mutations.novoUsuario(_, {
      dados: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
      },
    })
  },
  async novoUsuario(_, { dados }, context) {
    context && context.validarAdmin()

    const { qtde } = await db('usuarios')
      .where({ email: dados.email })
      .count('* as qtde')
      .first()

    if (qtde > 0) {
      throw new Error(`Usuario já existe com o email: ${dados.email}`)
    }

    //se nenhum perfil setado, força a ter um usuário comum
    if (!dados.perfis || !dados.perfis.length) {
      dados.perfis = [{ nome: 'comum' }]
    }

    //criptografar a senha
    const salt = bcrypt.genSaltSync()
    dados.senha = bcrypt.hashSync(dados.senha, salt)

    const { nome, email, senha } = dados
    const [usuario] = await db('usuarios').insert({ nome, email, senha }, [
      'id',
      'nome',
      'email',
    ])

    for (const filtro of dados.perfis) {
      const perfil = await obterPerfil(_, { filtro })

      if (perfil) {
        await db('usuarios_perfis').insert({
          usuario_id: usuario.id,
          perfil_id: perfil.id,
        })
      }
    }

    return db('usuarios').where({ id: usuario.id }).first()
  },
  async excluirUsuario(_, { filtro }, context) {
    context && context.validarAdmin()

    if (!filtro.id && !filtro.email) {
      reject(new Error("Favor informar um 'id' ou 'email' para exclusão"))
    }

    const usuario = await obterUsuario(_, { filtro })

    if (!usuario) return null

    await db('usuarios_perfis').where({ usuario_id: usuario.id }).del()
    await db('usuarios').where({ id: usuario.id }).del()
    return usuario
  },
  async alterarUsuario(_, { filtro, dados }, context) {
    context && context.validarUsuarioFitro(filtro)

    try {
      if (!filtro.id && !filtro.email) {
        reject(new Error("Favor informar um 'id' ou 'email' para exclusão"))
      }

      const usuario = await obterUsuario(_, { filtro })

      if (!usuario) return null

      if (dados.senha) {
        const salt = bcrypt.genSaltSync()
        dados.senha = bcrypt.hashSync(dados.senha, salt)
      }

      const { perfis, ...outros } = dados

      await db('usuarios')
        .update({ ...usuario, ...outros })
        .where({ id: usuario.id })

      if (contexto.admin && perfis) {
        for (const filtro of perfis) {
          const perfil = await obterPerfil(_, { filtro })

          if (perfil) {
            const { qtde } = await db('usuarios_perfis')
              .where({ usuario_id: usuario.id, perfil_id: perfil.id })
              .count('* as qtde')
              .first()

            if (qtde == 0) {
              await db('usuarios_perfis').insert({
                usuario_id: usuario.id,
                perfil_id: perfil.id,
              })
            }
          }
        }
      }

      return db('usuarios').where({ id: usuario.id }).first()
    } catch (e) {
      throw new Error(e)
    }
  },
}

module.exports = mutations
