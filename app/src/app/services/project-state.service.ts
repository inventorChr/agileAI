import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription, of } from 'rxjs';
import { switchMap, takeWhile, tap } from 'rxjs/operators';
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
    taskBreakdown: ''
  });

  private currentProjectId: number | null = null;
  private pollingSubscription: Subscription | null = null;
  private readonly POLLING_INTERVAL = 5000; // 5 seconds

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
    
    // Start new polling
    this.pollingSubscription = interval(this.POLLING_INTERVAL).pipe(
      takeWhile(() => this.currentProjectId === projectId),
      switchMap(() => {
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
    // Fetch title
    this.ideaService.getTitle(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.title) {
          const titleMatch = response.title.match(/^#[^"]*"([^"]+)"/);
          const title = titleMatch && titleMatch[1] 
            ? titleMatch[1] 
            : response.title.replace(/^#\s*Project Title:\s*\n/i, '').replace(/^["']|["']$/g, '').trim();
          if (title !== this.projectState.value.title) {
            this.updateProjectState({ title });
          }
        }
      },
      error: (error) => console.error('Error fetching title:', error)
    });

    // Fetch summary
    this.ideaService.getSummary(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.summary) {
          const summary = response.summary
            .replace(/\r\n/g, '\n')
            .replace(/^\s*[-*]\s/gm, '* ')
            .replace(/^\s*(\d+)\.\s/gm, '$1. ')
            .trim();
          if (summary !== this.projectState.value.summary) {
            this.updateProjectState({ summary });
          }
        }
      },
      error: (error) => console.error('Error fetching summary:', error)
    });

    // Fetch business case
    this.ideaService.getBusinessCase(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.businessCase) {
          if (response.businessCase !== this.projectState.value.businessCase) {
            this.updateProjectState({ businessCase: response.businessCase });
          }
        }
      },
      error: (error) => console.error('Error fetching business case:', error)
    });

    // Fetch goals
    this.ideaService.getGoal(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.goal) {
          if (response.goal !== this.projectState.value.goals) {
            this.updateProjectState({ goals: response.goal });
          }
        }
      },
      error: (error) => console.error('Error fetching goals:', error)
    });

    // Fetch objectives
    this.ideaService.getObjective(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.objective) {
          if (response.objective !== this.projectState.value.objectives) {
            this.updateProjectState({ objectives: response.objective });
          }
        }
      },
      error: (error) => console.error('Error fetching objectives:', error)
    });

    // Fetch scope deliverables
    this.ideaService.getScopeDeliverables(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.scopeDeliverables) {
          if (response.scopeDeliverables !== this.projectState.value.scopeDeliverables) {
            this.updateProjectState({ scopeDeliverables: response.scopeDeliverables });
          }
        }
      },
      error: (error) => console.error('Error fetching scope deliverables:', error)
    });

    // Fetch work breakdown structure
    this.ideaService.getWorkBreakdownStructure(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.workBreakdownStructure) {
          if (response.workBreakdownStructure !== this.projectState.value.workBreakdownStructure) {
            this.updateProjectState({ workBreakdownStructure: response.workBreakdownStructure });
          }
        }
      },
      error: (error) => console.error('Error fetching work breakdown structure:', error)
    });

    // Fetch timeline milestones
    this.ideaService.getTimelineMilestones(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.timelineMilestones) {
          if (response.timelineMilestones !== this.projectState.value.timelineMilestones) {
            this.updateProjectState({ timelineMilestones: response.timelineMilestones });
          }
        }
      },
      error: (error) => console.error('Error fetching timeline milestones:', error)
    });

    // Fetch budget resources
    this.ideaService.getBudgetResource(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.budgetResource) {
          if (response.budgetResource !== this.projectState.value.budgetResources) {
            this.updateProjectState({ budgetResources: response.budgetResource });
          }
        }
      },
      error: (error) => console.error('Error fetching budget resources:', error)
    });

    // Fetch risk assumptions
    this.ideaService.getRiskAssumption(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.riskAssumption) {
          if (response.riskAssumption !== this.projectState.value.riskAssumptions) {
            this.updateProjectState({ riskAssumptions: response.riskAssumption });
          }
        }
      },
      error: (error) => console.error('Error fetching risk assumptions:', error)
    });

    // Fetch task breakdown
    this.ideaService.getTask(projectId.toString()).subscribe({
      next: (response) => {
        if (response?.task) {
          if (response.task !== this.projectState.value.taskBreakdown) {
            this.updateProjectState({ taskBreakdown: response.task });
          }
        }
      },
      error: (error) => console.error('Error fetching task breakdown:', error)
    });
  }
} 