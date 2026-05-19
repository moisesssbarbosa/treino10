/*
  Warnings:

  - Added the required column `sobrenome_convidado` to the `Convidado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `convidado` ADD COLUMN `sobrenome_convidado` VARCHAR(50) NOT NULL;
