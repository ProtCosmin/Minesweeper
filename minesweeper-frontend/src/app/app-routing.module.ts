
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
      path: 'login', 
      component: LoginComponent
    },
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
        path: 'profile', 
        component: ProfileComponent
    },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }