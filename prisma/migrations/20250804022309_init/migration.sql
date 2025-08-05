-- CreateTable
CREATE TABLE `User` (
    `id` CHAR(36) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'OWNER', 'KASIR') NOT NULL DEFAULT 'KASIR',
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produk` (
    `id` CHAR(36) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `status` ENUM('TERSEDIA', 'HABIS') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penjualan` (
    `id` CHAR(36) NOT NULL,
    `produkId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `diskon` INTEGER NOT NULL,
    `harga` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisPengeluaran` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pengeluaran` (
    `id` CHAR(36) NOT NULL,
    `jenisPengeluaranId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `nominal` INTEGER NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `detailPencatatan` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArusKas` (
    `id` CHAR(36) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `saldo_awal` INTEGER NOT NULL,
    `sum_total_penjualan` INTEGER NOT NULL,
    `sum_nilai_penjualan` INTEGER NOT NULL,
    `sum_pengeluaran` INTEGER NOT NULL,
    `sebelum_pajak` INTEGER NOT NULL,
    `pajak` INTEGER NOT NULL,
    `laba_bersih` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Penjualan` ADD CONSTRAINT `Penjualan_produkId_fkey` FOREIGN KEY (`produkId`) REFERENCES `Produk`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penjualan` ADD CONSTRAINT `Penjualan_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengeluaran` ADD CONSTRAINT `Pengeluaran_jenisPengeluaranId_fkey` FOREIGN KEY (`jenisPengeluaranId`) REFERENCES `JenisPengeluaran`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengeluaran` ADD CONSTRAINT `Pengeluaran_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
