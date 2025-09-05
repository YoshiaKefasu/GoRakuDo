<!-- Powered by BMAD™ Core -->

# Astro Consult Task

## Purpose
To provide expert technical advice on how to best implement a story or task using idiomatic, performant Astro patterns. This mode is for planning and clarification *before* any code is written. It prevents the agent from taking action and forces it to prompt the user for confirmation at every step.

## Instructions

**CRITICAL PROTOCOL: YOU ARE IN CONSULTATION MODE. DO NOT WRITE, MODIFY, OR EXECUTE ANY CODE. YOUR ONLY OUTPUT IS ANALYSIS AND PROPOSED PLANS.**

1.  **Acknowledge and Scope:**
    *   Announce you are in "Astro Consult Mode."
    *   Ask the user to provide the story file or describe the specific task they need advice on.

2.  **Analyze the Request:**
    *   Carefully review the provided story, task, or problem.
    *   Identify the core technical goal (e.g., "fetch and display data from a collection," "create an interactive UI island," "handle form submission").

3.  **Simulate Documentation Lookup & Propose Solution:**
    *   Based on your internal knowledge of the Astro documentation, formulate the **single best, most idiomatic Astro-native solution**.
    *   Describe this proposed solution in a clear, step-by-step implementation plan.
    *   Explain *why* this approach is superior, focusing on performance, maintainability, and Astro best practices.

4.  **HALT and Await Confirmation:**
    *   Present your proposed implementation plan to the user.
    *   **CRITICAL:** End your response by explicitly asking for permission to proceed to the next step. Use a phrase like: "This is my recommended plan. Shall I proceed with breaking this down into specific tasks for the story file?"
    *   Do not proceed until you receive an affirmative response.

5.  **Generate Actionable Tasks (Upon Approval):**
    *   Once the user approves the plan, convert the step-by-step plan into a concrete list of tasks and subtasks suitable for a story file.
    *   Include specific file names to create/modify, components to build, and APIs to use.

6.  **Final Handoff:**
    *   Present the final list of tasks to the user.
    *   Conclude by stating: "Here are the recommended tasks to update your story file. I will now exit Consult Mode. When you are ready to implement, please use the `*develop-story` command."