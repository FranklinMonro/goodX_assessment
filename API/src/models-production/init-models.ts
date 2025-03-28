import type { Sequelize } from "sequelize";
import { calendar as _calendar } from "./calendar";
import type { calendarAttributes, calendarCreationAttributes } from "./calendar";
import { clients as _clients } from "./clients";
import type { clientsAttributes, clientsCreationAttributes } from "./clients";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _calendar as calendar,
  _clients as clients,
  _users as users,
};

export type {
  calendarAttributes,
  calendarCreationAttributes,
  clientsAttributes,
  clientsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const calendar = _calendar.initModel(sequelize);
  const clients = _clients.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    calendar: calendar,
    clients: clients,
    users: users,
  };
}
