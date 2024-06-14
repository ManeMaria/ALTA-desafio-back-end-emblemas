-- CreateTable
CREATE TABLE "users_forgot_passwords" (
    "id" UUID NOT NULL,
    "serial" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "confirmed_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "declined_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_forgot_passwords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_forgot_passwords" ADD CONSTRAINT "users_forgot_passwords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
