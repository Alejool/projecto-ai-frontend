// src/hooks/usePrediction.js
import { useState } from 'react';

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/predict`;

/**
 * Custom Hook para gestionar el envío de datos y el estado de la predicción,
 * incluyendo la solicitud de la lista de estudiantes pre-calculados.
 */
export const usePrediction = () => {
    // Estado para la predicción de un solo estudiante (POST /risk)
    const [result, setResult] = useState(null);
    // Estado para la lista de estudiantes (GET /students)
    const [studentList, setStudentList] = useState([]); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ==========================================================
    // 1. FUNCIÓN PARA OBTENER LA LISTA DE ESTUDIANTES DEL BACKEND
    // ==========================================================
    const fetchStudentList = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/students`);
            
            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Error ${response.status}: ${errorDetail}`);
            }

            const data = await response.json();
            setStudentList(data); // Almacena la lista en el estado

        } catch (err) {
            console.error('Error al obtener la lista de estudiantes:', err);
            setError(`Error de conexión al cargar la lista: ${err.message}. Asegúrate de que NestJS esté corriendo en ${BACKEND_URL}.`);
        } finally {
            setLoading(false);
        }
    };


    // ==========================================================
    // 2. FUNCIÓN PARA ENVIAR DATOS A LA IA (POST /risk)
    // ==========================================================
    const predictDropout = async (studentData) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Llama al endpoint de riesgo (que incluye la llamada a Gemini/Deepseek)
            const response = await fetch(`${BACKEND_URL}/risk`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Error ${response.status}: ${errorDetail}`);
            }

            const data = await response.json();
            setResult(data); // Almacena el resultado enriquecido de la IA

        } catch (err) {
            console.error('Error al realizar la predicción:', err);
            setError(`Error en el servidor de predicción: ${err.message}.`);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // 3. RETORNO DEL HOOK
    // ==========================================================
    return { 
        result, 
        loading, 
        error, 
        predictDropout,
        // Nuevas propiedades para la lista:
        studentList,
        fetchStudentList
    };
};