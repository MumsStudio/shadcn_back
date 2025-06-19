/*
  Warnings:

  - Added the required column `owner` to the `ProjectList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProjectList" ADD COLUMN     "owner" TEXT NOT NULL;
