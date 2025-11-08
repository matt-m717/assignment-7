// Create database and models
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const db = new Sequelize({
    dialect: "sqlite",
    storage: `./database/${process.env.DB_NAME}`,
    logging: console.log
});

async function setupDatabase() {
    try {
        await db.authenticate();
        console.log("Connection to database established successfully.");

        await db.sync({ force: true });
        console.log(
            "Database file created at:",
            `./database/${process.env.DB_NAME}`
        );

        await db.close();
    } catch (env) {
        console.error("Unable to connect to the database:", e);
    }
}

if (require.main === module) {
    setupDatabase();
}

const Track = db.define("Track", {
    trackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    songTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    albumName: {
        type: DataTypes.STRING
    },
    genre: {
        type: DataTypes.STRING
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = { db, Track };
