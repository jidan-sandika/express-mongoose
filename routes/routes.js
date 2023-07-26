const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.post('/movie', async (req, res) => {
	console.log('Menambahkan movie');
	const movie = new Movie({
		title: req.body.title,
		year: req.body.year,
	});

	try {
		const movieToSave = await movie.save();
		res.status(201).json(movieToSave);
		console.log('Success transfer to database');
	} catch (error) {
		console.error(error.message);
		res.status(400).json({ message: error.message });
	}
});

router.get('/movie', async (req, res) => {
	try {
		const movies = await Movie.find();
		if (movies.length <= 0) {
			res.json({ message: 'Movies not found' });
		} else {
			res.json(movies);
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: error.message });
	}
});

router.get('/movie/:id', async (req, res) => {
	try {
		if (req.params.id) {
			const movie = await Movie.findById(req.params.id);
			if (!movie._id) {
				res.json({ message: 'Movie not found' });
			} else {
				res.json(movie);
			}
		} else {
			res.json({ message: 'Not found' });
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: error.message });
	}
});

router.patch('/movie/:id', async (req, res) => {
	const id = req.params.id;
	const updatedMovieData = req.body;
	const option = { new: true };

	if (updatedMovieData.title) {
		if (updatedMovieData.year) {
			try {
				const update = await Movie.findByIdAndUpdate(
					id,
					updatedMovieData,
					option
				);
				res.json(update);
			} catch (error) {
				console.error(error.message);
				res.status(500).json({ message: error.message });
			}
		} else {
			res.json({ message: 'Year not found' });
		}
	} else {
		res.json({ message: 'Title not found' });
	}
});

router.delete('/movie/:id', async (req, res) => {
	try {
		if (!req.params.id) {
			res.json({ message: 'Id not found' });
		} else {
			await Movie.findByIdAndDelete(req.params.id);
			res.json({
				message: `Movie with id ${req.params.id} has been deleted`,
			});
		}
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
