const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movies');
const { Genre } = require('../models/genres');


router.get('/', async (req, res) => {
  const movies = await Movie.find().sort({ title: 1 });
  res.send(movies);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return required.status(400).send('No Genre found !');

  const movie = new Movie({
    title: req.body.title,
    genre: new Genre({
      _id: genre._id,
      name: genre.name
    }),
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  try {
    await movie.save();
    console.log(movie);
    res.send(movie);
  } catch (error) {
    console.log(error.message)
    res.send(error.message);
  }
});

module.exports = router;