# LLM and SDK Implementation Plan

## Phase 1: Static UI Scaffold

### Relevant Files:
- `src/components/ApiKeyModal.tsx` - Modal for API key input
- `src/components/stepper/StepIcon.tsx` - Custom step icons
- `src/components/stepper/VerticalStepper.tsx` - Stepper component
- `src/components/ContactForm.tsx` - Project information form

### Objective:
Create all UI components without functionality, focusing on layout and visual design.

### Data Flow:
1. Static UI components with mock data
2. No real data flow - components render with placeholder content
3. Visual state changes through prop changes (no real state management)

### Acceptance Criteria:
- All components visually match design specs
- Components use proper Tailwind/shadcn styling
- Responsive layout across breakpoints
- Proper component composition

### Step-by-Step Tasks:

- [x] 1.1. Build API Key Modal UI
  - File: `src/components/ApiKeyModal.tsx`
  - [x] 1.1.1. Create Modal Shell
    - [x] 1.1.1.1. Add shadcn dialog component
    - [x] 1.1.1.2. Create form layout
    - [x] 1.1.1.3. Add input field placeholder
    - [x] 1.1.1.4. Add save/cancel buttons

- [x] 1.2. Create Step Icon Component
  - File: `src/components/stepper/StepIcon.tsx`
  - [x] 1.2.1. Design Icon States
    - [x] 1.2.1.1. Create idle state icon
    - [x] 1.2.1.2. Design loading state
    - [x] 1.2.1.3. Design success/error states
    - [x] 1.2.1.4. Add state transition animations

- [x] 1.3. Enhance Vertical Stepper UI
  - File: `src/components/stepper/VerticalStepper.tsx`
  - [x] 1.3.1. Update Visual Design
    - [x] 1.3.1.1. Add step indicators with StepIcon
      - [x] Ensure to use a red color icon (16x16) for error states and a green color icon (16x16) for completed states.
      - [x] Icons should be vertically aligned with the vertical divider for a cohesive look.
      - [x] Reuse the existing state mechanism from the stepper to maintain consistency in icon representation.

## Phase 2: Frontend Logic

### Relevant Files:
- `src/context/ApiKeyContext.tsx` - Context for API key management
- `src/store/generationStore.ts` - State management for generation process (to be created)
- `src/lib/validations.ts` - Form validation schemas (to be created)
- `src/types/index.ts` - TypeScript type definitions (to be created)

### Objective:
Implement all frontend logic, state management, and user interactions.

### Data Flow:
1. User Input Flow:
   - Form data → Form validation → Store update
   - API key input → Validation → Local storage → Context update
   - Step navigation → Store update → UI update

2. State Management Flow:
   - Generation store manages step states and content
   - Context provides API key status to components
   - Local storage persists user preferences and API key

3. View State Flow:
   - Form view → Generation view transition
   - Step progress updates
   - Final download state

### Step-by-Step Tasks:

- [x] 2.1. Implement API Key Management
  - File: `src/context/ApiKeyContext.tsx`
  - [x] 2.1.1. Create Context Logic
    - [x] 2.1.1.1. Create ApiKeyContext with isValid and key states
    - [x] 2.1.1.2. Implement useLocalStorage hook with encryption for API key
    - [x] 2.1.1.3. Add validateApiKey method with OpenRouter API check

- [x] 2.2. Set up Generation Store
  - File: `src/store/generationStore.ts` (create)
  - [x] 2.2.1. Define Store Structure
    - [x] 2.2.1.1. Create StepState and GenerationState interfaces
    - [x] 2.2.1.2. Initialize store with currentStep and documentStates
    - [x] 2.2.1.3. Add actions for step transitions and document updates
  - [x] 2.2.2. Add Store Logic
    - [x] 2.2.2.1. Implement step state machine with validation
    - [x] 2.2.2.2. Add selectors for step progress and document status
    - [x] 2.2.2.3. Create persistence layer using localStorage

- [x] 2.3. Add View State Management
  - [x] 2.3.1. Form to Stepper Transition
    - [x] 2.3.1.1. Add form submission handler with Zod validation
    - [x] 2.3.1.2. Implement contactform to vertical stepper transition
  - [x] 2.3.2. Generation Progress
    - [x] 2.3.2.1. Use StepIcon states to update the vertical stepper
    - [x] 2.3.2.2. Implement vertical stepper to generation view transition

## Phase 3: Backend Integration

### Relevant Files:
- `src/lib/llm.ts` - LLM integration utilities (to be created)
- `src/lib/download.ts` - Download utilities (to be created)

### Objective:
Integrate LLM functionality and implement document generation pipeline.

### Data Flow:
1. Generation Pipeline:
   - Form submission → Validation → LLM request
   - LLM response → Store update → UI update
   - Error response → Error state → UI feedback

2. Document Generation:
   - README generation → Store update → Step update
   - BOM generation → Store update → Step update
   - Generation error → Error handling → User feedback

3. Download Flow:
   - Download trigger → File packaging → ZIP creation
   - Completion → Immediate download

### Step-by-Step Tasks:

- [ ] 3.1. Create LLM Integration
  - File: `src/lib/llm.ts` (create)
  - [x] 3.1.1. Set up OpenRouter Client
    - [x] 3.1.1.1. Create API client with rate limiting and retries
    - [x] 3.1.1.2. Add request interceptors for API key and error handling
    - [x] 3.1.1.3. Implement streaming response handler with events
  - [ ] 3.1.2. Create Generation Methods
    - [ ] 3.1.2.1. Add README generator with project context
    - [ ] 3.1.2.2. Create BOM generator with tech stack analysis
    - [ ] 3.1.2.3. Implement error recovery with fallback options

- [ ] 3.2. Implement Download Logic
  - File: `src/lib/download.ts` (create)
  - [ ] 3.2.1. Create ZIP Utilities
    - [ ] 3.2.1.1. Set up JSZip with proper file structure
    - [ ] 3.2.1.2. Add markdown file packaging with metadata
    - [ ] 3.2.1.3. Implement browser download with progress

## Phase 4: UI Polish

### Objective:
Add final polish, animations, and improve user experience.

### Data Flow:
1. Animation Triggers:
   - State changes → Animation triggers
   - User interactions → Micro-animations
   - Loading states → Loading animations
   - Error states → Error animations

### Step-by-Step Tasks:

- [ ] 4.1. Add Loading States
  - [ ] 4.1.1. Create skeleton loader components with premade shadcn components
  - [ ] 4.1.2. Implement loading spinners with theme colors use @eights-bit-loading-spinner

- [ ] 4.2. Enhance Transitions
  - [ ] 4.2.1. Add fadein/fadeout transitions for form/stepper views
  - [ ] 4.2.2. Create smooth step transitions with opacity

- [ ] 4.3. Improve Error States
  - [ ] 4.3.1. Create toast notifications with status icons
  - [ ] 4.3.2. Implement error recovery UI with retry buttons

Note: Two-column layout with document preview functionality is preserved in the codebase for future enhancement. 