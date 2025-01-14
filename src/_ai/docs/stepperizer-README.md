A library for creating step-by-step workflows in your apps

- 🚀 Fast and efficient
- 🔥 Powerful and flexible
- 📦 Lightweight (< 1kB gzipped)
- 🪄 Fully typesafe
- 🔗 Composable architecture
- 🎨 Unstyled for maximum customization

## Installation

```bash
npm install @stepperize/react
```

## Quick Start

1. Import the constructor:

```tsx
import { defineStepper } from "@stepperize/react";
```

2. Define your steps:

```tsx
const { Scoped, useStepper, steps, utils } = defineStepper(
  { id: "step-1", title: "Step 1", description: "Description for step 1" },
  { id: "step-2", title: "Step 2", description: "Description for step 2" },
  { id: "step-3", title: "Step 3", description: "Description for step 3" },
  { id: "step-4", title: "Step 4", description: "Description for step 4" }
);
```

3. Use the hook in your components:

```tsx
function StepperComponent() {
  const { currentStep, nextStep, prevStep } = useStepper();

  return (
    <div>
      <h2>{currentStep.title}</h2>
      <p>{currentStep.description}</p>
      <button onClick={prevStep}>Previous</button>
      <button onClick={nextStep}>Next</button>
    </div>
  );
}
```

## How It Works

Stepperize allows you to define a series of steps with unique IDs. When you create your steps using `defineStepper`, you get:

- A `Scoped` component for context management
- A `useStepper` hook for step control
- An array of `steps` for rendering
- An `utils` object with useful functions

The only required field for each step is the `id`. You can add any additional properties you need, and they'll be fully typesafe when using the hook.

## Documentation

For more detailed information on usage, configuration, and advanced features, visit our [full documentation](https://stepperize.vercel.app).

