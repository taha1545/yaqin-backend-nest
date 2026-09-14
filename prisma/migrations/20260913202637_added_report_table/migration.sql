/*
  Warnings:

  - Changed the type of `report` on the `StudentReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StudentReport" DROP COLUMN "report",
ADD COLUMN     "report" JSONB NOT NULL;
