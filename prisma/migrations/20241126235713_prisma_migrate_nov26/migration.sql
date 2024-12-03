-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "listing_id" INTEGER NOT NULL,
    "listing_type" TEXT NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);
