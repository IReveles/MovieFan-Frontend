import apiClient from './services.js'; // same axios instance

const AuthService = {
  register(data) {
    return apiClient.post('/users/register', data);
  },

  login(data) {
    return apiClient.post('/users/login', data);
  },

  googleLogin(data) {
    return apiClient.post('/users/googleLogin', data);
  }
};

export default AuthService;
