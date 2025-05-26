-- CreateTable
CREATE TABLE "WhiteBoard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "lastEditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nodes" TEXT NOT NULL,
    "edges" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastEditedBy" TEXT,

    CONSTRAINT "WhiteBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteBoardHistory" (
    "id" TEXT NOT NULL,
    "whiteBoardId" TEXT NOT NULL,
    "nodes" TEXT NOT NULL,
    "edges" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "editedBy" TEXT,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhiteBoardHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhiteBoardPermission" (
    "id" TEXT NOT NULL,
    "whiteBoardId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'EDIT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhiteBoardPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileLibrary" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "documentId" TEXT,
    "whiteBoardId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileLibrary_fileId_key" ON "FileLibrary"("fileId");

-- AddForeignKey
ALTER TABLE "WhiteBoardHistory" ADD CONSTRAINT "WhiteBoardHistory_whiteBoardId_fkey" FOREIGN KEY ("whiteBoardId") REFERENCES "WhiteBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhiteBoardPermission" ADD CONSTRAINT "WhiteBoardPermission_whiteBoardId_fkey" FOREIGN KEY ("whiteBoardId") REFERENCES "WhiteBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileLibrary" ADD CONSTRAINT "FileLibrary_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileLibrary" ADD CONSTRAINT "FileLibrary_whiteBoardId_fkey" FOREIGN KEY ("whiteBoardId") REFERENCES "WhiteBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
