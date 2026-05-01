import { PaperBlade } from "../../../database/model/paperBlade";
import { IPaperBlade } from "../../../utils/types";

export const createPaperBlade = async (paperBlade: Partial<IPaperBlade>) => {
    return await PaperBlade.create(paperBlade);
}

export const getPaperBlades = async () => {
    return await PaperBlade.find({}).populate("studentId");
}

export const getPaperBladeById = async (id: string) => {
    return await PaperBlade.findById(id).populate("studentId");
}

export const updatePaperBlade = async (id: string, paperBlade: Partial<IPaperBlade>) => {
    return await PaperBlade.findByIdAndUpdate(id, paperBlade, { new: true });
}