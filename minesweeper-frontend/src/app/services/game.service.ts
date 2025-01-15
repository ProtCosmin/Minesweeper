import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000'; // Modifică cu URL-ul corect al serverului tău

  constructor(private http: HttpClient) {}

  // 1. Creează un element în games, incluzând și durata
  AddGame(userId: number, difficulty: string, duration: number, win: boolean): Observable<any> {
    const body = { user_id: userId, difficulty, duration, win };
    return this.http.post(`${this.apiUrl}/games`, body);
  }

  // 2. Selectează primele 10 elemente în funcție de durată pentru o anumită dificultate
  getLeaderboard(difficulty: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/games/top?difficulty=${difficulty}`);
  }

  // 3. Preia toate jocurile și numără câte sunt câștigate pentru un anumit user și dificultate
  getWins(userId: number, difficulty: string): Observable<{ totalWins: number }> {
    return this.http.get<{ totalWins: number }>(`${this.apiUrl}/games/wins-count?user_id=${userId}&difficulty=${difficulty}`);
  }

  // 4. Preia toate jocurile pentru un anumit user și dificultate
  getTotalGames(userId: number, difficulty: string): Observable<{ totalGames: number }> {
    return this.http.get<{ totalGames: number }>(`${this.apiUrl}/games/count?user_id=${userId}&difficulty=${difficulty}`);
  }
}
