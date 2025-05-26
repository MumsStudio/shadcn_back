/*
  Warnings:

  - The `nodes` column on the `WhiteBoard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `edges` column on the `WhiteBoard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `nodes` column on the `WhiteBoardHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `edges` column on the `WhiteBoardHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "WhiteBoard" DROP COLUMN "nodes",
ADD COLUMN     "nodes" JSONB[],
DROP COLUMN "edges",
ADD COLUMN     "edges" JSONB[];

-- AlterTable
ALTER TABLE "WhiteBoardHistory" DROP COLUMN "nodes",
ADD COLUMN     "nodes" JSONB[],
DROP COLUMN "edges",
ADD COLUMN     "edges" JSONB[];
