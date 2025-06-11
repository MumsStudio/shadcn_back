-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resources" JSONB[],
    "sheetOrder" JSONB[],
    "sheets" JSONB NOT NULL,
    "styles" JSONB NOT NULL,
    "workbookId" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "lastEditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastEditedBy" TEXT,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableHistory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "resources" JSONB[],
    "sheetOrder" JSONB[],
    "sheets" JSONB NOT NULL,
    "styles" JSONB NOT NULL,
    "version" INTEGER NOT NULL,
    "editedBy" TEXT,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TableHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TablePermission" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'EDIT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TablePermission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TableHistory" ADD CONSTRAINT "TableHistory_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TablePermission" ADD CONSTRAINT "TablePermission_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
