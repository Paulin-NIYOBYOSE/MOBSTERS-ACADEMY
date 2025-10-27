/*
  Warnings:

  - Added the required column `currentBalance` to the `TradingAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable - Add currentBalance column with default value equal to startingBalance
ALTER TABLE "TradingAccount" ADD COLUMN "currentBalance" DOUBLE PRECISION;

-- Update existing accounts to set currentBalance equal to startingBalance
UPDATE "TradingAccount" SET "currentBalance" = "startingBalance";

-- Make currentBalance NOT NULL after setting values
ALTER TABLE "TradingAccount" ALTER COLUMN "currentBalance" SET NOT NULL;
