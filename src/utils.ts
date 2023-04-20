const TOKEN_KEY = "AUTH"

function getTokenFromLocalStorage(): string {
    return localStorage.getItem(TOKEN_KEY) ?? ""
}

function saveTokenToLocalStorage(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
}

export { getTokenFromLocalStorage, saveTokenToLocalStorage }
