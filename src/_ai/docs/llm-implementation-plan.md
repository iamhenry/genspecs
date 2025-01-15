# Single Page Stepper Implementation Plan

## Milestone 1: Core Layout and API Key Setup

### Relevant Files:
- `src/app/page.tsx` - Main application page component
- `src/app/layout.tsx` - Root layout component
- `src/components/layout/TwoColumnLayout.tsx` - Two column layout component
- `src/components/ApiKeyModal.tsx` - Modal for API key input (to be created)
- `src/lib/utils.ts` - Utility functions
- `src/context/ApiKeyContext.tsx` - Context for API key management (to be created)

### Data Flow:
1. User enters API key in modal
2. Key stored in ApiKeyContext
3. Key availability controls form submission
4. API key used for LLM requests

### Objective:
Set up the basic application structure with API key management and layout components.

### Acceptance Criteria:
- Single page layout with conditional rendering
- Functional API key modal with local storage
- Two-column layout component ready for content
- Toast notifications for key-related actions

### Step-by-Step Tasks:

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

- [ ] 1.2. Create API Key Modal Component
  - File: `src/components/ApiKeyModal.tsx` (create)
  - Dependency: ApiKeyContext
  - [ ] 1.2.1. Build Modal UI
    - [ ] 1.2.1.1. Create form layout with shadcn
    - [ ] 1.2.1.2. Add input field with validation
    - [ ] 1.2.1.3. Implement save button with loading state
  - [ ] 1.2.2. Add Modal Logic
    - [ ] 1.2.2.1. Implement open/close handlers
    - [ ] 1.2.2.2. Add form submission logic
    - [ ] 1.2.2.3. Integrate with API key context

- [ ] 1.3. Implement Base Layout
  - File: `src/app/layout.tsx`
  - Dependency: None
  - [ ] 1.3.1. Set up Providers
    - [ ] 1.3.1.1. Add toast provider
    - [ ] 1.3.1.2. Configure API key context provider
    - [ ] 1.3.1.3. Set up theme provider
  - [ ] 1.3.2. Configure Layout Structure
    - [ ] 1.3.2.1. Add metadata configuration
    - [ ] 1.3.2.2. Set up root styles
    - [ ] 1.3.2.3. Configure font optimization

- [ ] 1.4. Create Main Page Structure
  - File: `src/app/page.tsx`
  - Dependency: ApiKeyModal, TwoColumnLayout
  - [ ] 1.4.1. Implement Page Components
    - [ ] 1.4.1.1. Add API key modal trigger
    - [ ] 1.4.1.2. Create conditional rendering logic
    - [ ] 1.4.1.3. Set up layout transitions
  - [ ] 1.4.2. Add State Management
    - [ ] 1.4.2.1. Create view state handlers
    - [ ] 1.4.2.2. Implement form visibility logic
    - [ ] 1.4.2.3. Add loading states

## Milestone 2: Form Implementation

### Relevant Files:
- `src/components/ContactForm.tsx` - Existing form component to be reused
- `src/lib/validations.ts` - Form validation schemas (to be created)
- `src/types/index.ts` - TypeScript type definitions (to be created)

### Data Flow:
1. User fills project form using existing ContactForm component
2. Data validated using zod schemas (already implemented)
3. On submit, data stored in state
4. Triggers document generation process

### Objective:
Adapt existing ContactForm component for project information collection.

### Acceptance Criteria:
- Reuse ContactForm component with minimal modifications
- Extend validation if needed
- Smooth transition to generation phase
- Proper TypeScript types for form data

### Step-by-Step Tasks:

- [ ] 2.1. Define Type Structures
  - File: `src/types/index.ts` (create)
  - Dependency: None
  - [ ] 2.1.1. Create Form Types
    - [ ] 2.1.1.1. Reuse existing form schema types
    - [ ] 2.1.1.2. Add any additional types needed
    - [ ] 2.1.1.3. Add validation error types

- [ ] 2.2. Extend Validation Schemas
  - File: `src/lib/validations.ts` (create)
  - Dependency: Type definitions
  - [ ] 2.2.1. Review Existing Schema
    - [ ] 2.2.1.1. Assess current validation rules
    - [ ] 2.2.1.2. Add any additional validation
    - [ ] 2.2.1.3. Update error messages if needed

- [ ] 2.3. Adapt ContactForm Component
  - File: `src/components/ContactForm.tsx`
  - Dependency: Validation schemas, Type definitions
  - [ ] 2.3.1. Update Form Logic
    - [ ] 2.3.1.1. Modify submission handler
    - [ ] 2.3.1.2. Add generation trigger
    - [ ] 2.3.1.3. Implement loading states

## Milestone 3: Stepper Implementation

### Relevant Files:
- `src/components/stepper/VerticalStepper.tsx` - Stepper component
- `src/components/stepper/StepIcon.tsx` - Custom step icons (to be created)
- `src/store/generationStore.ts` - State management for generation process (to be created)

### Data Flow:
1. Generation status updates step states
2. Step completion triggers next step
3. Document preview updates based on selected step
4. Final step enables download functionality

### Objective:
Implement a vertical stepper with status indicators and document preview.

### Acceptance Criteria:
- Visual step indicators with status icons
- Automatic progression through steps
- Preview pane shows current document
- Error handling with visual feedback

### Step-by-Step Tasks:

- [ ] 3.1. Create Generation Store
  - File: `src/store/generationStore.ts` (create)
  - Dependency: Type definitions
  - [ ] 3.1.1. Define Store Structure
    - [ ] 3.1.1.1. Create store types
    - [ ] 3.1.1.2. Set up initial state
    - [ ] 3.1.1.3. Define actions
  - [ ] 3.1.2. Implement Store Logic
    - [ ] 3.1.2.1. Add state updates
    - [ ] 3.1.2.2. Create selectors
    - [ ] 3.1.2.3. Implement persistence

- [ ] 3.2. Build Step Icon Component
  - File: `src/components/stepper/StepIcon.tsx` (create)
  - Dependency: None
  - [ ] 3.2.1. Create Icon States
    - [ ] 3.2.1.1. Add idle state icon
    - [ ] 3.2.1.2. Create loading animation
    - [ ] 3.2.1.3. Implement success/error states
  - [ ] 3.2.2. Add Icon Logic
    - [ ] 3.2.2.1. Implement state transitions
    - [ ] 3.2.2.2. Add animation effects
    - [ ] 3.2.2.3. Create accessibility features

- [ ] 3.3. Enhance Vertical Stepper
  - File: `src/components/stepper/VerticalStepper.tsx`
  - Dependency: StepIcon, Generation Store
  - [ ] 3.3.1. Update Stepper UI
    - [ ] 3.3.1.1. Add step indicators
    - [ ] 3.3.1.2. Implement progress bar
    - [ ] 3.3.1.3. Create step transitions
  - [ ] 3.3.2. Add Stepper Logic
    - [ ] 3.3.2.1. Implement step navigation
    - [ ] 3.3.2.2. Add state management
    - [ ] 3.3.2.3. Create event handlers

## Milestone 4: Document Generation and Download

### Relevant Files:
- `src/lib/llm.ts` - LLM integration utilities (to be created)
- `src/lib/download.ts` - Download utilities (to be created)
- `src/components/DocumentPreview.tsx` - Preview component (to be created)
- `src/components/layout/TwoColumnLayout.tsx` - Existing layout to be reused

### Data Flow:
1. Form submission triggers README generation
2. README completion triggers BOM generation
3. Generated documents displayed in TwoColumnLayout's right panel
4. Download bundles documents into zip

### Objective:
Implement document generation flow and download functionality using existing layout.

### Step-by-Step Tasks:

- [ ] 4.1. Create LLM Integration
  - File: `src/lib/llm.ts` (create)
  - Dependency: API Key Context
  - [ ] 4.1.1. Set up API Client
    - [ ] 4.1.1.1. Configure OpenRouter client
    - [ ] 4.1.1.2. Add request interceptors
    - [ ] 4.1.1.3. Implement error handling
  - [ ] 4.1.2. Create Generation Methods
    - [ ] 4.1.2.1. Add README generation
    - [ ] 4.1.2.2. Implement BOM generation
    - [ ] 4.1.2.3. Create retry logic

- [ ] 4.2. Build Document Preview
  - File: `src/components/DocumentPreview.tsx` (create)
  - Dependency: Generation Store, TwoColumnLayout
  - [ ] 4.2.1. Create Preview UI
    - [ ] 4.2.1.1. Integrate with TwoColumnLayout's right panel
    - [ ] 4.2.1.2. Add markdown renderer
    - [ ] 4.2.1.3. Implement syntax highlighting
  - [ ] 4.2.2. Implement Preview Logic
    - [ ] 4.2.2.1. Add content switching using currentStep prop
    - [ ] 4.2.2.2. Create update handlers
    - [ ] 4.2.2.3. Implement error states

- [ ] 4.3. Implement Download Logic
  - File: `src/lib/download.ts` (create)
  - Dependency: Generation Store
  - [ ] 4.3.1. Create ZIP Utilities
    - [ ] 4.3.1.1. Set up ZIP creation
    - [ ] 4.3.1.2. Add file packaging
    - [ ] 4.3.1.3. Implement progress tracking
  - [ ] 4.3.2. Add Download Handlers
    - [ ] 4.3.2.1. Create download trigger
    - [ ] 4.3.2.2. Add error handling
    - [ ] 4.3.2.3. Implement cleanup logic 