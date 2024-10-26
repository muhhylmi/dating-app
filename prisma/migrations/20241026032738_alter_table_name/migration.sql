/*
  Warnings:

  - You are about to drop the `Premium` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Swipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Premium" DROP CONSTRAINT "Premium_userId_fkey";

-- DropTable
DROP TABLE "Premium";

-- DropTable
DROP TABLE "Swipe";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthdate" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hasNoSwipeLimit" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swipe" (
    "id" SERIAL NOT NULL,
    "swiperId" INTEGER NOT NULL,
    "swipedUserId" INTEGER NOT NULL,
    "status" "SwipeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "premium_userId_key" ON "premium"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "swipe_swiperId_swipedUserId_createdAt_key" ON "swipe"("swiperId", "swipedUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "premium" ADD CONSTRAINT "premium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
