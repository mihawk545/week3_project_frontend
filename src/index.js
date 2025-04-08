import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.set('strictQuery', false); // Suppress deprecation warning

mongoose.connect(
  "mongodb+srv://Aquib:12345@cluster0.na7sd.mongodb.net/foodway?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(
    () => console.log("DB connected...")
  )

app.listen(3001, () => console.log("Server started"));

// Add this route to insert sample recipes
app.post("/addSampleRecipes", async (req, res) => {
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
