export enum Rol {
  ADMIN = 'ADMIN',
  REFERENTE = 'REF',
  ASESOR = 'ASESOR',
  GERENTE = 'GERENTE',
  CONTADOR = 'CONTADOR',
}

export const RolNombre: Record<Rol, string> = {
  [Rol.ADMIN]: 'Administrador',
  [Rol.REFERENTE]: 'Referente',
  [Rol.ASESOR]: 'Asesor de Ventas',
  [Rol.GERENTE]: 'Gerente de Ventas',
  [Rol.CONTADOR]: 'Contador',
};

export const RolDashboard: Record<string, string> = {
  administrador: '/admin/dashboard',
  referente: '/referente/dashboard',
  asesor_ventas: '/asesor/dashboard',
  gerente_ventas: '/gerente/dashboard',
  contador: '/contador/dashboard',
};

export function tieneRol(roles: string[], rolBuscado: Rol | string): boolean {
  return roles.some(
    (r) => r.toLowerCase() === rolBuscado.toLowerCase() || r === rolBuscado
  );
}

export function obtenerPrimerRol(roles: string[]): string | null {
  if (!roles || roles.length === 0) return null;
  return roles[0];
}
