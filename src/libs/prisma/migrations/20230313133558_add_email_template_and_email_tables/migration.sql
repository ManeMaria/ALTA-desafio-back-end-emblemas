-- CreateTable
CREATE TABLE "emails_templates" (
    "id" UUID NOT NULL,
    "serial" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "markups" TEXT[],
    "title" TEXT,
    "body" TEXT,
    "html" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "emails_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" UUID NOT NULL,
    "serial" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "template_id" UUID NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT,
    "html" TEXT,
    "userId" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "emails_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
