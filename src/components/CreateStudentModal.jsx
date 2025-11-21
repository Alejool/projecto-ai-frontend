import React, { useState } from "react";
import {
  X,
  Save,
  User,
  FileText,
  BarChart3,
  Heart,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function CreateStudentModal({ onClose, onCreate, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    academicAverage: 3.0,
    motivationLevel: 5,
    weeklyAttendance: 3,
    socioeconomicFactor: 3,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert numeric strings to numbers
    const dataToSubmit = {
      ...formData,
      academicAverage: parseFloat(formData.academicAverage),
      motivationLevel: parseInt(formData.motivationLevel),
      weeklyAttendance: parseInt(formData.weeklyAttendance),
      socioeconomicFactor: parseInt(formData.socioeconomicFactor),
    };
    onCreate(dataToSubmit);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          animation: "slideIn 0.3s ease-out",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              color: "var(--color-primary-dark)",
            }}
          >
            Registrar Nuevo Estudiante
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div className="form-group">
              <label style={labelStyle}>
                <User size={16} /> Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>
                <FileText size={16} /> Código Estudiante
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Ej. 20231001"
              />
            </div>
          </div>

          <h3
            style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "15px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            Datos Académicos y Sociales
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div className="form-group">
              <label style={labelStyle}>
                <BarChart3 size={16} /> Promedio (0-5)
              </label>
              <input
                type="number"
                name="academicAverage"
                min="0"
                max="5"
                step="0.1"
                value={formData.academicAverage}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>
                <Heart size={16} /> Motivación (1-10)
              </label>
              <input
                type="number"
                name="motivationLevel"
                min="1"
                max="10"
                value={formData.motivationLevel}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>
                <Calendar size={16} /> Asistencia Semanal (0-7)
              </label>
              <input
                type="number"
                name="weeklyAttendance"
                min="0"
                max="7"
                value={formData.weeklyAttendance}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div className="form-group">
              <label style={labelStyle}>
                <DollarSign size={16} /> Factor Socioeconómico (1-5)
              </label>
              <input
                type="number"
                name="socioeconomicFactor"
                min="1"
                max="5"
                value={formData.socioeconomicFactor}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "white",
                cursor: "pointer",
                color: "#666",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: "var(--color-primary-dark)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                "Guardando..."
              ) : (
                <>
                  <Save size={18} /> Guardar Estudiante
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "var(--color-text-dark)",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "15px",
  boxSizing: "border-box",
};
