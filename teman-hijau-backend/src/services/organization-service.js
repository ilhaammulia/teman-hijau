import { prismaClient } from "../applications/database.js";
import { validate } from "../validations/validate.js";
import { generateRandomId } from "../utils/generate-random.js";
import {
  cashoutValidation,
  updateValidation,
} from "../validations/organization-validation.js";
import { ResponseError } from "../exceptions/response-error.js";

const fetch = async () => {
  return prismaClient.organization.findFirst({
    include: {
      Cashout: true,
    },
  });
};

const update = async (organizationId, req) => {
  const data = validate(updateValidation, req);
  const organization = await prismaClient.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization) {
    throw new ResponseError(404, "Data organisasi tidak ditemukan.");
  }

  return prismaClient.organization.update({
    where: { id: organization.id },
    data: data,
  });
};

const createCashout = async (req) => {
  const data = validate(cashoutValidation, req);
  const organization = await prismaClient.organization.findFirst();
  if (organization.balance < data.amount) {
    throw new ResponseError(400, "Saldo tidak mencukupi.");
  }
  data.id = generateRandomId("CO");
  data.organization_id = organization.id;
  const [updateOrganization, createdCashout] = await prismaClient.$transaction([
    prismaClient.organization.update({
      where: { id: organization.id },
      data: {
        balance: { decrement: data.amount },
      },
    }),
    prismaClient.cashout.create({
      data: data,
      include: {
        organization: true,
      },
    }),
  ]);

  return createdCashout;
};

const cashouts = async () => {
  const total = await prismaClient.cashout.aggregate({
    _sum: {
      amount: true,
    },
  });
  const result = {
    data: await prismaClient.cashout.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "desc" },
    }),
    total: total._sum.amount,
  };
  return result;
};

export default { fetch, update, createCashout, cashouts };
