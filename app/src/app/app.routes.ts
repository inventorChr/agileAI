import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Default route
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: '' }  // Wildcard route for 404
]; 