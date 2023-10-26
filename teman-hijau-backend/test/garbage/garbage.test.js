import { prismaClient } from "../../src/applications/database.js";
import supertest from "supertest";
import { logger } from "../../src/applications/logging.js";
import { web } from "../../src/applications/web.js";

describe("POST /api/garbages", () => {
  beforeAll(() => {
    logger.silent = true;
  });
  afterAll(() => {
    logger.silent = false;
  });

  beforeEach(async () => {
    await supertest(web).post("/api/users").send({
      username: "ilham",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",

      role_id: "admin",
    });

    await supertest(web).post("/api/users").send({
      username: "user",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham2@gmail.com",

      role_id: "user",
    });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany();

    await prismaClient.authentication.deleteMany();

    await prismaClient.wallet.deleteMany();

    await prismaClient.garbage.deleteMany();
    await prismaClient.category.deleteMany();
  });

  it("should reject if request missing", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/garbages")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({});

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request invalid", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/garbages")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: true,
        category_id: [],
        buy_price: "nol",
        sell_price: "two",
        stock: [],
        unit: "KG",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if user not staff", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "user",
      password: "rahasia",
    });
    const category = await prismaClient.category.create({
      data: {
        name: "Kaca",
      },
      select: {
        id: true,
      },
    });
    const result = await supertest(web)
      .post("/api/garbages")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should can create garbage", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const category = await prismaClient.category.create({
      data: {
        name: "Kaca",
      },
      select: {
        id: true,
      },
    });
    const result = await supertest(web)
      .post("/api/garbages")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      });

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.name).toBe("Botol Minuman");
  });
});

describe("GET /api/garbages", () => {
  beforeAll(() => {
    logger.silent = true;
  });
  afterAll(() => {
    logger.silent = false;
  });

  beforeEach(async () => {
    await supertest(web).post("/api/users").send({
      username: "ilham",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",

      role_id: "admin",
    });

    await supertest(web).post("/api/users").send({
      username: "user",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham2@gmail.com",

      role_id: "user",
    });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany();

    await prismaClient.authentication.deleteMany();

    await prismaClient.wallet.deleteMany();

    await prismaClient.garbage.deleteMany();
    await prismaClient.category.deleteMany();
  });

  it("should reject if user not staff", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "user",
      password: "rahasia",
    });

    const result = await supertest(web)
      .get("/api/garbages")
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should can get garbage list", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .get("/api/garbages")
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });
});

describe("PUT /api/garbages/:id", () => {
  beforeAll(() => {
    logger.silent = true;
  });
  afterAll(() => {
    logger.silent = false;
  });

  beforeEach(async () => {
    await supertest(web).post("/api/users").send({
      username: "ilham",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",

      role_id: "admin",
    });

    await supertest(web).post("/api/users").send({
      username: "user",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham2@gmail.com",

      role_id: "user",
    });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany();

    await prismaClient.authentication.deleteMany();

    await prismaClient.wallet.deleteMany();

    await prismaClient.garbage.deleteMany();
    await prismaClient.category.deleteMany();
  });

  it("should reject if id not found", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .put("/api/garbages/9")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Botol Minuman",
        category_id: 1,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request missing", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const category = await prismaClient.category.create({
      data: {
        name: "Kaca",
      },
      select: {
        id: true,
      },
    });

    const garbage = await prismaClient.garbage.create({
      data: {
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      },
      select: {
        id: true,
      },
    });

    const result = await supertest(web)
      .put(`/api/garbages/${garbage.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({});

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if user not staff", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "user",
      password: "rahasia",
    });
    const category = await prismaClient.category.create({
      data: {
        name: "Kaca",
      },
      select: {
        id: true,
      },
    });

    const garbage = await prismaClient.garbage.create({
      data: {
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      },
      select: {
        id: true,
      },
    });
    const result = await supertest(web)
      .put(`/api/garbages/${garbage.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should can update garbage details", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });
    const category = await prismaClient.category.create({
      data: {
        name: "Kaca",
      },
      select: {
        id: true,
      },
    });

    const garbage = await prismaClient.garbage.create({
      data: {
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      },
      select: {
        id: true,
      },
    });
    const result = await supertest(web)
      .put(`/api/garbages/${garbage.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Botol Minuman Kaleng",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Botol Minuman Kaleng");
  });
});

describe("DELETE /api/garbages/:id", () => {
  beforeAll(() => {
    logger.silent = true;
  });
  afterAll(() => {
    logger.silent = false;
  });

  beforeEach(async () => {
    await supertest(web).post("/api/users").send({
      username: "ilham",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",

      role_id: "admin",
    });

    await supertest(web).post("/api/users").send({
      username: "user",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham2@gmail.com",

      role_id: "user",
    });
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany();

    await prismaClient.authentication.deleteMany();

    await prismaClient.wallet.deleteMany();

    await prismaClient.garbage.deleteMany();
    await prismaClient.category.deleteMany();
  });

  it("should reject if id not found", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .delete("/api/garbages/9")
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if user not staff", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "user",
      password: "rahasia",
    });

    const result = await supertest(web)
      .delete(`/api/garbages/1`)
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should can delete garbage", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });
    const category = await prismaClient.category.create({
      data: {
        name: "Kaca",
      },
      select: {
        id: true,
      },
    });

    const garbage = await prismaClient.garbage.create({
      data: {
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      },
      select: {
        id: true,
      },
    });
    const result = await supertest(web)
      .delete(`/api/garbages/${garbage.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("Botol Minuman");
  });
});
