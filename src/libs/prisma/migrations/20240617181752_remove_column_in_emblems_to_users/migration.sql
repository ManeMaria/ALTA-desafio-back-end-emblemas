-- CreateTable
CREATE TABLE "redeem_emblems" (
    "id" UUID NOT NULL,
    "serial" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "redeem_emblems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "redeem_emblems_name_key" ON "redeem_emblems"("name");
