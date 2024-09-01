const { DEFAULT_BOT_USER } = require("../constants");
const { prisma } = require("./prisma.client");

async function main() {
  const createCarol = await prisma.user.findFirst({
    where: {
      number: DEFAULT_BOT_USER.id,
    },
  });

  if (!createCarol) {
    await prisma.user.create({
      data: {
        ...DEFAULT_BOT_USER,
        isOnline: true,
      },
    });

    console.log("Default user created");
  } else {
    console.log("Default user already exists");
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
