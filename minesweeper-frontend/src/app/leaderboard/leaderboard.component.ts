import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/game.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table'; // Importă modulul de tabel

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [MatTableModule], // Doar MatTableModule pentru tabel, fără sortare/paginare
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  displayedColumns: string[] = ['rank', 'name', 'duration'];
  dataSource: any[] = [];

  difficulty = 'Beginner';

  constructor(private route: ActivatedRoute, private gameService: GameService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.difficulty = params['difficulty'];
    });

    this.gameService.getLeaderboard(this.difficulty).subscribe({
      next: (response) => {
        console.log('Response from backend:', response);
        this.dataSource = response;
      },
      error: (error) => console.error('Error in request:', error)
    });
  }
}
