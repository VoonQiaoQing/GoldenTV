import ORM from 'sequelize'
const { Sequelize, DataTypes, Model } = ORM;

/**
 * A database entity model that represents contents in the database.
 * This model is specifically designed for users
 * @see "https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes"
**/
export class ModelSongInfo extends Model {
	/**
	 * Initializer of the model
	 * @see Model.init
	 * @access public
	 * @param {Sequelize} database The configured Sequelize handle
	**/
	static initialize(database) {
		ModelSongInfo.init({
			"song_uuid": { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
			"dateCreated": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"dateUpdated": { type: DataTypes.DATE(), allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
			"admin_uuid": { type: DataTypes.CHAR(36), defaultValue: DataTypes.UUIDV4 },
			"user_uuid": { type: DataTypes.CHAR(36), defaultValue: DataTypes.UUIDV4 },
			"songimage": { type: DataTypes.STRING(650), allowNull: false },
			"songname": { type: DataTypes.STRING(650), allowNull: false },
			"songagerating": { type: DataTypes.STRING(650), allowNull: false },
			"songduration": { type: DataTypes.FLOAT(4), allowNull: false },
			"songgenre": {
				type: DataTypes.ENUM('Pop', 'Rock', 'Metal', 'Country', 'Rap', 'Electronic', 'Jazz', 'Folk')
				, allowNull: false
			}
		}, {
			"sequelize": database,
			"modelName": "SongInfo",
			"hooks": {
				"afterUpdate": ModelSongInfo._auto_update_timestamp
			}
		});
	}

	/**
	 * Emulates "TRIGGER" of "AFTER UPDATE" in most SQL databases.
	 * This function simply assist to update the 'dateUpdated' timestamp.
	 * @private
	 * @param {ModelSongInfo}     instance The entity model to be updated
	 * @param {UpdateOptions} options  Additional options of update propagated from the initial call
	**/
	static _auto_update_timestamp(instance, options) {
		// @ts-ignore
		instance.dateUpdated = Sequelize.literal('CURRENT_TIMESTAMP');
	}

	get songimage() { return this.getDataValue("songimage"); }
	get songname() { return this.getDataValue("songname"); }
	get songagerating() { return this.getDataValue("songagerating"); }
	get songduration() { return this.getDataValue("songduration"); }
	get songgenre() { return this.getDataValue("songgenre"); }
}