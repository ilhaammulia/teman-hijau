import supertest from "supertest";
import { web } from "../src/applications/web.js";
import { prismaClient } from "../src/applications/database.js";

describe("POST /api/users", () => {
  beforeEach(async () => {
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

  it("should reject register if request invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject register if request data type invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: 1,
      password: true,

      first_name: [],
      last_name: 209,
      role_id: 2,
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "ilham",
      password: "rahasia",

      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",

      role_id: "admin",
    });

    expect(result.status).toBe(201);
    expect(result.body.data.username).toBe("ilham");
  });
});
