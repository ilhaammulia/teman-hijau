-- AlterTable
ALTER TABLE "user_withdrawals" ADD COLUMN     "staff_id" VARCHAR(20);

-- AddForeignKey
ALTER TABLE "user_withdrawals" ADD CONSTRAINT "user_withdrawals_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("username") ON DELETE SET NULL ON UPDATE CASCADE;
