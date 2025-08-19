/*
  Warnings:

  - You are about to drop the column `created_at` on the `ChallengeSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `ProofChallenge` table. All the data in the column will be lost.
  - You are about to drop the column `winner_ids` on the `ProofChallenge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobPostId]` on the table `ProofChallenge` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ChallengeSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `ProofChallenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventDate` to the `ProofChallenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProofChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChallengeSubmission" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "votes" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ProofChallenge" DROP COLUMN "created_at",
DROP COLUMN "winner_ids",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isBlackFriday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobPostId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "winnerIds" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TrustEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProofChallenge_jobPostId_key" ON "ProofChallenge"("jobPostId");

-- AddForeignKey
ALTER TABLE "ProofChallenge" ADD CONSTRAINT "ProofChallenge_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofChallenge" ADD CONSTRAINT "ProofChallenge_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProofChallenge" ADD CONSTRAINT "ProofChallenge_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustEvent" ADD CONSTRAINT "TrustEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
