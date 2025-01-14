const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
  it("Testeando la ruta cafes con una peticion get", async () => {
    const response = await request(server).get("/cafes").send();
    const status = response.statusCode;
    expect(status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Devuelve error 404 al hacer una petición GET a una ruta inexistente", async () => {
    const response = await request(server).get("/cafeFar").send();
    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });


  it("Devuelve error 404", async () => {
    const idInexistente = "1000";
    const token = "jwt";
    const response = await request(server)
      .delete(`/cafes/${idInexistente}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "No se encontró ningún cafe con ese id"
    );
  });


  it("Testeando la peticion POST para que al agregar un nuevo café y devuelve un código 201", async () => {
    const id = Math.floor(Math.random() * 999);
    const nuevoCafe = {
      id,
      nombre: "Café Especial",
      precio: 3.5,
      descripcion: "Una deliciosa mezcla de café especial",
    };
    const response = await request(server).post("/cafes").send(nuevoCafe);

    expect(response.status).toBe(201);
    expect(response.body).toContainEqual(nuevoCafe);
  });

  it("Devuelve error 400 y mensaje adecuado al intentar agregar un café con un ID existente", async () => {
    const idExistente = 1;
    const cafeExistente = {
      id: idExistente,
      nombre: "Café Existente",
      precio: 3.0,
      descripcion: "Un café que ya está en la lista",
    };

    const response = await request(server).post("/cafes").send(cafeExistente);
 
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Ya existe un cafe con ese id" });
  });



  it("Devuelve status code 400 si el id no coincide", async () => {
    const idParametros = 1;
    const idPayload = 2;
    const cafeActualizado = {
      id: idPayload,
      nombre: "Café Actualizado",
      precio: 4.0,
      descripcion: "Un café recién actualizado",
    };

    const response = await request(server)
      .put(`/cafes/${idParametros}`)
      .send(cafeActualizado);

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      message: "El id del parámetro no coincide con el id del café recibido",
    });

  });
  it("Devuelve error 404 al intentar actualizar un café con un ID inexistente", async () => {
    const idInexistente = "1000";
    const nuevoCafe = {
      id: idInexistente,
      nombre: "Café Especial",
      precio: 3.5,
      descripcion: "Una deliciosa mezcla de café especial",
    };
    const response = await request(server)
      .put(`/cafes/${idInexistente}`)
      .send(nuevoCafe);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "No se encontró ningún café con ese id"
    );
  });
});
