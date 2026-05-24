import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Student as IStudent } from "../types/student.types.ts";
import { Student } from "../models/student.model.ts";
import type { Request, Response } from "express";

export async function signup(req: Request, res: Response) {
    try {
        const {
            id,
            email,
            fullName,
            age,
            password,
            hobbies,
        }: IStudent = req.body;

        const existingStudent = await Student.findOne({ email });

        if (existingStudent) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const student = await Student.create({
            id,
            email,
            fullName,
            age,
            password,
            hobbies
        });

        res.status(201).json({ message: "User created" });

    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const {
            email,
            password,
        } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const match = await bcrypt.compare(password, student.password);

        if (!match) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            {
                id: student._id,
                email: student.email
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d"
            }
        );

        res.json({ token });

    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}

// HEADER.PAYLOAD.SIGNATURE

// $2b$10$9e85kpkBCckyMxyxS7djG.akQGemooRelNf/uK8LIXwyTepa0f8kK