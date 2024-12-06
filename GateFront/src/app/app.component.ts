import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainComponent} from "../main/main.component";
import {CookieService} from "ngx-cookie-service";
import {ChipsModule} from "primeng/chips";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {GenaralService} from "../service/genaral.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, ChipsModule, ReactiveFormsModule, Button, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements  OnInit{


  constructor(private service: GenaralService) {

  }

  ngOnInit(): void {
  }






}
