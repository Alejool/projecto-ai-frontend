import React, { useEffect, useState } from "react";
import { usePrediction } from "../hooks/usePrediction";
import DropoutPredictor from "./DropoutPredictor.jsx";
import StudentListPanel from "./StudentListPanel.jsx";
import CreateStudentModal from "./CreateStudentModal.jsx";
import { Users, User, Search } from "lucide-react";

export default function MainPredictorUI() {
  const {
    fetchStudentList,
    studentList,
    error,
    loading,
    predictDropout,
    result,
    updateStudent,
    createStudent,
    getStudentById,
  } = usePrediction();
  const [viewMode, setViewMode] = useState("list"); // 'list', 'result'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchStudentList();
  }, []);

  const handleSelectStudent = async (student) => {
    // Primero establecemos el estudiante seleccionado con los datos básicos de la lista
    setSelectedStudent(student);
    setViewMode("result");

    // Luego intentamos obtener los datos más frescos del servidor
    const freshStudentData = await getStudentById(student.id);

    if (freshStudentData) {
      setSelectedStudent(freshStudentData);

      const studentData = {
        academicAverage: freshStudentData.academicAverage,
        motivationLevel: freshStudentData.motivationLevel,
        weeklyAttendance: freshStudentData.weeklyAttendance,
        socioeconomicFactor: freshStudentData.socioeconomicFactor,
      };
      predictDropout(studentData);
    } else {
      // Fallback si falla la carga individual
      const studentData = {
        academicAverage: student.academicAverage,
        motivationLevel: student.motivationLevel,
        weeklyAttendance: student.weeklyAttendance,
        socioeconomicFactor: student.socioeconomicFactor,
      };
      predictDropout(studentData);
    }
  };

  const handleManualPredict = (data) => {
    setSelectedStudent(null);
    setViewMode("result");
    predictDropout(data);
  };

  const handleCreateStudent = async (data) => {
    const success = await createStudent(data);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleUpdateStudent = async (id, data) => {
    const success = await updateStudent(id, data);
    if (success) {
      // Obtener los datos actualizados del estudiante
      const updatedStudent = await getStudentById(id);
      if (updatedStudent) {
        setSelectedStudent(updatedStudent);
      }
      // Actualizar la predicción con los nuevos datos
      predictDropout(data);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedStudent(null);
  };

  return (
    <div className="predictor-wrapper">
      <div className="predictor-navbar">
        <div className="predictor-navbar-content">
          <div className="predictor-navbar-left">
            <button
              onClick={handleBackToList}
              className={`predictor-nav-button ${
                viewMode === "list" ? "active" : "inactive"
              }`}
            >
              <Users size={18} />
              Listado de Estudiantes
            </button>

            {viewMode === "result" && selectedStudent && (
              <div className="predictor-student-info">
                <User size={16} />
                <strong>{selectedStudent.name}</strong>
                <span className="student-code">({selectedStudent.code})</span>
              </div>
            )}
          </div>

          {viewMode === "result" && (
            <div className="predictor-badge">
              <Search size={14} />
              Análisis de Riesgo
            </div>
          )}
        </div>
      </div>
      <div className="predictor-content">
        {viewMode === "list" && (
          <StudentListPanel
            students={studentList}
            onSelectStudent={handleSelectStudent}
            onAddStudent={() => setShowCreateModal(true)}
            loading={loading}
            error={error}
          />
        )}
        {viewMode === "result" && (
          <div className="predictor-view">
            <DropoutPredictor
              result={result}
              loading={loading}
              error={error}
              defaultData={
                selectedStudent || {
                  academicAverage: 0,
                  motivationLevel: 0,
                  weeklyAttendance: 0,
                  socioeconomicFactor: 0,
                }
              }
              defaultCaseName={
                selectedStudent
                  ? `${selectedStudent.name} (${selectedStudent.code})`
                  : "Entrada Manual"
              }
              onPredict={handleManualPredict}
              studentId={selectedStudent ? selectedStudent.id : null}
              onUpdate={handleUpdateStudent}
            />
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateStudentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateStudent}
          loading={loading}
        />
      )}
    </div>
  );
}
