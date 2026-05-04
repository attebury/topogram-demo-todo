import { boolean, doublePrecision, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const task_statusEnum = pgEnum("task_status", ["draft", "active", "completed", "archived"]);
export const task_priorityEnum = pgEnum("task_priority", ["low", "medium", "high"]);
export const project_statusEnum = pgEnum("project_status", ["active", "archived"]);

export const tasksTable = pgTable("tasks", {
  id: uuid("id").notNull().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: task_statusEnum("status").notNull().default('draft'),
  priority: task_priorityEnum("priority").notNull().default('medium'),
  owner_id: uuid("owner_id"),
  project_id: uuid("project_id").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
  completed_at: timestamp("completed_at", { withTimezone: true, mode: "string" }),
  due_at: timestamp("due_at", { withTimezone: true, mode: "string" }),
}, (table) => ({
  tasks_project_id_status_idx: index("tasks_project_id_status_idx").on(table.project_id, table.status),
  tasks_owner_id_status_idx: index("tasks_owner_id_status_idx").on(table.owner_id, table.status),
}));

export const projectsTable = pgTable("projects", {
  id: uuid("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: project_statusEnum("status").notNull().default('active'),
  owner_id: uuid("owner_id"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
}, (table) => ({
  projects_name_idx: index("projects_name_idx").on(table.name),
  projects_owner_id_status_idx: index("projects_owner_id_status_idx").on(table.owner_id, table.status),
  projects_name_unique: uniqueIndex("projects_name_unique").on(table.name),
}));

export const usersTable = pgTable("users", {
  id: uuid("id").notNull().primaryKey(),
  email: text("email").notNull(),
  display_name: text("display_name").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
}, (table) => ({
  users_email_idx: index("users_email_idx").on(table.email),
  users_email_unique: uniqueIndex("users_email_unique").on(table.email),
}));
