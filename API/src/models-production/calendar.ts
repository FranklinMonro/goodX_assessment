import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface calendarAttributes {
  id: string;
  allDay?: boolean;
  debtorID?: string;
  description?: string;
  doctorName?: number;
  endDate?: Date;
  patientID?: string;
  startDate?: Date;
  title?: string;
}

export type calendarPk = 'id';
// eslint-disable-next-line no-use-before-define
export type calendarId = calendar[calendarPk];
export type calendarOptionalAttributes =
  | 'allDay'
  | 'debtorID'
  | 'description'
  | 'doctorName'
  | 'endDate'
  | 'patientID'
  | 'startDate'
  | 'title';
export type calendarCreationAttributes = Optional<
  calendarAttributes,
  calendarOptionalAttributes
>;

export class calendar
  extends Model<calendarAttributes, calendarCreationAttributes>
  implements calendarAttributes
{
  id!: string;

  allDay?: boolean;

  debtorID?: string;

  description?: string;

  doctorName?: number;

  endDate?: Date;

  patientID?: string;

  startDate?: Date;

  title?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof calendar {
    return calendar.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        allDay: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        debtorID: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        description: {
          type: DataTypes.CHAR(70),
          allowNull: true,
        },
        doctorName: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        patientID: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        title: {
          type: DataTypes.CHAR(20),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'calendar',
        schema: 'public',
        timestamps: false,
        indexes: [
          {
            name: 'calendar_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
  }
}
