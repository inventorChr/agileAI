import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTreeModule } from '@angular/material/tree';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { IdeaSubmissionComponent } from '../idea-submission/idea-submission.component';
import { ProjectOutlineComponent } from '../components/project-outline/project-outline.component';
import { ProjectPlanComponent } from '../components/project-plan/project-plan.component';
import { IdeaService, IdeaResponse } from '../services/idea-service.service';
import { ProjectStateService } from '../services/project-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatTreeModule,
    MatBottomSheetModule,
    MatRippleModule,
    MatGridListModule,
    MatProgressBarModule,
    HttpClientModule,
    MarkdownModule,
    IdeaSubmissionComponent,
    ProjectOutlineComponent,
    ProjectPlanComponent
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  projectId: number;
  alertMessage: string = '';
  activeTab: string = 'project-outline';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private ideaService: IdeaService,
    private projectStateService: ProjectStateService
  ) {
    let id = this.route.snapshot.paramMap.get('id');
    this.projectId = id ? +id : 0;
  }

  ngOnInit() {
    // Initial setup
  }

  ngAfterViewInit() {
    // Ensure data is loaded after view initialization
    if (this.projectId) {
      this.loadProjectData();
    }
  }

  loadProjectData() {
    this.isLoading = true;
    this.projectStateService.fetchProjectData(this.projectId);
    this.projectStateService.startPolling(this.projectId);
    
    // Force change detection after a short delay to ensure components are ready
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  onTabChange(event: any) {
    this.activeTab = event.tab.textLabel.toLowerCase().replace(/\s+/g, '-');
  }

  onIdeaSubmitted(event: {idea: string, additionalInfo: string}) {
    this.ideaService.saveIdea(event.idea, event.additionalInfo).subscribe({
      next: (response: IdeaResponse) => {
        this.alertMessage = 'Generating minions...';
        this.projectId = response.projectId;
        this.loadProjectData();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnDestroy() {
    this.projectStateService.stopPolling();
  }
}
