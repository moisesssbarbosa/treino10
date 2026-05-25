import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Gerando dados automaticamente...');

  // Limpa o banco de dados
  await prisma.convidado.deleteMany({});
  await prisma.usuario.deleteMany({});

  const senhaCriptografada = await bcrypt.hash('123456', 10);

  // Criar Usuários Obrigatórios
  await prisma.usuario.create({
    data: { nome: 'Admin', email: 'admin@weddingpass.com', cpf: '11111111111', cargo: true, senha: senhaCriptografada }
  });

  await prisma.usuario.create({
    data: { nome: 'Staff', email: 'staff@weddingpass.com', cpf: '22222222222', cargo: false, senha: senhaCriptografada }
  });

  // 🔥 A MÁGICA DA AUTOMAÇÃO: GERANDO OS 30 CONVIDADOS COM UM LAÇO FOR
  const listaConvidados: Prisma.ConvidadoCreateManyInput[] = [] ;

  for (let i = 1; i <= 30; i++) {
    // Garante que o CPF tenha sempre 11 dígitos preenchendo com zeros à esquerda (ex: 00000000001)
    const cpfFake = String(i).padStart(11, '0'); 
    listaConvidados.push({
      nome: `Convidado${i}`,
      sobrenome: `Sobrenome${i}`,
      email: `convidado${i}@email.com`,
      mesa: (i % 5) + 1, // Distribui as mesas entre 1 e 5
      cpf: cpfFake,
      telefone: `5199999${String(i).padStart(4, '0')}`, // Telefones dinâmicos válidos
      status_checkin: i % 2 === 0 // Metade dos convidados (os pares) começam com check-in feito
    });
  }

  // Insere todos os 30 de uma vez só!
  await prisma.convidado.createMany({
    data: listaConvidados,
  });

  console.log('✅ Tudo populado sem esforço!');
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });