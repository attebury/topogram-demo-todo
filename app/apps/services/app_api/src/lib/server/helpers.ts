import type { Context } from "hono";

export class HttpError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) {
    super(message);
  }
}

export type AuthorizationContext = {
  capabilityId?: string;
  input?: Record<string, unknown>;
  loadResource?: () => Promise<Record<string, unknown>> | Record<string, unknown>;
};

export function coerceValue(value: unknown, schema: { type?: string; format?: string } = {}) {
  if (value == null) return value;
  if (schema.type === "integer") return Number.parseInt(String(value), 10);
  if (schema.type === "number") return Number(value);
  if (schema.type === "boolean") return value === true || value === "true";
  return String(value);
}

export function contentDisposition(disposition: string, filename: string) {
  return `${disposition}; filename="${filename.replace(/"/g, "")}"`;
}

export function jsonError(error: unknown) {
  if (error instanceof HttpError) {
    return { status: error.status, body: { ok: false, error: { code: error.code, message: error.message } } };
  }
  const message = error instanceof Error ? error.message : "Unexpected server error";
  return { status: 500, body: { ok: false, error: { code: "internal_error", message } } };
}

export function requireHeaders(c: Context, requirements: ReadonlyArray<{ header?: string; name?: string; error?: number; code?: string }>) {
  for (const requirement of requirements || []) {
    const header = requirement.header || requirement.name;
    if (header && !c.req.header(header)) {
      throw new HttpError(Number(requirement.error || 428), requirement.code || "missing_required_header", `Missing required header ${header}`);
    }
  }
}

export function requireRequestFields(route: any, input: Record<string, unknown>) {
  for (const field of route.requestContract?.fields || []) {
    if (field.required && (input[field.name] === undefined || input[field.name] === null || input[field.name] === "")) {
      throw new HttpError(400, `${route.capabilityId || "capability"}_invalid_request`, `Missing required field ${field.name}`);
    }
  }
}

export async function authorizeWithGeneratedAuthProfile(
  _ctx: Context,
  _authz: ReadonlyArray<{ role?: string | null; permission?: string | null; claim?: string | null; claimValue?: string | null; ownership?: string | null; ownershipField?: string | null }>,
  _authorizationContext?: AuthorizationContext
) {
  return;
}
