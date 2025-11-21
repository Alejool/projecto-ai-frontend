import { useState } from 'react';

const BACKEND_URL = `${import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3000'}/predict`;

export const usePrediction = () => {
    const [result, setResult] = useState(null);
    const [studentList, setStudentList] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ==========================================================
    // 1. FUNCIÓN PARA OBTENER LA LISTA DE ESTUDIANTES (GET /students)
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
            setStudentList(data); 

        } catch (err) {
            console.error('Error al obtener la lista de estudiantes:', err);
            setError(`Error de conexión al cargar la lista: ${err.message}. Asegúrate de que NestJS esté corriendo en ${BACKEND_URL}.`);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // 2. FUNCIÓN PARA OBTENER UN ESTUDIANTE POR ID (GET /students/:id)
    // ==========================================================
    const getStudentById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BACKEND_URL}/students/${id}`);
            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Error ${response.status}: ${errorDetail}`);
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error al obtener estudiante:', err);
            setError(`Error al cargar estudiante: ${err.message}`);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // 3. FUNCIÓN PARA ENVIAR DATOS A LA IA (POST /risk)
    // ==========================================================
    const predictDropout = async (studentData) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
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
            setResult(data); 

        } catch (err) {
            console.error('Error al realizar la predicción:', err);
            setError(`Error en el servidor de predicción: ${err.message}.`);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // 4. FUNCIÓN PARA ACTUALIZAR ESTUDIANTE (PUT /students/:id)
    // ==========================================================
    const updateStudent = async (id, studentData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/students/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(studentData)
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Error ${response.status}: ${errorDetail}`);
            }
            
            // Refrescar la lista después de actualizar
            await fetchStudentList();
            return true;

        } catch (err) {
            console.error('Error al actualizar estudiante:', err);
            setError(`Error al actualizar: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================
    // 5. FUNCIÓN PARA CREAR ESTUDIANTE (POST /students)
    // ==========================================================
    const createStudent = async (studentData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/students`, {
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

            // Refrescar la lista después de crear
            await fetchStudentList();
            return true;

        } catch (err) {
            console.error('Error al crear estudiante:', err);
            setError(`Error al crear: ${err.message}`);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { 
        result, 
        loading, 
        error, 
        studentList,
        fetchStudentList,
        getStudentById,
        predictDropout,
        updateStudent,
        createStudent
    };
};
