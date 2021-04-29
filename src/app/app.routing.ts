import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
//components
import { PlayersComponent } from './components/players/players.component';
import { StatsComponent } from './components/stats/stats.component';
import { ErrorComponent } from './components/error/error.component';

const appRoutes: Routes = [
    {path: '', component: PlayersComponent},
    {path: 'stats/:id', component: StatsComponent},
    {path: '**', component: ErrorComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
