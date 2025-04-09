import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription, of, forkJoin } from 'rxjs';
import { switchMap, takeWhile, tap, debounceTime, map } from 'rxjs/operators';
import { IdeaService } from './idea-service.service';

export interface ProjectState {
  title: string;
  summary: string;
  businessCase: string;
  goals: string;
  objectives: string;
  scopeDeliverables: string;
  workBreakdownStructure: string;
  timelineMilestones: string;
  budgetResources: string;
  riskAssumptions: string;
  taskBreakdown: string;
  isComplete: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectStateService {
  private projectState = new BehaviorSubject<ProjectState>({
    title: '',
    summary: '',
    businessCase: '',
    goals: '',
    objectives: '',
    scopeDeliverables: '',
    workBreakdownStructure: '',
    timelineMilestones: '',
    budgetResources: '',
    riskAssumptions: '',
    taskBreakdown: '',
    isComplete: false
  });

  private currentProjectId: number | null = null;
  private pollingSubscription: Subscription | null = null;
  private readonly POLLING_INTERVAL = 10000; // 10 seconds
  private lastUpdateTime: number = 0;
  private readonly MIN_UPDATE_INTERVAL = 5000; // 5 seconds minimum between updates
  private isDataComplete: boolean = false;

  constructor(private ideaService: IdeaService) {}

  getProjectState(): Observable<ProjectState> {
    return this.projectState.asObservable();
  }

  getCurrentState(): ProjectState {
    return this.projectState.value;
  }

  updateProjectState(updates: Partial<ProjectState>) {
    const currentState = this.projectState.value;
    this.projectState.next({ ...currentState, ...updates });
  }

  startPolling(projectId: number) {
    // Stop any existing polling
    this.stopPolling();
    
    this.currentProjectId = projectId;
    this.isDataComplete = false;
    
    // Start new polling with debounce
    this.pollingSubscription = interval(this.POLLING_INTERVAL).pipe(
      takeWhile(() => this.currentProjectId === projectId && !this.isDataComplete),
      debounceTime(1000), // Debounce for 1 second
      switchMap(() => {
        const now = Date.now();
        if (now - this.lastUpdateTime < this.MIN_UPDATE_INTERVAL) {
          return of(null);
        }
        this.lastUpdateTime = now;
        this.fetchProjectData(projectId);
        return of(null);
      })
    ).subscribe();
  }

  stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
    this.currentProjectId = null;
  }

  fetchProjectData(projectId: number) {
    // Fetch all data in parallel using forkJoin
    forkJoin({
      title: this.ideaService.getTitle(projectId.toString()),
      summary: this.ideaService.getSummary(projectId.toString()),
      businessCase: this.ideaService.getBusinessCase(projectId.toString()),
      goal: this.ideaService.getGoal(projectId.toString()),
      objective: this.ideaService.getObjective(projectId.toString()),
      scopeDeliverables: this.ideaService.getScopeDeliverables(projectId.toString()),
      workBreakdownStructure: this.ideaService.getWorkBreakdownStructure(projectId.toString()),
      timelineMilestones: this.ideaService.getTimelineMilestones(projectId.toString()),
      budgetResource: this.ideaService.getBudgetResource(projectId.toString()),
      riskAssumption: this.ideaService.getRiskAssumption(projectId.toString()),
      task: this.ideaService.getTask(projectId.toString()),
      status: this.ideaService.getProjectStatus(projectId.toString())
    }).subscribe({
      next: (responses) => {
        const updates: Partial<ProjectState> = {};

        if (responses.title?.title) {
          const titleMatch = responses.title.title.match(/^#[^"]*"([^"]+)"/);
          const title = titleMatch && titleMatch[1] 
            ? titleMatch[1] 
            : responses.title.title.replace(/^#\s*Project Title:\s*\n/i, '').replace(/^["']|["']$/g, '').trim();
          if (title !== this.projectState.value.title) {
            updates.title = title;
          }
        }

        if (responses.summary?.summary) {
          const summary = responses.summary.summary
            .replace(/\r\n/g, '\n')
            .replace(/^\s*[-*]\s/gm, '* ')
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')
            .trim();
          if (summary !== this.projectState.value.summary) {
            updates.summary = summary;
          }
        }

        if (responses.businessCase?.businessCase) {
          if (responses.businessCase.businessCase !== this.projectState.value.businessCase) {
            updates.businessCase = responses.businessCase.businessCase;
          }
        }

        if (responses.goal?.goal) {
          if (responses.goal.goal !== this.projectState.value.goals) {
            updates.goals = responses.goal.goal;
          }
        }

        if (responses.objective?.objective) {
          if (responses.objective.objective !== this.projectState.value.objectives) {
            updates.objectives = responses.objective.objective;
          }
        }

        if (responses.scopeDeliverables?.scopeDeliverables) {
          if (responses.scopeDeliverables.scopeDeliverables !== this.projectState.value.scopeDeliverables) {
            updates.scopeDeliverables = responses.scopeDeliverables.scopeDeliverables;
          }
        }

        if (responses.workBreakdownStructure?.workBreakdownStructure) {
          if (responses.workBreakdownStructure.workBreakdownStructure !== this.projectState.value.workBreakdownStructure) {
            updates.workBreakdownStructure = responses.workBreakdownStructure.workBreakdownStructure;
          }
        }

        if (responses.timelineMilestones?.timelineMilestones) {
          if (responses.timelineMilestones.timelineMilestones !== this.projectState.value.timelineMilestones) {
            updates.timelineMilestones = responses.timelineMilestones.timelineMilestones;
          }
        }

        if (responses.budgetResource?.budgetResource) {
          if (responses.budgetResource.budgetResource !== this.projectState.value.budgetResources) {
            updates.budgetResources = responses.budgetResource.budgetResource;
          }
        }

        if (responses.riskAssumption?.riskAssumption) {
          if (responses.riskAssumption.riskAssumption !== this.projectState.value.riskAssumptions) {
            updates.riskAssumptions = responses.riskAssumption.riskAssumption;
          }
        }

        if (responses.task?.task) {
          if (responses.task.task !== this.projectState.value.taskBreakdown) {
            updates.taskBreakdown = responses.task.task;
          }
        }

        // Check if the project is complete
        if (responses.status?.status === 'complete') {
          this.isDataComplete = true;
          updates.isComplete = true;
          this.stopPolling();
        }

        // Only update state if there are changes
        if (Object.keys(updates).length > 0) {
          this.updateProjectState(updates);
        }
      },
      error: (error) => {
        console.error('Error fetching project data:', error);
      }
    });
  }
} 