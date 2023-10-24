-- DropForeignKey
ALTER TABLE "collector_transactions" DROP CONSTRAINT "collector_transactions_collector_id_fkey";

-- DropForeignKey
ALTER TABLE "collector_transactions" DROP CONSTRAINT "collector_transactions_garbage_id_fkey";

-- DropForeignKey
ALTER TABLE "garbages" DROP CONSTRAINT "garbages_category_id_fkey";

-- DropForeignKey
ALTER TABLE "user_transactions" DROP CONSTRAINT "user_transactions_garbage_id_fkey";

-- AlterTable
ALTER TABLE "collector_transactions" ALTER COLUMN "garbage_id" DROP NOT NULL,
ALTER COLUMN "collector_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "garbages" ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user_transactions" ALTER COLUMN "garbage_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_transactions" ADD CONSTRAINT "user_transactions_garbage_id_fkey" FOREIGN KEY ("garbage_id") REFERENCES "garbages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garbages" ADD CONSTRAINT "garbages_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_transactions" ADD CONSTRAINT "collector_transactions_garbage_id_fkey" FOREIGN KEY ("garbage_id") REFERENCES "garbages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_transactions" ADD CONSTRAINT "collector_transactions_collector_id_fkey" FOREIGN KEY ("collector_id") REFERENCES "collectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
