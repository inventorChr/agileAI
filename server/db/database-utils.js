const knex = require('knex');
const config = require('./database-config');

// Create a connection instance
const connection = knex(config);

module.exports = {
    // Function to get the connection instance
    getConnection: function() {
        return connection;
    },

    // Function to close the connection
    closeConnection: async function() {
        await connection.destroy();
    }
};
