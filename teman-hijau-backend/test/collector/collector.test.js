import { prismaClient } from "../../src/applications/database.js";
import supertest from "supertest";
import { logger } from "../../src/applications/logging.js";
import { web } from "../../src/applications/web.js";

describe("/api/collectors", () => {
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

    await prismaClient.collector.deleteMany();
  });

  describe("POST /api/collectors", () => {
    it("should reject if request empty", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const result = await supertest(web)
        .post("/api/collectors")
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
        .post("/api/collectors")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          name: true,
          address: 1,
        });

      expect(result.status).toEqual(400);
      expect(result.body.errors).toBeDefined();
    });

    it("should reject if not staff", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "user",
        password: "rahasia",
      });

      const result = await supertest(web)
        .post("/api/collectors")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          name: "Bank Sampah Test",
          address: "Jalan Kaliabu",
        });

      expect(result.status).toEqual(403);
      expect(result.body.errors).toBeDefined();
    });

    it("should can make organization", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const result = await supertest(web)
        .post("/api/collectors")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          name: "Bank Sampah Test",
          address: "Jalan Kaliabu",
        });

      expect(result.status).toEqual(201);
      expect(result.body.data).toBeDefined();
      expect(result.body.data.name).toEqual("Bank Sampah Test");
    });
  });

  describe("GET /api/collectors", () => {
    it("should reject if not staff", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "user",
        password: "rahasia",
      });

      const result = await supertest(web)
        .get("/api/collectors")
        .set("Authorization", `Bearer ${login.body.data.access_token}`);

      expect(result.status).toEqual(403);
      expect(result.body.errors).toBeDefined();
    });

    it("should can get collector", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const result = await supertest(web)
        .get("/api/collectors")
        .set("Authorization", `Bearer ${login.body.data.access_token}`);

      expect(result.status).toEqual(200);
      expect(result.body.data).toBeDefined();
      expect(result.body.data).toHaveLength(0);
    });
  });

  describe("PUT /api/collectors/:id", () => {
    it("should reject if id empty", async () => {
      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const result = await supertest(web)
        .put("/api/collectors/a")
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({});

      expect(result.status).toEqual(400);
      expect(result.body.errors).toBeDefined();
    });

    it("should reject if request invalid", async () => {
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
        .put(`/api/collectors/${collector.id}`)
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
        .put(`/api/collectors/10`)
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          name: "Bank Sampah Updated",
          address: "Jalan Kaliabu",
        });

      expect(result.status).toEqual(404);
      expect(result.body.errors).toBeDefined();
    });

    it("should reject if not staff", async () => {
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
        .put(`/api/collectors/${collector.id}`)
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          name: "Bank Sampah Updated",
          address: "Jalan Kaliabu",
        });

      expect(result.status).toEqual(403);
      expect(result.body.errors).toBeDefined();
    });

    it("should can update collector", async () => {
      const collector = await prismaClient.collector.create({
        data: {
          name: "Bank Sampah Test",
          address: "Jalan Kaliabu",
        },
      });

      const del = await prismaClient.collector.delete({
        where: { id: collector.id },
      });

      const find = await prismaClient.collector.findMany();

      logger.warn({ del, find });

      const login = await supertest(web).post("/api/users/login").send({
        username: "ilham",
        password: "rahasia",
      });

      const result = await supertest(web)
        .put(`/api/collectors/${collector.id}`)
        .set("Authorization", `Bearer ${login.body.data.access_token}`)
        .send({
          name: "Bank Sampah Updated",
          address: "Jalan Kaliabu",
        });

      expect(result.status).toEqual(200);
      expect(result.body.data).toBeDefined();
      expect(result.body.data.name).toEqual("Bank Sampah Updated");
    });
  });

  describe("DELETE /api/collectors/:id", () => {
    it("should reject if not staff", async () => {
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
        .delete(`/api/collectors/${collector.id}`)
        .set("Authorization", `Bearer ${login.body.data.access_token}`);

      expect(result.status).toEqual(403);
      expect(result.body.errors).toBeDefined();
    });

    it("should can delete collector", async () => {
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
        .delete(`/api/collectors/${collector.id}`)
        .set("Authorization", `Bearer ${login.body.data.access_token}`);

      expect(result.status).toEqual(200);
      expect(result.body.data).toBeDefined();
    });
  });
});
