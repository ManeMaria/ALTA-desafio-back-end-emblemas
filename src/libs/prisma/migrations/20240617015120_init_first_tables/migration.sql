/*
  Warnings:

  - You are about to drop the column `template_id` on the `emails` table. All the data in the column will be lost.
  - You are about to drop the `emails_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "emails" DROP CONSTRAINT "emails_template_id_fkey";

-- AlterTable
ALTER TABLE "emails" DROP COLUMN "template_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" TEXT NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "emails_templates";
