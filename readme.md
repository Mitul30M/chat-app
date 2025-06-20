# Direct Messaging - Real-Time Chat App

A full-stack real-time chat application built with **React** (client), **Node.js/Express** (server), **MongoDB** (database), and **Passport.js** for authentication. Real-time messaging is powered by **Socket.IO**.

---

## Features

- **Real-Time Messaging:** Instant direct and channel-based messaging using WebSockets.
- **Authentication:** Secure login/signup with Passport.js (local & Google OAuth).
- **User Profiles:** Editable profile with avatar upload (Cloudinary integration).
- **File Sharing:** Send and download files in chat.
- **Channels & DMs:** Create channels or direct message users.
- **Responsive UI:** Modern, mobile-friendly interface with Tailwind CSS.
- **Notifications:** Toast notifications for actions and errors.
- **Protected Routes:** Only authenticated users can access chat and profile pages.

---

## Tech Stack

- **Frontend:** React, Vite, Zustand, Tailwind CSS, Radix UI, Sonner, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Passport.js, Socket.IO, Cloudinary
- **Authentication:** JWT (access & refresh tokens), Passport Local & Google OAuth
- **File Uploads:** Multer, Cloudinary

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Clone the Repository

```sh
git clone https://github.com/<your-username>/direct-messaging-app.git
cd direct-messaging-app
```

### Install Dependencies

```sh
npm install
```

### Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```
MONGODB_URI=your_mongodb_uri
CLOUDINARY_URL=your_cloudinary_url
JWT_SECRET=your_jwt_secret
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
```

### Run the Development Server

```sh
npm run dev
```

### Access the App

- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:5000](http://localhost:5000)

---

## Usage

1. **Register/Login:** Create an account or log in.
2. **Edit Profile:** Update your profile information and upload an avatar.
3. **Create Channels:** Start a new channel for group messaging.
4. **Direct Messaging:** Send direct messages to other users.
5. **File Sharing:** Upload and share files in chats.
6. **Notifications:** Check notifications for messages and alerts.

---

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by the need for a real-time communication tool.
- Built as a personal project to explore MERN stack capabilities.
- Thanks to the open-source community for their invaluable resources and tools.

---

## Contact

- **Your Name** - [your_email@example.com](mailto:your_email@example.com)
- **GitHub:** [your_github_username](https://github.com/your_github_username)
- **LinkedIn:** [your_linkedin_profile](https://linkedin.com/in/your_linkedin_profile)

