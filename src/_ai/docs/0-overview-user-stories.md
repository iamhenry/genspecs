# Project Overview
i want to automate the process of creating project documents so that i can use those to jump start my new software projects. I rely on these documents to guide the ai code generator i use within cursor ide which uses llm's to produce the code. I want to be able to download all of the documents at the end of the workflow and use them in my project to build out the app.

The workflow should be almost like an onboarding experience where it basically goes from one step to the next step. The user must accept the current step in order to proceed to the next step. Each previous document is then used within the current step as context so that it could be informed as to the project details.


# User stories (MVP)
- Project Document Generation
  as a user i want to be able to give a project name, description, tech stack, user stories and it will generate the following documents: readme, bill materials.
- Guided Workflow
  as a user i want to be automatically guided through the process and only move on to generating the next document once the document has been generated
- Download All Documents
  at the end of this workflow/wizard flow i want to be able to download the markdown files all at once in a zip file
- Data Preservation
  as a user if i refresh the page i want to be able to preserve the data i have provided
- API Key Integration
  as a user i want to be able to bring my own API key from "openrouter"
- Stepper Visibility
  as a user i want to see the stepper upon submitting the project information form

# User Stories (On hold)
- as a user i Want to be able to make changes to the drafted document and have the ability to regenerate the document
- as a user i want to request changes to the draft in a chat interface for changes i need to make
- as a user i want to go step by step and before proceeding to the next one i must accept the draft for that document
- as a user i want to be able to see a skeletong loading state for when the current document is being generate
- as a user i want to first fill out the simple form, then taken to a two column layout where the left sidebar is a vertical progress stepper that includes the list of documents that will be generated, and the right column is where the markdown document will display it's contents to review
- as a user i want to be able to request changes using the chat input field and not modify the existing text editor in the right column. that should be read-only

# Requirements
- I will provide the document templates for the readme and bom
- I will provide the generation prompt for readme and bom that will be used to generate the documents when calling the openrouter api

# Dependencies (stable versions)
- tailwind
- nextjs
- shadcn component library
- openrouter api for llm usage

# Future Dependencies
- vercel AI SDK
- novel.sh for the markdown text editor

