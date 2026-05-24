import type { Request, Response } from "express";
import type { Batch as IBatch } from "../types/batch.types.ts";
import { Batch } from "../models/batch.model.ts";

export async function createBatch(req: Request, res: Response): Promise<void> {
    try {
        const { id, name, classesPerWeek, classDays, courseDuration }: IBatch = req.body;

        const batch = await Batch.create({
            id,
            name,
            classesPerWeek,
            classDays,
            courseDuration
        });

        res.status(201).json({ succes: true, message: "Resource was created", resource: batch })
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Server error" });
    }
}


export async function getAllBatches(req: Request, res: Response): Promise<void> {
    try {

        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, parseInt(req.query.limit as string) || 10);

        const skip = (page - 1) * limit;

        const batches = await Batch
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Batch.countDocuments();

        res.json({
            success: true,
            data: batches,
            pagination: {
                total: total,
                page: page,
                limit: limit,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}


export async function getBatchById(req: Request, res: Response): Promise<void> {

    try {
        const { batchId } = req.params;

        if (!batchId || Array.isArray(batchId)) {
            res.status(400).json({ message: "No batch ID provided" });
            return;
        }

        const batch = await Batch.findOne({ _id: batchId.toString() });

        res.json(batch);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}


export async function updateBatch(req: Request, res: Response): Promise<void> {

    try {
        const { batchId } = req.params;

        if (!batchId || Array.isArray(batchId)) {
            res.status(400).json({ message: "No batch ID provided" });
            return;
        }

        const { id, name, classesPerWeek, classDays, courseDuration }: Partial<IBatch> = req.body;

        const updatedBatch = await Batch.findByIdAndUpdate(
            batchId,
            {
                id, name, classesPerWeek, classDays, courseDuration
            }, {
            new: true,
            runValidators: true
        }
        );

        if (!updatedBatch) {
            res.status(404).json({ message: "Batch not found" });
            return;
        }

        res.status(200).json({ resource: updatedBatch });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }

}