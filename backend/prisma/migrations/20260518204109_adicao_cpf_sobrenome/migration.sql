/*
  Warnings:

  - A unique constraint covering the columns `[cpf_convidado]` on the table `Convidado` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf_usuario]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf_convidado` to the `Convidado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf_usuario` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `convidado` ADD COLUMN `cpf_convidado` VARCHAR(11) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `cpf_usuario` VARCHAR(11) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Convidado_cpf_convidado_key` ON `Convidado`(`cpf_convidado`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_cpf_usuario_key` ON `Usuario`(`cpf_usuario`);
