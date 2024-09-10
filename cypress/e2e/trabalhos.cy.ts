/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-arrow-callback */
const requestOptionsPOST: Partial<Cypress.RequestOptions> = {
  method: "POST",
  url: "/trabalhos",
  failOnStatusCode: false,
};

describe("Testes sobre o endpoint POST /trabalhos", () => {
  before(() => {
    cy.task("limparBancoDeDados");
    cy.fixture("trabalho").as("trabalho");
    cy.fixture("trabalho_com_area_invalida").as("trabalhoComAreaInvalida");
    cy.fixture("trabalho_com_autor_com_cpf_invalido").as(
      "trabalhoComAutorComCPFInvalido",
    );
    cy.fixture("trabalho_com_autor_com_genero_invalido").as(
      "trabalhoComAutorComGeneroInvalido",
    );
    cy.fixture("trabalho_com_autor_com_nome_invalido").as(
      "trabalhoComAutorComNomeInvalido",
    );
    cy.fixture("trabalho_com_codigo_invalido").as("trabalhoComCodigoInvalido");
    cy.fixture("trabalho_com_mais_de_sete_autores").as(
      "trabalhoComMaisDeSeteAutores",
    );
    cy.fixture("trabalho_com_um_autor").as("trabalhoComUmAutor");
    cy.fixture("trabalho_sem_titulo").as("trabalhoSemTitulo");
  });

  it.only("deve salvar um trabalho com dados válidos", function () {
    requestOptionsPOST.body = this.trabalho;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(201);
      const { trabalho } = res.body;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(trabalho.id).to.not.null;
    });
  });

  it("não deve salvar um trabalho com título vazio ou nulo", function () {
    requestOptionsPOST.body = this.trabalhoSemTitulo;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O título do trabalho não pode ser vazio",
      );
    });
  });

  it("não deve salvar um trabalho com menos de 2 autores", function () {
    requestOptionsPOST.body = this.trabalhoComUmAutor;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O trabalho deve conter entre 2 e 7 autores",
      );
    });
  });

  it("não deve salvar um trabalho com mais de 7 autores", function () {
    requestOptionsPOST.body = this.trabalhoComMaisDeSeteAutores;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O trabalho deve conter entre 2 e 7 autores",
      );
    });
  });

  it("não deve salvar um trabalho com uma área inválida", function () {
    requestOptionsPOST.body = this.trabalhoComAreaInvalida;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "A área do trabalho deve ser uma dentre as opções: CAE, CET, CBS, CHCSA e MDIS.",
      );
    });
  });

  it("não deve salvar um trabalho com um código inválido", function () {
    requestOptionsPOST.body = this.trabalhoComCodigoInvalido;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O código do trabalho deve ser composto pelo código da área seguido por 2 dígitos.",
      );
    });
  });

  it("não deve salvar um trabalho com autor com nome inválido", function () {
    requestOptionsPOST.body = this.trabalhoComAutorComNomeInvalido;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "Os nomes dos autores devem conter nome e sobrenome.",
      );
    });
  });

  it("não deve salvar um trabalho com autor com gênero inválido", function () {
    requestOptionsPOST.body = this.trabalhoComAutorComGeneroInvalido;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O gênero de cada autor deve ser uma dentre as opções M ou F.",
      );
    });
  });

  it("não deve salvar um trabalho com autor com CPF inválido", function () {
    requestOptionsPOST.body = this.trabalhoComAutorComCPFInvalido;

    cy.request(requestOptionsPOST).then((res) => {
      expect(res.status).to.equal(400);
      const { mensagensDeErro } = res.body;
      expect(mensagensDeErro[0]).to.equal(
        "O CPF de cada autor deve conter 11 dígitos e não possuir máscara.",
      );
    });
  });
});

/* eslint-disable prefer-arrow-callback */
const requestOptionsGET: Partial<Cypress.RequestOptions> = {
  method: "GET",
  url: "/trabalhos/area/:codArea",
  failOnStatusCode: false,
};

describe("Testes sobre o endpoint GET /trabalhos/area/:codArea", () => {
  before(() => {
    cy.task("limparBancoDeDados");
    cy.task("popularBancoDeDados");
  });

  it("deve recuperar todos os trabalhos de uma determinada área válida", () => {
    const codArea = "CET";
    requestOptionsGET.url = requestOptionsGET.url.replace(":codArea", codArea);

    cy.request(requestOptionsGET).then((res) => {
      expect(res.status).to.equal(200);
      const { trabalhos } = res.body;

      expect(trabalhos.length).to.greaterThan(0);

      for (let i = 0; i < trabalhos.length; i++) {
        expect(trabalhos[i].area).to.equal(codArea);
      }
    });
  });

  it("não deve recuperar trabalhos de uma área inválida", () => {
    const codArea = "Saúde";
    requestOptionsGET.url = requestOptionsGET.url.replace(":codArea", codArea);

    cy.request(requestOptionsGET).then((res) => {
      expect(res.status).to.equal(200);
      const { trabalhos } = res.body;

      expect(trabalhos.length).to.equal(0);
    });
  });
});