import type { Request, Response } from "express";
import type { Student as IStudent } from "../types/student.types.ts";
import { Student } from "../models/student.model.ts";

export async function createStudent(req: Request, res: Response): Promise<void> {
    try {
        const { id, fullName, email, hobbies, age }: IStudent = req.body;

        const student = await Student.create({
            id,
            fullName,
            email,
            hobbies,
            age
        });

        res.status(201).json({ succes: true, message: "Resource was created", resource: student })
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Server error" });
    }
}

// /api/students?limit=10&page=2
export async function getAllStudents(req: Request, res: Response): Promise<void> {
    try {
        

        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, parseInt(req.query.limit as string) || 1);

        const skip = (page - 1) * limit;

        const students = await Student
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1});

        res.status(200).json({
            success: true,
            data: students
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}


export async function getStudentById(req: Request, res: Response): Promise<void> {

    try {
        const { studentId } = req.params;

        if (!studentId || Array.isArray(studentId)) {
            res.status(400).json({ message: "No student ID provided" });
            return;
        }

        const student = await Student.findOne({ _id: studentId.toString() });

        res.json(student);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}


export async function updateStudent(req: Request, res: Response): Promise<void> {

    try {
        const { studentId } = req.params;

        if (!studentId || Array.isArray(studentId)) {
            res.status(400).json({ message: "No student ID provided" });
            return;
        }

        const { id, fullName, email, hobbies, age }: Partial<IStudent> = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            {
                id, fullName, email, hobbies, age
            },{
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        res.status(200).json({resource: updatedStudent});

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }

}