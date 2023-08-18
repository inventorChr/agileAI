import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface IdeaResponse {
  message: string;
  projectId: number;
}
export interface KeyResponse {
  projectId: number;
  openai_key: string;
}
export interface TitleResponse {
  title: string;
}
export interface SummaryResponse {
  summary: string;
}
export interface BusinessCaseResponse {
  businessCase: string;
}
export interface CharterResponse {
  charter: string;
}

export interface GoalResponse {
  goal: string;
}

export interface ObjectiveResponse {
  objective: string;
}

export interface ScopeDeliverablesResponse {
  scopeDeliverables: string;
}

export interface WorkBreakdownStructureResponse {
  workBreakdownStructure: string;
}

export interface TimelineMilestonesResponse {
  timelineMilestones: string;
}

export interface BudgetResourceResponse {
  budgetResource: string;
}

export interface RiskAssumptionResponse {
  riskAssumption: string;
}

export interface StakeHolderResponse {
  stakeHolder: string;
}

export interface RoleResponse {
  role: string;
}

export interface TaskResponse {
  task: string;
}

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  private API_URL = 'http://localhost:3000/openai'; // Update with your server URL

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }



  saveIdea(idea: string, additionalInfo: string): Observable<IdeaResponse> {
    return this.http.post<IdeaResponse>(`${this.API_URL}/save_idea`, { idea, additionalInfo }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  saveSettings(openai_key: string): Observable<KeyResponse> {
    return this.http.post<KeyResponse>(`${this.API_URL}/savesettings`, { openai_key }, this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  getCharter(projectId: string): Observable<CharterResponse> {
    return this.http.get<CharterResponse>(`${this.API_URL}/charter?id=${projectId}`)
  }

  getTitle(projectId: string): Observable<TitleResponse> {
    return this.http.get<TitleResponse>(`${this.API_URL}/title?id=${projectId}`);
  }

  getSummary(projectId: string): Observable<SummaryResponse> {
    return this.http.get<SummaryResponse>(`${this.API_URL}/summary?id=${projectId}`);
  }

  getBusinessCase(projectId: string): Observable<BusinessCaseResponse> {
    return this.http.get<BusinessCaseResponse>(`${this.API_URL}/business_case?id=${projectId}`);
  }

  getGoal(projectId: string): Observable<GoalResponse> {
    return this.http.get<GoalResponse>(`${this.API_URL}/goals?id=${projectId}`);
  }

  getObjective(projectId: string): Observable<ObjectiveResponse> {
    return this.http.get<ObjectiveResponse>(`${this.API_URL}/objectives?id=${projectId}`);
  }
  getScopeDeliverables(projectId: string): Observable<ScopeDeliverablesResponse> {
    return this.http.get<ScopeDeliverablesResponse>(`${this.API_URL}/scope_deliverables?id=${projectId}`);
  }

  getWorkBreakdownStructure(projectId: string): Observable<WorkBreakdownStructureResponse> {
    return this.http.get<WorkBreakdownStructureResponse>(`${this.API_URL}/work_breakdown_structure?id=${projectId}`);
  }
  getTimelineMilestones(projectId: string): Observable<TimelineMilestonesResponse> {
    return this.http.get<TimelineMilestonesResponse>(`${this.API_URL}/timeline_milestones?id=${projectId}`);
  }
  getRiskAssumption(projectId: string): Observable<RiskAssumptionResponse> {
    return this.http.get<RiskAssumptionResponse>(`${this.API_URL}/risk_assumptions?id=${projectId}`);
  }

  getBudgetResource(projectId: string): Observable<BudgetResourceResponse> {
    return this.http.get<BudgetResourceResponse>(`${this.API_URL}/budget_resources?id=${projectId}`);
  }

  getStakeHolder(projectId: string): Observable<StakeHolderResponse> {
    return this.http.get<StakeHolderResponse>(`${this.API_URL}/stake_holder?id=${projectId}`);
  }

  getRole(projectId: string): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.API_URL}/role?id=${projectId}`);
  }

  getTask(projectId: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(`${this.API_URL}/task?id=${projectId}`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(error);
  }
}
