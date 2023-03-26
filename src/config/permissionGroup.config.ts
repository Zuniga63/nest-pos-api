import { Permission } from 'src/modules/auth/permission.enum';

export enum PermissionGroupKeys {
  roles,
  users,
  cashboxes,
}

export default [
  // --------------------------------------------------------------------------
  // ROLES PERMISSIONS
  // --------------------------------------------------------------------------
  {
    id: 1,
    name: 'Roles',
    description:
      'Permisos para la adminsitración de los roles de la paltaforma',
    permissions: [
      // CREATE
      {
        id: 1,
        name: 'Crear',
        key: Permission.CREATE_ROLE,
      },
      // READ
      {
        id: 2,
        name: 'Ver',
        key: Permission.READ_ROLE,
      },
      // UPDATE
      {
        id: 3,
        name: 'Editar',
        key: Permission.UPDATE_ROLE,
      },
      // DELETE
      {
        id: 4,
        name: 'Eliminar',
        key: Permission.CREATE_ROLE,
      },
      // ADD ROLE TO USER
      {
        id: 5,
        name: 'Asignar rol a usuario',
        key: Permission.ADD_ROLE_TO_USER,
      },
      // REMOVE ROL TO USER
      {
        id: 6,
        name: 'Remover Rol a usuario',
        key: Permission.REMOVE_ROLE_TO_USER,
      },
      // UPDATE ROLE PERMISSION
      {
        id: 7,
        name: 'Actualizar los permisos',
        key: Permission.UPDATE_ROLE_PERMISSIONS,
      },
    ],
  },
  // --------------------------------------------------------------------------
  // USER PERMISSIONS
  // --------------------------------------------------------------------------
  {
    id: 1,
    name: 'Usuario',
    description: 'Permisos para la adminsitración de los usuarios',
    permissions: [
      // CREATE
      {
        id: 1,
        name: 'Crear',
        key: Permission.CREATE_NEW_USER,
      },
      // READ
      {
        id: 2,
        name: 'Ver Usuarios',
        key: Permission.READ_USERS,
      },
      {
        id: 2,
        name: 'Ver Usuario',
        key: Permission.READ_USER,
      },
      // UPDATE
      {
        id: 3,
        name: 'Editar',
        key: Permission.UPDATE_USER,
      },
      // DELETE
      {
        id: 4,
        name: 'Eliminar',
        key: Permission.DELETE_USER,
      },
    ],
  },
  // --------------------------------------------------------------------------
  // CASHBOX PERMISSIONS
  // --------------------------------------------------------------------------
  {
    id: PermissionGroupKeys.cashboxes,
    name: 'Cajas',
    description: 'Permisos para la adminsitración de las cajas',
    permissions: [
      // CREATE
      {
        id: 1,
        name: 'Crear',
        key: Permission.CREATE_NEW_CASHBOX,
      },
      // READ
      {
        id: 2,
        name: 'Ver',
        key: Permission.READ_CASHBOX,
      },
      // UPDATE
      {
        id: 3,
        name: 'Editar',
        key: Permission.UPDATE_CASHBOX,
      },
      // DELETE
      {
        id: 4,
        name: 'Eliminar',
        key: Permission.DELETE_CASHBOX,
      },
      // OPEN CASHBOX
      {
        id: 5,
        name: 'Abrir caja',
        key: Permission.OPEN_CASHBOX,
      },
      {
        id: 6,
        name: 'Cerrar caja',
        key: Permission.CLOSE_CASHBOX,
      },
      {
        id: 7,
        name: 'Agregar Transacción',
        key: Permission.ADD_TRANSACTION,
      },
      {
        id: 8,
        name: 'Eliminar Transacción',
        key: Permission.DELETE_TRANSACTION,
      },
      {
        id: 9,
        name: 'Transferencia de fondos',
        key: Permission.CASH_TRANSFER,
      },
    ],
  },
];
