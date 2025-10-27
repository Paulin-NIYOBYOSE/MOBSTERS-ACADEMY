/*
  Warnings:

  - You are about to drop the column `comment` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `currentBalance` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/

-- CreateTable
CREATE TABLE "TradingAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startingBalance" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TradingAccount_userId_idx" ON "TradingAccount"("userId");

-- AddForeignKey for TradingAccount
ALTER TABLE "TradingAccount" ADD CONSTRAINT "TradingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create default trading accounts for users who have existing trades
INSERT INTO "TradingAccount" ("userId", "name", "startingBalance", "description", "createdAt", "updatedAt")
SELECT DISTINCT 
    t."userId", 
    'Main Account' as "name",
    COALESCE(MAX(t."currentBalance"), 10000.0) as "startingBalance",
    'Default account created during migration' as "description",
    NOW() as "createdAt",
    NOW() as "updatedAt"
FROM "Trade" t
GROUP BY t."userId";

-- Remove the old columns from Trade table
ALTER TABLE "Trade" DROP COLUMN IF EXISTS "comment";
ALTER TABLE "Trade" DROP COLUMN IF EXISTS "currentBalance";

-- Add accountId column as nullable first
ALTER TABLE "Trade" ADD COLUMN "accountId" INTEGER;

-- Update existing trades to reference the default account for each user
UPDATE "Trade" 
SET "accountId" = (
    SELECT ta."id" 
    FROM "TradingAccount" ta 
    WHERE ta."userId" = "Trade"."userId" 
    AND ta."name" = 'Main Account'
    LIMIT 1
);

-- Now make accountId NOT NULL since all trades should have an account
ALTER TABLE "Trade" ALTER COLUMN "accountId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Trade_userId_accountId_idx" ON "Trade"("userId", "accountId");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "TradingAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
