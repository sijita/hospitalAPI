/*
  Warnings:

  - A unique constraint covering the columns `[identification]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phoneNumber` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `patient` MODIFY `phoneNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Patient_identification_key` ON `Patient`(`identification`);
