import { Router, Request, Response } from "express";
import { ideas } from "./ideas.routes";


const router = Router();

/**
 * Experiment type definition
 */
interface Experiment {
  id: number;
  title: string;
  ideaId: number;
  description: string;
  status: "planned" | "in-progress" | "completed";
  outcome?: string;
  createdAt: Date;
}

/**
 * In-memory storage
 */
export let experiments: Experiment[] = [];
let nextId = 1;


/**
 * GET all experiments
 */
router.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: experiments,
  });
});


/**
 * GET experiment by ID
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const experiment = experiments.find(e => e.id === id);

  if (!experiment) {
    return res.status(404).json({
      success: false,
      message: "Experiment not found",
    });
  }

  res.json({
    success: true,
    data: experiment,
  });
});


/**
 * CREATE experiment
 */
router.post("/", (req: Request, res: Response) => {
const { ideaId, title, description, status } = req.body;
// Check if idea exists
const ideaExists = ideas.find(i => i.id === ideaId);

if (!ideaExists) {
  return res.status(400).json({
    success: false,
    message: "Idea does not exist",
  });
}


 if (!ideaId || !title || !description || !status) {
    return res.status(400).json({
      success: false,
      message: "title, description, and status are required",
    });
  }

  const newExperiment: Experiment = {
    id: nextId++,
    title,
    ideaId,
    description,
    status,
    createdAt: new Date(),
  };

  experiments.push(newExperiment);

  res.status(201).json({
    success: true,
    data: newExperiment,
  });
});


/**
 * UPDATE experiment
 */
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const experiment = experiments.find(e => e.id === id);

  if (!experiment) {
    return res.status(404).json({
      success: false,
      message: "Experiment not found",
    });
  }

  const { title, description, status, outcome } = req.body;

  if (title !== undefined) experiment.title = title;
  if (description !== undefined) experiment.description = description;
  if (status !== undefined) experiment.status = status;
  if (outcome !== undefined) experiment.outcome = outcome;

  res.json({
    success: true,
    data: experiment,
  });
});


/**
 * DELETE experiment
 */
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const index = experiments.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Experiment not found",
    });
  }

  experiments.splice(index, 1);

  res.json({
    success: true,
    message: "Experiment deleted",
  });
});


export default router;
