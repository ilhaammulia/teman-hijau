import supertest from "supertest";
import { web } from "../../src/applications/web.js";
import { prismaClient } from "../../src/applications/database.js";
import { logger } from "../../src/applications/logging.js";

describe("GET /api/users", () => {
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
    const result = await supertest(web).get("/api/users");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if authorization is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users")
      .set("authorization", `Bearer token`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("should can fetch their profile", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .get("/api/users")
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.profile).toBeDefined();
  });
});
