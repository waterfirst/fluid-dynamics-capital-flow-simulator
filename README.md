Of course. Based on the file structure provided in the images, it's clear this is a modern web application built with React, TypeScript, and Vite, not a Python-based script package. This is an excellent, state-of-the-art approach for academic research.

Here is a new, more accurate `README.md` file tailored to your actual project structure.

-----

# Capital Flow Simulator: A Hydrodynamic Model

[](https://opensource.org/licenses/MIT)

## 1\. Overview

This repository contains the official source code for the interactive web application accompanying the research paper: **"The Hydrodynamics of Capital: A Non-Linear Computational Model for Financial Crises and Policy Simulation."**

The application provides a real-time simulation of the hydrodynamic model of international capital flows described in the paper. It is designed to offer an intuitive, visual understanding of the model's dynamics and to serve as a direct, reproducible artifact for the research findings.

  - **Paper Pre-print:** [Link to your paper on arXiv, SSRN, or your personal website]
  - **Author:** Nakcho Choi

-----

## 2\. Live Interactive Application

**Experience the model in real-time without any local setup.** The live application is the primary tool for exploring the research.

Users can adjust key economic parameters and immediately observe their impact on capital flows, providing a hands-on understanding of concepts like "sudden stops," "market viscosity," and "external shocks."

➡️ **[Launch Interactive Simulation](https://www.google.com/search?q=https://aistudio.google.com/apps/drive/16hG8KiDND9g7J8Ma5aY7_3vkqnHQ8wUr)**

-----

## 3\. Technology Stack

This project is a modern web application built with the following technologies:

  * **Framework:** React
  * **Language:** TypeScript
  * **Build Tool:** Vite
  * **Styling:** (e.g., Tailwind CSS, CSS Modules - *specify your styling solution*)
  * **Data Visualization:** (e.g., D3.js, Recharts - *specify your charting library*)

-----

## 4\. Local Development and Setup

To run the application on your local machine, please follow these steps.

**Prerequisites:**

  * Node.js (v18.0 or higher recommended)
  * `npm` or `yarn` package manager

**1. Clone the Repository:**

```bash
git clone https://github.com/waterfirst/fluid-dynamics-capital-flow-simulator.git
cd fluid-dynamics-capital-flow-simulator
```

**2. Install Dependencies:**
Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn
```

**3. Run the Development Server:**

```bash
npm run dev
```

This will start a local development server, typically at `http://localhost:5173`. Open this URL in your web browser to use the application.

-----

## 5\. Features & Usage

The application is designed for interactive analysis:

  * **Interactive Parameter Control:** Adjust sliders and inputs to change key model parameters in real-time, such as market viscosity ($\\nu$), external forces ($f$), and initial pressure ($p$).
  * **Real-time Visualization:** Observe the simulation's output through dynamic charts, including:
      * **`CapitalHistoryChart`**: Tracks the flow of capital over time.
      * **`SectorFlowChart`**: Visualizes the distribution of capital across different economic sectors.
  * **Replicating Paper Scenarios:** While the app is dynamic, you can replicate the paper's key findings by setting the parameters to the values specified in the paper's appendix. For example, to simulate the "Transaction Tax" scenario from Table 4, you can increase the viscosity parameter and observe the dampening effect on capital outflows.

-----

## 6\. Project File Structure

The project follows a standard structure for a React + TypeScript application.

```
/
├── .env.local             # Local environment variables
├── .gitignore             # Files to be ignored by Git
├── index.html             # Main HTML entry point for Vite
├── package.json           # Project dependencies and scripts
├── README.md              # This file
├── tsconfig.json          # TypeScript compiler configuration
├── vite.config.ts         # Vite build tool configuration
│
└── src/
    ├── App.tsx            # Main application component
    ├── index.tsx          # React application entry point
    ├── constants.ts       # Application-wide constants
    ├── types/             # TypeScript type definitions
    │
    ├── components/
    │   ├── CapitalHistoryChart.tsx
    │   ├── SectorFlowChart.tsx
    │   └── icons/
    │
    └── hooks/
        └── useFluidSimulation.ts  # **Core simulation logic is here**
```

-----

## 7\. How to Cite

If you use this application or model in your research, please cite the accompanying paper:

```bibtex
@article{Choi2025Hydrodynamics,
  title   = {The Hydrodynamics of Capital: A Non-Linear Computational Model for Financial Crises and Policy Simulation},
  author  = {Choi, Nakcho},
  year    = {2025},
  journal = {Working Paper}
}
```

-----

## 8\. License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
