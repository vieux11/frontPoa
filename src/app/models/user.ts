export interface User {
    fullName: string | null;
    email: string;
    password: string;
    role: string;
  }
export interface UserLogin{
    user:{
        id: number,
        fullName: string,
        email: string,
        password: string,
        role: string
    },
    token: {
    type: string,
    name: null|string,
    token: string,
    abilities: [
    string
    ],
    lastUsedAt: null|string,
    expiresAt: null|string
  }
}
