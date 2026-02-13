import { Router, Request, Response } from "express";

const router = Router();

// Temporary in-memory storage
interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
}

let ideas: Idea[] = [];
let nextId = 1;

// GET /ideas
router.get("/", (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      ideas: ideas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ideas",
    });
  }
});

// POST /ideas
router.post("/", (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    // validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const newIdea: Idea = {
      id: nextId++,
      title,
      description,
      status: "proposed",
    };

    ideas.push(newIdea);

    res.status(201).json({
      success: true,
      idea: newIdea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create idea",
    });
  }
});

export default router;
