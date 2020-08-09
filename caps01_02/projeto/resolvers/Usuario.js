const { perfis } = require("../data/db")

module.exports = {
  salario(usuario) {
    return usuario.salario_real
  },
  perfil(usuario) {
    const sel = perfis.filter((p) => p.id === usuario.perfil_id)
    return sel ? sel[0] : null
  },
}
