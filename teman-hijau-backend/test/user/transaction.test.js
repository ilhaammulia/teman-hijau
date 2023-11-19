import supertest from "supertest";
import { web } from "../../src/applications/web.js";
import { prismaClient } from "../../src/applications/database.js";
import { logger } from "../../src/applications/logging.js";

describe("/api/users/transaction", () => {
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
    await prismaClient.userTransaction.deleteMany();

    await prismaClient.user.deleteMany();

    await prismaClient.authentication.deleteMany();

    await prismaClient.wallet.deleteMany();

    await prismaClient.garbage.deleteMany();
    await prismaClient.category.deleteMany();
  });

  describe("POST /api/users/transaction", () => {
    it("should reject if request empty", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const result = await supertest(web)
        .post("/api/users/transactions")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({});

      expect(result.status).toEqual(400);
      expect(result.body.errors).toBeDefined();
    });

    it("should reject if request invalid", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const result = await supertest(web)
        .post("/api/users/transactions")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          garbage_id: true,
          user_id: 100,
          organization_id: false,
          qty: "10",
        });

      expect(result.status).toEqual(400);
      expect(result.body.errors).toBeDefined();
    });

    it("should reject if not staff", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "user",
        password: "rahasia",
      });

      const organization = await prismaClient.organization.create({
        data: {
          name: "Bank Sampah Kaliabu",
          address: "Jalan Kaliabu, No. 12",
        },
      });

      const category = await prismaClient.category.create({
        data: {
          name: "Kaca",
        },
      });

      const garbage = await prismaClient.garbage.create({
        data: {
          name: "Botol Kaca",
          category_id: category.id,
          unit: "KG",
          buy_price: 5000,
          sell_price: 7000,
          stock: 10,
        },
      });

      const result = await supertest(web)
        .post("/api/users/transactions")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          garbage_id: garbage.id,
          user_id: "user",
          organization_id: organization.id,
          qty: 3.5,
        });

      expect(result.status).toEqual(403);
      expect(result.body.errors).toBeDefined();
    });

    it("should can make transaction", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const organization = await prismaClient.organization.create({
        data: {
          name: "Bank Sampah Kaliabu",
          address: "Jalan Kaliabu, No. 12",
        },
      });

      const category = await prismaClient.category.create({
        data: {
          name: "Kaca",
        },
      });

      const garbage = await prismaClient.garbage.create({
        data: {
          name: "Botol Kaca",
          category_id: category.id,
          unit: "KG",
          buy_price: 5000,
          sell_price: 7000,
          stock: 10,
        },
      });

      const result = await supertest(web)
        .post("/api/users/transactions")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          garbage_id: garbage.id,
          user_id: "user",
          organization_id: organization.id,
          qty: 3.5,
        });

      expect(result.status).toEqual(201);
      expect(result.body.data).toBeDefined();
    });
  });
});
