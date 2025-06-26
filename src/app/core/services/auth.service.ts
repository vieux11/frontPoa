import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User, UserLogin } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:3333';

  // Signals réactifs
  isConnected = signal<boolean>(false);
  nom = signal<string>('');
  role = signal<string>('');
  token = signal<string | null>(null);
  currentUser=signal<UserLogin | null>(null)

  constructor(private http: HttpClient) {
    // Initialisation depuis localStorage
    const storedToken = localStorage.getItem('token');
    const storedNom = localStorage.getItem('nom');
    const storedRole = localStorage.getItem('role');

    if (storedToken) {
      this.token.set(storedToken);
      this.isConnected.set(true);
      this.nom.set(storedNom || '');
      this.role.set((storedRole as 'admin' | 'client') || '');
    }
  }

  // 👤 Enregistrement
  register(fullName: string, email: string, password: string, role:string): Observable<UserLogin> {
    const user: User = { fullName, email, password, role};
    return this.http.post<UserLogin>(`${this.baseUrl}/register`, user, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    });
  }

  // 🔐 Connexion
  login(email: string, password: string): Observable<UserLogin> {
    const credentials = { email, password };
    return this.http.post<UserLogin>(`${this.baseUrl}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    });
  }

  // ✅ Enregistrement des infos après succès du login
  loginSuccess(data: UserLogin) {
    localStorage.setItem('token', data.token.token);
    localStorage.setItem('nom', data.user.fullName);
    localStorage.setItem('role', data.user.role);

    this.token.set(data.token.token);
    this.nom.set(data.user.fullName);
    this.role.set(data.user.role);
    this.isConnected.set(true);
    this.currentUser.set(data);
  }

  // 🔓 Déconnexion
  logout() : Observable<{message: string, status: number}> {
    const tokenBearer=localStorage.getItem('token');
    return this.http.post<{message: string, status: number}>(`${this.baseUrl}/logout`,{}, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${tokenBearer}`
      }
    })
  }

  // 📌 Helpers utiles
  isAuthenticated(): boolean {
    return this.isConnected();
  }

  getRole(): string {
    return this.role();
  }

  getToken(): string | null {
    return this.token();
  }

  getUserName(): string {
    return this.nom();
  }
  // Récupérer l' utilisateur actuel
  getCurrentUser(): UserLogin | null {
    return this.currentUser();
  }
  getUserId(): number | null {
    const user = this.currentUser();
    return user ? user.user.id : null;
  }
}
