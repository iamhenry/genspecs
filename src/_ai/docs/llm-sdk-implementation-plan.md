# LLM and SDK Implementation Plan

## Phase 1: Static UI Scaffold

### Relevant Files:
- `src/components/ApiKeyModal.tsx` - Modal for API key input
- `src/components/stepper/StepIcon.tsx` - Custom step icons
- `src/components/stepper/VerticalStepper.tsx` - Stepper component (to be enhanced)
- `src/components/DocumentPreview.tsx` - Preview component (to be created)

### Objective:
Create all UI components without functionality, focusing on layout and visual design.

### Data Flow:
1. Static UI components with mock data
2. No real data flow - components render with placeholder content
3. Visual state changes through prop changes (no real state management)
4. Mock transitions and animations with dummy triggers

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

- [ ] 1.4. Create Document Preview Component
  - File: `src/components/DocumentPreview.tsx` (create)
  - [ ] 1.4.1. Build Preview UI
    - [ ] 1.4.1.1. Add markdown preview area
    - [ ] 1.4.1.2. Create syntax highlighting theme
    - [ ] 1.4.1.3. Add loading skeleton
    - [ ] 1.4.1.4. Design error states

## Phase 2: Frontend Logic

### Relevant Files:
- `src/context/ApiKeyContext.tsx` - Context for API key management (to be created)
- `src/store/generationStore.ts` - State management for generation process (to be created)
- `src/lib/validations.ts` - Form validation schemas (to be created)
- `src/types/index.ts` - TypeScript type definitions (to be created)

### Objective:
Implement all frontend logic, state management, and user interactions without backend integration.

### Data Flow:
1. User Input Flow:
   - Form data → Form validation → Store update
   - API key input → Validation → Local storage → Context update
   - Step navigation → Store update → UI update

2. State Management Flow:
   - Generation store manages step states and content
   - Context provides API key status to components
   - Local storage persists user preferences and API key

3. Component Communication:
   - Parent components pass callbacks to children
   - Store updates trigger component re-renders
   - Context changes propagate to subscribed components

### Step-by-Step Tasks:

- [ ] 2.1. Implement API Key Management
  - File: `src/context/ApiKeyContext.tsx` (create)
  - [ ] 2.1.1. Create Context Logic
    - [ ] 2.1.1.1. Define context types
    - [ ] 2.1.1.2. Add local storage integration
    - [ ] 2.1.1.3. Create key validation methods

- [ ] 2.2. Set up Generation Store
  - File: `src/store/generationStore.ts` (create)
  - [ ] 2.2.1. Define Store Structure
    - [ ] 2.2.1.1. Create store types
    - [ ] 2.2.1.2. Set up initial state
    - [ ] 2.2.1.3. Define actions
  - [ ] 2.2.2. Add Store Logic
    - [ ] 2.2.2.1. Implement state updates
    - [ ] 2.2.2.2. Create selectors
    - [ ] 2.2.2.3. Add persistence layer

- [ ] 2.3. Add Component Logic
  - [ ] 2.3.1. ApiKeyModal Logic
    - [ ] 2.3.1.1. Add form validation
    - [ ] 2.3.1.2. Implement key storage
    - [ ] 2.3.1.3. Add error handling
  - [ ] 2.3.2. Stepper Logic
    - [ ] 2.3.2.1. Add step navigation
    - [ ] 2.3.2.2. Implement progress tracking
    - [ ] 2.3.2.3. Create event handlers

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
   - README generation → Store update → Preview update
   - BOM generation → Store update → Preview update
   - Generation error → Error handling → User feedback

3. Download Flow:
   - Download trigger → File packaging → ZIP creation
   - Progress updates → UI feedback
   - Completion → Download prompt

### Step-by-Step Tasks:

- [ ] 3.1. Create LLM Integration
  - File: `src/lib/llm.ts` (create)
  - [ ] 3.1.1. Set up API Client
    - [ ] 3.1.1.1. Configure OpenRouter client
    - [ ] 3.1.1.2. Add request interceptors
    - [ ] 3.1.1.3. Implement error handling
  - [ ] 3.1.2. Create Generation Methods
    - [ ] 3.1.2.1. Add README generation
    - [ ] 3.1.2.2. Implement BOM generation
    - [ ] 3.1.2.3. Create retry logic

- [ ] 3.2. Implement Download Logic
  - File: `src/lib/download.ts` (create)
  - [ ] 3.2.1. Create ZIP Utilities
    - [ ] 3.2.1.1. Set up ZIP creation
    - [ ] 3.2.1.2. Add file packaging
    - [ ] 3.2.1.3. Implement progress tracking

## Phase 4: UI Polish

### Objective:
Add final polish, animations, and improve user experience.

### Data Flow:
1. Animation Triggers:
   - State changes → Animation triggers
   - User interactions → Micro-animations
   - Loading states → Loading animations
   - Error states → Error animations

2. Performance Flow:
   - Component mount → Performance tracking
   - User interaction → Performance measurement
   - Animation frame → Performance optimization

### Step-by-Step Tasks:

- [ ] 4.1. Add Loading States
  - [ ] 4.1.1. Implement skeleton loaders
  - [ ] 4.1.2. Add progress indicators
  - [ ] 4.1.3. Create loading animations

- [ ] 4.2. Enhance Transitions
  - [ ] 4.2.1. Add step transitions
  - [ ] 4.2.2. Improve modal animations
  - [ ] 4.2.3. Polish hover states

- [ ] 4.3. Improve Error States
  - [ ] 4.3.1. Add error animations
  - [ ] 4.3.2. Enhance error messages
  - [ ] 4.3.3. Implement recovery flows

- [ ] 4.4. Final Polish
  - [ ] 4.4.1. Add micro-interactions
  - [ ] 4.4.2. Optimize performance
  - [ ] 4.4.3. Conduct accessibility audit 