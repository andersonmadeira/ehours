const TOKEN_KEY = 'ehours-token'
export const login = token => localStorage.setItem(TOKEN_KEY, token)
export const logout = () => localStorage.removeItem(TOKEN_KEY)
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null
export const getToken = () => localStorage.getItem(TOKEN_KEY)
