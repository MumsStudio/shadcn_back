-- DropForeignKey
ALTER TABLE "CloudDocumentHistory" DROP CONSTRAINT "CloudDocumentHistory_documentId_fkey";

-- AddForeignKey
ALTER TABLE "CloudDocumentHistory" ADD CONSTRAINT "CloudDocumentHistory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "CloudDocument"("documentId") ON DELETE RESTRICT ON UPDATE CASCADE;
