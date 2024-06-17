/*
  Warnings:

  - You are about to drop the column `user_id` on the `emblems` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "emblems" DROP CONSTRAINT "emblems_user_id_fkey";

-- AlterTable
ALTER TABLE "emblems" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "emblems_to_users" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "emblems_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "userConfirmationId" UUID,

    CONSTRAINT "emblems_to_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emblems_to_users" ADD CONSTRAINT "emblems_to_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emblems_to_users" ADD CONSTRAINT "emblems_to_users_emblems_id_fkey" FOREIGN KEY ("emblems_id") REFERENCES "emblems"("refId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emblems_to_users" ADD CONSTRAINT "emblems_to_users_userConfirmationId_fkey" FOREIGN KEY ("userConfirmationId") REFERENCES "users_confirmations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
