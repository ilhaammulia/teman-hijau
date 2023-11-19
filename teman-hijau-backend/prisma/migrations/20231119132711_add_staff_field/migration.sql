-- AlterTable
ALTER TABLE "collector_transactions" ADD COLUMN     "staff_id" VARCHAR(20);

-- AlterTable
ALTER TABLE "user_transactions" ADD COLUMN     "staff_id" VARCHAR(20);

-- AddForeignKey
ALTER TABLE "user_transactions" ADD CONSTRAINT "user_transactions_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_transactions" ADD CONSTRAINT "collector_transactions_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
