import { prismaClient } from "../../src/applications/database.js";
import supertest from "supertest";
import { logger } from "../../src/applications/logging.js";
import { web } from "../../src/applications/web.js";

describe("/api/collectors/transaction", () => {
  beforeAll(() => {
    logger.silent = true;
  });
  afterAll(() => {
    logger.silent = false;
  });

  beforeEach(async () => {
    const category = await prismaClient.category.create({
      data: {
        name: "Kaca",
      },
      select: {
        id: true,
      },
    });

    await prismaClient.garbage.create({
      data: {
        name: "Botol Minuman",
        category_id: category.id,
        buy_price: 200,
        sell_price: 500,
        stock: 1.5,
        unit: "KG",
      },
    });

    await supertest(web).post("/api/users").send({
      username: "ilham",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",

      role_id: "admin",
    });

    await supertest(web).post("/api/users").send({
      username: "staff",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",

      role_id: "staff",
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

    await prismaClient.collector.deleteMany();
  });

  it("should can't create transaction if not staff", async () => {
    const garbage = await prismaClient.garbage.findFirst();
    const collector = await prismaClient.collector.create({
      data: {
        name: "Bank Sampah Test",
        address: "Jalan Kaliabu",
      },
    });

    const login = await supertest(web).post("/api/users/login").send({
      username: "user",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/collectors/transaction")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        garbage_id: garbage.id,
        collector_id: collector.id,
        organization_id: 1,
        qty: 1,
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should can't create transaction if qty more than stock", async () => {
    const garbage = await prismaClient.garbage.findFirst();
    const collector = await prismaClient.collector.create({
      data: {
        name: "Bank Sampah Test",
        address: "Jalan Kaliabu",
      },
    });

    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/collectors/transaction")
      .set("Authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        garbage_id: garbage.id,
        collector_id: collector.id,
        organization_id: 1,
        qty: 2,
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});
