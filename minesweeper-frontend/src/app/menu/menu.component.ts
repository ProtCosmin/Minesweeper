import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

declare var handleSignout: any

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  constructor(private router: Router){}
  handleSignOut(){
    handleSignout();
    sessionStorage.removeItem("loggedInUser");
    this.router.navigate(["/login"]).then(() =>{
      window.location.reload();
    })
  }
}
