let id = 1

function proximoId(){
  return id++
}

const usuarios = [
  {
    id: proximoId(),
    nome: "João Silva",
    email: "jsilva@zemail.com",
    idade: 29,
    vip: true,
    perfil_id: 1,
    status: 'ATIVO'
  },
  {
    id: proximoId(),
    nome: "Mário Andrade",
    email: "mandrade@zemail.com",
    idade: 27,
    vip: false,
    perfil_id: 2,
    status: 'INATIVO'
  },
  {
    id: proximoId(),
    nome: "Alice Dantas",
    email: "adantas@zemail.com",
    idade: 24,
    vip: false,
    perfil_id: 1,
    status: 'BLOQUEADO'
  },
]

const perfis = [
  { id: proximoId(), nome: "Comum" },
  { id: proximoId(), nome: "Administrador" },
]

module.exports = { usuarios, perfis, proximoId }
