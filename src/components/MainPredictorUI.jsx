import React, { useEffect, useState } from "react";
import { usePrediction } from "../hooks/usePrediction";
import DropoutPredictor from "./DropoutPredictor.jsx";
import StudentListPanel from "./StudentListPanel.jsx";
import { Users, User, Search } from "lucide-react";

export default function MainPredictorUI() {
  const {
    fetchStudentList,
    studentList,
    error,
    loading,
    predictDropout,
    result,
  } = usePrediction();
  const [viewMode, setViewMode] = useState("list"); // 'list', 'result'
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudentList();
  }, []);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setViewMode("result");

    const studentData = {
      academicAverage: student.academicAverage,
      motivationLevel: student.motivationLevel,
      weeklyAttendance: student.weeklyAttendance,
      socioeconomicFactor: student.socioeconomicFactor,
    };
    predictDropout(studentData);
  };

  const handleManualPredict = (data) => {
    setSelectedStudent(null);
    setViewMode("result");
    predictDropout(data);
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
            />
          </div>
        )}
      </div>
    </div>
  );
}
