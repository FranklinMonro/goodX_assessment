import * as Sequelize from 'sequelize';
import { DataTypes, Model } from 'sequelize';

export interface usersAttributes {
  id: string;
  username: string;
  password: string;
}

export type usersPk = 'id';
// eslint-disable-next-line no-use-before-define
export type usersId = users[usersPk];
export type usersCreationAttributes = usersAttributes;

export class users
  extends Model<usersAttributes, usersCreationAttributes>
  implements usersAttributes
{
  id!: string;

  username!: string;

  password!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.CHAR(20),
          allowNull: false,
        },
        password: {
          type: DataTypes.CHAR(256),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'users_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
