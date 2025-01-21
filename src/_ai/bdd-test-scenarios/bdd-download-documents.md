# Download Documents Feature BDD Scenarios

## Core Download Functionality

Scenario 1: Successfully downloading all generated documents
Given: All documents have been successfully generated
When: The user clicks the "Download All Documents" button
Then: A zip file containing all markdown documents is downloaded

Acceptance Criteria:
- [ ] Zip file contains all generated markdown documents
- [ ] Files maintain correct markdown formatting
- [ ] Download initiates automatically
- [ ] Zip file is named appropriately with project name

## Button State Management

Scenario 2: Button state during document generation
Given: The system is currently generating documents
When: The user views the download button
Then: The button should be disabled

Acceptance Criteria:
- [ ] Button is visually disabled
- [ ] Button prevents user interaction
- [ ] Button label indicates generation in progress

Scenario 3: Button state after successful generation
Given: All documents have been successfully generated
When: The generation process completes
Then: The download button becomes enabled with "Download All Documents" label

Acceptance Criteria:
- [ ] Button becomes enabled automatically
- [ ] Button label changes to "Download All Documents"
- [ ] Button is visually indicated as interactive
- [ ] Button responds to user interaction

Scenario 4: Button state with incomplete generation
Given: Some documents are still in generation process
When: The user views the download button
Then: The button remains disabled until all documents complete generation

Acceptance Criteria:
- [ ] Button stays disabled
- [ ] Visual indication of pending generation
- [ ] Clear feedback about generation progress
- [ ] No download possible until completion

## Error Handling

Scenario 5: Handling download failures
Given: All documents are generated but download fails
When: The user attempts to download
Then: An error message is displayed via the toast component and retry option is provided

Acceptance Criteria:
- [ ] Clear error message shown to user
- [ ] Retry mechanism available within the same button
- [ ] Button retry label is "Retry"
- [ ] Original documents preserved
- [ ] System maintains stable state

## File Format and Structure

Scenario 6: Verifying downloaded content structure
Given: User has downloaded the documents
When: The zip file is extracted
Then: All files maintain correct structure and formatting

Acceptance Criteria:
- [ ] Markdown formatting preserved
- [ ] File hierarchy maintained
- [ ] All document types included
- [ ] Files are properly named 
- [ ] The download zip file name should be the name of the project document from the `contactform`

## Stepper Integration

Scenario 7: Download step in vertical stepper
Given: The user has completed generating all previous documents
When: The user reaches the final step in the vertical stepper
Then: The "Download Documents" step is displayed with appropriate icon state

Acceptance Criteria:
- [ ] "Download Documents" appears as the final step in the vertical stepper
- [ ] Step icon shows "idle" state when documents are not ready
- [ ] Step icon shows "loading" state while preparing download
- [ ] Step icon shows "done" state after successful download
- [ ] Step icon shows "error" state if download fails
- [ ] User cannot proceed to download step if previous documents are incomplete


Scenario 8: Automatic progression to download step
Given: All previous documents have been generated and accepted
When: The BOM document state changes to "accepted"
Then: The stepper automatically progresses to the download step

Acceptance Criteria:
- [ ] Automatic progression occurs without user intervention
- [ ] Transition happens immediately after BOM acceptance
- [ ] Download step becomes active automatically
- [ ] Previous steps are marked as completed