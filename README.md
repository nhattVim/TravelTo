<div align="center">
    <h1>TravelTo</h1>
    <p><em>A modern, full-stack web application designed for travel experiences. Built with a robust Spring Boot backend and a dynamic Next.js frontend, featuring interactive maps, AI integrations, and responsive animations</em></p>
    <h1></h1>
</div>

<div align="center">
    <table>
        <tr>
            <td><img src="https://github.com/nhattVim/assets/blob/master/TravelTo/1.png?raw=true"/></td>
            <td><img src="https://github.com/nhattVim/assets/blob/master/TravelTo/2.png?raw=true"/></td>
        </tr>
    </table>
    <table>
        <tr>
            <td><img src="https://github.com/nhattVim/assets/blob/master/TravelTo/3.png?raw=true"/></td>
            <td><img src="https://github.com/nhattVim/assets/blob/master/TravelTo/4.png?raw=true"/></td>
            <td><img src="https://github.com/nhattVim/assets/blob/master/TravelTo/5.png?raw=true"/></td>
        </tr>
    </table>
</div>

## 🚀 Tech Stack

### Frontend (`/fe`)
- **Framework:** Next.js 16 (App Router) & React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 & Framer Motion (for animations)
- **Features:** 
  - Interactive maps via `react-leaflet`
  - AI integrations via `@ai-sdk` (Vercel AI SDK)
  - Data visualization via `recharts`
  - Authentication via `next-auth` (v5 beta)
- **Package Manager:** pnpm

### Backend (`/be`)
- **Framework:** Spring Boot 4.0.x
- **Language:** Java 21
- **Security:** Spring Security & JWT (JSON Web Tokens)
- **Database:** Spring Data JPA with H2 (Development) and MySQL (Production)
- **Build Tool:** Maven
- **Utilities:** Lombok, Spring Boot Actuator, Spring Mail

## 📁 Project Structure

```text
TravelTo/
├── be/                 # Java Spring Boot Backend application
│   ├── src/            # Source code and application properties
│   ├── pom.xml         # Maven dependencies
│   └── Dockerfile      # Docker configuration for containerization
├── fe/                 # Next.js Frontend application
│   ├── src/            # Application source code (components, app layout)
│   ├── public/         # Static assets
│   └── package.json    # Node dependencies and scripts
└── README.md           # Project documentation
```

## 🛠️ Getting Started

### Prerequisites
- **Java:** JDK 21 or higher
- **Node.js:** v20 or higher
- **pnpm:** Installed globally (`npm install -g pnpm`)

### 1. Starting the Backend

Navigate to the backend directory and run the Spring Boot application using the Maven wrapper:

```bash
cd be

# On Windows
mvnw.cmd spring-boot:run

# On macOS/Linux
./mvnw spring-boot:run
```
The backend server will typically start on `http://localhost:8080`.

### 2. Starting the Frontend

Navigate to the frontend directory, install dependencies, and start the development server:

```bash
cd fe

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```
The frontend application will be accessible at `http://localhost:3000`.

## 🐳 Docker Deployment

The backend application is Docker-ready. To build and run the backend container:

```bash
cd be
docker build -t travelto-backend .
docker run -p 8080:8080 travelto-backend
```

## 🤝 Contributing
Ensure you follow the established linting rules (`pnpm lint` in the frontend) and maintain code quality standards before submitting any pull requests.
