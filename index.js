require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoUrl = process.env.DATABASE_URL;
const bodyParser = require('body-parser');

console.log(mongoUrl);
mongoose
	.connect(mongoUrl)
	.then(() => {
		console.log('Connected to database');
	})
	.catch((err) => {
		console.error(err);
	});

const database = mongoose.connection;

database.on('error', (err) => {
	console.error(err);
});

database.once('connected', () => {
	console.log('Database connected');
});

const routes = require('./routes/routes');
const app = express();
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req, res) => {
	res.send('<h1>Welcome to express mongoose.</h1>');
});

app.all('*', (req, res) => {
	res.status(404).send('<h1>Resource not found.</h1>');
});

const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`);
});
