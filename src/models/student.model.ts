import { Schema, model } from "mongoose";

import type { Student as IStudent } from "../types/student.types.ts";
import type { NextFunction } from "express";
import bcrypt from "bcryptjs";

export const studentSchema = new Schema<IStudent>({
    id: String,
    fullName: String,
    email: String,
    age: Number,
    password: String,
    hobbies: [String],
}, { timestamps: true });

studentSchema.pre(
    "save",
    async function () {
        if (!this.isModified("password")) return;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
    }
)

export const Student = model<IStudent>("Student", studentSchema);