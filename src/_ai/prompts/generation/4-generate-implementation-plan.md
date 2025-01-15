# Generating Task List

# Principles

- Always think step by step
- Decompose it into a structured implementation plan using the principles of Vertical Slice, Incremental Development, and MVP.
- Prioritize building a simple, functional prototype first and incrementally refine it toward the final vision.
- IMPORTANT: Breakup Milestones in this order: Static UI (UI scaffold, no functionality yet) -> Frontend -> Backend -> UI Polish (e.g. animations)

# Requirements

- roadmap.md

# Instructions

Create a detailed task plan for developing a software feature, ensuring the following structure:

1. Divide the feature into milestones (Ensure to follow the "Phases" outlined in "roadmap.md")
   - Each milestone should represent a significant deliverable or phase of the project.
   - Include a clear objective describing the goal of the milestone and acceptance criteria defining what qualifies the milestone as complete.
2. Break down each milestone into tasks
   - Each task should be tightly scoped, actionable, small, and independent.
   - Decompose and draft a step by step plan to development.
   - Decompose complex tasks (complexity > 2 on a 1-5 scale) into subtasks
3. Specify dependencies
   Identify and document relationships between tasks, indicating which tasks depend on others.
4. Include file references
   For each task, specify which file(s) to modify, and note if a file needs to be created.
5. Format the tasks as markdown checkboxes
   Use markdown formatting to ensure tasks are easy to track and check off.

<output_format>
Use the following example structure:

```markdown
# [Task Plan Name]

## Milestone [Number]: [Milestone Title]

## Relevant Files:

[List relevant primary and secondary files. Include purpose of that file in a inline comment]

# Data Flow:

[Outline the flow of data between frontend and backend, detailing what is sent (e.g., form data, API requests), how it is processed on the server (e.g., validation, database interactions), and what is returned to the frontend (e.g., responses, data rendering). Include key interactions between components, API routes, and database queries.]

## Objective:

[Describe the specific goal of the milestone.]

## Acceptance Criteria:

- [List the measurable outcomes that define milestone success.]

## Step-by-Step Tasks:

</output_format>
- [ ] [Task Number]. [Task Description]
  - File: `[File Name]` ([specify if it needs to be created]).
  - Dependency: [Specify dependency if applicable].
  - [ ] 1.1. Set up API Key Management
  - File: `src/context/ApiKeyContext.tsx` (create)
  - Dependency: None
  - [ ] 1.1.1. Create API Key Context
    - [ ] 1.1.1.1. Define context types and interfaces
    - [ ] 1.1.1.2. Implement context provider
    - [ ] 1.1.1.3. Add local storage integration
  - [ ] 1.1.2. Implement Key Management Methods
    - [ ] 1.1.2.1. Add key validation function
    - [ ] 1.1.2.2. Create key storage utilities
    - [ ] 1.1.2.3. Add key removal functionality
</output_format>

<commands>
/status = mark completed tasks as done and list next steps
</commands>

[No code blocks in the final task list]
