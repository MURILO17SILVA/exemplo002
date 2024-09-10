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

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      on("task", {
        async limparBancoDeDados() {
          await AppDataSource.initialize();
          const autorRepo = AppDataSource.getRepository(Autor);
          const trabalhoRepo = AppDataSource.getRepository(Trabalho);
          let trabalhos = await trabalhoRepo.find();
          await trabalhoRepo.remove(trabalhos);
          trabalhos = await trabalhoRepo.find();
          console.log(trabalhos);

          let autores = await autorRepo.find();
          await autorRepo.remove(autores);
          autores = await autorRepo.find();
          console.log(autores);

          return null;
        },

        async popularBancoDeDados() {
          await AppDataSource.initialize();
          const autorRepo = AppDataSource.getRepository(Autor);
          const trabalhoRepo = AppDataSource.getRepository(Trabalho);
          const QTDE_AUTORES = 10;
          const QTDE_TRABALHOS = 100;

          const autores: Autor[] = [];

          for (let i = 0; i < QTDE_AUTORES; i++) {
            const autor = new Autor();
            autor.nome = faker.person.fullName();
            autor.genero =
              Math.ceil(Math.random() % 2) === 0 ? Genero.F : Genero.M;
            autor.cpf = "99999999999";

            const autorSalvo = await autorRepo.save(autor);
            autores.push(autorSalvo);
          }

          for (let i = 0; i < QTDE_TRABALHOS; i++) {
            const trabalho = new Trabalho();
            trabalho.titulo = faker.lorem.sentence();

            if (i < 20) {
              trabalho.area = Area.CAE;
              trabalho.autores = autores.slice(0, 2);
            } else if (i >= 20 && i < 40) {
              trabalho.area = Area.CBS;
              trabalho.autores = autores.slice(2, 4);
            } else if (i >= 40 && i < 60) {
              trabalho.area = Area.CET;
              trabalho.autores = autores.slice(4, 6);
            } else if (i >= 60 && i < 80) {
              trabalho.area = Area.CHCSA;
              trabalho.autores = autores.slice(6, 8);
            } else {
              trabalho.area = Area.MDIS;
              trabalho.autores = autores.slice(8);
            }

            const numero = i + 1;
            trabalho.codigo = `${trabalho.area}${numero < 10 ? `0${numero}` : numero}`;

            await trabalhoRepo.save(trabalho);
          }
        },
      });
    },
  },
});
