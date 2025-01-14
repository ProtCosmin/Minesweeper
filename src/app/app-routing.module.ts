
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
      path: 'game', 
      component: GameComponent
    },
    {
        path: 'leaderboard', 
        component: LeaderboardComponent
    },
    {
        path: 'instructions', 
        component: InstructionsComponent
    },
    {
      path: '',
      redirectTo: 'instructions',
      pathMatch: 'full'
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }