/*
  Warnings:

  - You are about to drop the column `garbage_type_id` on the `garbages` table. All the data in the column will be lost.
  - You are about to drop the `garbage_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `garbages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `garbages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "garbage_types" DROP CONSTRAINT "garbage_types_category_id_fkey";

-- DropForeignKey
ALTER TABLE "garbages" DROP CONSTRAINT "garbages_garbage_type_id_fkey";

-- AlterTable
ALTER TABLE "garbages" DROP COLUMN "garbage_type_id",
ADD COLUMN     "buy_price" MONEY NOT NULL DEFAULT 0,
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "sell_price" MONEY NOT NULL DEFAULT 0,
ADD COLUMN     "unit" VARCHAR(100),
ALTER COLUMN "stock" SET DEFAULT 0;

-- DropTable
DROP TABLE "garbage_types";

-- AddForeignKey
ALTER TABLE "garbages" ADD CONSTRAINT "garbages_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
