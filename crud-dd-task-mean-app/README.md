# 🚀 MEAN Stack DevOps Deployment with CI/CD

## 📌 Project Title

Full-Stack MEAN Application Deployment with Docker, Nginx Reverse Proxy, GitHub Actions CI/CD, and AWS EC2

---

## 🎯 Objective

To containerize and deploy a full-stack MEAN (MongoDB, Express, Angular, Node.js) application using Docker and automate the build and deployment process using GitHub Actions CI/CD to an Ubuntu EC2 instance on AWS.

---

## 🏗️ Architecture Overview

```
Developer
   ↓
GitHub Repository
   ↓
GitHub Actions (CI/CD)
   ↓
Docker Hub (Image Registry)
   ↓
AWS EC2 (Ubuntu)
   ↓
Docker Compose
   ↓
Nginx Reverse Proxy (Port 80)
   ↓
MEAN Application (MongoDB + Backend + Frontend)
```

---

## 🧰 Tech Stack

* Frontend: Angular 15
* Backend: Node.js + Express
* Database: MongoDB
* Containerization: Docker
* Orchestration: Docker Compose (v2)
* Reverse Proxy: Nginx
* CI/CD: GitHub Actions
* Cloud: AWS EC2 (Ubuntu 22.04)
* Image Registry: Docker Hub

---

## 📂 Project Structure

```
mean-crud-dd-task/
│
├── crud-dd-task-mean-app/
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│
├── docker-compose.yml
├── nginx.conf
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 🐳 Dockerization

### Backend Dockerfile

* Uses Node 18 Alpine
* Installs dependencies
* Exposes port 8080
* Runs via `npm start`

### Frontend Dockerfile (Multi-Stage Build)

* Stage 1: Builds Angular app
* Stage 2: Uses Nginx Alpine to serve static build
* Optimized production build

---

## 🔄 Docker Compose Configuration

Services:

* mongodb
* backend
* frontend
* nginx (reverse proxy on port 80)

Reverse proxy routes:

* `/` → Angular frontend
* `/api` → Node backend

---

## 🌍 Cloud Deployment (AWS EC2)

* Instance Type: t2.micro
* OS: Ubuntu 22.04
* Ports Open:

  * 22 (SSH)
  * 80 (HTTP)

Deployment folder on EC2:

```
/home/ubuntu/mean-app
```

Application accessible via:

```
http://<EC2_PUBLIC_IP>
```

---

## 🔁 CI/CD Pipeline (GitHub Actions)

Workflow Trigger:

```
Push to master branch
```

Pipeline Steps:

1. Checkout repository
2. Login to Docker Hub
3. Build backend image
4. Build frontend image
5. Push images to Docker Hub
6. SSH into EC2
7. Pull latest images
8. Restart containers using Docker Compose

Deployment is fully automated on every push.

---

## 🔐 GitHub Secrets Used

* DOCKER_USERNAME
* DOCKER_PASSWORD (Docker Access Token)
* VM_IP
* SSH_PRIVATE_KEY

Sensitive credentials are securely managed using GitHub Repository Secrets.

---

## 🚦 Deployment Flow

1. Developer pushes code
2. GitHub Actions builds new Docker images
3. Images pushed to Docker Hub
4. EC2 server pulls updated images
5. Containers restart automatically
6. Application updates live

---

## 📸 Screenshots (To Include)

Add screenshots of:

* GitHub Actions successful run
* Docker Hub repositories (frontend + backend)
* EC2 `docker ps` output
* Security Group inbound rules
* Application running in browser

---

## ⚠️ Challenges Faced & Resolved

* Docker Compose v1 compatibility issue (ContainerConfig error)
* Migration to Docker Compose v2 plugin
* SSH authentication configuration
* CI pipeline path correction for nested folders
* Docker Hub non-interactive login issue

---

## 📚 Key Learnings

* Difference between Docker Compose v1 and v2
* Handling container name conflicts
* Managing CI/CD secrets securely
* Reverse proxy routing with Nginx
* Cloud networking and Security Groups
* Automating full-stack deployments

---

## ✅ Conclusion

This project demonstrates:

* End-to-end containerization of a full-stack application
* Secure cloud deployment on AWS
* Production-grade reverse proxy setup
* Fully automated CI/CD pipeline

The system now supports zero-touch deployments through GitHub Actions.

Here is the main part where:-
 *What broke
 *Why it broke
 *How I diagnosed it
 *How I fixed it

Good. This is smart.

Interviewers don’t just want “what you built.”
They want:

* What broke
* Why it broke
* How you diagnosed it
* How you fixed it
# ⚠️ Issues Faced & How They Were Resolved

## 1️⃣ Incorrect Git Branch Trigger

**Problem:**
GitHub Actions did not trigger because workflow was set for `main` while repository default branch was `master`.

**Root Cause:**
Branch mismatch in workflow trigger.

**Fix:**
Updated workflow configuration:

```yaml
on:
  push:
    branches:
      - master
```

**Learning:**
CI/CD pipelines must match repository branch strategy.

---

## 2️⃣ Docker Build Context Path Error

**Problem:**
CI failed with:

```
path "./backend" not found
```

**Root Cause:**
Project had nested structure:

```
crud-dd-task-mean-app/backend
```

Workflow was referencing incorrect relative path.

**Fix:**
Updated build path in workflow:

```yaml
docker build -t virtualverse/mean-backend:latest ./crud-dd-task-mean-app/backend
```

**Learning:**
CI runners use repository root as working directory — paths must be relative to that.

---

## 3️⃣ Docker Hub Login Failure (Non-TTY Error)

**Problem:**
GitHub Actions failed with:

```
Cannot perform an interactive login from a non TTY device
```

**Root Cause:**
Used interactive `docker login` instead of non-interactive login.

**Fix:**
Implemented secure login using `--password-stdin`:

```yaml
echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
```

**Learning:**
CI environments require non-interactive authentication.

---

## 4️⃣ Docker Compose v1 Compatibility Error

**Problem:**
Deployment failed on EC2 with:

```
KeyError: 'ContainerConfig'
```

**Root Cause:**
Old `docker-compose 1.29.2` incompatible with newer Docker Engine.

**Fix:**
Removed legacy docker-compose and installed Docker Compose v2 plugin:

```bash
sudo apt remove docker-compose
sudo apt install docker-compose-plugin
```

Updated commands to:

```bash
docker compose up -d
```

**Learning:**
Tooling version compatibility is critical in production environments.

---

## 5️⃣ Container Name Conflict

**Problem:**
After upgrading Docker, containers failed with:

```
Conflict. The container name is already in use
```

**Root Cause:**
Old containers still existed from previous Docker installation.

**Fix:**
Cleaned environment:

```bash
docker compose down
docker rm -f $(docker ps -aq)
```

**Learning:**
Always clean stale containers when changing runtime versions.

---

## 6️⃣ SSH Key Path Issue

**Problem:**
SSH failed with:

```
Identity file not accessible
```

**Root Cause:**
Incorrect file path used for private key.

**Fix:**
Used full path to PEM file:

```bash
ssh -i /c/Users/SHARANYA/Downloads/mean.pem ubuntu@<public-ip>
```

**Learning:**
File path context matters in CLI operations.

---

## 7️⃣ Docker Daemon Not Running

**Problem:**
Compose failed with:

```
Cannot connect to the Docker daemon
```

**Root Cause:**
Docker service not started after installation.

**Fix:**

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

**Learning:**
Infrastructure setup must include service verification.
