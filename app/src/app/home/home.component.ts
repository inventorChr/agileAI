import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {
  IdeaService,
  IdeaResponse,
  TitleResponse,
  SummaryResponse,
  BusinessCaseResponse,
  GoalResponse,
  ObjectiveResponse,
  ScopeDeliverablesResponse,
  WorkBreakdownStructureResponse,
  StakeHolderResponse,
  RoleResponse,
  TaskResponse,
  TimelineMilestonesResponse,
  BudgetResourceResponse,
  RiskAssumptionResponse,
  CharterResponse,
  KeyResponse
} from "../idea-service.service";
import {ActivatedRoute} from "@angular/router";
import {interval, Subscription, switchMap} from "rxjs";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    MarkdownModule
  ]
})

export class HomeComponent implements OnInit {
  projectId: number;
  idea: string = '';
  additionalInfo: string = '';
  alertMessage: string = '';
  title: string = '';
  summary: string = '';
  business_case: string = '';
  goal: string = '';
  objective: string = '';
  scope_deliverables: string = '';
  work_breakdown_structure: string = '';
  timeline_milestones: string = '';
  budget_resources: string = '';
  risk_assumption: string = '';
  charter: string = '';

  role: string = '';
  stakeholder: string = '';
  task: string = '';

  activeTab: string = 'project-outline';

  titleFetched: boolean = false;
  summaryFetched: boolean = false;
  businessCaseFetched: boolean = false;

  subscription?: Subscription;

  pollingIntervalInSeconds = 5;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private ideaService: IdeaService) {
    let id = this.route.snapshot.paramMap.get('id');
    this.projectId = id ? +id : 0;
  }

  ngOnInit() {
    this.startFetchingData();
  }

  submitIdea() {
    this.ideaService.saveIdea(this.idea, this.additionalInfo).subscribe({
      next: (response: IdeaResponse) => {
        // Handle successful save
        this.idea = '';
        this.additionalInfo = '';
        this.alertMessage = 'Generating minions...';
        this.projectId = response.projectId;

        // Reset fetch flags
        this.titleFetched = false;
        this.summaryFetched = false;
        this.businessCaseFetched = false;

        this.startFetchingData();
      },
      error: (error) => {
        // Handle error in saving
        console.error(error);
      }
    });
  }
  // saveSettings() {
  //   this.ideaService.saveSettings(this.openai_key).subscribe({
  //     next: (response: KeyResponse) => {
  //       // Handle successful save
  //       this.projectId = response.projectId;
  //     },
  //     error: (error) => {
  //       // Handle error in saving
  //       console.error(error);
  //     }
  //   })
  // }

  startFetchingData() {
    if (this.projectId) {
      this.getTitle();
    }
  }
  getTitle() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getTitle(this.projectId.toString())))
      .subscribe({
        next: (response: TitleResponse) => {
          this.title = response.title;
          this.alertMessage = 'Generating catchy title...';
          this.cdr.detectChanges();

          // Unsubscribe if data received
          if (this.title) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getSummary();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getSummary() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getSummary(this.projectId.toString())))
      .subscribe({
        next: (response: SummaryResponse) => {
          this.summary = response.summary;
          this.alertMessage = "Generating project's summary...";
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.summary) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getBusinessCase();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }

      })
  }

  getBusinessCase() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getBusinessCase(this.projectId.toString())))
      .subscribe({
        next: (response: BusinessCaseResponse) => {
          this.business_case = response.businessCase;
          this.alertMessage = 'Generating the business case...';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.business_case) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getCharter();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getCharter() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getCharter(this.projectId.toString())))
      .subscribe({
        next: (response: CharterResponse) => {
          this.charter = response.charter;
          // this.alertMessage = 'Generating project charter...';
          this.cdr.detectChanges();

          // Unsubscribe if data received
          if (this.charter) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getGoal();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getGoal() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getGoal(this.projectId.toString())))
      .subscribe({
        next: (response: GoalResponse) => {
          this.goal = response.goal;
          this.alertMessage = 'Generating project goals...';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.goal) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getObjective();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getObjective() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getObjective(this.projectId.toString())))
      .subscribe({
        next: (response: ObjectiveResponse) => {
          this.objective = response.objective;
          this.alertMessage = 'Generating project objectives...';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.objective) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getScopeDeliverables();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getScopeDeliverables() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getScopeDeliverables(this.projectId.toString())))
      .subscribe({
        next: (response: ScopeDeliverablesResponse) => {
          this.scope_deliverables = response.scopeDeliverables;
          this.alertMessage = 'Generating project scope and deliverables...';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.scope_deliverables) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getWorkBreakdownStructure();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getWorkBreakdownStructure() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getWorkBreakdownStructure(this.projectId.toString())))
      .subscribe({
        next: (response: WorkBreakdownStructureResponse) => {
          if (response.workBreakdownStructure) {
            this.work_breakdown_structure = response.workBreakdownStructure.replace(/\n/g, '  \n');
          }
          this.alertMessage = 'Generating project work breakdown structure...';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.work_breakdown_structure) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getTimelineMilestones();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }


  getTimelineMilestones() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getTimelineMilestones(this.projectId.toString())))
      .subscribe({
        next: (response: TimelineMilestonesResponse) => {
          this.timeline_milestones = response.timelineMilestones;
          this.alertMessage = 'Generating project timeline and milestones...';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.timeline_milestones) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getBudgetResource();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getBudgetResource() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getBudgetResource(this.projectId.toString())))
      .subscribe({
        next: (response: BudgetResourceResponse) => {
          this.budget_resources = response.budgetResource;
          this.alertMessage = 'Generating budget and resources...';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.budget_resources) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getRiskAssumption();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getRiskAssumption() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getRiskAssumption(this.projectId.toString())))
      .subscribe({
        next: (response: RiskAssumptionResponse) => {
          this.risk_assumption = response.riskAssumption;
          this.alertMessage = "Generating project risk and assumption's...";
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.risk_assumption) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.alertMessage = '';
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getStakeHolder() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getStakeHolder(this.projectId.toString())))
      .subscribe({
        next: (response: StakeHolderResponse) => {
          this.stakeholder = response.stakeHolder;
          this.alertMessage = "Generating stakeholder's for your project...";
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.stakeholder) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  getTask() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getTask(this.projectId.toString())))
      .subscribe({
        next: (response: TaskResponse) => {
          this.task = response.task;
          this.alertMessage = 'Task Created';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.task) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }


  getRole() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getRole(this.projectId.toString())))
      .subscribe({
        next: (response: RoleResponse) => {
          this.role = response.role;
          this.alertMessage = 'Role Created';
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.role) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

}
