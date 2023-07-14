export enum Permission {
  CREATE_ROLE = 'CREATE_ROLE',
  READ_ROLE = 'READ_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',
  ADD_ROLE_TO_USER = 'ADD_ROLE_TO_USER',
  REMOVE_ROLE_TO_USER = 'REMOVE_ROLE_TO_USER',
  UPDATE_ROLE_PERMISSIONS = 'UPDATE_ROLE_PERMISSIONS',
  // ---------------------------------------------------------------
  // USERS PERMISSIONS
  // ---------------------------------------------------------------
  CREATE_NEW_USER = 'CREATE_NEW_USER',
  READ_USERS = 'READ_USERS',
  UPDATE_USER = 'UPDATE_USER',
  READ_USER = 'READ_USER',
  DELETE_USER = 'DELETE_USER',
  // ---------------------------------------------------------------
  // CASHBOX PERMISSIONS
  // ---------------------------------------------------------------
  CREATE_NEW_CASHBOX = 'CREATE_NEW_CASHBOX',
  READ_CASHBOX = 'READ_CASHBOX',
  UPDATE_CASHBOX = 'UPDATE_CASHBOX',
  DELETE_CASHBOX = 'DELETE_CASHBOX',
  OPEN_CASHBOX = 'OPEN_CASHBOX',
  CLOSE_CASHBOX = 'CLOSE_CASHBOX',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  DELETE_TRANSACTION = 'DELETE_TRANSACTION',
  CASH_TRANSFER = 'CASH_TRANSFER',
  // ---------------------------------------------------------------
  // PRODUCT BRAND PERMISISION
  // ---------------------------------------------------------------
  CREATE_NEW_PRODUCT_BRAND = 'CREATE_NEW_PRODUCT_BRAND',
  UPDATE_PRODUCT_BRAND = 'UPDATE_PRODUCT_BRAND',
  READ_PRODUCT_BRAND = 'READ_PRODUCT_BRAND',
  DELETE_PRODUCT_BRAND = 'DELETE_PRODUCT_BRAND',
  // ---------------------------------------------------------------
  // SUPER ADMIN PERMISSIONS
  // ---------------------------------------------------------------
  INSTALL_CLOUD_PRESETS = 'INSTALL_CLOUD_PRESETS',
  DELETE_MAIN_TRANSACTION = 'DELETE_MAIN_TRANSACTION',
  ADD_MAIN_TRANSACTION = 'ADD_MAIN_TRANSACTION',
  GET_MAIN_BOX_BALANCE = 'GET_MAIN_BOX_BALANCE',
  READ_MAIN_TRANSACTIONS = 'READ_MAIN_TRANSACTIONS',
}
