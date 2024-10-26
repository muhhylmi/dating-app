-- CreateEnum
CREATE TYPE "SwipeStatus" AS ENUM ('LIKE', 'PASS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthdate" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Premium" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hasNoSwipeLimit" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Premium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swipe" (
    "id" SERIAL NOT NULL,
    "swiperId" INTEGER NOT NULL,
    "swipedUserId" INTEGER NOT NULL,
    "status" "SwipeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Swipe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Premium_userId_key" ON "Premium"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Swipe_swiperId_swipedUserId_createdAt_key" ON "Swipe"("swiperId", "swipedUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "Premium" ADD CONSTRAINT "Premium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
