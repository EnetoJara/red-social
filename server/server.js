import mongoose from "mongoose";

import config from "../config/config";
import app from "./express";

const { log, } = console;

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
	useCreateIndex: true,
	useNewUrlParser: true,
});
mongoose.connection.on("error", () => {
	throw new Error(`unable to connect to database ${ config.mongoUri }`);
});

const server = app();
server.listen(config.port, () => {
	log(`
		server running or some shit
		Server listening on http://localhost:${ config.port } in ${ config.env }
		`);
});
