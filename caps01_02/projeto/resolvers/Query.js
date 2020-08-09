const {usuarios, perfis} = require('../data/db')

module.exports = {
      usuarios() {
        return usuarios
      },
      usuario(_, { id }) {
        const selecionados = usuarios.filter((u) => u.id === id)
        return selecionados ? selecionados[0] : null
      },
      perfis() {
        return perfis
      },
      perfil(_, { id }) {
        const sel = perfis.filter((p) => p.id === id)
        return sel ? sel[0] : null
      },
}