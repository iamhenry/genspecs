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
- Then: Should generate complete README matching template structure
  - Includes all sections from src/prompt-templates/readme.md
  - Shows success toast notification

### 2. Form Validation
- Given: One or more required fields are missing
- When: User attempts to submit form
- Then: Submit button should be disabled
  - Should show validation error messages
  - Should not allow form submission

### 3. Template Validation
- Given: Complete project context
- When: README generation is triggered
- Then: Should validate generated document matches template structure
  - All sections from src/prompt-templates/readme.md must be present
  - Should show error if template structure is incomplete

## BOM Generator

### 1. Complete Document Generation
- Given: README document has been successfully generated
- When: BOM generation is triggered
- Then: Should generate complete BOM matching template structure
  - Includes all sections from src/prompt-templates/bom.md
  - Should update the Stepper component to reflect the current step
  - Should use data from generated README rather than form data

### 2. Template Validation
- Given: README document has been successfully generated
- When: BOM generation is triggered
- Then: Should validate generated document matches template structure
  - All sections from src/prompt-templates/bom.md must be present
  - Should show error if template structure is incomplete

## Error Handling

### 1. Generation Failure
- Given: Document generation process fails
- When: Error occurs during generation
- Then: Should show error toast notification
  - Should maintain existing document state
  - Should not save partial document
