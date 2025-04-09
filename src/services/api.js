// Constantes de configuración
const BASE_URL = 'http://localhost:8000/api'; // URL base para la API
const LLIBRES_ENDPOINT = '/llibres'; // Endpoint para los libros
const API_URL = `${BASE_URL}${LLIBRES_ENDPOINT}`;

// Tiempos de espera (en ms)
const TIMEOUT_DURATION = 15000; // 15 segundos de timeout para las peticiones

/**
 * Wrapper para fetch con timeout y mensajes de error consistentes
 * @param {string} url - URL a la que hacer la petición
 * @param {Object} options - Opciones de fetch
 * @returns {Promise} - Promise con la respuesta
 */
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const { signal } = controller;
  
  // Combinar el signal del AbortController con las options
  const fetchOptions = {
    ...options,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };
  
  // Crear un timeout que aborte la petición
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_DURATION);
  
  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeout);
    
    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      // Intentar obtener más información sobre el error
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeout);
    
    // Personalizar el mensaje según el tipo de error
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo en responder.');
    }
    
    // Rethrow para que se maneje en la función que llamó a fetchWithTimeout
    throw error;
  }
};

/**
 * Obtiene todos los libros
 * @param {Object} params - Parámetros opcionales para la petición (filtros, ordenación, etc)
 * @returns {Promise<Array>} - Promise con la lista de libros
 */
export const getBooks = async (params = {}) => {
  console.log('📚 Obteniendo lista de libros...');
  
  try {
    // Construir la URL con posibles parámetros de consulta
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const url = `${API_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const data = await fetchWithTimeout(url);
    console.log(`✅ ${data.length} libros obtenidos correctamente`);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener los libros:', error.message);
    // Puedes manejar diferentes tipos de errores de forma distinta aquí
    return [];
  }
};

/**
 * Obtiene un libro por su ID
 * @param {string|number} id - ID del libro a obtener
 * @returns {Promise<Object>} - Promise con los datos del libro
 */
export const getBookById = async (id) => {
  console.log(`📗 Obteniendo detalles del libro con ID: ${id}`);
  
  try {
    const data = await fetchWithTimeout(`${API_URL}/${id}`);
    console.log('✅ Libro obtenido correctamente:', data.titol);
    return data;
  } catch (error) {
    console.error(`❌ Error al obtener el libro con ID ${id}:`, error.message);
    
    // Si la API no proporciona un endpoint específico para obtener un libro por ID,
    // como alternativa, podemos obtener todos los libros y filtrar el que necesitamos
    try {
      console.log('⚠️ Intentando obtener el libro mediante una búsqueda alternativa...');
      const allBooks = await getBooks();
      const book = allBooks.find(book => book.id === parseInt(id));
      
      if (book) {
        console.log('✅ Libro encontrado mediante búsqueda alternativa:', book.titol);
        return book;
      } else {
        throw new Error('Libro no encontrado');
      }
    } catch (fallbackError) {
      console.error('❌ Error en la búsqueda alternativa:', fallbackError.message);
      throw fallbackError;
    }
  }
};

/**
 * Crea un nuevo libro
 * @param {Object} bookData - Datos del libro a crear
 * @returns {Promise<Object>} - Promise con los datos del libro creado
 */
export const createBook = async (bookData) => {
  console.log('📝 Creando nuevo libro...');
  
  try {
    const data = await fetchWithTimeout(API_URL, {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    
    console.log('✅ Libro creado correctamente:', data.titol);
    return data;
  } catch (error) {
    console.error('❌ Error al crear el libro:', error.message);
    throw error;
  }
};

/**
 * Actualiza un libro existente
 * @param {string|number} id - ID del libro a actualizar
 * @param {Object} bookData - Nuevos datos del libro
 * @returns {Promise<Object>} - Promise con los datos actualizados
 */
export const updateBook = async (id, bookData) => {
  console.log(`📝 Actualizando libro con ID: ${id}`);
  
  try {
    const data = await fetchWithTimeout(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
    
    console.log('✅ Libro actualizado correctamente:', data.titol);
    return data;
  } catch (error) {
    console.error(`❌ Error al actualizar el libro con ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Elimina un libro
 * @param {string|number} id - ID del libro a eliminar
 * @returns {Promise<void>}
 */
export const deleteBook = async (id) => {
  console.log(`🗑️ Eliminando libro con ID: ${id}`);
  
  try {
    await fetchWithTimeout(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    console.log('✅ Libro eliminado correctamente');
    return true;
  } catch (error) {
    console.error(`❌ Error al eliminar el libro con ID ${id}:`, error.message);
    throw error;
  }
};

/**
 * Busca libros según un término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} - Promise con la lista de libros encontrados
 */
export const searchBooks = async (searchTerm) => {
  console.log(`🔍 Buscando libros con término: "${searchTerm}"`);
  
  try {
    const queryParams = new URLSearchParams({
      search: searchTerm
    });
    
    const data = await fetchWithTimeout(`${API_URL}?${queryParams.toString()}`);
    console.log(`✅ ${data.length} libros encontrados para la búsqueda`);
    return data;
  } catch (error) {
    console.error('❌ Error al buscar libros:', error.message);
    throw error;
  }
};

// Exportación por defecto para importación más fácil
export default {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
};