import { Schema, model } from "mongoose";

import type { Batch as IBatch } from "../types/batch.types.ts";

export const batchSchema = new Schema<IBatch>({
    id: String,
    name: String,
    classesPerWeek: Number,
    classDays: [Number],
    courseDuration: Number,
}, { timestamps: true });

export const Batch = model<IBatch>("Batch", batchSchema);