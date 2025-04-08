const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const OpenAI = require("openai");

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const today = new Date();
const year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

// Pad the month and day with leading zeros, if required
month = (month < 10) ? '0' + month : month;
day = (day < 10) ? '0' + day : day;

const formattedDate = `${year}-${month}-${day}`;




router.post('/', async (req, res) => {
    const messageContent = req.body.message;

    try {
        const response = await openai.chat.completions.create({
            messages: [{role: "user", content: messageContent}],
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        res.json(response.choices[0].message);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(error.message);
    }
});

router.post('/save_idea', async (req, res) => {
    const {idea, additionalInfo} = req.body;
    const Project = req.db.models.Project;

    try {
        // Save the idea and additional info to the database
        const project = await Project.create({project_idea: idea, project_additional_info: additionalInfo});

        // Process the idea
        const processIdeaResult =  processIdea(project);

        // Send response
        res.json({message: 'Idea received and saved successfully', projectId: project.id});

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'An error occurred while saving the idea'});
    }
});

router.post('/savesettings', async (req, res) => {
    const Project = req.db.models.Project;
    const {projectId, settings_openai_key} = req.body;

    if (!settings_openai_key || !projectId) {
        res.status(400).json({error: 'Both settings_openai_key and projectId are required'});
        return;
    }

    try {
        // Find project by projectId
        const project = await Project.findByPk(projectId);

        if (project) {
            // If the project exists, update the openai_key
            project.settings_openai_key = settings_openai_key;
            await project.save();
            res.json({message: 'Settings saved successfully'});
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong on the server' });
    }
});




router.get('/charter', async (req, res) => {
    try {
        const Project = req.db.models.Project;

        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ charter: project.project_outline_charter });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the title' });
    }
})
router.get('/title', async (req, res) => {
    try {
        const Project = req.db.models.Project;

        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ title: project.project_outline_title });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the title' });
    }
})
router.get('/summary', async (req, res) => {
    try {
        const Project = req.db.models.Project;

        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ summary: project.project_outline_summary });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the title' });
    }
})
router.get('/business_case', async (req, res) => {
    try {
        const Project = req.db.models.Project;

        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ businessCase: project.project_outline_business_case });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the business case' });
    }
})
router.get('/goals', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ goal: project.project_plan_goals });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the goals' });
    }
})

router.get('/objectives', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ objective: project.project_plan_objectives });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the objectives' });
    }
})
router.get('/scope_deliverables', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ scopeDeliverables: project.project_plan_scope_deliverables });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the scope_deliverables' });
    }
})
router.get('/work_breakdown_structure', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ workBreakdownStructure: project.project_plan_work_breakdown_structure });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the Work Breakdown Structure' });
    }
})
router.get('/timeline_milestones', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ timelineMilestones: project.project_plan_timeline_milestones });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the Timeline Milestones' });
    }
})
router.get('/risk_assumptions', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ riskAssumption: project.project_plan_risk_assumptions });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the Risk Assumptions' });
    }
})
router.get('/budget_resources', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ budgetResource: project.project_plan_budget_resources });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the Budget Resources' });
    }
})
router.get('/stakeholders', async (req, res) => {
    try {
        const Project = req.db.models.Project;

        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ stakeHolder: project.project_stakeholders });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the stakeholders' });
    }
})
router.get('/roles', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ role: project.project_roles });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the roles' });
    }
})

router.get('/task', async (req, res) => {
    try {
        const Project = req.db.models.Project;
        // get the title from the database
        const project = await Project.findByPk(req.query.id);

        if (project) {
            res.json({ task: project.project_task_list });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the task' });
    }
})



async function processIdea(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('Project is required.');
    }

    // Define the prompt
    const prompt = `
    You are an AI assistant for project planning, we are beginning the initiation phase of project planning for ${project.project_idea}, ${project.project_additional_info}.
    Engage in a discussion to flesh out the user's idea by asking insightful questions. You must follow these rules in order to complete phase 1:
    Develop a rough draft of:
    1 Project Title:
    2 Project Charter:
    3 Project Summary:
    4 Business Case:
    The generated text should be in plain text.
    `;

    // Construct the assistant's messages
    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        // Get the content of the response
        const responseContent = response.choices[0].message.content;

        console.log('---------------------------- Response 1 ----------------------------');
        console.log(responseContent);


        // Update the project's charter in the database
        const updatedProject = await project.update(
            {project_conversation: responseContent},
        );
        updatedProject.project_conversation = responseContent;


        // Call charterIteration and pass responseContent
        await charterIteration(responseContent, project);


        return {message: 'Idea processed and conversation saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}



async function charterIteration(responseContent, project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    1. Review the discussion: ${project.project_conversation}.
    2. Today is: ${formattedDate}.
    3. From the discussion, create a thorough charter of the project.
    4. Generated text should be in Markdown.
    `;

    // Construct the assistant's messages
    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let response;
        try {
            response = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }


        // Get the content of the response
        const charterResponse = response.choices[0].message.content;

        console.log('---------------------------- Project Charter ----------------------------');
        console.log('Project ID:', project.id);


        // Update the project's charter in the database
        const updatedProject = await project.update(
            {project_outline_charter: charterResponse},
        );
        updatedProject.project_outline_charter = charterResponse;

        // Call titleIteration and pass responseContent
        await titleIteration(project);


        return {message: 'Charter drafted and saved successfully'};

    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}



async function titleIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    1. Review the following discussion: ${project.project_outline_charter}.
    2. Your **GOAL** is to parse the data for the keywords Project Title.
    3. Generated text shall only be the title of the project, formatted # Project Title: \n title.
    4. Response should be in Markdown.
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];


    try {
        // Generate a response from OpenAI
        let response;
        try {
            response = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = response.choices[0].message.content;
        console.log('---------------------------- Title ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_outline_title: responseContent},
        );
        updatedProject.project_outline_title = responseContent;

        // Call summaryIteration and pass responseContent
        await summaryIteration(project);


        return {message: 'Title generated and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}



async function summaryIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    1. Review the following discussion: ${project.project_outline_charter}.
    2. Parse data for the keyword Summary.
    3. Generated text shall only be the summary of the project, formatted ## Summary.
    4. Response should be in Markdown.
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];


    try {
        // Generate a response from OpenAI
        let response;
        try {
            response = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = response.choices[0].message.content;
        console.log('---------------------------- Summary ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_outline_summary: responseContent},
        );
        updatedProject.project_outline_summary = responseContent;



        // Call businessCaseIteration and pass responseContent
        await businessCaseIteration(project);

        return {message: 'Summary generated and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}



async function businessCaseIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    1. Review the following discussion: ${project.project_outline_charter}.
    2. Parse data for the keyword Business Case.
    3. Generated text shall only be the business case of the project, formatted ## Business Case.
    4. If the business case should be revised, revise and generate a new business case.
    5. Response should be in Markdown.
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];


    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Business Case ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_outline_business_case: responseContent},
        );
        updatedProject.project_outline_business_case = responseContent;



        // Call stakeholderIteration and pass responseContent
        await goalsIteration(project);

        return {message: 'Business case generated and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function goalsIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the Project: ${project.project_outline_charter}.
        2. Your **GOAL** is to generate a list of high level goals encompassing the project.
        3. Generated text shall only be the high level goals of the project, formatted ## high level goals.
        4. Generated text must be formatted in MARKDOWN.`;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Goals ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_goals: responseContent},
        );
        updatedProject.project_plan_goals = responseContent;

        // Call objectiveIteration and pass responseContent
        await objectiveIteration(project);

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


async function objectiveIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the Project Outline: ${project.project_outline_charter}.
        2. Your **GOAL** is to generate a list of objectives encompassing the project.
        3. Generated text shall only be the objectives of the project, formatted ## objectives.
        4. Generated text must be formatted in MARKDOWN.`;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Objective ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_objectives: responseContent},
        );
        updatedProject.project_plan_objectives = responseContent;
        // Call scopeDeliverablesIteration and pass responseContent
        await scopeDeliverablesIteration(project);

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}




async function scopeDeliverablesIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the Project Outline: ${project.project_outline_charter}.
        2. Your **GOAL** is to generate a list of scope and deliverables encompassing the project.
        3. Generated text shall only be the scope and deliverables of the project, formatted ## scope and deliverables.
        4. Generated text must be formatted in MARKDOWN.`;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Scope And Deliverables ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_scope_deliverables: responseContent},
        );
        updatedProject.project_plan_scope_deliverables = responseContent;
        // Call workBreakdownStructureIteration and pass responseContent
        await workBreakdownStructureIteration(project);

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}




async function workBreakdownStructureIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the Project Outline: ${project.project_outline_charter}.
        2. Your **GOAL** is to generate a comprehensive work breakdown structure encompassing the project.
        3. Generated text shall only be the work breakdown structure of the project, formatted ## work breakdown structure.
        4. Generated text must be formatted in Markdown.`;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Work Breakdown Structure ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_work_breakdown_structure: responseContent},
        );
        updatedProject.project_plan_work_breakdown_structure = responseContent;
        // Call timelineMilestonesIteration and pass responseContent
        await timelineMilestonesIteration(project);

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}


async function timelineMilestonesIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the Project Outline: ${project.project_outline_charter}.
        2. Your **GOAL** is to parse the project outline and generate comprehensive timeline and milestones encompassing the project.
        3. Generated text shall only be the timeline and milestones of the project, formatted ## timeline and milestones.
        4. Generated text must be formatted in Markdown.`;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Timeline Milestones ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_timeline_milestones: responseContent},
        );
        updatedProject.project_plan_timeline_milestones = responseContent;

        // Call budgetResourcesIteration
        await budgetResourcesIteration(project);

        return {message: 'Timeline and Milestones created and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function budgetResourcesIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the Project Outline: ${project.project_outline_charter}.
        2. Parse data for any information related to the Budget and Resources of the project.
        3. Your **Goal** is to create the section of the project called budget and resources.
        4. Generated text must be formatted in Markdown.`;

    const messages = [
        {role:'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Budget Resources ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_budget_resources: responseContent},
        );
        updatedProject.project_plan_budget_resources = responseContent;
        // Call riskAssumptionIteration
        await riskAssumptionIteration(project);

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function riskAssumptionIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the Project Outline: ${project.project_outline_charter}.
        2. Parse data for the keyword Risk and Assumptions.
        3. Create the given risk and assumptions for the project.
        4. Generated text must be formatted in Markdown.`;

    const messages = [
        {role:'system', content: prompt},
    ];

    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Risk and Assumptions ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_risk_assumptions: responseContent},
        );
        updatedProject.project_plan_risk_assumptions = responseContent;

        await taskIteration(project)

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function taskIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }
    let prompt = `
        1. Review the following discussion: ${project.project_outline_charter}.
        2. Parse data and determine the tasks necessary to meet the project's goals.
        3. Prioritize the task based and labeled on importance and interdependencies.
        4. Response should be in Markdown.`;

    const messages = [
        {role: 'system', content: prompt},
    ];
    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Task ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_task: responseContent},
        );
        updatedProject.project_task = responseContent;

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function stakeholderIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    1. Review the following discussion: ${project.project_outline_charter}.
    2. Parse data and determine who the stakeholder's of the project are.
    4. Response should be in Markdown.
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];


    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Stakeholders ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_stakeholders: responseContent},
        );
        updatedProject.project_stakeholders = responseContent;



        // Call rolesIteration and pass responseContent
        await rolesIteration(project);

        return {message: 'Stakeholders identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}



async function rolesIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    // Ensure that project is provided
    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    1. Parse stakeholder's ${project.project_stakeholders} and clearly define their role.
    2. Response should be in Markdown.
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];


    try {
        // Generate a response from OpenAI
        let r;
        try {
            r = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
                messages,
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
                temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
                top_p: Number(process.env.OPENAI_TOP_P) || 1,
                n: Number(process.env.OPENAI_N) || 1,
            });
        } catch (error) {
            console.error('An error occurred during the OpenAI API call:', error);
        }

        // Get the content of the response
        const responseContent = r.choices[0].message.content;

        console.log('---------------------------- Roles ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_roles: responseContent},
        );
        updatedProject.project_roles = responseContent;

        // Call stakeholderIteration and pass responseContent
        await taskIteration(project);

        return {message: 'Roles identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
















module.exports = router;
