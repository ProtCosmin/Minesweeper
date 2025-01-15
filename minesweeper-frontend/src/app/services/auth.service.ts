import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
  
    constructor() {}
  
    // Verificăm dacă utilizatorul este autentificat (de obicei pe baza unui token)
    isAuthenticated(): boolean {
      return !!sessionStorage.getItem('loggedInUser'); // Verificăm dacă există un user în sesiune
    }
  }
  