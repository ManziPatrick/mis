import { Request, Response } from "express";
import { getStudentById } from "../../students/repository/studentRepositories";
import { createPaperBlade, getPaperBladeById, getPaperBlades, updatePaperBlade } from "../repository/paperBladeRepositories";
import { Usage } from "../../../database/model/usage";
import { PaperBlade } from "../../../database/model/paperBlade";

// Add paper blades brought by a student
export const addPaperBlades = async (req: Request, res:Response) => {
  try {
    const { studentId, quantityBrought } = req.body;
    const student = await getStudentById(studentId);
    if (!student) {
        res.status(404).json({ error: 'Student not found' });
      return;
    }
    const paperBlade = await createPaperBlade({studentId, quantityBrought });
    res.status(201).json(paperBlade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPaperBlades = async (req: Request, res: Response) => {
    try {
      const paperBlades = await getPaperBlades()
      const totalPaperBlades = await PaperBlade.aggregate([
        { $group: { _id: null, total: { $sum: "$quantityBrought" } } }
      ]);
  
      console.log("Total Paper Blades:", totalPaperBlades[0]?.total || 0);
      
      // Properly structure the response object
      res.status(200).json({
        paperBlades,
        totalPaperBlades: totalPaperBlades[0]?.total || 0
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// paper blade out

export const usagePaperBlade = async (req: Request, res: Response) => {
    try {
        const { quantityUsed, purpose } = req.body;

        if (!quantityUsed || !purpose) {
            res.status(400).json({ message: "Quantity and purpose are required" });
            return 
        }

        // Calculate total available paper blades
        const totalPaper = await PaperBlade.aggregate([
            { $group: { _id: null, total: { $sum: "$quantityBrought" } } }
        ]);
        const totalPaperBlades = totalPaper[0]?.total || 0;

        if (quantityUsed > totalPaperBlades) {
            res.status(400).json({ message: "Not enough paper blades available" });
            return 
        }

        // Deduct quantity from the most recent entries
        let remainingToDeduct = quantityUsed;
        const paperBlades = await PaperBlade.find().sort({ dateBrought: -1 }); // Get most recent first

        for (const paper of paperBlades) {
            if (remainingToDeduct <= 0) break;

            const deductAmount = Math.min(paper.quantityBrought, remainingToDeduct);
            paper.quantityBrought -= deductAmount;
            remainingToDeduct -= deductAmount;
            await paper.save();
        }

        // Log the usage in a separate model
        await Usage.create({
            quantityUsed,
            purpose,
            dateUsed: new Date(),
        });

        res.status(200).json({ message: "Paper blades used successfully" });
    } catch (error) {
        console.error("Error using paper blades:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};