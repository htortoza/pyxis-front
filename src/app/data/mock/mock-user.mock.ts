import type { MockUser } from '../models/mock-user.model';

/**
 * Stand-in for real authentication -- this app has none yet. Defaults to the most
 * permissive role so every saved-views code path (personal + team CRUD) is exercisable
 * without building a role-switcher UI. Same spirit as the TODAY mock-date constant
 * already used in the Period Picker component.
 */
export const CURRENT_USER: MockUser = {
  id: 'user-demo',
  name: 'Usuario Demo',
  role: 'HOLDING_ADMIN',
  tenantId: 'tenant-demo',
  rubro: 'retail',
};

export function canManageTeamViews(role: MockUser['role']): boolean {
  return role === 'HOLDING_ADMIN' || role === 'CLIENT_ADMIN';
}
