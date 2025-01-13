# GenSpecs

## Overview
GenSpecs is an automated document generation system designed to streamline the process of creating project documentation for software projects. It provides a guided, step-by-step workflow for generating essential project documents that can be used to guide AI code generation within the Cursor IDE.

## Features
- Interactive form-based project setup (name, description, tech stack, user stories)
- Step-by-step document generation workflow
- Document generation for:
  1. README
  2. Bill of Materials
  3. Project Roadmap
  4. Implementation Plan
- Two-column layout with vertical progress stepper
  - left column: stepper
  - right column: view generated text
- Real-time document preview and editing
- Chat interface for requesting document changes
- Document persistence across page refreshes
- Custom OpenRouter API key integration
- Individual or bulk document downloads
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
- Novel.sh (Markdown editor)

## Architecture
The application follows a modern web architecture with:
- Client-side routing and state management via Next.js
- Server-side API integration with OpenRouter
- Persistent storage for document state
- Real-time document generation and preview
- Modular component structure for UI elements

## Core Components
1. Project Setup Form
   - Initial project details collection
   - Tech stack selection
   - User story input

2. Document Generation Workflow
   - Vertical progress stepper
   - Document preview panel
   - Chat interface for modifications

3. Document Management
   - Real-time preview and editing
   - Version control and persistence
   - Download management (single/bulk)

4. UI Components
   - Two-column layout system
   - Loading states and animations
   - Markdown editor integration
   - Chat interface for document modifications
