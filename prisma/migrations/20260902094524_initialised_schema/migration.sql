-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED');

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "homeScore" INTEGER NOT NULL DEFAULT 0,
    "awayScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commentary" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "actor" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "minute" INTEGER,
    "sequenceNo" INTEGER NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Commentary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Commentary_matchId_idx" ON "Commentary"("matchId");

-- CreateIndex
CREATE INDEX "Commentary_matchId_sequenceNo_idx" ON "Commentary"("matchId", "sequenceNo");

-- AddForeignKey
ALTER TABLE "Commentary" ADD CONSTRAINT "Commentary_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
