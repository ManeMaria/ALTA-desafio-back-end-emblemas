/*
  Warnings:

  - Added the required column `attempts` to the `users_confirmations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users_confirmations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users_confirmations" ADD COLUMN     "attempts" INTEGER NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;
