/**
 * Mock audit trail for team-view CRUD (create/update/delete), per the platform's "trazabilidad
 * completa" principle. There is no backend in this app -- a real implementation would write
 * these entries server-side. This is a documented client-side stand-in, persisted to
 * tenant-namespaced localStorage purely so entries survive a page reload for demo purposes.
 * There is no viewer UI for this log yet (not requested for this screen) -- only the write
 * path needs to exist and be exercised correctly by SavedViewsService.
 */

export type AuditAction = 'create' | 'update' | 'delete';

export interface AuditLogEntry {
  id: string;
  entity: 'saved_view';
  entityId: string;
  entityLabel: string;
  action: AuditAction;
  userId: string;
  userName: string;
  tenantId: string;
  timestamp: string; // ISO
}

const AUDIT_LOG_KEY_PREFIX = 'pyxis:audit-log:';

function isAuditLogEntry(value: unknown): value is AuditLogEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'string' &&
    candidate['entity'] === 'saved_view' &&
    typeof candidate['entityId'] === 'string' &&
    typeof candidate['entityLabel'] === 'string' &&
    (candidate['action'] === 'create' ||
      candidate['action'] === 'update' ||
      candidate['action'] === 'delete') &&
    typeof candidate['userId'] === 'string' &&
    typeof candidate['userName'] === 'string' &&
    typeof candidate['tenantId'] === 'string' &&
    typeof candidate['timestamp'] === 'string'
  );
}

export function logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  try {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const full: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    const existing = loadAuditLog(entry.tenantId);
    const next = [...existing, full];
    localStorage.setItem(`${AUDIT_LOG_KEY_PREFIX}${entry.tenantId}`, JSON.stringify(next));
  } catch {
    // Swallow -- audit logging must never crash the UI over a persistence failure.
  }
}

export function loadAuditLog(tenantId: string): AuditLogEntry[] {
  try {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(`${AUDIT_LOG_KEY_PREFIX}${tenantId}`);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isAuditLogEntry);
  } catch {
    return [];
  }
}
