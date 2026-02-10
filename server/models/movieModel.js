const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    
    description: {
      type: String,
      required: true,
    },

    
    duration: {
      hours: {
        type: Number,
        required: true,
      },
      minutes: {
        type: Number,
        required: true,
        max: 59,
      },
    },

    genre: {
      type: [String],
      required: true,
    },

  
    language: {
      type: [String],
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    poster: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("movies", movieSchema);
