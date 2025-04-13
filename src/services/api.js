//const API_URL = 'http://localhost:8000/api/llibres'; // Ajusta según tu Django API
const API_URL = 'https://biblioteca5.ieti.site/api/llibres/';
export const getBooks = () => {
  console.log('llamando API...');
  return fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener los libros');
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error en la API:', error);
      return [];
    });
};
