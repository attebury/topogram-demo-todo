DO $$ BEGIN
  CREATE TYPE "TaskStatus" AS ENUM ('draft', 'active', 'completed', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "TaskPriority" AS ENUM ('low', 'medium', 'high');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "ProjectStatus" AS ENUM ('active', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "tasks" (
  "id" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "TaskStatus" NOT NULL DEFAULT 'draft',
  "priority" "TaskPriority" NOT NULL DEFAULT 'medium',
  "owner_id" UUID,
  "project_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL,
  "updated_at" TIMESTAMPTZ NOT NULL,
  "completed_at" TIMESTAMPTZ,
  "due_at" TIMESTAMPTZ,
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" "ProjectStatus" NOT NULL DEFAULT 'active',
  "owner_id" UUID,
  "created_at" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "tasks_project_id_status_idx" ON "tasks" ("project_id", "status");

CREATE INDEX IF NOT EXISTS "tasks_owner_id_status_idx" ON "tasks" ("owner_id", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "projects_name_unique" ON "projects" ("name");

CREATE INDEX IF NOT EXISTS "projects_owner_id_status_idx" ON "projects" ("owner_id", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");

ALTER TABLE "tasks" ADD FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL;

ALTER TABLE "tasks" ADD FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;

ALTER TABLE "projects" ADD FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL;
