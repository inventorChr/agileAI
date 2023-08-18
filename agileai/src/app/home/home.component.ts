import {Component, ChangeDetectorRef} from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
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
