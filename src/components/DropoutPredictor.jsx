import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  BarChart3,
  Heart,
  Calendar,
  DollarSign,
  Bot,
  AlertTriangle,
  Clipboard,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function DropoutPredictor({
  defaultData,
  defaultCaseName,
  onPredict,
  result,
  loading,
  error,
}) {
  // Estado local para los datos del formulario
  const [formData, setFormData] = useState(
    defaultData || {
      academicAverage: 0,
      motivationLevel: 5,
      weeklyAttendance: 0,
      socioeconomicFactor: 3,
    }
  );

  // Ref para rastrear el caso anterior
  const previousCaseName = useRef(defaultCaseName);

  // Sincronizar estado SOLO cuando cambia el estudiante seleccionado
  useEffect(() => {
    if (defaultData && defaultCaseName !== previousCaseName.current) {
      setFormData(defaultData);
      previousCaseName.current = defaultCaseName;
    }
  }, [defaultData, defaultCaseName]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const studentData = {
      academicAverage: parseFloat(formData.academicAverage),
      motivationLevel: parseInt(formData.motivationLevel),
      weeklyAttendance: parseInt(formData.weeklyAttendance),
      socioeconomicFactor: parseInt(formData.socioeconomicFactor),
    };

    if (onPredict) {
      onPredict(studentData);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    // El riesgo ya viene como porcentaje (ej: 10.9)
    const riskPercentage = result.risk || 0;

    // Mapear el color del backend a las clases CSS y valores RGB
    let riskClass = "risk-low";
    let cssColor = "var(--color-risk-low)";
    let rgbColor = "56, 142, 60"; // Verde
    let bgColor = "rgba(56, 142, 60, 0.05)";
    let borderColor = "var(--color-risk-low)";

    // Usar el color que viene del backend
    if (result.color === "rojo") {
      riskClass = "risk-high";
      cssColor = "var(--color-risk-high)";
      rgbColor = "190, 61, 42"; // Rojo
      bgColor = "rgba(190, 61, 42, 0.05)";
      borderColor = "var(--color-risk-high)";
    } else if (result.color === "naranja") {
      riskClass = "risk-medium";
      cssColor = "var(--color-risk-medium)";
      rgbColor = "231, 139, 72"; // Naranja
      bgColor = "rgba(231, 139, 72, 0.05)";
      borderColor = "var(--color-risk-medium)";
    }

    // Usar el status que viene del backend
    const displayStatus = result.status || "Estado no disponible";

    return (
      <div
        className="ia-panel container"
        style={{
          backgroundColor: bgColor,
          borderLeft: `5px solid ${borderColor}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "var(--color-primary-dark)",
              fontSize: "1.4em",
            }}
          >
            <BarChart3
              size={20}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Resultados del Análisis
          </h3>
          <span
            className={`risk-status ${riskClass}`}
            style={{
              fontSize: "1em",
              padding: "8px 16px",
              borderRadius: "20px",
              border: `2px solid ${cssColor}`,
            }}
          >
            {displayStatus}
          </span>
        </div>

        {/* Indicador de Probabilidad */}
        <div style={{ marginBottom: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <strong style={{ color: "var(--color-text-dark)" }}>
              Probabilidad de Deserción
            </strong>
            <span
              style={{
                fontSize: "1.3em",
                fontWeight: "bold",
                color: cssColor,
              }}
            >
              {riskPercentage.toFixed(1)}%
            </span>
          </div>

          <div
            style={{
              background: "var(--color-background)",
              borderRadius: "12px",
              height: "28px",
              width: "100%",
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${riskPercentage}%`,
                background: `linear-gradient(90deg, rgba(${rgbColor}, 1), rgba(${rgbColor}, 0.85))`,
                borderRadius: "12px",
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `0 0 10px rgba(${rgbColor}, 0.3)`,
              }}
            ></div>
          </div>
        </div>

        {/* Factores Analizados */}
        {result.factors && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "var(--color-card-background)",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <strong
              style={{
                color: "var(--color-primary-dark)",
                display: "block",
                marginBottom: "10px",
                fontSize: "1.05em",
              }}
            >
              <Clipboard
                size={16}
                style={{ display: "inline", marginRight: "6px" }}
              />
              Factores Analizados
            </strong>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "10px",
              }}
            >
              <div>
                <span style={{ color: "#666" }}>Promedio Académico:</span>{" "}
                <strong>{result.factors.academicAverage}</strong>
              </div>
              <div>
                <span style={{ color: "#666" }}>Nivel de Motivación:</span>{" "}
                <strong>{result.factors.motivationLevel}/10</strong>
              </div>
              <div>
                <span style={{ color: "#666" }}>Asistencia Semanal:</span>{" "}
                <strong>{result.factors.weeklyAttendance}/7 días</strong>
              </div>
              <div>
                <span style={{ color: "#666" }}>Factor Socioeconómico:</span>{" "}
                <strong>{result.factors.socioeconomicFactor}/5</strong>
              </div>
            </div>
          </div>
        )}

        {/* Problemas Identificados */}
        {result.problems && result.problems.length > 0 && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "var(--color-card-background)",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <strong
              style={{
                color: "var(--color-risk-high)",
                display: "block",
                marginBottom: "10px",
                fontSize: "1.05em",
              }}
            >
              <AlertTriangle
                size={16}
                style={{ display: "inline", marginRight: "6px" }}
              />
              Problemas Identificados
            </strong>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                lineHeight: "1.8",
              }}
            >
              {result.problems.map((problem, i) => (
                <li key={i} style={{ marginBottom: "6px" }}>
                  {problem}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recomendación de IA */}
        {result.aiRecommendation && (
          <div
            style={{
              padding: "15px",
              backgroundColor: "var(--color-card-background)",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <strong
              style={{
                color: "var(--color-primary-dark)",
                display: "block",
                marginBottom: "10px",
                fontSize: "1.05em",
              }}
            >
              <Sparkles
                size={16}
                style={{ display: "inline", marginRight: "6px" }}
              />
              Recomendación de IA
            </strong>
            <p
              style={{
                margin: 0,
                lineHeight: "1.8",
                whiteSpace: "pre-wrap",
                color: "var(--color-text-dark)",
              }}
            >
              {result.aiRecommendation}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dropout-predictor">
      <form
        id="predictionForm"
        onSubmit={handleSubmit}
        style={{
          background: "var(--color-card-background)",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          marginBottom: "30px",
          border: "1px solid #e0e0e0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "25px",
            paddingBottom: "15px",
            borderBottom: "2px solid var(--color-secondary-light)",
          }}
        >
          <FileText size={24} style={{ color: "var(--color-primary-dark)" }} />
          <h3
            style={{
              margin: 0,
              color: "var(--color-primary-dark)",
              fontSize: "1.3em",
              fontWeight: "600",
            }}
          >
            Parámetros del Estudiante
          </h3>
          <span
            style={{
              marginLeft: "auto",
              background: "var(--color-background)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              color: "var(--color-text-dark)",
              fontWeight: "500",
            }}
          >
            {defaultCaseName}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          {/* Promedio Académico */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              htmlFor="academicAverage"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "var(--color-text-dark)",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              <BarChart3 size={18} />
              Promedio Académico
            </label>
            <input
              type="number"
              id="academicAverage"
              name="academicAverage"
              min="0"
              max="5"
              step="0.1"
              value={formData.academicAverage}
              onChange={handleInputChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                backgroundColor: loading ? "#f5f5f5" : "white",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary-dark)")
              }
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
            <small
              style={{
                color: "#666",
                fontSize: "12px",
                display: "block",
                marginTop: "4px",
              }}
            >
              Escala: 0.0 - 5.0
            </small>
          </div>

          {/* Nivel de Motivación */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              htmlFor="motivationLevel"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "var(--color-text-dark)",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              <Heart size={18} />
              Nivel de Motivación
            </label>
            <input
              type="number"
              id="motivationLevel"
              name="motivationLevel"
              min="1"
              max="10"
              step="1"
              value={formData.motivationLevel}
              onChange={handleInputChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                backgroundColor: loading ? "#f5f5f5" : "white",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary-dark)")
              }
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
            <small
              style={{
                color: "#666",
                fontSize: "12px",
                display: "block",
                marginTop: "4px",
              }}
            >
              Escala: 1 - 10
            </small>
          </div>

          {/* Frecuencia de Conexión */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              htmlFor="weeklyAttendance"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "var(--color-text-dark)",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              <Calendar size={18} />
              Asistencia Semanal
            </label>
            <input
              type="number"
              id="weeklyAttendance"
              name="weeklyAttendance"
              min="0"
              max="7"
              step="1"
              value={formData.weeklyAttendance}
              onChange={handleInputChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                backgroundColor: loading ? "#f5f5f5" : "white",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary-dark)")
              }
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
            <small
              style={{
                color: "#666",
                fontSize: "12px",
                display: "block",
                marginTop: "4px",
              }}
            >
              Días por semana: 0 - 7
            </small>
          </div>

          {/* Factor Socioeconómico */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label
              htmlFor="socioeconomicFactor"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "var(--color-text-dark)",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              <DollarSign size={18} />
              Factor Socioeconómico
            </label>
            <input
              type="number"
              id="socioeconomicFactor"
              name="socioeconomicFactor"
              min="1"
              max="5"
              step="1"
              value={formData.socioeconomicFactor}
              onChange={handleInputChange}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 15px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                backgroundColor: loading ? "#f5f5f5" : "white",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-primary-dark)")
              }
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
            <small
              style={{
                color: "#666",
                fontSize: "12px",
                display: "block",
                marginTop: "4px",
              }}
            >
              1 = Bajo, 5 = Alto
            </small>
          </div>
        </div>

        {/* <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px 30px",
            background: loading
              ? "#ccc"
              : "linear-gradient(135deg, var(--color-primary-dark) 0%, #1a4570 100%)",
            color: "var(--color-text-light)",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 4px 12px rgba(16, 46, 80, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(16, 46, 80, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(16, 46, 80, 0.3)";
            }
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              ></span>
              Calculando...
            </>
          ) : (
            <>
              <Bot size={18} />
              Analizar Perfil y Generar Recomendaciones IA
            </>
          )}
        </button> */}
      </form>

      <div id="resultContainer">
        {error && (
          <div
            style={{
              background: "rgba(190, 61, 42, 0.1)",
              border: "2px solid var(--color-risk-high)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <p
              className="error-message"
              style={{
                color: "var(--color-risk-high)",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "15px",
              }}
            >
              <AlertTriangle size={24} />
              {error}
            </p>
          </div>
        )}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              background: "var(--color-card-background)",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            >
              <Bot size={48} />
            </div>
            <p
              style={{
                color: "var(--color-text-dark)",
                fontSize: "16px",
                margin: 0,
              }}
            >
              Analizando datos y contactando al módulo de IA...
            </p>
          </div>
        )}
        {result && renderResult()}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
