import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });
  console.log(recipe);

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Add more recipes for Biryani and Burger
router.post("/addSampleRecipes", async (req, res) => {
  const sampleRecipes = [
    {
      name: "Chicken Biryani",
      ingredients: ["Chicken", "Rice", "Spices", "Yogurt", "Onions"],
      instructions: "Cook chicken with spices. Layer with rice and cook.",
      imageUrl: "https://example.com/chicken-biryani.jpg",
      cookingTime: 60,
      userOwner: req.body.userOwner,
    },
    {
      name: "Veg Biryani",
      ingredients: ["Mixed Vegetables", "Rice", "Spices", "Yogurt", "Onions"],
      instructions: "Cook vegetables with spices. Layer with rice and cook.",
      imageUrl: "https://example.com/veg-biryani.jpg",
      cookingTime: 50,
      userOwner: req.body.userOwner,
    },
    {
      name: "Beef Burger",
      ingredients: ["Beef Patty", "Buns", "Lettuce", "Tomato", "Cheese"],
      instructions: "Grill beef patty. Assemble with buns and vegetables.",
      imageUrl: "https://example.com/beef-burger.jpg",
      cookingTime: 30,
      userOwner: req.body.userOwner,
    },
    {
      name: "Veggie Burger",
      ingredients: ["Veggie Patty", "Buns", "Lettuce", "Tomato", "Cheese"],
      instructions: "Grill veggie patty. Assemble with buns and vegetables.",
      imageUrl: "https://example.com/veggie-burger.jpg",
      cookingTime: 25,
      userOwner: req.body.userOwner,
    },
    {
      name: "Spaghetti Bolognese",
      ingredients: ["Spaghetti", "Ground Beef", "Tomato Sauce", "Onions", "Garlic"],
      instructions: "Cook spaghetti. Prepare sauce with beef and tomatoes. Combine and serve.",
      imageUrl: "https://example.com/spaghetti-bolognese.jpg",
      cookingTime: 40,
      userOwner: req.body.userOwner,
    },
  ];

  try {
    const result = await RecipesModel.insertMany(sampleRecipes);
    res.status(201).json({ message: "Sample recipes added successfully", result });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as recipesRouter };
