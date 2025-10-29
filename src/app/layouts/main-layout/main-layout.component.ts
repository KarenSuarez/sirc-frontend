import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/componentes/navbar/navbar.component';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {

  }
}
