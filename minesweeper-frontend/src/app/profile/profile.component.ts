import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile:any;
  ngOnInit(): void {
    this.userProfile = JSON.parse(sessionStorage.getItem("loggedInUser") || "");
  }
}
