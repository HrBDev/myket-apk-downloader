interface V1ApiResponse {
    price: { isFree: boolean }
    size: { actual: number }
    version: { code: string }
}

interface V2ApiResponse {
    uriPath: string
    uriServers: string[]
}

interface AuthResponse { token: string }

interface AuthErrorResponse { translatedMessage: string }

export { V1ApiResponse, V2ApiResponse, AuthResponse, AuthErrorResponse }
