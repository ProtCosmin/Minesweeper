
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
      path: 'login', 
      component: LoginComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'game', 
      component: GameComponent,
      canActivate: [AuthGuard]
    },
    {
        path: 'leaderboard', 
        component: LeaderboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'instructions', 
        component: InstructionsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profile', 
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: 'login',
      pathMatch: 'full'
    }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }