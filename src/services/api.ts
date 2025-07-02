import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://0c71dm55-3000.use2.devtunnels.ms',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.multiRemove(['token', 'userId']);
      // En React Native no podemos hacer redirect directo, 
      // esto se manejará en el AuthContext
    }
    return Promise.reject(error);
  }
);

// Configurar token si existe en AsyncStorage
const initializeToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

initializeToken();

export default api;