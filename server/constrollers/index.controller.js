function HelloWorld (req, res) {
	return res.status(200).send({
		message: "welcome to where ever we are!",
	});
}

export { HelloWorld };
