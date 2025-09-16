-- CreateTable
CREATE TABLE "PendingRoleRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "program" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingRoleRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingRoleRequest_userId_program_key" ON "PendingRoleRequest"("userId", "program");

-- AddForeignKey
ALTER TABLE "PendingRoleRequest" ADD CONSTRAINT "PendingRoleRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
