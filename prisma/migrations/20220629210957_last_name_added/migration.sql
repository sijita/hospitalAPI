/*
  Warnings:

  - You are about to drop the column `pacientId` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the `pacient` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[patientId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointment` DROP FOREIGN KEY `Appointment_pacientId_fkey`;

-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `pacientId`,
    ADD COLUMN `patientId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `doctor` ADD COLUMN `lastName` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `pacient`;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identification` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Patient_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Appointment_patientId_key` ON `Appointment`(`patientId`);

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
