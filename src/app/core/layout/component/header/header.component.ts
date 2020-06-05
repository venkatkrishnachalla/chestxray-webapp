import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/module/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "cxr-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isAuth = false;
  doctorName = 'Dr.Adam';
  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.initialize();
  }

  private initialize() {
    this.isAuth = !!this.authService.user;
  }

  onLogout() {
    this.authService.logOut();
  }
}
