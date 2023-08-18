# Agile AI - Project Outline Streamlining

## Creators Notes

Thank you for check out my personal project. I started this a few months ago and have worked on it on and off over the past few months. I planned on keeping this closed source until I was finished but due to my day job its making it increasingly more difficult to work on it. Hopefully you see my vision and would like to contribute to the project. Thanks Again!

## Introduction

Welcome to Agile AI, an innovative solution designed to streamline your business ideas and accelerate your time to market. In today's rapidly evolving business landscape, the ability to conceptualize, plan, and execute projects efficiently is a crucial differentiator. Agile AI empowers you with the tools to bring your projects to life, transforming your ideas into tangible realities with strategic planning and comprehensive project outlines.

Whether you're a seasoned entrepreneur or a budding innovator, Agile AI is your go-to AI-powered assistant for brainstorming and project planning. Our platform is designed to engage with you, ask insightful questions, and assist in fleshing out your project ideas. Through a dynamic conversation, Agile AI will incorporate additional project information, ensuring a thorough understanding of your vision.

The heart of Agile AI lies in its ability to craft meticulous project outlines. Guided by your input and powered by advanced algorithms, Agile AI refines project titles, formulates project charters, and drafts comprehensive project summaries and business cases. Each project section is meticulously curated, offering a holistic view of the project's goals, stakeholders, objectives, and financial implications.

Our solution is built on cutting-edge technologies, including Flask for backend implementation, jQuery for dynamic web interactions, and Tailwind CSS for modern and responsive design. The integration of these technologies ensures a seamless and user-friendly experience, whether you're accessing Agile AI from a desktop or a mobile device.

We invite you to embark on this journey of project innovation with Agile AI. Let us help you turn your concepts into compelling project outlines, setting you on a path to success. Dive into the interactive interface, collaborate with our AI-driven tool, and witness the transformation of your ideas into well-defined project roadmaps.

Welcome to Agile AI - Where Ideas Take Shape, Strategies Take Form, and Success Takes Flight.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Description

Agile AI - Project Outline Streamlining is an advanced AI-powered platform designed to revolutionize the way you conceptualize, plan, and execute projects. In the dynamic and fast-paced business landscape of today, turning innovative ideas into actionable project plans is essential for success.

Agile AI offers a seamless and intuitive experience for entrepreneurs, innovators, and project managers alike. By engaging in insightful conversations, the platform helps you flesh out your project ideas, ensuring that every facet of your vision is captured. Through advanced algorithms, Agile AI refines project titles, crafts comprehensive project charters, drafts in-depth project summaries, and outlines compelling business cases. This results in a well-structured and strategic project outline that serves as the foundation for successful execution.

The core of Agile AI is its ability to create meticulously detailed project outlines. Whether you're planning a startup venture, a product launch, or a complex business strategy, Agile AI guides you through the process, ensuring no critical detail is overlooked. By harnessing cutting-edge technologies like Flask, jQuery, and Tailwind CSS, Agile AI provides a modern and responsive user experience, accessible from both desktop and mobile devices.

Welcome to the Agile AI experience, where your ideas are transformed into well-defined project roadmaps. Join us in streamlining your project planning process, accelerating your time to market, and bringing your business visions to life with precision and efficiency.


## Features

- **Interactive Brainstorming:** Engage in dynamic conversations with Agile AI to flesh out your project ideas. Benefit from insightful questions that help you capture every aspect of your vision.

- **Refined Project Titles:** Agile AI refines project titles to ensure they accurately encapsulate the essence of your project.

- **Comprehensive Project Charters:** Craft detailed project charters that outline objectives, key stakeholders, and major deliverables.

- **In-depth Project Summaries:** Draft comprehensive project summaries that provide a clear overview of the project's purpose, objectives, and expected outcomes.

- **Elaborate Business Cases:** Develop detailed business cases that explain the reasons for undertaking the project, including financial implications and business benefits.

- **Responsive Design:** The platform is built on cutting-edge technologies like Flask and Tailwind CSS, ensuring a responsive and user-friendly experience on both desktop and mobile devices.

- **Efficient Time-to-Market:** By streamlining the project planning process, Agile AI accelerates your time to market, giving you a competitive edge.

- **AI-Powered Assistance:** Agile AI serves as your AI-powered assistant, providing guidance and structure throughout the project planning journey.

- **Collaborative Workflow:** Collaborate seamlessly with the AI-driven tool, refining your project outline to perfection.

- **Holistic Project View:** The meticulously crafted project outline offers a holistic view of the project's goals, stakeholders, and expected outcomes.

- **Customizable Sections:** Tailor the project outline sections to fit the specific needs of your project.

- **Easy Installation:** Get started quickly with clear installation instructions provided in the documentation.

- **Contribution Guidelines:** Contribute to the project's growth by following the outlined contribution guidelines.

- **MIT License:** The project is open-source and licensed under the MIT License, allowing for both personal and commercial use.

- **Regular Updates:** The project is actively maintained, with updates and improvements released regularly.

Feel free to add or modify features to best represent the functionalities of your project.


## Installation

Provide step-by-step instructions on how to install and set up your project. Include any prerequisites, environment setup, and necessary commands.

1. **Clone the Repository:**

   First, clone the repository to your local machine using the following command:

    ```bash
    $ git clone https://gitlab.com/chrisdionne/agileai.git
    $ cd agileai
    ```

2. **Install Dependencies:**

   Navigate to the app & server directories and install the required dependencies using `npm i`:

    ```bash
    $ cd app
    $ npm i
    $ cd ../server
    $ npm i
    ```

3. **Create Environment File:**

   The program looks for an .env file in the base directory for your convenience I created test.env, just rename the file to .env and put in your open ai information.

   If you are not aware of these values for the engine, you can find the meaning at https://platform.openai.com/docs/api-reference

4. **Run the Application:**

   The application front end is run on Angular and the backend interfacing with Open AI runs in the backend; therefore, you must start both. The first command runs both the backend and frontend.

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

   Open your web browser and navigate to `http://localhost:5000` to access Agile AI.

6. **Engage in Interactive Brainstorming:**

   Upon accessing the platform, engage in interactive brainstorming with Agile AI. Answer questions about your project idea to flesh out its details.

7. **Refine Your Project Outline:**

   Observe how Agile AI refines your project title, crafts a comprehensive project charter, generates a detailed project summary, and develops an elaborate business case.

8. **Customize and Review:**

   Tailor the sections of your project outline to your liking. Review the comprehensive project outline and ensure it accurately captures your vision.

9. **Collaborate and Export:**

   Collaborate with the AI-driven tool to refine the project outline. Once satisfied, export the finalized project outline.

10. **Accelerate Your Project:**

    Utilize the well-structured project outline to accelerate your project planning and execution, reducing time to market.

11. **Contribute and Give Feedback:**

    If you'd like to contribute to the project, follow the provided contribution guidelines. Your feedback is valuable for the ongoing improvement of Agile AI.

Enjoy the Agile AI experience and let your ideas take shape with strategic project planning!

For more detailed instructions, troubleshooting, and examples, refer to the project documentation.

*NOTE: The process to run the version build with Angular begins in the APP/ directory and does not use any code from the base directory.


## Technologies

Agile AI is built on a range of modern and cutting-edge technologies, ensuring a seamless and responsive user experience. The following technologies are utilized in the development of the project:

- **Python:** The primary programming language used for building the backend logic and functionality.

- **Flask:** A lightweight and versatile web framework used for developing the backend of the application.

- **jQuery:** A fast and feature-rich JavaScript library that enhances the interactive elements and dynamic behavior of the platform.

- **Tailwind CSS:** A utility-first CSS framework that aids in creating responsive and modern user interfaces.

- **SQLite:** A lightweight and efficient database management system used for storing project data and user interactions.

- **AJAX:** Asynchronous JavaScript and XML is used to create seamless and interactive web interactions, enabling real-time updates without the need for full page refreshes.

- **Git:** A version control system that facilitates collaboration and tracking of code changes throughout the development process.

- **Gitlab:** A platform for hosting and sharing code repositories, enabling efficient collaboration among developers.

These technologies work in harmony to create a user-friendly, interactive, and efficient platform for brainstorming, project planning, and execution. Their combination ensures that Agile AI delivers a seamless experience across both desktop and mobile devices.


## Contributing

Please review [Contributing](CONTRIBUTING.md)

## Reporting Issues

If you encounter bugs, issues, or have suggestions for improvements, please open an issue on the Gitlab repository. Provide as much detail as possible to help us understand and address the problem.

## Code of Conduct

Please review and adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) when participating in the project's community. We aim to foster a respectful and inclusive environment for all contributors.

We appreciate your contributions and dedication to making Agile AI a valuable tool for project planning and execution.