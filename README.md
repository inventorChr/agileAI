# Agile AI - Project Outline Streamlining

## Creators Notes

Thank you for checking out my personal project. I started this a few months ago and have worked on it on and off over the past few months. I planned on keeping this closed source until I was finished but due to my day job its making it increasingly more difficult to work on it. Hopefully you see my vision and would like to contribute to the project. Thanks Again!

## Introduction

Welcome to Agile AI, a pioneering solution crafted to streamline your business ideas and expedite your journey to market. In the dynamic landscape of modern business, the ability to conceptualize, strategize, and execute projects efficiently is a key competitive advantage. Agile AI empowers you with a suite of tools to translate your visions into reality, transforming your ideas into tangible projects with strategic planning and comprehensive project outlines.

Whether you're an experienced entrepreneur or an emerging innovator, Agile AI stands as your AI-powered companion for brainstorming and project planning. Our platform is meticulously designed to engage in meaningful dialogues, pose insightful queries, and aid in refining your project concepts. Through these dynamic conversations, Agile AI gathers additional project details, ensuring a holistic understanding of your vision.

At the core of Agile AI's capabilities lies its capacity to meticulously construct project outlines. Guided by your inputs and driven by advanced algorithms, Agile AI fine-tunes project titles, crafts project charters, and drafts comprehensive project summaries and business cases. Each facet of your project receives meticulous attention, providing a holistic view of objectives, stakeholders, goals, and financial implications.

Our solution is underpinned by state-of-the-art technologies, carefully curated to enhance your experience. This includes Angular for dynamic frontend development, Express for robust backend implementation, and powerful npm packages like Axios, JWT, and Sequelize for seamless data flow and security. These technologies coalesce to ensure an intuitive and responsive experience, whether you're engaging with Agile AI from your desktop or mobile device.

We extend a warm invitation for you to embark on this journey of project innovation with Agile AI. Let us assist you in transforming your concepts into structured project outlines, setting you on a trajectory towards success. Immerse yourself in the interactive interface, collaborate closely with our AI-driven tool, and witness the metamorphosis of your ideas into well-defined project blueprints.

Welcome to Agile AI, where ideas take tangible form, strategies crystallize, and the pathway to success takes flight.
## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Description

In the ever-evolving landscape of business, the translation of ingenious ideas into actionable project plans is pivotal for triumph.

Agile AI offers a seamless and intuitive journey for entrepreneurs, innovators, and project managers. Through insightful conversations, the platform collaborates with you to refine your project ideas, ensuring that every nuance of your vision is meticulously captured. Powered by sophisticated algorithms, Agile AI fine-tunes project titles, sculpts comprehensive project charters, crafts intricate project summaries, and meticulously frames compelling business cases. The outcome is a strategically structured project outline, serving as the bedrock for effective project execution.

The essence of Agile AI lies in its remarkable capacity to craft detailed project outlines. Whether you're charting the course for a startup endeavor, orchestrating a product launch, or devising an intricate business strategy, Agile AI acts as your guiding hand, leaving no vital detail unattended.

Embark on the Agile AI journey, where your ideas transmute into meticulously defined project roadmaps. Collaborate with us to streamline your project planning, expedite your path to market, and breathe life into your business visions with precision and efficiency. Welcome to a realm where innovation meets strategic execution.

## Features

Discover the capabilities that Agile AI - Project Outline Streamlining brings to the table, empowering you to craft well-defined project blueprints with precision and efficiency:

- **Interactive Brainstorming**: Engage in dynamic conversations with Agile AI to flesh out your project ideas. Benefit from insightful questions that help you capture every aspect of your vision.

- **Refined Project Titles**: Agile AI refines project titles to ensure they accurately encapsulate the essence of your project.

- **Comprehensive Project Charters**: Craft detailed project charters that outline objectives, key stakeholders, and major deliverables.

- **In-depth Project Summaries**: Draft comprehensive project summaries that provide a clear overview of the project's purpose, objectives, and expected outcomes.

- **Elaborate Business Cases**: Develop detailed business cases that explain the reasons for undertaking the project, including financial implications and business benefits.

- **Responsive Design**: The platform ensures a responsive and user-friendly experience on both desktop and mobile devices.

- **Efficient Time-to-Market**: By streamlining the project planning process, Agile AI accelerates your time to market, giving you a competitive edge.

- **AI-Powered Assistance**: Agile AI serves as your AI-powered assistant, providing guidance and structure throughout the project planning journey.

- **Collaborative Workflow**: Collaborate seamlessly with the AI-driven tool, refining your project outline to perfection.

- **Holistic Project View**: The meticulously crafted project outline offers a holistic view of the project's goals, stakeholders, and expected outcomes.

- **Customizable Sections**: Tailor the project outline sections to fit the specific needs of your project.

- **Easy Installation**: Get started quickly with clear installation instructions provided in the documentation.

- **Contribution Guidelines**: Contribute to the project's growth by following the outlined contribution guidelines.

- **MIT License**: The project is open-source and licensed under the MIT License, allowing for both personal and commercial use.


## Installation

Follow these step-by-step instructions to seamlessly install and set up the Agile AI project. Make sure to fulfill any prerequisites and execute the necessary commands for a smooth experience.

1. **Clone the Repository:**

   Begin by cloning the project repository to your local machine using the following commands:

    ```bash
    $ git clone https://gitlab.com/chrisdionne/agileai.git
    $ cd agileai
    ```

2. **Install Dependencies:**

   Move into both the `app` and `server` directories and install the required dependencies using the following commands:

    ```bash
    $ cd app
    $ npm install
    $ cd ../server
    $ npm install
    ```

3. **Create Environment File:**

   An environment configuration file is necessary for the project. Rename the provided `test.env` file to `.env` in the base directory. Fill in your Open AI information in the `.env` file. If you're unsure about the values required, consult the [Open AI API reference](https://platform.openai.com/docs/api-reference).

4. **Run the Application:**

   The Agile AI application consists of a frontend built with Angular and a backend that interacts with Open AI. To run both, use the following command:

    ```bash
    $ cd app
    $ npm run start
    ```

   If you need to run them separately for debugging purposes:

   ```bash
   $ cd app
   $ npm serve
   $ cd ../server
   $ npm start
   ```

5. **Access Agile AI in Your Browser:**

   Open your preferred web browser and go to `http://localhost:4200` to access the Agile AI platform. This is the default address that Angular uses for development.

6. **Engage in Interactive Brainstorming:**

   Upon accessing the platform, immerse yourself in interactive brainstorming with Agile AI. 

7. **Refine Your Project Outline:**

   Observe how Agile AI sharpens your project title, constructs a comprehensive project charter, generates a detailed project summary, and formulates an intricate business case.

8. **Customize and Review:**

   Tailor the sections of your project outline to your preferences. Thoroughly review the all-encompassing project outline to ensure it captures your vision accurately.

9. **Collaborate and Export:**

   Collaborate closely with the AI-powered tool to enhance the project outline. Once content, export the finalized project outline.

10. **Accelerate Your Project:**

    Utilize the well-structured project outline to expedite your project planning and execution, thereby reducing time-to-market.

11. **Contribute and Provide Feedback:**

    If you're inclined to contribute to the project, adhere to the outlined contribution guidelines. Your feedback is invaluable for the ongoing enhancement of Agile AI.

Enjoy the enriching Agile AI experience and watch your ideas transform into strategic project plans!


## Technologies

This project leverages a comprehensive range of technologies and npm packages to ensure optimal functionality and a seamless user experience. Here's a breakdown of the key technologies and npm packages integral to the project's architecture:

### Frontend Technologies (Angular)

- **@angular/animations**: v16.1.0
- **@angular/cdk**: v16.1.1
- **@angular/common**: v16.1.0
- **@angular/compiler**: v16.1.0
- **@angular/core**: v16.1.0
- **@angular/forms**: v16.1.0
- **@angular/material**: v16.1.1
- **@angular/platform-browser**: v16.1.0
- **@angular/platform-browser-dynamic**: v16.1.0
- **@angular/router**: v16.1.0
- **ngx-markdown**: v16.0.0
- **rxjs**: v7.8.0
- **tslib**: v2.3.0
- **zone.js**: v0.13.0

### Frontend Development Tools (Dev Dependencies)

- **@angular-devkit/build-angular**: v16.1.0
- **@angular/cli**: v16.1.0
- **@angular/compiler-cli**: v16.1.0
- **@types/jasmine**: v4.3.0
- **concurrently**: v8.2.0
- **jasmine-core**: v4.6.0
- **karma**: v6.4.0
- **karma-chrome-launcher**: v3.2.0
- **karma-coverage**: v2.2.0
- **karma-jasmine**: v5.1.0
- **karma-jasmine-html-reporter**: v2.1.0
- **typescript**: v5.1.3

### Backend Technologies

- **axios**: v1.4.0
- **bcrypt**: v5.1.0
- **cors**: v2.8.5
- **dotenv**: v16.3.1
- **express**: v4.18.2
- **jsonwebtoken**: v9.0.0
- **knex**: v2.4.2
- **openai**: v3.3.0
- **openai-api**: v1.3.1
- **sequelize**: v6.32.1
- **sqlite3**: v5.1.6

These technologies and packages combine harmoniously to create a robust development environment. Whether it's the frontend Angular components, backend server logic, or development tools, each component plays a pivotal role in delivering a high-quality application. To learn more about how to utilize these technologies effectively, consult their respective documentation.
## Contributing

Please review [Contributing](CONTRIBUTING.md)

## License

[LICENSE](LICENSE)

## Reporting Issues

If you encounter bugs, issues, or have suggestions for improvements, please open an issue on the Gitlab repository. Provide as much detail as possible to help us understand and address the problem.

## Code of Conduct

Please review and adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) when participating in the project's community. We aim to foster a respectful and inclusive environment for all contributors.

We appreciate your contributions and dedication to making Agile AI a valuable tool for project planning and execution.
