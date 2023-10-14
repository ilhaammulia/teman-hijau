import { prismaClient } from "../applications/database.js";
import { ResponseError } from "../exceptions/response-error.js";
import { validate } from "../validations/validate.js";
import { registerUserValidation } from "../validations/user-validation.js";
import bcrypt from "bcrypt";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      OR: [{ username: user.username }, { email: user.email }],
    },
  });

  if (countUser) {
    throw new ResponseError(400, "Username telah digunakan.");
  }

  user.password = await bcrypt.hash(user.password, 10);

  await prismaClient.user.create({
    data: {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_photo: "",
    },
  });

  await prismaClient.wallet.create({
    data: {
      username: user.username,
    },
  });

  return prismaClient.authentication.create({
    data: {
      username: user.username,
      password: user.password,
      role_id: user.role_id,
    },
    select: {
      username: true,
      role_id: true,
    },
  });
};

export default {
  register,
};
