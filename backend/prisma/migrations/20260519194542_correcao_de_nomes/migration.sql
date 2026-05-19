/*
  Warnings:

  - The primary key for the `convidados` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nome_usuario` on the `convidados` table. All the data in the column will be lost.
  - Added the required column `id_convidado` to the `convidados` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `convidados` DROP PRIMARY KEY,
    DROP COLUMN `nome_usuario`,
    ADD COLUMN `id_convidado` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_convidado`);
