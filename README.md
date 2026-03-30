# Student Registration System

A clean, fully responsive Student Registration System built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## Project Overview

This project allows users to register and manage student records directly in the browser. All data is persisted using **LocalStorage**, so records survive page refreshes without any backend.

---

## Features

- **Add Students** — Register with name, student ID, email, and contact number
- **Edit Records** — Update any student's details via a modal dialog
- **Delete Records** — Remove entries with a confirmation prompt
- **LocalStorage Persistence** — Data is saved locally and survives page refresh
- **Input Validation** — Real-time field-level validation with error messages
- **Live Search** — Filter the records table instantly by name, ID, or email
- **Dynamic Scrollbar** — Vertical scrollbar appears automatically when records exceed 5 rows
- **Stats Dashboard** — Shows total students, active records, and latest student ID
- **Toast Notifications** — Non-intrusive success/warning messages on actions
- **Fully Responsive** — Works across mobile, tablet, and desktop screen sizes

---

## File Structure

```
student-registration-system/
│
└── index.html       # All HTML, CSS, and JavaScript in one file
└── README.md        # Project documentation
```

> No nested folders. No build tools. No dependencies.

---

## Validation Rules

| Field          | Rule                                              |
|----------------|---------------------------------------------------|
| Student Name   | Letters, spaces, hyphens, and apostrophes only    |
| Student ID     | Numbers only                                      |
| Email Address  | Must follow standard email format (x@x.x)         |
| Contact Number | Numbers only, minimum 10 digits                   |

All fields are required — empty submissions are blocked.

---

## Responsive Breakpoints

| Screen Size | Breakpoint     | Layout                        |
|-------------|----------------|-------------------------------|
| Mobile      | ≤ 640px        | Single column, stacked layout |
| Tablet      | 641px – 1024px | Single column, wider spacing  |
| Desktop     | ≥ 1025px       | Two-column (form + table)     |

---

## LocalStorage

Student records are stored under the key `srs_students` as a JSON array. Data persists across browser sessions until manually cleared.

---

## How to Run

1. Download or clone this repository
2. Open `index.html` in any modern browser
3. No installation, server, or build step required

```bash
git clone https://github.com/your-username/student-registration-system.git
cd student-registration-system
# Open index.html in your browser
```

---

## 📋 Assignment Coverage

| Task | Description                        | Marks |
|------|------------------------------------|-------|
| 1    | Basic HTML structure & meta tags   | 5     |
| 2    | Header with title & description    | 5     |
| 3    | Form with 4 input fields           | 5     |
| 4    | Responsive display/records section | 15    |
| 5    | CSS styling & responsiveness       | 20    |
| 6    | Full JavaScript functionality      | 40    |
| 7    | Documentation & comments           | 10    |

---

## 🛠️ Built With

- **HTML** — Semantic markup
- **CSS** — Custom properties, Flexbox, Grid, media queries
- **JavaScript** — DOM manipulation, LocalStorage API
- **Google Fonts** — Syne (headings) + DM Sans (body)

---

## 👤 Author

Submitted by **Abhikraj Dutta Choudhury** as part of the **Internshala Web Development Training** assignment.