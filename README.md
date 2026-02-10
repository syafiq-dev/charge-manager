## Web Demo

[Click here to test the web demo](https://supersharkz-demo.syafiq.art/)

## Setup on Development

First, run the development server:

```bash
# 1. Clone the repository
git clone https://github.com/syafiq-dev/charge-manager.git
cd charge-manager

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# 📋 Assumptions & Trade-offs
## Assumptions Made:

- Single-user system: The UI is designed for one admin at a time, without authentication or user roles.

- Data persistence: Since this is a front-end demo, data is reset on page refresh. In production, this would connect to a backend API.

- Charge calculation: Charges are entered manually per transaction. A production system might auto-generate charges based on class schedules.

## Trade-offs Chosen:

- State over Backend: I chose to manage all data in React state (using useState/useReducer) rather than simulating a full backend, to stay within the 3-hour scope and focus on UI/UX.

- Simplicity over Features: I prioritized a fully functional CRUD with clear UX over advanced features (like bulk actions or reporting) to meet the core requirement reliably.

- Manual Mock Data: I used static JSON instead of a mock API server to minimize setup complexity for reviewers.

## What I Would Improve Next:

- Backend Integration: Replace the static JSON with a real Node.js/Express or Firebase backend with proper database.

- Data Validation: Add more robust validation (e.g., checking for duplicate entries, date ranges, amount formats).

- Advanced UX: Add search/filter, export to CSV, and audit logs for charge history.

## 🎨 UX Reflection: Preventing Admin Mistakes Potential Admin Mistake How UI Prevents/Reduces It

1. Accidental deletion Delete requires a confirmation modal with clear "Cancel" and "Delete" buttons. The modal clearly states which item is being removed.
2. Saving incomplete/incorrect data Form validation ensures required fields (Student, Amount, Date) are filled before submission. Invalid inputs are highlighted with clear error messages.
3. Editing the wrong charge Each row has distinct visual separation. The "Edit" button is placed per row with clear labeling. When editing, the form is pre-filled with the selected charge's data for clear context.

## 🗑️ Deletion Handling
To prevent accidental removal:

- Two-Step Process: Clicking "Delete" opens a confirmation modal instead of immediate deletion.

- Clear Warning: The modal displays: "Are you sure you want to delete this charge for [Student Name]? This action cannot be undone."

- Intentional Action: The user must consciously click the red "Confirm Delete" button. The safer "Cancel" button is more prominent.

Why this approach? It follows the principle of reversible actions—giving users a clear "undo" point before permanent data loss. This is standard in financial systems where data integrity is critical.
