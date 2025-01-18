# BDD Test Scenarios for Generation Methods

Note: The "project context" used in these scenarios comes from the ContactForm component, which collects:
- Project name
- Description
- Tech stack (parsed from description)
- User stories

## README Generator

### 1. Valid Project Context
- Given: Complete project context with all required fields
- When: README generation is triggered
- Then: Should generate complete README with all sections

### 2. Partial Project Context
- Given: Project context with missing optional fields
- When: README generation is triggered
- Then: Should generate README with available sections and placeholders for missing data

### 3. Error Handling
- Given: Invalid project context
- When: README generation is triggered
- Then: Should return appropriate error and not generate file

## BOM Generator

### 1. Complete Tech Stack
- Given: Complete tech stack analysis
- When: BOM generation is triggered
- Then: Should generate complete BOM with all dependencies

### 2. Partial Tech Stack
- Given: Tech stack with missing optional dependencies
- When: BOM generation is triggered
- Then: Should generate BOM with available dependencies and notes for missing data

### 3. Version Handling
- Given: Tech stack with some dependencies having version ranges
- When: BOM generation is triggered
- Then: Should properly handle and document version ranges

## Error Recovery

### 1. Primary Failure
- Given: Primary generation method fails
- When: Error occurs
- Then: Should attempt fallback generation method

### 2. Fallback Success
- Given: Primary generation method fails
- When: Fallback method is successful
- Then: Should return fallback-generated document

### 3. Complete Failure
- Given: Both primary and fallback methods fail
- When: Error occurs
- Then: Should return appropriate error state and not generate file
