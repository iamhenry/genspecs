# GenSpecs

## Overview
GenSpecs is an automated document generation system designed to streamline the process of creating project documentation for software projects. It provides a guided, step-by-step workflow for generating essential project documents that can be used to guide AI code generation within the Cursor IDE.

## Features
- Interactive form-based project setup (name, description, tech stack, user stories)
- Step-by-step document generation workflow with vertical progress stepper
- Document generation for:
  1. README
  2. Bill of Materials (BOM)
- Document persistence using local storage
- Custom OpenRouter API key integration
- Individual document downloads
- Skeleton loading states for document generation

## System Requirements
- Modern web browser with JavaScript enabled
- Internet connection for API access
- OpenRouter API key

## Dependencies
- Next.js (Latest stable)
- Tailwind CSS
- Shadcn Component Library
- OpenRouter API
- Vercel AI SDK

## Architecture
The application follows a modern web architecture with:
- Client-side routing and state management via Next.js
- Server-side API integration with OpenRouter
- Local storage for document state persistence
- Step-based document generation workflow
- Modular component structure for UI elements

## Core Components
1. Project Setup Form
   - Initial project details collection
   - Tech stack selection
   - User story input

2. Document Generation Workflow
   - Vertical progress stepper
   - Generation state management
   - Document regeneration options

3. Document Management
   - Generation state tracking
   - Version control and persistence
   - Download functionality

4. UI Components
   - Form-based input system
   - Loading states and animations
   - Progress tracking interface
