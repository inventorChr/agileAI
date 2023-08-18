const sqlite3 = require('sqlite3').verbose();
const dbConfig = require('./database-config');
let db = new sqlite3.Database(dbConfig.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

const setupDatabase = () => {
    db.serialize(() => {
        // Create User table
        db.run(`
        CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          username TEXT,
          password TEXT,  // Remember to hash and salt this
          settings_openai_key TEXT
        )`, (err) => {
            if (err) {
                console.error('User table not created', err);
            } else {
                console.log('User table created successfully');
            }
        });

        // Create Project table
        db.run(`
        CREATE TABLE IF NOT EXISTS Project (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          user_id INTEGER,  // Add a new column to relate a project to a user
          project_conversation TEXT,
          project_stakeholders TEXT,
          project_task_list TEXT,
          project_idea TEXT,
          project_roles TEXT,
          project_additional_info TEXT,
          project_outline_title TEXT,
          project_outline_charter TEXT,
          project_outline_summary TEXT,
          project_outline_business_case TEXT,
          project_plan_goals TEXT,
          project_plan_objectives TEXT,
          project_plan_scope_deliverables TEXT,
          project_plan_work_breakdown_structure TEXT,
          project_plan_timeline_milestones TEXT,
          project_plan_budget_resources TEXT,
          project_plan_risk_assumptions TEXT,
          project_plan_risk_analysis TEXT,
          project_plan_stakeholder_analysis TEXT,
          project_plan_cost_analysis TEXT,
          project_plan_schedule_analysis TEXT,
          project_plan_resource_analysis TEXT,
          project_plan_communication_plan TEXT,
          FOREIGN KEY(user_id) REFERENCES User(id)  // Make sure that user_id relates to a valid user
        )`, (err) => {
            if (err) {
                console.error('Project table not created', err);
            } else {
                console.log('Project table created successfully');
            }
        });
    });
}


module.exports = setupDatabase;
