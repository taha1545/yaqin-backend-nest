export interface GoogleProfile {
    email: string;
    name: string;
    googleId: string;
}

export interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    domain?: string;
    maxAge: number;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}