-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "externalLink" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN "externalLinkTitle" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "images" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "seoDescription" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "seoKeywords" JSONB;
ALTER TABLE "BlogPost" ADD COLUMN "seoTitle" JSONB;
