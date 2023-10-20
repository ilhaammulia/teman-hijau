import { prismaClient } from "../../src/applications/database.js";
import supertest from "supertest";
import { logger } from "../../src/applications/logging.js";
import { web } from "../../src/applications/web.js";

describe("POST /garbages/categories", () => {
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
    await prismaClient.user.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.authentication.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.wallet.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.category.deleteMany();
  });

  it("should reject if request missing", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/garbages/categories")
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
      .post("/api/garbages/categories")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: true,
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if user not staff", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "user",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/garbages/categories")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Kaca",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should can create garbage category", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .post("/api/garbages/categories")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Kaca",
      });

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.name).toBe("Kaca");
  });
});

describe("GET /garbages/categories", () => {
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
    await prismaClient.user.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.authentication.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.wallet.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.category.deleteMany();
  });

  it("should reject if user not staff", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "user",
      password: "rahasia",
    });

    const result = await supertest(web)
      .get("/api/garbages/categories")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Kaca",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should can get garbage categories", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .get("/api/garbages/categories")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Kaca",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });
});

describe("PUT /garbages/categories/:id", () => {
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
    await prismaClient.user.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.authentication.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.wallet.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.category.deleteMany();
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
      .put(`/api/garbages/categories/${category.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Plastik",
      });

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id is unknown", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .put("/api/garbages/categories/9")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Kaca",
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id is missing", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .put("/api/garbages/categories/")
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Kaca",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if request invalid", async () => {
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
      .put(`/api/garbages/categories/${category.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: true,
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should can update category", async () => {
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
      .put(`/api/garbages/categories/${category.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`)
      .send({
        name: "Plastik",
      });

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });
});

describe("DELETE /garbages/categories/:id", () => {
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
    await prismaClient.user.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.authentication.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.wallet.deleteMany({
      where: {
        OR: [{ username: "ilham" }, { username: "user" }],
      },
    });

    await prismaClient.category.deleteMany();
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
      .delete(`/api/garbages/categories/${category.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(403);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id is unknown", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .delete("/api/garbages/categories/9")
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if id is missing", async () => {
    const login = await supertest(web).post("/api/users/login").send({
      username: "ilham",
      password: "rahasia",
    });

    const result = await supertest(web)
      .delete("/api/garbages/categories/")
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should can delete category", async () => {
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
      .delete(`/api/garbages/categories/${category.id}`)
      .set("authorization", `Bearer ${login.body.data.access_token}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });
});
