# Chat App Features

## Features

### Private Chat Room
- Users can create private chat rooms for one-on-one conversations.
- Private chat rooms are only accessible to invited users.

### Global Chat Room
- The app includes a global chat room where all users can participate.

### Stores Private Chat Room
- The app stores private chat room history securely for users to access later.

### Option to Login Anonymously
- Users have the option to log in anonymously, ensuring privacy and security.

### Login/Register Page
- The app includes pages for user login and registration.

### Responsive UI
- The user interface of the app is responsive, ensuring optimal viewing and interaction experience across different devices and screen sizes.

### Socket.io Integration
- The app utilizes Socket.io to enable real-time communication between users.
- Socket connections are managed efficiently to save space and resources.

### Automatic Image Selection
- The app automatically selects an image based on the room name, adding visual appeal and personalization to chat rooms.

### User Management
- Logged-in users can join existing chat rooms or create new ones.
- Users can view a list of rooms they have joined or created.

## Video Demo
[![Chat App Video Demo](images/MainPage.png)](https://youtu.be/QlszQE3o6Xo)


## Screenshots
- Main Page
    ![Main Page](images/MainPage.png)
- Chat Page
    ![Chat Page](images/Rooms.png)
- Login Page
     ![Login Page](images/LoginMobile.png)
- Register Page
     ![Register Page](images/Register.png)
- Rooms List
  ![Rooms List](images/RoomsList.png)


## Login Credentials
- Username: notpritam
- Password: 123

# Setup Instructions

.env details for frontend directory

```
SITE_URL=http://localhost:3001/api/
```
.env.local details for backend directory
```
MONGO_URI="mongodb+srv://notpritamsharma:SMqDpPT5n1KaESiq@cluster0.9xbrbrd.mongodb.net/?retryWrites=true&w=majority"
JWT_SECRET="SMqDpPT5n1KaESiq"
PORT=3001
```

```bash
cd backend
npm i
npm start
cd ../frontend
npm i
npm run dev
```


