-- CreateTable
CREATE TABLE "mail_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporterEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "contentId" TEXT,
    "recommendationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" DATETIME,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "mail_logs_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "mail_logs_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendation_drafts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
