import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';  // Asigură-te că ai un serviciu de autentificare

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.authService.isAuthenticated();  // Verifică dacă utilizatorul este autentificat
    const isLoginRoute = state.url === '/login'; // Verifică dacă ruta curentă este /login

    // Dacă utilizatorul este deja autentificat și încearcă să acceseze /login, îl redirecționăm la /profile
    if (isAuthenticated && isLoginRoute) {
      this.router.navigate(['/profile']);
      return false;
    }

    // Dacă nu este autentificat și încearcă să acceseze orice altă pagină, îl redirecționăm la login
    if (!isAuthenticated && !isLoginRoute) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
