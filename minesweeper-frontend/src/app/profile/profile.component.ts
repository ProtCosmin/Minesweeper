import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  userId: number = 0;

  // Variabile pentru a stoca datele pentru fiecare dificultate
  winsByDifficulty: { [key: string]: number } = {};
  gamesByDifficulty: { [key: string]: number } = {};
  winRatesByDifficulty: { [key: string]: number } = {}; // Winrate pentru fiecare dificultate
  lostGamesByDifficulty: { [key: string]: number } = {}; // Jocuri pierdute pentru fiecare dificultate

  difficulties: string[] = ['Beginner', 'Intermediate', 'Expert']; // Lista dificultăților

  constructor(private userService: UserService, private gameService: GameService) { }

  ngOnInit(): void {
    this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");
    this.loadUserId();
  }

  loadUserId(): void {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
    const email = loggedInUser.email;
    console.log(loggedInUser);

    if (email) {
      this.userService.getUserIdByEmail(email).subscribe(response => {
        this.userId = response.id;
        console.log('ID-ul utilizatorului este:', this.userId);

        // După obținerea userId, apelăm endpoint-urile pentru toate dificultățile
        this.loadGamesStats();
      }, error => {
        console.error('Eroare la obținerea ID-ului utilizatorului:', error);
      });
    }
  }

  loadGamesStats(): void {
    this.difficulties.forEach(difficulty => {
      // Inițializăm un obiect pentru a colecta datele complet pentru fiecare dificultate
      let wins: number = 0;
      let totalGames: number = 0;
  
      // Apelăm endpoint-ul pentru câștiguri
      this.gameService.getWins(this.userId, difficulty).subscribe({
        next: (response) => {
          wins = response.totalWins; // Asumând că backend-ul returnează `totalWins`
          this.winsByDifficulty[difficulty] = wins;
  
          // Dacă avem deja totalGames, calculăm winrate și pierderile
          if (totalGames !== 0) {
            this.winRatesByDifficulty[difficulty] = this.calculateWinRate(wins, this.gamesByDifficulty[difficulty] || 0);
            this.lostGamesByDifficulty[difficulty] = this.calculateLostGames(this.gamesByDifficulty[difficulty] || 0, wins);
          }
        },
        error: (error) => console.error(`Error fetching wins for ${difficulty}:`, error)
      });
  
      // Apelăm endpoint-ul pentru jocurile totale
      this.gameService.getTotalGames(this.userId, difficulty).subscribe({
        next: (response) => {
          totalGames = response.totalGames; // Asumând că backend-ul returnează `total_games`
          this.gamesByDifficulty[difficulty] = totalGames;
  
          // Dacă avem deja wins, calculăm winrate și pierderile
          if (wins !== 0) {
            this.winRatesByDifficulty[difficulty] = this.calculateWinRate(wins, this.gamesByDifficulty[difficulty] || 0);
            this.lostGamesByDifficulty[difficulty] = this.calculateLostGames(this.gamesByDifficulty[difficulty] || 0, wins);
          }
          else{
            this.winRatesByDifficulty[difficulty] = 0;
            this.lostGamesByDifficulty[difficulty] = 0;
          }
        },
        error: (error) => console.error(`Error fetching total games for ${difficulty}:`, error)
      });
    });
  }

  // Funcție pentru calcularea winrate-ului
  calculateWinRate(wins: number, totalGames: number): number {
    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
    return parseFloat(winRate.toFixed(2));
  }

  // Funcție pentru calcularea jocurilor pierdute
  calculateLostGames(totalGames: number, wins: number): number {
    return totalGames - wins;
  }
}
