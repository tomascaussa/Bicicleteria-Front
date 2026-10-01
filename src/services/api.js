const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5147/api';

async function request(endpoint, options = {}) {

    // headers
    const headers = new Headers(options.headers || {});

    // Adjuntar token JWT si existe
    // Adjuntar token JWT si existe Y NO ESTAMOS EN LOGIN
    const token = localStorage.getItem('token');
    if (token && !endpoint.includes('/Auth/login')) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    // se asume un JSON si no se indica el CONTENT-TYPE
    if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
    }

    //cargamos la configuracio de  la peticíon
    const config = {
        ...options,
        headers,
    };
    // si el body es un objeto, convertir a JSON
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    // cargamos una llamada al fetch con la url a la api
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    // respuesta de una sesión expirada
    if (response.status === 401) {
        // Si es el endpoint de login, devolver error de credenciales
        if (endpoint.includes('/Auth/login')) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Credenciales inválidas');
        }

        // Para otros endpoints, sesión expirada: limpiar token y redirigir a login
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        throw new Error('Sesión expirada');
    }


    // Manejo de respuesta sin contenido
    if (response.status === 204) {
        return null;
    }

    // parsear cuerpo a JSON
    const data = await response.json().catch(() => null);

    // manejo de errores HTTP
    if (!response.ok) {
        const mensajeError = `Error ${response.status} - ${data?.title || ''} - ${data?.message || ''}`;
        throw new Error(mensajeError);
    }

    return data;
}


const login = (mail, password) =>
  request('/Auth/login', {
    method: 'POST',
    body: { email: mail, password }
    
  });

const register = (data) =>
  request('/Auth/register', {
    method: 'POST',
    body: data
  });

export { request };

export const authAPI = { login, register };

// ---------- Carrusel ----------
const getAllCarrusel = () => request('/Carrusel');
const getCarruselById = (id) => request(`/Carrusel/${id}`);
const createCarrusel = (data) => request('/Carrusel', { method: 'POST', body: data });
const updateCarrusel = (id, data) => request(`/Carrusel/${id}`, { method: 'PUT', body: data });
const removeCarrusel = (id) => request(`/Carrusel/${id}`, { method: 'DELETE' });

export const carruselAPI = {
  getAll: getAllCarrusel,
  getById: getCarruselById,
  create: createCarrusel,
  update: updateCarrusel,
  remove: removeCarrusel,
};

// ---------- Categorías ----------
const getAllCategories = () => request('/Categories');
const getCategoryById = (id) => request(`/Categories/${id}`);
const createCategory = (data) => request('/Categories', { method: 'POST', body: data });
const updateCategory = (id, data) => request(`/Categories/${id}`, { method: 'PUT', body: data });
const removeCategory = (id) => request(`/Categories/${id}`, { method: 'DELETE' });

export const categoriesAPI = {
  getAll: getAllCategories,
  getById: getCategoryById,
  create: createCategory,
  update: updateCategory,
  remove: removeCategory,
};

// ---------- Productos ----------
const getAllProducts = () => request('/Products');
const getProductById = (id) => request(`/Products/${id}`);
const createProduct = (data) => request('/Products', { method: 'POST', body: data });
const updateProduct = (id, data) => request(`/Products/${id}`, { method: 'PUT', body: data });
const removeProduct = (id) => request(`/Products/${id}`, { method: 'DELETE' });
const getCachedProducts = () => request('/Products/cached');
const syncCache = () => request('/Products/sync-cache', { method: 'POST' });
const debugProducts = () => request('/Products/debug');

export const productsAPI = {
  getAll: getAllProducts,
  getById: getProductById,
  create: createProduct,
  update: updateProduct,
  remove: removeProduct,
  getCached: getCachedProducts,
  syncCache,
  debug: debugProducts,
};
