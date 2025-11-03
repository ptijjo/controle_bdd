-- CreateTable
CREATE TABLE "LoginAttempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "emailName" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LoginAttempts_emailName_fkey" FOREIGN KEY ("emailName") REFERENCES "User" ("email") ON DELETE CASCADE ON UPDATE CASCADE
);
