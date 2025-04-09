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
  TimelineMilestonesResponse,
  BudgetResourceResponse,
  RiskAssumptionResponse,
  UpdateResponse,
  TaskResponse
} from "../services/idea-service.service";
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
  task: string = '';

  activeTab: string = 'project-outline';

  titleFetched: boolean = false;
  summaryFetched: boolean = false;
  businessCaseFetched: boolean = false;

  subscription?: Subscription;

  pollingIntervalInSeconds = 5;

  // Editing state properties
  isEditingTitle = false;
  isEditingSummary = false;
  isEditingBusinessCase = false;
  isEditingGoal = false;
  isEditingObjective = false;
  isEditingScopeDeliverables = false;
  isEditingWorkBreakdownStructure = false;
  isEditingTimelineMilestones = false;
  isEditingBudgetResources = false;
  isEditingRiskAssumption = false;
  isEditingTask = false;

  // Editing content properties
  editingTitle = '';
  editingSummary = '';
  editingBusinessCase = '';
  editingGoal = '';
  editingObjective = '';
  editingScopeDeliverables = '';
  editingWorkBreakdownStructure = '';
  editingTimelineMilestones = '';
  editingBudgetResources = '';
  editingRiskAssumption = '';
  editingTask = '';

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
          this.summary = response.summary
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
          this.alertMessage = "Generating project's summary...";
          this.cdr.detectChanges();
          if (this.summary) {
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getBusinessCase();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getBusinessCase() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getBusinessCase(this.projectId.toString())))
      .subscribe({
        next: (response: BusinessCaseResponse) => {
          this.business_case = response.businessCase
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
          this.alertMessage = 'Generating the business case...';
          this.cdr.detectChanges();
          if (this.business_case) {
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
          this.goal = response.goal
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .replace(/^##\s*High-Level Goals\s*$/gm, '## High-Level Goals')  // Preserve High-Level Goals header
            .replace(/^##\s*Supporting Goals\s*$/gm, '## Supporting Goals')  // Preserve Supporting Goals header
            .trim();
          this.alertMessage = 'Generating project goals...';
          this.cdr.detectChanges();
          if (this.goal) {
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getObjective();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getObjective() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getObjective(this.projectId.toString())))
      .subscribe({
        next: (response: ObjectiveResponse) => {
          // Preserve markdown formatting while ensuring proper line breaks
          this.objective = response.objective
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
          this.alertMessage = 'Generating project objectives...';
          this.cdr.detectChanges();
          if (this.objective) {
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getScopeDeliverables();
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getScopeDeliverables() {
    this.subscription = interval(this.pollingIntervalInSeconds * 1000)
      .pipe(switchMap(() => this.ideaService.getScopeDeliverables(this.projectId.toString())))
      .subscribe({
        next: (response: ScopeDeliverablesResponse) => {
          this.scope_deliverables = response.scopeDeliverables
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
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
          this.work_breakdown_structure = response.workBreakdownStructure
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
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
          this.timeline_milestones = response.timelineMilestones
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
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
          this.budget_resources = response.budgetResource
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
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
          this.risk_assumption = response.riskAssumption
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
          this.alertMessage = "Generating project risk and assumption's...";
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.risk_assumption) {
            // Check if subscription is defined before trying to unsubscribe
            if (this.subscription) {
              this.subscription.unsubscribe();
              this.getTask();
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
          this.task = response.task
            .replace(/\r\n/g, '\n')  // Normalize line endings
            .replace(/^\s*[-*]\s/gm, '* ')  // Normalize bullet points
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')  // Normalize numbered lists
            .trim();
          this.alertMessage = "Generating task breakdown...";
          this.cdr.detectChanges();
          // Unsubscribe if data received
          if (this.task) {
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

  startEditing(field: string) {
    switch (field) {
      case 'title':
        this.isEditingTitle = true;
        this.editingTitle = this.title;
        break;
      case 'summary':
        this.isEditingSummary = true;
        this.editingSummary = this.summary;
        break;
      case 'business_case':
        this.isEditingBusinessCase = true;
        this.editingBusinessCase = this.business_case;
        break;
      case 'goal':
        this.isEditingGoal = true;
        this.editingGoal = this.goal;
        break;
      case 'objective':
        this.isEditingObjective = true;
        this.editingObjective = this.objective;
        break;
      case 'scope_deliverables':
        this.isEditingScopeDeliverables = true;
        this.editingScopeDeliverables = this.scope_deliverables;
        break;
      case 'work_breakdown_structure':
        this.isEditingWorkBreakdownStructure = true;
        this.editingWorkBreakdownStructure = this.work_breakdown_structure;
        break;
      case 'timeline_milestones':
        this.isEditingTimelineMilestones = true;
        this.editingTimelineMilestones = this.timeline_milestones;
        break;
      case 'budget_resources':
        this.isEditingBudgetResources = true;
        this.editingBudgetResources = this.budget_resources;
        break;
      case 'risk_assumption':
        this.isEditingRiskAssumption = true;
        this.editingRiskAssumption = this.risk_assumption;
        break;
      case 'task':
        this.isEditingTask = true;
        this.editingTask = this.task;
        break;
    }
  }

  cancelEditing(field: string) {
    switch (field) {
      case 'title':
        this.isEditingTitle = false;
        break;
      case 'summary':
        this.isEditingSummary = false;
        break;
      case 'business_case':
        this.isEditingBusinessCase = false;
        break;
      case 'goal':
        this.isEditingGoal = false;
        break;
      case 'objective':
        this.isEditingObjective = false;
        break;
      case 'scope_deliverables':
        this.isEditingScopeDeliverables = false;
        break;
      case 'work_breakdown_structure':
        this.isEditingWorkBreakdownStructure = false;
        break;
      case 'timeline_milestones':
        this.isEditingTimelineMilestones = false;
        break;
      case 'budget_resources':
        this.isEditingBudgetResources = false;
        break;
      case 'risk_assumption':
        this.isEditingRiskAssumption = false;
        break;
      case 'task':
        this.isEditingTask = false;
        break;
    }
  }

  saveEditing(field: string) {
    let content: string;
    switch (field) {
      case 'title':
        content = this.editingTitle;
        this.title = content;
        this.isEditingTitle = false;
        break;
      case 'summary':
        content = this.editingSummary;
        this.summary = content;
        this.isEditingSummary = false;
        break;
      case 'business_case':
        content = this.editingBusinessCase;
        this.business_case = content;
        this.isEditingBusinessCase = false;
        break;
      case 'goal':
        content = this.editingGoal;
        this.goal = content;
        this.isEditingGoal = false;
        break;
      case 'objective':
        content = this.editingObjective;
        this.objective = content;
        this.isEditingObjective = false;
        break;
      case 'scope_deliverables':
        content = this.editingScopeDeliverables;
        this.scope_deliverables = content;
        this.isEditingScopeDeliverables = false;
        break;
      case 'work_breakdown_structure':
        content = this.editingWorkBreakdownStructure;
        this.work_breakdown_structure = content;
        this.isEditingWorkBreakdownStructure = false;
        break;
      case 'timeline_milestones':
        content = this.editingTimelineMilestones;
        this.timeline_milestones = content;
        this.isEditingTimelineMilestones = false;
        break;
      case 'budget_resources':
        content = this.editingBudgetResources;
        this.budget_resources = content;
        this.isEditingBudgetResources = false;
        break;
      case 'risk_assumption':
        content = this.editingRiskAssumption;
        this.risk_assumption = content;
        this.isEditingRiskAssumption = false;
        break;
      case 'task':
        content = this.editingTask;
        this.task = content;
        this.isEditingTask = false;
        break;
      default:
        return;
    }

    // Save to backend
    this.ideaService.updateProjectContent(this.projectId, field, content).subscribe({
      next: (response: UpdateResponse) => {
        console.log(`${field} updated successfully`);
      },
      error: (error: Error) => {
        console.error(`Error updating ${field}:`, error);
      }
    });
  }

  // Add these methods to handle content transformations
  getCleanTitle(): string {
    if (!this.title) return '';
    return this.title
      .replace(/^markdown\s*/i, '')                // Remove 'markdown' text first
      .replace(/^[#\s]*Project Title:?\s*/i, '')   // Remove "Project Title:" and any #
      .replace(/^[#\s]+/, '')                      // Remove any remaining # at the start
      .replace(/^["'`]|["'`]$/g, '')              // Remove quotes/backticks at start/end
      .trim();                                     // Clean up whitespace
  }

  getCleanSummary(): string {
    if (!this.summary) return '';
    return this.summary
      .replace(/^[#\s]*Project Summary:?\s*/i, '') // Remove "Project Summary:" and any #
      .replace(/^[#\s]*Summary:?\s*/i, '')       // Remove "Summary:" and any #
      .replace(/^['"`]*|['"`]*$/g, '')           // Remove quotes/backticks
      .replace(/^markdown\s*/i, '')              // Remove 'markdown' text
      .replace(/^\s*```\s*|\s*```\s*$/g, '')    // Remove backticks
      .trim();                                   // Clean up whitespace
  }

  getCleanBusinessCase(): string {
    if (!this.business_case) return '';
    return this.business_case
      .replace(/^[#\s]*Business Case:?\s*/i, '')  // Remove "Business Case:" and any #
      .replace(/^Business Case:?\s*/i, '')        // Remove any remaining "Business Case:" without #
      .replace(/^['"`]*|['"`]*$/g, '')           // Remove quotes/backticks
      .replace(/^markdown\s*/i, '')              // Remove 'markdown' text
      .replace(/^\s*```\s*|\s*```\s*$/g, '')    // Remove backticks
      .trim();                                   // Clean up whitespace
  }

  getCleanGoal(): string {
    if (!this.goal) return '';
    return this.goal
      .replace(/^[#\s]*Goals:?\s*/i, '')          // Remove "Goals:" and any #
      .replace(/^['"`]*|['"`]*$/g, '')           // Remove quotes/backticks
      .replace(/^markdown\s*/i, '')              // Remove 'markdown' text
      .replace(/^\s*```\s*|\s*```\s*$/g, '')    // Remove backticks
      .replace(/^##\s*High-Level Goals\s*$/gm, '## High-Level Goals')  // Preserve High-Level Goals header
      .replace(/^##\s*Supporting Goals\s*$/gm, '## Supporting Goals')  // Preserve Supporting Goals header
      .trim();                                   // Clean up whitespace
  }

  getCleanObjective(): string {
    if (!this.objective) return '';
    return this.objective
      .replace(/^[#\s]*Objectives:?\s*/i, '')     // Remove "Objectives:" and any #
      .replace(/^['"`]*|['"`]*$/g, '')            // Remove quotes/backticks
      .replace(/^markdown\s*/i, '')               // Remove 'markdown' text
      .replace(/^\s*```\s*|\s*```\s*$/g, '')     // Remove backticks
      .trim();                                    // Clean up whitespace
  }

  getCleanScopeDeliverables(): string {
    return this.scope_deliverables.replace(/^##\s*Scope & Deliverables:\s*/, '');
  }

  getCleanBudgetResources(): string {
    if (!this.budget_resources) return '';
    return this.budget_resources
      .replace(/^[#\s]*Budget (?:&|and) Resources:?\s*/i, '')  // Remove header
      .replace(/^['"`]*|['"`]*$/g, '')                         // Remove quotes
      .replace(/^markdown\s*/i, '')                            // Remove markdown text
      .replace(/^\s*```\s*|\s*```\s*$/g, '')                  // Remove code blocks
      .replace(/^(###\s+[^#\n]+)$/gm, '\n$1')                // Add newline before H3 headers
      .replace(/^(- .+)$/gm, '    $1')                        // Indent all list items
      .replace(/^(### .+\n)(.+)/gm, '$1\n$2')                // Add newline after headers
      .trim();
  }

  getCleanRiskAssumption(): string {
    return this.risk_assumption.replace(/^##\s*Risk & Assumptions:\s*/, '');
  }

  getCleanTask(): string {
    return this.task.replace(/^##\s*Task Breakdown:\s*/, '');
  }

  getCleanWorkBreakdownStructure(): string {
    if (!this.work_breakdown_structure) return '';

    let lines = this.work_breakdown_structure
      .replace(/^[#\s]*Work Breakdown Structure:?\s*/i, '')
      .replace(/^['"`]*|['"`]*$/g, '')
      .replace(/^markdown\s*/i, '')
      .replace(/^\s*```\s*|\s*```\s*$/g, '')
      .trim()
      .split('\n');

    let formattedLines: string[] = [];
    let inSublist = false;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue; // Skip empty lines

      // Check if it's a phase line (e.g., "Phase 1: ..." or "* Phase 1: ...")
      if (line.match(/^Phase\s+\d+:|^-?\*?\s*Phase\s+\d+:/i)) {
        // Format as a top-level list item
        formattedLines.push(`* ${line.replace(/^[-*]?\s*/, '').replace(/:$/, '')}`);
        inSublist = true; // Subsequent items should be sub-items
      } else if (inSublist && line.match(/^[-*]/)) {
        // Format as a sub-list item (indented)
        formattedLines.push(`  * ${line.replace(/^[-*]?\s*/, '')}`);
      } else if (inSublist) {
        // Assume non-bulleted lines under a phase are also sub-items
        formattedLines.push(`  * ${line}`);
      } else {
         // Treat as a top-level item if not under a phase yet
         formattedLines.push(`* ${line.replace(/^[-*]?\s*/, '')}`);
      }
    }

    return formattedLines.join('\n');
  }

  getCleanTimelineMilestones(): string {
    if (!this.timeline_milestones) return '';
    return this.timeline_milestones
      .replace(/^[#\s]*Timeline (?:&|and) Milestones:?\s*/i, '')  // Remove "Timeline & Milestones:" and any #
      .replace(/^['"`]*|['"`]*$/g, '')                             // Remove quotes/backticks
      .replace(/^markdown\s*/i, '')                                // Remove 'markdown' text
      .replace(/^\s*```\s*|\s*```\s*$/g, '')                      // Remove backticks
      .trim();                                                     // Clean up whitespace
  }
}
