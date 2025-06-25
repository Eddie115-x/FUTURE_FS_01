# 🚀 Future FS 01 – Serverless Portfolio (React + Supabase + Vercel)

A fully serverless portfolio web app designed and built for the **Future Interns Full Stack Internship**.

This project showcases a production-ready, scalable personal portfolio powered by modern tools — with seamless backend logic, dynamic content management, and real-time email functionality, all without spinning up a custom server.

---

## 🎯 What It Does

- ✅ Dynamic project and blog showcase (fetched from Supabase)
- ✅ Fully functional contact form (data stored + emails sent)
- ✅ Admin dashboard with secure login (Supabase Auth)
- ✅ File upload support via Supabase Storage
- ✅ Responsive UI with dark/light mode support
- ✅ Serverless functions handling backend logic

---

## 🛠 Tech Stack

| Layer        | Tools Used                            |
| ------------ | ------------------------------------- |
| Frontend     | React, Bootstrap, Custom CSS          |
| Backend/API  | Vercel Serverless Functions (Node.js) |
| Database     | Supabase (PostgreSQL)                 |
| Auth         | Supabase Auth                         |
| Email        | Resend API                            |
| Hosting      | Vercel (GitHub-integrated CI/CD)      |

---

## 🌐 Live Demo

🔗 [https://future-fs-01-seven.vercel.app](https://future-fs-01-seven.vercel.app)

---

## 🔐 How It Works

- All form submissions are routed through a **serverless API** endpoint (`/api/contact`)
- Messages are stored securely in Supabase
- Email notifications are dispatched via the **Resend API**
- Authenticated users can manage projects and blogs via a protected **Admin Dashboard**
- The homepage dynamically displays portfolio data using real-time Supabase queries

---

## 📦 Project Structure

/api → Serverless backend (e.g., contact.js)
/public → Static files (icons, manifest, images)
/src → React components and pages

yaml
Copy
Edit

---

## 🚀 How to Deploy Your Own Version

1. **Fork or clone** the repo
2. Connect to **Vercel** and set the following environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `ADMIN_EMAIL`
3. Push to main branch — Vercel handles the deployment
4. Test the live form, login, and content updates!

---

## 💡 Highlights

- 💬 Real-time contact handling
- 🔐 Secure admin authentication
- 📄 Editable project/blog content from the database
- 📩 Automated emails to admin & user on submission
- ⚡ Fully serverless — no backend server to maintain

---

## 👨‍💻 Built By

**Adrian Obadiah**  
For the [Future Interns Full Stack Internship](https://futureinterns.com)

📫 [adrianobadiah4@gmail.com](mailto:adrianobadiah4@gmail.com)

---

## 📎 Tags

`#React` `#Supabase` `#Serverless` `#Vercel` `#Portfolio` `#FullStack` `#Internship`
