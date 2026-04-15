-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "name" TEXT;
