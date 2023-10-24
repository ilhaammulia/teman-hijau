import { prismaClient } from "../src/applications/database.js";
import bcrypt from "bcrypt";

const Roles = async () => {
  await prismaClient.role.createMany({
    data: [
      { id: "user", name: "User", is_staff: false },
      { id: "staff", name: "Staff", is_staff: true },
      { id: "admin", name: "Administrator", is_staff: true },
    ],
    skipDuplicates: true,
  });
};

const Organization = async () => {
  await prismaClient.organization.create({
    data: {
      name: "Bank Sampah Kaliabu",
      address: "Jalan Kaliabu, No. 12",
    },
  });
};

const CreateAdmin = async () => {
  const ADMIN_USERNAME = "admin";

  await prismaClient.user.create({
    data: {
      username: ADMIN_USERNAME,
      first_name: "Ilham",
      last_name: "Mulia",
      email: "ilham@gmail.com",
      profile_photo: "",
    },
  });

  await prismaClient.wallet.create({
    data: {
      username: ADMIN_USERNAME,
    },
  });

  await prismaClient.authentication.create({
    data: {
      username: ADMIN_USERNAME,
      password: await bcrypt.hash("password", 10),
      role_id: "admin",
    },
    select: {
      username: true,
      role_id: true,
    },
  });
};

Promise.all([await Roles(), await Organization(), await CreateAdmin()]);
