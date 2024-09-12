/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-import */
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-import
import { defineConfig } from "cypress";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { AppDataSource } from "./src/data-source";
import { Autor } from "./src/entity/Autor";
import { Trabalho } from "./src/entity/Trabalho";
import Genero from "./src/entity/Genero";
import Area from "./src/entity/Area";

// Função que gera CPFs válidos para uso em testes
function gerarCPF() {
  // Função mais realista que gera um CPF válido pode ser usada, caso necessário.
  return faker.number.int(99999999999).toString().padStart(11, "0"); // Gerando um número de 11 dígitos
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    setupNodeEvents(on, config) {
      on("task", {
        // Limpar banco de dados
        async limparBancoDeDados() {
          if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
          }

          const autorRepo = AppDataSource.getRepository(Autor);
          const trabalhoRepo = AppDataSource.getRepository(Trabalho);

          // Remover trabalhos e autores
          const trabalhos = await trabalhoRepo.find();
          await trabalhoRepo.remove(trabalhos);

          const autores = await autorRepo.find();
          await autorRepo.remove(autores);

          return null; // Certifique-se de que a task retorne null
        },

        // Popular banco de dados
        async popularBancoDeDados() {
          if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
          }

          const autorRepo = AppDataSource.getRepository(Autor);
          const trabalhoRepo = AppDataSource.getRepository(Trabalho);
          const QTDE_AUTORES = 10;
          const QTDE_TRABALHOS = 100;

          const autores: Autor[] = [];

          // Criar autores fictícios
          for (let i = 0; i < QTDE_AUTORES; i++) {
            const autor = new Autor();
            autor.nome = faker.person.fullName();
            autor.genero = Math.random() < 0.5 ? Genero.F : Genero.M; // 50% de chance de ser M ou F
            autor.cpf = gerarCPF(); // Usando a função para gerar CPF válido

            const autorSalvo = await autorRepo.save(autor);
            autores.push(autorSalvo);
          }

          // Criar trabalhos fictícios
          for (let i = 0; i < QTDE_TRABALHOS; i++) {
            const trabalho = new Trabalho();
            trabalho.titulo = faker.lorem.sentence();

            // Definir área e autores com base na iteração
            if (i < 20) {
              trabalho.area = Area.CAE;
              trabalho.autores = autores.slice(0, 2); // Primeiro par de autores
            } else if (i >= 20 && i < 40) {
              trabalho.area = Area.CBS;
              trabalho.autores = autores.slice(2, 4); // Segundo par de autores
            } else if (i >= 40 && i < 60) {
              trabalho.area = Area.CET;
              trabalho.autores = autores.slice(4, 6); // Terceiro par
            } else if (i >= 60 && i < 80) {
              trabalho.area = Area.CHCSA;
              trabalho.autores = autores.slice(6, 8); // Quarto par
            } else {
              trabalho.area = Area.MDIS;
              trabalho.autores = autores.slice(8); // Últimos autores
            }

            // Garantir que o código do trabalho tenha dois dígitos (ex: "CAE01")
            const numero = (i % 20) + 1;
            trabalho.codigo = `${trabalho.area}${numero.toString().padStart(2, "0")}`;

            await trabalhoRepo.save(trabalho); // Salvar trabalho no repositório
          }

          return null; // Certifique-se de que a task retorne null
        },
      });
    },
  },
});
