import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface clientsAttributes {
  id: string;
  debtor: string;
  telephone?: number;
  debtorID?: string;
  name?: string;
  main?: boolean;
  relationship?: string;
  active?: boolean;
}

export type clientsPk = 'id';
// eslint-disable-next-line no-use-before-define
export type clientsId = clients[clientsPk];
export type clientsOptionalAttributes =
  | 'telephone'
  | 'debtorID'
  | 'name'
  | 'main'
  | 'relationship'
  | 'active';
export type clientsCreationAttributes = Optional<
  clientsAttributes,
  clientsOptionalAttributes
>;

export class clients
  extends Model<clientsAttributes, clientsCreationAttributes>
  implements clientsAttributes
{
  id!: string;

  debtor!: string;

  telephone?: number;

  debtorID?: string;

  name?: string;

  main?: boolean;

  relationship?: string;

  active?: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof clients {
    return clients.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        debtor: {
          type: DataTypes.CHAR(20),
          allowNull: false,
        },
        telephone: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        debtorID: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        name: {
          type: DataTypes.CHAR(20),
          allowNull: true,
        },
        main: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        relationship: {
          type: DataTypes.CHAR(10),
          allowNull: true,
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'clients',
        schema: 'public',
        timestamps: false,
      }
    );
  }
}
