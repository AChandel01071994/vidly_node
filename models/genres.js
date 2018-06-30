const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
      trim: true
    }
  });
  
  const Genre = mongoose.model('Genre', genreSchema);
  
  function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(5).max(50).required()
    };
  
    return Joi.validate(genre, schema);
  }

  exports.validate = validateGenre;
  exports.Genre = Genre;
  exports.genreSchema = genreSchema;