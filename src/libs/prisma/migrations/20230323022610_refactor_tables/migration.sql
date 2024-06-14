/*
  Warnings:

  - You are about to drop the column `userId` on the `emails` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users_confirmations` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users_forgot_passwords` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `users_confirmations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users_forgot_passwords` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_confirmations" DROP CONSTRAINT "users_confirmations_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_forgot_passwords" DROP CONSTRAINT "users_forgot_passwords_userId_fkey";

-- AlterTable
ALTER TABLE "emails" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "users_confirmations" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users_forgot_passwords" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "users_confirmations" ADD CONSTRAINT "users_confirmations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_forgot_passwords" ADD CONSTRAINT "users_forgot_passwords_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
