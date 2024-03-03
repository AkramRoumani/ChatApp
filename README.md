# Socket Chat Application

## Project Description
This project is a real-time chat application built using Node.js, Express, and Socket.io. It allows users to communicate in real-time through various chat rooms. The application supports features like user login, room creation, and real-time messaging.

## Author
This project was developed by the following team members:
- **Akram ROUMANI**

## Features
- **Real-Time Chat:** Users can send and receive messages instantly.
- **Chat Rooms:** Supports multiple chat rooms for different conversation topics.
- **User Login:** Simple login interface with username and avatar selection.
- **Room Creation:** Users can create new chat rooms.
- **Private Messaging:** Support for sending private messages between users.
- **Online Users List:** Displays a list of users currently online in a chat room.
- **Typing Indicators:** Shows when a user is typing a message.

## How to Run the Application

### Prerequisites
- Node.js and npm: These are required to run the application. If you don't have Node.js and npm installed, download and install them from the [Node.js official website](https://nodejs.org/).

### Installation and Setup
1. **Clone the Repository:** Clone the project to your local machine.
    ```bash
    git clone [repository-url]
    ```
2. **Navigate to the Project Directory:**
    ```bash
    cd \socket-chat-example
    ```
3. **Install Dependencies:** Use the Makefile to install all required Node.js packages.
    ```bash
    make install
    ```

### Running the Application
- Use the Makefile to start the application:
    ```bash
    make run
    ```
  This command starts the server. Then, open a web browser and navigate to [http://localhost:3000/login.html](http://localhost:3000/login.html) to access the chat application.

- **Note:** If you don't have `make` installed, you can directly use the following commands based on your operating system:

  - **Linux or macOS:**
    ```bash
    npm install
    node index.js
    ```

  - **Windows:**
    ```bash
    npm install
    node index.js
    ```

### Using the Makefile
- The Makefile includes several commands to simplify the process of running the application:
  - `make check-node`: Verifies if Node.js and npm are installed.
  - `make install`: Installs the necessary Node.js packages.
  - `make run`: Starts the chat application.

**Note:** Make sure to replace `[repository-url]` with the actual URL of your Git repository. Adjust the instructions as necessary to match the specifics of your project setup.

**Important:** If you don't have `make` set up on your system, use the provided commands directly as mentioned above.
