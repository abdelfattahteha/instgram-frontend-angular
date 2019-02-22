import { NgModule } from "@angular/core";
import { 
    MatDialogModule, 
    MatMenuModule, 
    MatButtonModule, 
    MatInputModule, 
    MatCardModule,
    MatProgressSpinnerModule 
} from "@angular/material";

@NgModule({
    exports: [
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatMenuModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ]
})
export class AppMaterial {}