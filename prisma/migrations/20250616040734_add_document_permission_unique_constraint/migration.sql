/*
  Warnings:

  - A unique constraint covering the columns `[documentId,userEmail]` on the table `DocumentPermission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DocumentPermission_documentId_userEmail_key" ON "DocumentPermission"("documentId", "userEmail");
