// backend/controllers/students/studentsController.js
import { getAllStudents, registerStudents} from '../../models/studentsModel.js';

export const registerStudentsController = async (req, res) => {
  try {
    const newStudent = await registerStudents(req);
    res.status(201).json({
      message: "Student registered succesfully",
      student: newStudent
    });
  } catch (error) {
    // Handle duplicate key errors (unique constraint violations)
    if (error.code === '23505') {
      if (error.constraint === 'students_email_key') {
        return res.status(409).json({ 
          message: "Registration failed", 
          error: "Email already exists. Please use a different email address." 
        });
      }
      if (error.constraint === 'students_student_id_key') {
        return res.status(409).json({ 
          message: "Registration failed", 
          error: "Student ID already exists. Please use a different student ID." 
        });
      }
      return res.status(409).json({ 
        message: "Registration failed", 
        error: "Duplicate entry. This record already exists." 
      });
    }
    
    // Handle other database errors
    res.status(500).json({ 
      message: "Failed to register student", 
      error: error.message 
    });
  }
};

