/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `emails_templates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "emails_templates_tag_key" ON "emails_templates"("tag");
