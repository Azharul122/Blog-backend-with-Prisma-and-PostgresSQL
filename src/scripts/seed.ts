
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";


async function main() {

    const email = process.env.ADMIN_EMAIL as string;
    const password = process.env.ADMIN_PASSWORD as string;
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: {
            email,
        },
        update: {

        },
        create: {
            email,
            password: hashedPassword,
            name: process.env.ADMIN_NAME as string,
            role: "ADMIN",
        },
    });

    console.log(`Admin ready: ${admin.email}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });