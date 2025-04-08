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

// Add update endpoint
router.post('/:field', async (req, res) => {
  try {
    const { id, content } = req.body;
    const field = req.params.field;

    // Map the field to the database column name
    const fieldMap = {
      'title': 'project_outline_title',
      'summary': 'project_outline_summary',
      'business_case': 'project_outline_business_case',
      'goal': 'project_plan_goals',
      'objective': 'project_plan_objectives',
      'scope_deliverables': 'project_plan_scope_deliverables',
      'work_breakdown_structure': 'project_plan_work_breakdown_structure',
      'timeline_milestones': 'project_plan_timeline_milestones',
      'budget_resources': 'project_plan_budget_resources',
      'risk_assumption': 'project_plan_risk_assumptions'
    };

    const dbField = fieldMap[field];
    if (!dbField) {
      return res.status(400).json({ error: 'Invalid field' });
    }

    // Update the project in the database
    await db.query(
      `UPDATE Project SET ${dbField} = $1, updatedAt = $2 WHERE id = $3`,
      [content, new Date(), id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating project content:', error);
    res.status(500).json({ error: 'Failed to update project content' });
  }
});

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
    You are an elite AI project strategist.

    The user is initiating a new idea: "${project.project_idea}"  
    Additional context: "${project.project_additional_info}"

    Your task:
    1. Begin Phase 1 by guiding the user through high-level conceptual questions to help shape and sharpen their idea.
    2. Then, generate thoughtful rough drafts for the following artifacts:
        - Project Title
        - Project Charter
        - Project Summary
        - Business Case
    3. Each artifact must be original, strategic, and practical — helping the user think deeply and creatively.
    4. Do NOT fabricate specific details such as dates, budgets, team members, or approval status unless provided.
    5. Output must be plain text, clearly separated, and ready for refinement in subsequent phases.
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

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    Based on the following discussion: "${project.project_conversation}"
    Date: ${formattedDate}

    Your task:
    Generate a comprehensive project charter. Format your response EXACTLY as follows, using proper Markdown.
    Each section MUST be clearly delimited with its own heading:

    # Project Title
    [A clear, concise title that reflects the project's purpose]

    ## Project Summary
    [A brief overview of the project's purpose, goals, and expected outcomes]

    ## Business Case
    - Problem Statement
    - Proposed Solution
    - Expected Benefits
    - Strategic Alignment

    ## Goals and Objectives
    ### High-Level Goals
    [Strategic, long-term intentions]
    
    ### Supporting Goals
    [Tactical, implementation-level goals]
    
    ### Objectives
    [Specific, measurable objectives]

    ## Scope and Deliverables
    ### Project Scope
    - In Scope
    - Out of Scope
    
    ### Deliverables
    [List of tangible outputs]

    ## Work Breakdown Structure
    - Phase 1: [name]
      - Task 1.1
      - Task 1.2
    - Phase 2: [name]
      - Task 2.1
      - Task 2.2

    ## Timeline and Milestones
    ### Timeline
    [Key phases and durations]
    
    ### Milestones
    [Critical project checkpoints]

    ## Budget and Resources
    ### Budget Overview
    [Total budget and major allocations]

    ### Resources Required
    #### Human Resources
    [Team roles and skills needed]
    
    #### Material Resources
    [Equipment, tools, facilities needed]
    
    #### Financial Resources
    [Detailed budget breakdown]
    
    #### Time Resources
    [Time-related requirements]

    ## Risks and Assumptions
    ### Risks
    [Identified project risks]
    
    ### Assumptions
    [Key project assumptions]

    ## Stakeholders
    [Key stakeholders and their interests]

    ## Project Roles
    [Key roles and responsibilities]

    Important Guidelines:
    1. Include ALL sections, even if some lack specific details
    2. For sections without specific information, state "Details not specified in project discussion"
    3. Do NOT invent or assume details not present in the discussion
    4. Use proper Markdown formatting throughout
    5. Each section must be clearly delimited with the exact headings shown above
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        const charterResponse = response.choices[0].message.content;
        console.log('---------------------------- Project Charter ----------------------------');
        console.log('Project ID:', project.id);

        // Extract each section using regex patterns
        const sections = {
            title: charterResponse.match(/# Project Title\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            summary: charterResponse.match(/## Project Summary\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            businessCase: charterResponse.match(/## Business Case\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            goals: charterResponse.match(/## Goals and Objectives\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            scopeDeliverables: charterResponse.match(/## Scope and Deliverables\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            workBreakdown: charterResponse.match(/## Work Breakdown Structure\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            timelineMilestones: charterResponse.match(/## Timeline and Milestones\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            budgetResources: charterResponse.match(/## Budget and Resources\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            risksAssumptions: charterResponse.match(/## Risks and Assumptions\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            stakeholders: charterResponse.match(/## Stakeholders\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
            roles: charterResponse.match(/## Project Roles\s*([\s\S]*?)(?=\n##|$)/)?.[1]?.trim(),
        };

        // Save all sections to their respective database fields
        await project.update({
            project_outline_charter: charterResponse,
            project_outline_title: sections.title,
            project_outline_summary: sections.summary,
            project_outline_business_case: sections.businessCase,
            project_plan_goals: sections.goals,
            project_plan_scope_deliverables: sections.scopeDeliverables,
            project_plan_work_breakdown_structure: sections.workBreakdown,
            project_plan_timeline_milestones: sections.timelineMilestones,
            project_plan_budget_resources: sections.budgetResources,
            project_plan_risk_assumptions: sections.risksAssumptions,
            project_stakeholders: sections.stakeholders,
            project_roles: sections.roles
        });

        // Call titleIteration to begin the refinement process
        await titleIteration(project);

        return {message: 'Charter drafted and all sections saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}



async function titleIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    Review the following:
    
    Original Project Charter Title:
    ${project.project_outline_title || "Title not specified"}

    Full Project Charter Context:
    ${project.project_outline_charter}

    Your task:
    1. Review the existing title and full charter context
    2. Enhance or refine the title to be:
       - Clear and concise
       - Reflective of the project's purpose
       - Strategically aligned
       - Professional and engaging
    3. Format the output exactly as:
        # Project Title
        <your enhanced title here>

    Important:
    - Maintain consistency with the project's scope and objectives
    - Do not contradict any information in the original charter
    - If the existing title is already optimal, you may keep it
    - Only return the title block in Markdown format
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

        await project.update({
            project_outline_title: responseContent
        });

        // Call summaryIteration with the updated project
        await summaryIteration(project);

        return {message: 'Title enhanced and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}



async function summaryIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    Review the following:
    
    Project Title:
    ${project.project_outline_title}

    Original Project Summary:
    ${project.project_outline_summary || "Summary not specified"}

    Full Project Charter Context:
    ${project.project_outline_charter}

    Your task:
    1. Review the existing summary and full charter context
    2. Enhance or refine the project summary to be:
       - Clear and comprehensive
       - Aligned with the project title
       - Focused on key objectives and value
       - Professional and well-structured
    3. Format the output exactly as:
        # Project Summary
        <your enhanced summary here>

    Important:
    - Maintain consistency with the project's scope and objectives
    - Do not contradict any information in the original charter
    - If the existing summary is already optimal, you may keep it
    - Only return the summary block in Markdown format
    - Keep the summary concise but informative (2-3 paragraphs)
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        const responseContent = response.choices[0].message.content;
        console.log('---------------------------- Summary ----------------------------');
        console.log(responseContent);

        await project.update({
            project_outline_summary: responseContent
        });

        // Call businessCaseIteration with the updated project
        await businessCaseIteration(project);

        return {message: 'Summary enhanced and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
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
    Review the following project charter: ${project.project_outline_charter}
    Official Project Title: ${project.project_outline_title}

    Your task:
    1. Extract or generate a compelling Business Case based strictly on the content provided.
    2. Do NOT invent or assume any details (e.g. dates, team roles, budgets, or approvals) unless explicitly included in the charter.
    3. If the existing Business Case is weak, vague, or missing, create a revised version that clearly communicates the project's strategic justification and value.
    4. The tone should be strategic and persuasive, but grounded in factual input.
    5. Use the official project title when referring to the project.
    6. Format the output as:
        ## Business Case
        <business case content>

    Only return the business case section in Markdown.
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
    const prompt = `
    Review the following project charter: ${project.project_outline_charter}

    Your task:
    1. Generate two levels of goals based on the charter:
        - **High-Level Goals**: Strategic, long-term intentions that define the overall vision and purpose of the project.
        - **Supporting Goals**: Tactical, feature-level or implementation goals that support achieving the high-level ones.
    2. Do NOT invent or assume details not clearly stated or logically implied in the charter.
    3. If certain goals cannot be determined, omit them rather than guessing.
    4. Use a clear, structured format suitable for planning documents.
    5. Format the output in Markdown as follows:

    ## High-Level Goals
        - <strategic goal 1>
        - <strategic goal 2>

    ## Supporting Goals
        - <tactical goal 1>
        - <tactical goal 2>

    Only return the goals section in Markdown.
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

        console.log('---------------------------- Goals ----------------------------');
        console.log('Full response from OpenAI:');
        console.log(responseContent);
        console.log('Response length:', responseContent.length);
        console.log('Contains High-Level Goals:', responseContent.includes('## High-Level Goals'));
        console.log('Contains Supporting Goals:', responseContent.includes('## Supporting Goals'));
        console.log('----------------------------------------');

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
    const prompt = `
    Review the following project charter: ${project.project_outline_charter}

    Your task:
    1. Generate a concise list of clear, measurable objectives that align directly with the project's goals and scope.
    2. Objectives should describe **what success looks like** for the project — focusing on actionable outcomes, not abstract ideals.
    3. Do NOT fabricate or assume any objectives that are not clearly stated or strongly implied in the charter.
    4. Omit anything that cannot be confidently derived from the input.
    5. Format the output as:
        ## Objectives
        - <objective 1>
        - <objective 2>
        - <objective 3>

    Only return the objectives section in Markdown.
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
    const prompt = `
    Review the following project charter: ${project.project_outline_charter}

    Your task:
    1. Create two clearly separated sections:
        - **Scope**: Define what the project will cover or include. Focus on boundaries, features, and areas of responsibility.
        - **Deliverables**: List the tangible outputs or results expected from the project.
    2. Only include items explicitly stated or logically supported by the charter.
    3. Do NOT assume or invent any items not found or implied in the input.
    4. Format the output in Markdown like this:

    ## Scope
        - <scope item 1>
        - <scope item 2>

    ## Deliverables
        - <deliverable 1>
        - <deliverable 2>

    Only return these two sections in Markdown.
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

        console.log('---------------------------- Scope And Deliverables ----------------------------');
        console.log(responseContent);

        const updatedProject = await project.update(
            {project_plan_scope_deliverables: responseContent},
        );
        updatedProject.project_plan_scope_deliverables = responseContent;
        // Call workBreakdownStructureIteration and pass responseContent
        await workBreakdownStructureIteration(project);

        return {message: 'Scope and deliverables generated successfully'};
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
    const prompt = `
    Review the following project charter: ${project.project_outline_charter}

    Your task:
    1. Generate a clear and hierarchical **Work Breakdown Structure (WBS)** based strictly on the content of the charter.
    2. Break the project into logical phases, components, or work packages where possible.
    3. Only include tasks and phases that are explicitly described or logically implied in the charter — do NOT fabricate.
    4. Use a Markdown nested bullet format like this:

    ## Work Breakdown Structure
    - Phase 1: <name>
        - Task 1.1: <subtask>
        - Task 1.2: <subtask>
    - Phase 2: <name>
        - Task 2.1: <subtask>

    Only return the Work Breakdown Structure section in Markdown.
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
    const prompt = `
    Review the following project charter: ${project.project_outline_charter}

    Your task:
    1. Generate a project timeline and list of major milestones based strictly on the content of the charter.
    2. If no dates or durations are explicitly provided, do NOT invent them — use relative phases instead (e.g., "Phase 1", "Initial Planning").
    3. The timeline should provide a logical sequence of phases or events.
    4. Milestones should be distinct, measurable markers of progress.
    5. Format the output in Markdown as follows:

    ## Timeline
    - Phase 1: <description>
    - Phase 2: <description>
    - Phase 3: <description>

    ## Milestones
    - <milestone 1>
    - <milestone 2>
    - <milestone 3>

    Only return the timeline and milestone sections in Markdown.
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

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    You are tasked with enhancing the Budget and Resources section of a project charter.

    Original Project Charter:
    ${project.project_outline_charter}

    Current Budget & Resources Content:
    ${project.project_plan_budget_resources || "No existing content"}

    Your task:
    1. First, locate and analyze the Budget and Resources section from the original project charter
    2. Then, enhance and expand this section while maintaining consistency with the original charter
    3. Generate a detailed breakdown following this EXACT structure:

    ## Budget Overview
    [Provide a comprehensive budget overview. Include all specific amounts mentioned in the charter.
     If no specific budget is mentioned, clearly state what is known about financial constraints or expectations]

    ## Resources Required

    ### Human Resources
    [List all human resources mentioned or implied in the charter]
    - Role/Position
    - Required skills/expertise
    - Team size (if specified)
    - Reporting structure (if mentioned)

    ### Material Resources
    [List all physical/material resources mentioned or implied]
    - Equipment needs
    - Software requirements
    - Hardware requirements
    - Facilities/Space requirements
    - Other material needs

    ### Financial Resources
    [Provide detailed financial breakdown]
    - Development costs
    - Marketing/Promotion costs
    - Operational costs
    - Contingency funds
    - Other financial allocations

    ### Time Resources
    [Detail all time-related resources]
    - Project duration
    - Phase timelines
    - Resource availability periods
    - Key time constraints

    Important Guidelines:
    1. Maintain consistency with the original charter - do not contradict any existing information
    2. Expand upon the original content with more detail and structure
    3. For any category where details are not provided, explicitly state "Not specified in project charter"
    4. Use bullet points for lists
    5. Maintain proper markdown formatting
    6. If specific amounts or numbers are mentioned in the charter, always include them
    7. Do not invent or assume details not present in the original charter

    Format your response using proper Markdown, ensuring clear hierarchy and readability.
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        const r = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        const responseContent = r.choices[0].message.content;
        console.log('---------------------------- Budget Resources ----------------------------');
        console.log(responseContent);

        await project.update({
            project_plan_budget_resources: responseContent
        });

        // Call riskAssumptionIteration
        await riskAssumptionIteration(project);

        return {message: 'Budget and resources generated successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

async function riskAssumptionIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    You are tasked with enhancing the Risks and Assumptions section of a project charter.

    Original Project Charter:
    ${project.project_outline_charter}

    Current Risks & Assumptions Content:
    ${project.project_plan_risk_assumptions || "No existing content"}

    Your task:
    1. First, locate and analyze the Risks and Assumptions section from the original project charter
    2. Then, enhance and expand this section while maintaining consistency with the original charter
    3. Generate a detailed breakdown following this structure:

    ## Risks and Assumptions

    ### Project Risks
    [List and analyze all identified risks]
    - Risk description
    - Potential impact
    - Likelihood (if mentioned)
    - Mitigation strategies (if specified)

    ### Project Assumptions
    [List and analyze all stated assumptions]
    - Business assumptions
    - Technical assumptions
    - Resource assumptions
    - Timeline assumptions

    Important Guidelines:
    1. Maintain consistency with the original charter
    2. Expand upon the original content with more detail
    3. Clearly indicate when information is not specified
    4. Use proper markdown formatting
    5. Do not invent new risks or assumptions

    Format your response using proper Markdown, ensuring clear hierarchy and readability.
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        const r = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        const responseContent = r.choices[0].message.content;
        console.log('---------------------------- Risks and Assumptions ----------------------------');
        console.log(responseContent);

        await project.update({
            project_plan_risk_assumptions: responseContent
        });

        await taskIteration(project);

        return {message: 'Risks and assumptions enhanced successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
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

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    You are tasked with identifying and analyzing project stakeholders.

    Original Project Charter:
    ${project.project_outline_charter}

    Current Stakeholders Content:
    ${project.project_stakeholders || "No existing content"}

    Your task:
    1. Review the project charter carefully
    2. Identify all stakeholders mentioned or implied
    3. For each stakeholder:
       - Define their role/position
       - Describe their interest in the project
       - Outline their influence level
       - Specify their requirements/expectations
    4. Format the output exactly as:
        # Project Stakeholders
        
        ## Key Stakeholders
        [List primary stakeholders with details]
        
        ## Secondary Stakeholders
        [List secondary stakeholders with details]
        
        ## External Stakeholders
        [List external stakeholders if any]

    Important Guidelines:
    - Only include stakeholders mentioned or logically implied in the charter
    - Do not invent stakeholders or details
    - Use clear, professional language
    - Format in proper Markdown
    - If certain stakeholder categories are not present, note "None identified in project charter"
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        const responseContent = response.choices[0].message.content;
        console.log('---------------------------- Stakeholders ----------------------------');
        console.log(responseContent);

        await project.update({
            project_stakeholders: responseContent
        });

        // Call rolesIteration with the updated project
        await rolesIteration(project);

        return {message: 'Stakeholders identified and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

async function rolesIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    You are tasked with defining project roles based on the stakeholder analysis.

    Project Charter:
    ${project.project_outline_charter}

    Stakeholder Analysis:
    ${project.project_stakeholders}

    Current Roles Content:
    ${project.project_roles || "No existing content"}

    Your task:
    1. Review the project charter and stakeholder analysis
    2. Define clear roles and responsibilities for the project
    3. For each role identified:
       - Define the position title
       - List key responsibilities
       - Specify required skills/qualifications
       - Define reporting relationships
       - Outline authority levels
    4. Format the output exactly as:
        # Project Roles and Responsibilities

        ## Core Team Roles
        [List primary project team roles]

        ## Supporting Roles
        [List supporting/auxiliary roles]

        ## External Roles
        [List any external roles/contractors]

    Important Guidelines:
    - Base roles strictly on information from the charter and stakeholder analysis
    - Do not invent positions or responsibilities not supported by project documents
    - Use clear, professional language
    - Format in proper Markdown
    - If certain role categories are not present, note "None identified in project charter"
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        const responseContent = response.choices[0].message.content;
        console.log('---------------------------- Roles ----------------------------');
        console.log(responseContent);

        await project.update({
            project_roles: responseContent
        });

        // Call taskIteration with the updated project
        await taskIteration(project);

        return {message: 'Roles defined and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

async function taskIteration(project) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    if (!project) {
        throw new Error('project is required.');
    }

    const prompt = `
    You are tasked with creating a detailed task list based on the project charter.

    Project Charter:
    ${project.project_outline_charter}

    Work Breakdown Structure:
    ${project.project_plan_work_breakdown_structure}

    Current Task List:
    ${project.project_task_list || "No existing tasks"}

    Your task:
    1. Review the project charter and work breakdown structure
    2. Create a comprehensive task list that:
       - Aligns with project goals and objectives
       - Follows the work breakdown structure
       - Includes dependencies and priorities
       - Estimates complexity/effort level
    3. Format the output exactly as:
        # Project Task List

        ## High Priority Tasks
        [List critical path tasks]

        ## Medium Priority Tasks
        [List important but non-critical tasks]

        ## Low Priority Tasks
        [List nice-to-have tasks]

        ## Dependencies
        [List task dependencies and relationships]

    Important Guidelines:
    - Base tasks strictly on the project charter and WBS
    - Include clear priorities and dependencies
    - Use clear, actionable language
    - Format in proper Markdown
    - Do not invent tasks not supported by project documentation
    `;

    const messages = [
        {role: 'system', content: prompt},
    ];

    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_ENGINE || "gpt-3.5-turbo",
            messages,
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 1000,
            temperature: Number(process.env.OPENAI_TEMPERATURE) || 0.7,
            top_p: Number(process.env.OPENAI_TOP_P) || 1,
            n: Number(process.env.OPENAI_N) || 1,
        });

        const responseContent = response.choices[0].message.content;
        console.log('---------------------------- Tasks ----------------------------');
        console.log(responseContent);

        await project.update({
            project_task_list: responseContent
        });

        return {message: 'Task list created and saved successfully'};
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

module.exports = router;
