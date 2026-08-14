/*
  Warnings:

  - The values [VISIBLE,HIDDEN,DELETED] on the enum `commentStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Providers" AS ENUM ('credentials', 'google');

-- AlterEnum
BEGIN;
CREATE TYPE "commentStatus_new" AS ENUM ('APPROVED', 'REJECTED');
ALTER TABLE "comments" ALTER COLUMN "status" TYPE "commentStatus_new" USING ("status"::text::"commentStatus_new");
ALTER TYPE "commentStatus" RENAME TO "commentStatus_old";
ALTER TYPE "commentStatus_new" RENAME TO "commentStatus";
DROP TYPE "public"."commentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "provider" "Providers" NOT NULL DEFAULT 'credentials';

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
