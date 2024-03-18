import type { Sequelize } from "sequelize";
import { clients as _clients } from "./clients";
import type { clientsAttributes, clientsCreationAttributes } from "./clients";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _clients as clients,
  _users as users,
};

export type {
  clientsAttributes,
  clientsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const clients = _clients.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    clients: clients,
    users: users,
  };
}
