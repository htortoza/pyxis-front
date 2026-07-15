/**
 * This app has no real authentication yet -- MockUser stands in for whatever a real
 * logged-in user/session object would look like once a backend exists.
 */
export type UserRole = 'HOLDING_ADMIN' | 'CLIENT_ADMIN' | 'VIEWER_ESTRATEGICO';

export interface MockUser {
  id: string;
  name: string;
  role: UserRole;
  tenantId: string;
}
