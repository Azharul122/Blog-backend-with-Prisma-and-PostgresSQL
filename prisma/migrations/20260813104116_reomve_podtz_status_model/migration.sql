/*
  Warnings:

  - You are about to drop the `post_statuses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_statuses" DROP CONSTRAINT "post_statuses_postId_fkey";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "status" "PostStatus";

-- DropTable
DROP TABLE "post_statuses";
