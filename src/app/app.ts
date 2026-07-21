import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

import { SidebarComponent } from './components/shared/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pyxis-front');
}
