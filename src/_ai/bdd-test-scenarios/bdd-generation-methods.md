# BDD Test Scenarios for Generation Methods

Note: The "project context" used in these scenarios comes from the ContactForm component, which collects:
- Project name (input field)
- Description & Tech stack (single textarea)
- User stories (textarea)

## README Generator

### 1. Complete Document Generation
- Given: All required fields are provided
  - Project name
  - Description & Tech stack
  - User stories
- When: README generation is triggered
- Then: Should generate complete README matching template structure from the prompt in the LLM Api call
  - Proceeds to show the generating state in the stepper component

### 2. Form Validation
- Given: One or more required fields are missing
- When: User attempts to submit form
- Then: Submit button should be disabled
  - Should not allow form submission


## BOM Generator

### 1. Complete Document Generation
- Given: README document has been successfully generated
- When: BOM generation is triggered
- Then: Should generate complete BOM matching template structure
  - Match the prompt structure in the LLM Api call
  - Should update the Stepper component to reflect the current step
  - Should use data from form data

## Error Handling

### 1. Generation Failure
- Given: Document generation process fails
- When: Error occurs during generation
- Then: Should show error toast notification
  - Should maintain existing document state
  - Should not save partial document
