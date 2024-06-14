/*
  Warnings:

  - You are about to drop the column `enabled` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image_url` on the `user` table. All the data in the column will be lost.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "enabled",
DROP COLUMN "profile_image_url",
ADD COLUMN     "password" TEXT NOT NULL;
