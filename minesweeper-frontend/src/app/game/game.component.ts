import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameState } from '../models/gamestate.enum';
import { CellState } from '../models/cellstate.enum';
import { Cell } from '../models/cell.model';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
    cells: Cell[][] = [];
    gameState: GameState = GameState.FIRSTCLICK;
    width: number = 9;
    height: number = 9;
    minesNumber: number = 10;
    flagsNumber: number = 10;
    revealedCells: number = 0;
    timer = 0;
    private timerInterval: any;
    difficulty='Beginner';

    userId: number=0;
  
    constructor(private route: ActivatedRoute, private userService: UserService, private gameService: GameService) {}

    setGridStyles() {
      const root = document.documentElement;
      root.style.setProperty('--grid-rows', `${this.height}`);
      root.style.setProperty('--grid-cols', `${this.width}`);
    }

    private initializeGame(): void {
      this.gameState = GameState.FIRSTCLICK;
      this.flagsNumber = this.minesNumber;
      this.revealedCells = 0;
      this.timer = 0;
      this.setUnrevealedCells();
    }
  
    private setUnrevealedCells(): void {
      this.cells = [];
  
      for (let row = 0; row < this.height; row++) {
        const line: Cell[] = [];
  
        for (let column = 0; column < this.width; column++) {
          line.push(new Cell(row, column));
        }
  
        this.cells.push(line);
      }
    }

    ngOnInit(): void {
      this.loadUserId();
      this.route.queryParams.subscribe((params) => {
        this.difficulty = params['difficulty'];
  
        if (this.difficulty === 'Beginner') {
          this.width = 9;
          this.height = 9;
          this.minesNumber = 10;
        } else if (this.difficulty === 'Intermediate') {
          this.width = 16;
          this.height = 16;
          this.minesNumber = 40;
        } else if (this.difficulty === 'Expert') {
          this.width = 30;
          this.height = 16;
          this.minesNumber = 99;
        }
  
        this.setGridStyles();
        this.initializeGame();  
      });
    }

    loadUserId(): void {
      const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser') || '{}');
      const email = loggedInUser.email;
      console.log(JSON.parse(sessionStorage.getItem('loggedInUser') || '{}'));
  
      if (email) {
        this.userService.getUserIdByEmail(email).subscribe(response => {
          this.userId = response.id;
          console.log('ID-ul utilizatorului este:', this.userId);
        }, error => {
          console.error('Eroare la obținerea ID-ului utilizatorului:', error);
        });
      }
    }

    flagCell(cell: Cell, event: MouseEvent): void {
      event.preventDefault();
      if (this.gameState === GameState.FIRSTCLICK || this.gameState === GameState.INGAME) {
        let stateChanged = false;
  
        if (cell.state === CellState.UNREVEALED) {
          cell.state = CellState.FLAGGED;
          this.flagsNumber--;
          stateChanged = true;
        }
  
        if (cell.state === CellState.FLAGGED && !stateChanged) {
          cell.state = CellState.UNREVEALED;
          this.flagsNumber++;
        }
  
        if (cell.state === CellState.MINE) {
          cell.state = CellState.FLAGGED_MINE;
          this.flagsNumber--;
          stateChanged = true;
        }
  
        if (cell.state === CellState.FLAGGED_MINE && !stateChanged) {
          cell.state = CellState.MINE;
          this.flagsNumber++;
        }
      }
    }
    
    getCellClass(cell: Cell): string {
      switch (cell.state) {
        case CellState.FLAGGED:
          return 'cell-flagged';
        case CellState.FLAGGED_MINE:
          return 'cell-flagged';
        case CellState.REVEALED_MINE:
          return 'cell-mine';
        case CellState.REVEALED:
          if (cell.adjacentMines === 0) {
            return 'cell-revealed-0';
          } else if (cell.adjacentMines === 1) {
            return 'cell-revealed-1';
          } else if (cell.adjacentMines === 2) {
            return 'cell-revealed-2';
          } else if (cell.adjacentMines === 3) {
            return 'cell-revealed-3';
          } else if (cell.adjacentMines === 4) {
            return 'cell-revealed-4';
          } else if (cell.adjacentMines === 5) {
            return 'cell-revealed-5';
          } else if (cell.adjacentMines === 6) {
            return 'cell-revealed-6';
          } else if (cell.adjacentMines === 7) {
            return 'cell-revealed-7';
          } else if (cell.adjacentMines === 8) {
            return 'cell-revealed-8';
          }
          break;
        default:
          return 'cell-unrevealed';
      }
      return '';
    }
    
    
    generateMines(clickedCellRow: number, clickedCellColumn: number): void {
      this.gameState = GameState.INGAME;
      this.timerInterval = setInterval(() => {
        this.timer++;
      }, 1000);
      let indexMine = 0;
      while (indexMine < this.minesNumber) {
        const xPos = Math.floor(Math.random() * this.height);
        const yPos = Math.floor(Math.random() * this.width);
    
        if (xPos !== clickedCellRow && yPos !== clickedCellColumn) {
          const cell = this.cells[xPos][yPos];
    
          if (cell.state === CellState.UNREVEALED) {
            cell.state = CellState.MINE;
            indexMine++;
          } else if (cell.state === CellState.FLAGGED) {
            cell.state = CellState.FLAGGED_MINE;
            indexMine++;
          }
        }
      }
    }
    
    isOutOfBounds(row: number, column: number): boolean {
      return row < 0 || row >= this.height || column < 0 || column >= this.width;
    }

    checkAdjacentMines(cell: Cell): void {
      for (let x = cell.row - 1; x <= cell.row + 1; x++) {
        for (let y = cell.column - 1; y <= cell.column + 1; y++) {
          if (!this.isOutOfBounds(x, y)) {
            const adjacentCell = this.cells[x][y];
            if (adjacentCell.state === CellState.MINE || adjacentCell.state === CellState.FLAGGED_MINE) {
              cell.addAdjacentMine();
            }
          }
        }
      }
    }
    
    revealCells(cell: Cell): void {
      const filledCells: Cell[] = [];
      filledCells.push(cell);
      cell.state = CellState.REVEALED;
    
      while (filledCells.length > 0) {
        const currentCell = filledCells.shift()!;
    
        this.checkAdjacentMines(currentCell);
    
        if (currentCell.adjacentMines === 0) {
          for (let row = currentCell.row - 1; row <= currentCell.row + 1; row++) {
            for (let column = currentCell.column - 1; column <= currentCell.column + 1; column++) {
              if (!this.isOutOfBounds(row, column)) {
                const adjacentCell = this.cells[row][column];
                if (!(row === currentCell.row && column === currentCell.column) &&
                    (adjacentCell.state === CellState.UNREVEALED || adjacentCell.state === CellState.FLAGGED)) {
                  if (adjacentCell.state === CellState.FLAGGED) {
                    this.flagsNumber++;
                  }
                  filledCells.push(adjacentCell);
                  adjacentCell.state = CellState.REVEALED;
                }
              }
            }
          }
        }
    
        this.revealedCells++;
      }
    }
    
    checkCell(cell: Cell): void {
      if (this.gameState === GameState.FIRSTCLICK || this.gameState === GameState.INGAME) {
        if (cell.state === CellState.UNREVEALED) {
          if (this.revealedCells === 0) {
            this.generateMines(cell.row, cell.column);
          }
          this.revealCells(cell);
          this.CheckVictory();
        }
        else if (cell.state === CellState.MINE){
          this.gameOver();
        }
      }
    }
    
    gameOver(): void {
      this.gameState = GameState.GAMEOVER;
      this.gameService.AddGame(this.userId, this.difficulty, this.timer, false).subscribe({
        next: (response) => console.log('Response from backend:', response),
        error: (error) => console.error('Error in request:', error)
      });
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      for (let row = 0; row < this.height; row++) {
        for (let column = 0; column < this.width; column++) {
          if (this.cells[row][column].state === CellState.MINE) {
            this.cells[row][column].state = CellState.REVEALED_MINE
          }
        }
      }
    }

    CheckVictory(): void {
      if (this.width * this.height - this.revealedCells == this.minesNumber){
        this.gameState = GameState.WIN;
        this.gameService.AddGame(this.userId, this.difficulty, this.timer, true).subscribe({
          next: (response) => console.log('Response from backend:', response),
          error: (error) => console.error('Error in request:', error)
        });
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        for (let row = 0; row < this.height; row++) {
          for (let column = 0; column < this.width; column++) {
            if (this.cells[row][column].state === CellState.MINE) {
              this.cells[row][column].state = CellState.FLAGGED
            }
          }
        }
      }
    }
  }
