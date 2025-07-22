# 📚 Library Management System

A modern web-based Library Management System built with **React**, **TypeScript**, and **Tailwind CSS** using the **Vite** build tool. This project helps users manage library operations like searching, issuing, and tracking books with an intuitive interface.

---

## 🚀 Features

- 🔍 **Book Search**: Quickly find books by title or author.
- 👤 **Role-Based Access**: Separate access for students, faculty, and librarians.
- 📦 **Book Issuing & Return**: Track borrowing and returning of books.
- 🧠 **Recommendations**: Suggest books based on user interest (planned).
- 📝 **Form Validation**: Secure and user-friendly input handling with `React Hook Form` and `Zod`.
- 💡 **Responsive UI**: Built using `shadcn-ui`, `Radix UI`, and `TailwindCSS`.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [React](https://reactjs.org/) | Frontend library |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Vite](https://vitejs.dev/) | Fast build tool |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI components |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Supabase (optional)](https://supabase.com/) | Backend as a service |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form handling and validation |

---
## Install dependencies

bash
Copy
Edit
npm install
Run the development server

bash
Copy
Edit
npm run dev
Open your browser at http://localhost:5173

📁 Project Structure
php
Copy
Edit
📦 root
 ┣ 📁 public/               # Static assets
 ┣ 📁 src/                  # Source code
 ┃ ┣ 📁 components/        # Reusable UI components
 ┃ ┣ 📁 pages/             # Route-based pages
 ┃ ┣ 📁 styles/            # Tailwind & global styles
 ┃ ┗ main.tsx             # React app entry
 ┣ 📄 index.html           # Main HTML template
 ┣ 📄 package.json         # Project dependencies and scripts
 ┗ 📄 tailwind.config.ts   # Tailwind custom config


## ✅ Future Enhancements:
📷 OCR Integration to scan and extract book data from covers

📊 Analytics Dashboard for admin insights

📚 Book Wishlist / Reservation System

🛡️ Authentication & Authorization with Supabase or Firebase


. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/Sahil_Chauhan_CSE-G_LMS
.git
   cd library-management-system
