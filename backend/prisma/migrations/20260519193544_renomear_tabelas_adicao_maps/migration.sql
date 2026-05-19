/*
  Warnings:

  - You are about to drop the `convidado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `convidado`;

-- DropTable
DROP TABLE `usuario`;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_usuario` VARCHAR(50) NOT NULL,
    `cpf_usuario` VARCHAR(11) NOT NULL,
    `email_usuario` VARCHAR(50) NOT NULL,
    `cargo_usuario` BOOLEAN NOT NULL DEFAULT false,
    `senha_usuario` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `usuarios_cpf_usuario_key`(`cpf_usuario`),
    UNIQUE INDEX `usuarios_email_usuario_key`(`email_usuario`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `convidados` (
    `nome_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_convidado` VARCHAR(50) NOT NULL,
    `sobrenome_convidado` VARCHAR(50) NOT NULL,
    `cpf_convidado` VARCHAR(11) NOT NULL,
    `email_convidado` VARCHAR(50) NOT NULL,
    `telefone_convidado` VARCHAR(11) NOT NULL,
    `status_checkin_convidado` BOOLEAN NOT NULL DEFAULT false,
    `mesa_convidado` SMALLINT NOT NULL,

    UNIQUE INDEX `convidados_cpf_convidado_key`(`cpf_convidado`),
    UNIQUE INDEX `convidados_email_convidado_key`(`email_convidado`),
    UNIQUE INDEX `convidados_telefone_convidado_key`(`telefone_convidado`),
    PRIMARY KEY (`nome_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
