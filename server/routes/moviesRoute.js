const router = require("express").Router();
const Movie = require("../models/movieModel");
const authMiddleware = require("../middlewares/authMiddleware");

console.log("=== MOVIES ROUTES LOADED ===");

// Add a new movie
router.post("/add-movie", authMiddleware, async (req, res) => {
  try {
    console.log("=== ADD MOVIE REQUEST ===");
    console.log("Request body:", req.body);
    console.log("User ID from auth:", req.userId);
    
    const newMovie = new Movie(req.body);
    await newMovie.save();
    
    console.log("✅ Movie added successfully:", newMovie._id);
    
    res.status(201).send({
      success: true,
      message: "Movie added successfully",
      data: newMovie
    });
  } catch (error) {
    console.error("❌ Add movie error:", error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// get all movies
router.get("/get-all-movies", async (req, res) => {
  try {
    console.log("=== GET ALL MOVIES REQUEST ===");
    
    const movies = await Movie.find().sort({ createdAt: -1 });
    
    console.log(`✅ Found ${movies.length} movies`);
    
    res.send({
      success: true,
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (error) {
    console.error("❌ Get all movies error:", error.message);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update a movie
router.post("/update-movie", authMiddleware, async (req, res) => {
  try {
    console.log("=== UPDATE MOVIE REQUEST ===");
    console.log("Movie ID:", req.body.movieId);
    console.log("Update data:", req.body);
    
    await Movie.findByIdAndUpdate(req.body.movieId, req.body);
    
    console.log("✅ Movie updated successfully");
    
    res.send({
      success: true,
      message: "Movie updated successfully",
    });
  } catch (error) {
    console.error("❌ Update movie error:", error.message);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete a movie
router.post("/delete-movie", authMiddleware, async (req, res) => {
  try {
    console.log("=== DELETE MOVIE REQUEST ===");
    console.log("Movie ID:", req.body.movieId);
    
    await Movie.findByIdAndDelete(req.body.movieId);
    
    console.log("✅ Movie deleted successfully");
    
    res.send({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete movie error:", error.message);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get a movie by id
router.get("/get-movie-by-id/:id", async (req, res) => {
  try {
    console.log("=== GET MOVIE BY ID REQUEST ===");
    console.log("Movie ID:", req.params.id);
    
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      console.log("❌ Movie not found");
      return res.status(404).send({
        success: false,
        message: "Movie not found",
      });
    }
    
    console.log("✅ Movie found:", movie.title);
    
    res.send({
      success: true,
      message: "Movie fetched successfully",
      data: movie,
    });
  } catch (error) {
    console.error("❌ Get movie by ID error:", error.message);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

console.log("✅ Movies routes configured");

module.exports = router;