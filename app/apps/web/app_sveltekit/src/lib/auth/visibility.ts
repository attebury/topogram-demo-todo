import { env as publicEnv } from "$env/dynamic/public";

export interface VisibilityRule {
  predicate?: string | null;
  value?: string | null;
  permission?: string | null;
  ownershipField?: string | null;
}
export interface VisibilityDebug { userId?: string | null; permissions?: string | null; isAdmin?: string | boolean | null; }

function truthy(value: unknown) {
  return value === true || value === "true" || value === "1" || value === "yes";
}

function currentUser(debug?: VisibilityDebug | null) {
  return debug?.userId || publicEnv.PUBLIC_TOPOGRAM_AUTH_USER_ID || "";
}

function hasDebugUser(debug?: VisibilityDebug | null) {
  return Boolean(debug?.userId);
}

function currentPermissions(debug?: VisibilityDebug | null) {
  const permissions = hasDebugUser(debug) ? debug?.permissions : (debug?.permissions || publicEnv.PUBLIC_TOPOGRAM_AUTH_PERMISSIONS);
  return String(permissions || "").split(/[\s,]+/).filter(Boolean);
}

function isAdmin(debug?: VisibilityDebug | null) {
  if (hasDebugUser(debug)) return truthy(debug?.isAdmin) || currentPermissions(debug).includes("*");
  return truthy(debug?.isAdmin) || truthy(publicEnv.PUBLIC_TOPOGRAM_AUTH_ADMIN) || currentPermissions(debug).includes("*");
}

export function canShowAction(rule: VisibilityRule | null | undefined, resource?: Record<string, unknown> | null, debug?: VisibilityDebug | null) {
  if (!rule) return true;
  if (rule.permission && !currentPermissions(debug).includes(rule.permission) && !currentPermissions(debug).includes("*")) return false;
  if (rule.predicate === "ownership") {
    if (rule.value === "owner_or_admin" && isAdmin(debug)) return true;
    const field = rule.ownershipField || "owner_id";
    return Boolean(currentUser(debug)) && String(resource?.[field] || "") === currentUser(debug);
  }
  return true;
}
