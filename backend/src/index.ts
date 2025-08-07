import { PrismaClient } from "@prisma/client";

// Local import
import { app } from "./server";

export const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

(async function main() {
  try {
    await prisma.$connect();
    console.log("📂  Connected to Database...");
    app.listen(PORT, () => {
      console.log(
        `🌐  Server running in ${process.env.NODE_ENV} on port: ${PORT}`
      );
    });
  } catch (error) {
    console.error(`❌❌❌❌  Error while starting server: \n`, error);
  }
})();
