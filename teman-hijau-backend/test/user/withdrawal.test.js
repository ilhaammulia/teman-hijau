import supertest from "supertest";
import { web } from "../../src/applications/web.js";
import { prismaClient } from "../../src/applications/database.js";
import { logger } from "../../src/applications/logging.js";

describe("GET /api/users/withdrawals", () => {
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
  });

  afterEach(async () => {
    await prismaClient.user.deleteMany({
      where: {
        username: "ilham",
      },
    });

    await prismaClient.authentication.deleteMany({
      where: {
        username: "ilham",
      },
    });

    await prismaClient.wallet.deleteMany({
      where: {
        username: "ilham",
      },
    });
  });

  it("should reject if authorization is missing", async () => {
    const result = await supertest(web).get("/api/users/withdrawals");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if authorization is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/withdrawals")
      .set("authorization", `Bearer token`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should can fetch their withdrawal history", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .get("/api/users/withdrawals")
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });
});

describe("POST /api/users/withdrawals", () => {
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
  });

  afterEach(async () => {
    await prismaClient.userWithdrawal.deleteMany({
      where: {
        user_id: "ilham",
      },
    });

    await prismaClient.user.deleteMany({
      where: {
        username: "ilham",
      },
    });

    await prismaClient.authentication.deleteMany({
      where: {
        username: "ilham",
      },
    });

    await prismaClient.wallet.deleteMany({
      where: {
        username: "ilham",
      },
    });
  });

  it("should reject if authorization is missing", async () => {
    const result = await supertest(web).get("/api/users/withdrawals");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if authorization is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/withdrawals")
      .set("authorization", `Bearer token`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request body is missing", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/users/withdrawals")
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
      .post("/api/users/withdrawals")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        amount: true,
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if amount less than user balance", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/users/withdrawals")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        amount: 10000,
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should can request withdrawal", async () => {
    await prismaClient.wallet.update({
      data: { balance: 20000 },
      where: { username: "ilham" },
    });

    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/users/withdrawals")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        amount: 10000,
      });

    expect(result.status).toBe(200);
    expect(result.body.data.amount).toEqual("10000");
  });
});
