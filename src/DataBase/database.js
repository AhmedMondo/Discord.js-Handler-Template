const { connect, connection } = require('mongoose');
const { MongoDB } = require('../configs/config');



module.exports = class Mongoose {
    constructor(client) {
        this.client = client
    }
    init() {
        const dbOptions = {
            autoIndex: false,
            family: 4,
            connectTimeoutMS: 10000
        };

        connect(MongoDB, dbOptions);

        connection.on('connected', () => {
            this.client.logger.log('Connected to MongoDB Successfully!');
        });

        connection.on('err', (error) => {
            this.client.logger.warn(`Error recieved from MongoDB: \n${error.message}`);
        });

        connection.on('disconnected', () => {
            this.client.logger.error('MongoDB has been Disconnected!');
        });
    }
};