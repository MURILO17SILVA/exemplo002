import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Autor } from "../entity/Autor";
import { Trabalho } from "../entity/Trabalho";
import Area from "../entity/Area";
import Genero from "../entity/Genero";

export default class TrabalhoController {
  async salvar(req: Request, res: Response) {
    const { titulo, area, codigo, autores } = req.body;

    const mensagensDeErro: string[] = [];

    if (!titulo || titulo.trim().length === 0) {
      mensagensDeErro.push("O título do trabalho não pode ser vazio");
    }

    if (!Object.values(Area).includes(area)) {
      mensagensDeErro.push(
        "A área do trabalho deve ser uma dentre as opções: CAE, CET, CBS, CHCSA e MDIS."
      );
    }

    if (!/^[A-Z]{3}\d{2}$/.test(codigo)) {
      mensagensDeErro.push(
        "O código do trabalho deve ser composto pelo código da área seguido por 2 dígitos."
      );
    }

    if (autores.length < 2 || autores.length > 7) {
      mensagensDeErro.push("O trabalho deve conter entre 2 e 7 autores");
    }

    autores.forEach((autor: any) => {
      if (!autor.nome || autor.nome.trim().length === 0) {
        mensagensDeErro.push("Os nomes dos autores devem conter nome e sobrenome.");
      }

      if (!Object.values(Genero).includes(autor.genero)) {
        mensagensDeErro.push("O gênero de cada autor deve ser uma dentre as opções M ou F.");
      }

      if (!/^\d{11}$/.test(autor.cpf)) {
        mensagensDeErro.push("O CPF de cada autor deve conter 11 dígitos e não possuir máscara.");
      }
    });

    if (mensagensDeErro.length > 0) {
      return res.status(400).json({ mensagensDeErro });
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const autoresSalvos: Autor[] = [];

      for (const autorData of autores) {
        const autor = new Autor();
        Object.assign(autor, autorData);
        const autorSalvo = await transactionalEntityManager.save(autor);
        autoresSalvos.push(autorSalvo);
      }

      const trabalho = new Trabalho();
      trabalho.area = area;
      trabalho.codigo = codigo;
      trabalho.titulo = titulo;
      trabalho.autores = autoresSalvos;

      const trabalhoSalvo = await transactionalEntityManager.save(trabalho);
      return res.status(201).json({ trabalho: trabalhoSalvo });
    });
  }

  async buscarPorArea(req: Request, res: Response) {
    const { codArea } = req.params;

    if (!Object.values(Area).includes(codArea as Area)) {
      return res.status(400).json({ mensagensDeErro: ["Área inválida"] });
    }

    const trabalhos = await AppDataSource.getRepository(Trabalho).find({
      where: { area: codArea },
    });

    return res.status(200).json({ trabalhos });
  }
}
