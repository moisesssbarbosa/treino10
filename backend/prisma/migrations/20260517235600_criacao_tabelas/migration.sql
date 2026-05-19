-- CreateTable
CREATE TABLE `Usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_usuario` VARCHAR(50) NOT NULL,
    `email_usuario` VARCHAR(50) NOT NULL,
    `cargo_usuario` BOOLEAN NOT NULL DEFAULT false,
    `senha_usuario` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_email_usuario_key`(`email_usuario`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Convidado` (
    `id_convidado` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_convidado` VARCHAR(50) NOT NULL,
    `email_convidado` VARCHAR(50) NOT NULL,
    `telefone_convidado` VARCHAR(11) NOT NULL,
    `status_checkin_convidado` BOOLEAN NOT NULL DEFAULT false,
    `mesa_convidado` SMALLINT NOT NULL,

    UNIQUE INDEX `Convidado_email_convidado_key`(`email_convidado`),
    UNIQUE INDEX `Convidado_telefone_convidado_key`(`telefone_convidado`),
    PRIMARY KEY (`id_convidado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
