import {reactive, provide} from 'vue';
import VueJwtDecode from 'vue-jwt-decode';

const API_BASE_URL = 'http://localhost:3000';
const authService = reactive({

    async login(email,password) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error(`Erreur de connexion: ${response.statusText}`);
        }
        const result = await response.json();
        localStorage.setItem('authToken', result.token);
        return result;

    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
    },

    async register(formData) {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'kbis') {
                data.append(key, formData[key], formData[key].name);
            } else {
                data.append(key, formData[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            body: data,
        })

        if (!response.ok) {
            throw new Error(`Erreur d'inscription: ${response.statusText}`);
        }

        return await response.json();
    },
});
export default authService;
