import { Router } from "express";
import * as studentController from "../controller/student.controller.ts";


const router = Router();

router.get("/", studentController.getAllStudents);
router.post("/", studentController.createStudent);
router.get("/:studentId", studentController.getStudentById);
router.patch("/:studentId", studentController.updateStudent);

export default router;