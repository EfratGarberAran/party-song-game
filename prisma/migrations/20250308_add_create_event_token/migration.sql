-- CreateTable
CREATE TABLE "CreateEventToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreateEventToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreateEventToken_token_key" ON "CreateEventToken"("token");

-- AddForeignKey
ALTER TABLE "CreateEventToken" ADD CONSTRAINT "CreateEventToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
