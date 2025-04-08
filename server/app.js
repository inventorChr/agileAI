const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const openaiRouter = require('./routes/openai');
const loginRouter = require('./routes/login');
const dbConfig = require('./db/database-config');
const cors = require('cors');
const { Sequelize, DataTypes, Model } = require('sequelize');

// Setup sequelize instance
const sequelize = new Sequelize({
    dialect:'sqlite',
    storage: dbConfig.dbPath
});

class User extends Model {}
User.init({
    createdAt: DataTypes.DATE,
    username: DataTypes.STRING,
    password: DataTypes.STRING,  // Remember to hash and salt this in your registration and login code
    settings_openai_key: DataTypes.STRING
}, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
});

// define Project model
class Project extends Model {}
Project.init({
    createdAt: DataTypes.DATE,
    user_id: DataTypes.INTEGER,  // Add a new user_id field
    project_idea: DataTypes.STRING,
    project_additional_info: DataTypes.STRING,
    project_conversation: DataTypes.STRING,
    project_stakeholders: DataTypes.STRING,
    project_task_list: DataTypes.STRING,
    project_roles: DataTypes.STRING,
    project_outline_title: DataTypes.STRING,
    project_outline_charter: DataTypes.STRING,
    project_outline_summary: DataTypes.STRING,
    project_outline_business_case: DataTypes.STRING,
    project_plan_goals: DataTypes.STRING,
    project_plan_objectives: DataTypes.STRING,
    project_plan_scope_deliverables: DataTypes.STRING,
    project_plan_work_breakdown_structure: DataTypes.STRING,
    project_plan_timeline_milestones: DataTypes.STRING,
    project_plan_budget_resources: DataTypes.STRING,
    project_plan_risk_assumptions: DataTypes.STRING,
    project_plan_risk_analysis: DataTypes.STRING,
    project_plan_stakeholder_analysis: DataTypes.STRING,
    project_plan_cost_analysis: DataTypes.STRING,
    project_plan_schedule_analysis: DataTypes.STRING,
    project_plan_resource_analysis: DataTypes.STRING,
    project_plan_communication_plan: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Project',
    freezeTableName: true
});

Project.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Project, { foreignKey: 'user_id' });



// Sync sequelize models and start server
sequelize.sync().then(() => {
    console.log('Database & tables created!');

    // Middleware
    app.use(express.json());
    app.use(cors());

    // Pass sequelize instance to routes
    app.use((req, res, next) => {
        req.db = sequelize;
        next();
    });

    // Routes
    app.use('/openai', openaiRouter);
    // app.use('/login', loginRouter);

    // Default route
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    // Server listening
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });

}).catch(error => console.error('Unable to create tables', error));

// Close the database connection when the node process is terminated
process.on('SIGINT', () => {
    sequelize.close().then(() => {
        console.log('Closed the database connection.');
        process.exit(0);
    }).catch(err => {
        console.error(err.message);
    });
});
