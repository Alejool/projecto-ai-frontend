import React, { useState } from "react";import {
  BookOpen,
  AlertCircle,
  Inbox,
  Loader2,
  IdCard,
  Search,
} from "lucide-react";

function getRiskColor(color) {
  switch (color) {
    case "rojo":
      return "var(--color-risk-high)";
    case "naranja":
      return "var(--color-risk-medium)";
    default:
      return "var(--color-risk-low)";
  }
}

function getRiskClass(color) {
  switch (color) {
    case "rojo":
      return "risk-high";
    case "naranja":
      return "risk-medium";
    default:
      return "risk-low";
  }
}

export default function StudentListPanel({
  students,
  onSelectStudent,
  loading,
  error,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const studentsPerPage = 4;

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "var(--color-text-dark)",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          <Loader2
            size={48}
            className="animate-spin"
            style={{ margin: "0 auto" }}
          />
        </div>
        <p style={{ fontSize: "18px", fontWeight: "500" }}>
          Cargando lista de estudiantes...
        </p>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "rgba(190, 61, 42, 0.1)",
          border: "1px solid var(--color-risk-high)",
          borderRadius: "12px",
          padding: "20px",
          margin: "20px 0",
        }}
      >
        <p
          className="error-message"
          style={{
            color: "var(--color-risk-high)",
            margin: 0,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={20} />
          {error}
        </p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "var(--color-text-dark)",
        }}
      >
        <Inbox size={64} style={{ marginBottom: "20px" }} />
        <p style={{ fontSize: "18px" }}>
          No se encontraron estudiantes para el análisis.
        </p>
      </div>
    );
  }

  // Filtrar estudiantes por código
  const filteredStudents = students.filter((student) =>
    student.code.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Paginación
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Resetear página si el filtro cambia
  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
    setCurrentPage(1); // Volver a la primera página al filtrar
  };

  return (
    <div>
      {/* Header con estadísticas */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(16, 46, 80, 0.05) 0%, rgba(16, 46, 80, 0.02) 100%)",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          border: "1px solid rgba(16, 46, 80, 0.1)",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px 0",
            color: "var(--color-primary-dark)",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          <BookOpen
            size={20}
            style={{ display: "inline", marginRight: "8px" }}
          />
          Estudiantes Registrados
        </h2>
        <p
          style={{
            margin: 0,
            color: "var(--color-text-dark)",
            opacity: 0.8,
            fontSize: "15px",
          }}
        >
          Seleccione un estudiante para ver su análisis de riesgo y
          recomendaciones de IA
        </p>

        {/* Campo de búsqueda */}
        <div
          style={{
            marginTop: "15px",
            position: "relative",
            maxWidth: "400px",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#666",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por código de estudiante..."
            value={searchFilter}
            onChange={handleSearchChange}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-primary-dark)";
              e.target.style.boxShadow = "0 0 0 3px rgba(16, 46, 80, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "var(--color-card-background)",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <span style={{ color: "#666", fontSize: "13px" }}>Total: </span>
            <strong
              style={{ color: "var(--color-primary-dark)", fontSize: "16px" }}
            >
              {students.length}
            </strong>
          </div>
          <div
            style={{
              background: "var(--color-card-background)",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <span style={{ color: "#666", fontSize: "13px" }}>Filtrados: </span>
            <strong
              style={{ color: "var(--color-primary-dark)", fontSize: "16px" }}
            >
              {filteredStudents.length}
            </strong>
          </div>
          <div
            style={{
              background: "var(--color-card-background)",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
            }}
          >
            <span style={{ color: "#666", fontSize: "13px" }}>Página: </span>
            <strong
              style={{ color: "var(--color-primary-dark)", fontSize: "16px" }}
            >
              {currentPage} de {totalPages}
            </strong>
          </div>
        </div>
      </div>

      {/* Mensaje cuando no hay resultados del filtro */}
      {filteredStudents.length === 0 && searchFilter && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--color-text-dark)",
            background: "rgba(231, 139, 72, 0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(231, 139, 72, 0.2)",
          }}
        >
          <Search size={48} style={{ marginBottom: "15px", opacity: 0.5 }} />
          <p
            style={{
              fontSize: "16px",
              margin: "0 0 10px 0",
              fontWeight: "500",
            }}
          >
            No se encontraron estudiantes
          </p>
          <p style={{ fontSize: "14px", margin: 0, opacity: 0.7 }}>
            No hay estudiantes con el código "{searchFilter}"
          </p>
        </div>
      )}

      {/* Grid de estudiantes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {currentStudents.map((student) => {
          const riskColor = getRiskColor(student.color);
          const riskClass = getRiskClass(student.color);

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              style={{
                background: "var(--color-card-background)",
                borderRadius: "5px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `2px solid ${riskColor}20`,
                borderLeft: `5px solid ${riskColor}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
            >
              {/* Badge de riesgo */}
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: riskColor,
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {student.risk.toFixed(1)}%
              </div>

              {/* Nombre y código */}
              <h3
                style={{
                  margin: "0 0 8px 0",
                  color: "var(--color-primary-dark)",
                  fontSize: "18px",
                  fontWeight: "600",
                  paddingRight: "60px",
                }}
              >
                {student.name}
              </h3>

              <p
                style={{
                  margin: "0 0 15px 0",
                  color: "#666",
                  fontSize: "13px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IdCard size={20} style={{ marginRight: "5px" }} />
                {student.code}
              </p>

              {/* Status badge */}
              <div
                className={`risk-status ${riskClass}`}
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "15px",
                }}
              >
                {student.status}
              </div>

              {/* Métricas */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginTop: "15px",
                  paddingTop: "15px",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Promedio
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "var(--color-primary-dark)",
                    }}
                  >
                    {student.academicAverage}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#999",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Asistencia
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "var(--color-primary-dark)",
                    }}
                  >
                    {student.weeklyAttendance}/7
                  </div>
                </div>
              </div>

              {/* Hover indicator */}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  height: "3px",
                  background: `linear-gradient(90deg, ${riskColor}, ${riskColor}aa)`,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              background:
                currentPage === 1 ? "#f0f0f0" : "var(--color-primary-dark)",
              color: currentPage === 1 ? "#999" : "var(--color-text-light)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
            ← Anterior
          </button>

          <div
            style={{
              display: "flex",
              gap: "6px",
            }}
          >
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    background:
                      currentPage === pageNum
                        ? "var(--color-secondary-light)"
                        : "var(--color-card-background)",
                    color:
                      currentPage === pageNum
                        ? "var(--color-primary-dark)"
                        : "var(--color-text-dark)",
                    border:
                      currentPage === pageNum
                        ? "2px solid var(--color-secondary-light)"
                        : "1px solid #e0e0e0",
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: currentPage === pageNum ? "600" : "500",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== pageNum) {
                      e.target.style.background = "#f5f5f5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== pageNum) {
                      e.target.style.background =
                        "var(--color-card-background)";
                    }
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={{
              background:
                currentPage === totalPages
                  ? "#f0f0f0"
                  : "var(--color-primary-dark)",
              color:
                currentPage === totalPages ? "#999" : "var(--color-text-light)",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
