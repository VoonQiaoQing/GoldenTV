import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;
import date from 'date-and-time';

const now = new Date();
const DateNow = date.format(now, 'DD/MM/YYYY HH:mm:ss');

/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class ModelRoomInfo extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelRoomInfo.init({
			"room_uuid": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.STRING(50), allowNull: false, defaultValue: DateNow },
			"dateUpdated": { type: DataTypes.STRING(50), allowNull: false, defaultValue: DateNow },
			"admin_uuid": { type: DataTypes.CHAR(36), defaultValue: DataTypes.UUIDV4 },
			"roomname": { type: DataTypes.STRING(100), allowNull: false },
			"roomsize": { type: DataTypes.ENUM('Small', 'Medium', 'Large'), allowNull: false },
			"roomprice": { type: DataTypes.FLOAT(6) },
			"roominfo": { type: DataTypes.STRING(650), allowNull: false },
			"roomimage": { type: DataTypes.STRING(650), allowNull: false },
			"location": { type: DataTypes.STRING(100), allowNull: false }
		}, {
			"sequelize": database,
			"modelName": "RoomInfo",
			"hooks": {
				"afterUpdate": ModelRoomInfo._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelRoomInfo}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

	get room_title() { return String(this.getDataValue("room_title")); }
	get small_roominfo() { return String(this.getDataValue("small_roominfo")); }
	get small_roomprice() { return String(this.getDataValue("small_roomprice")); }
	get small_roomimage() { return String(this.getDataValue("small_roomimage")); }
	get med_roominfo() { return String(this.getDataValue("med_roominfo")); }
	get med_roomprice() { return String(this.getDataValue("med_roomprice")); }
	get med_roomimage() { return String(this.getDataValue("med_roomimage")); }
	get large_roominfo() { return String(this.getDataValue("large_roominfo")); }
	get large_roomprice() { return String(this.getDataValue("large_roomprice")); }
	get large_roomimage() { return String(this.getDataValue("large_roomimage")); }
}