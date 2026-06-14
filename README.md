# Puzzly

Puzzly is a collaborative puzzle application with a web companion, an
offline-first React Native mobile app, and a Firebase backend.

## Current Implementation

### Web Companion

- Responsive Next.js puzzle dashboard
- Interactive puzzle pieces and puzzle progress
- Collaborator management and session controls
- Typed puzzle, user, and collaboration services

### Mobile App

- Offline-first React Native puzzle experience
- Home, puzzle, collaboration, and profile screens
- Local puzzle and user state without requiring Firebase credentials
- Realtime and Firebase service contracts ready for backend integration

### Firebase Backend

- Callable Functions for profiles, puzzles, and collaborative sessions
- Session joining, leaving, ending, and completion tracking
- Realtime Database and Storage security rules
- Local Auth, Functions, Database, Storage, Hosting, and Emulator UI support

## Currently Supported Devices

| Platform | Current Support |
| --- | --- |
| Desktop and mobile web browsers | Supported through the responsive Next.js companion site |
| iPhone and iPad | Supported by the React Native iOS project and verified Metro bundle |
| Android phones and tablets | React Native target is configured, but a native Android project and device build are not currently included |

## Run Locally

From the repository root on Windows:

```powershell
.\scripts\start-local.cmd -Install
```

Local services bind to external interfaces for development:

- Web companion: `http://localhost:3000`
- Firebase Emulator UI: `http://localhost:4000`
- Firebase Hosting: `http://localhost:5000`
- Firebase Functions: port `5001`
- Firebase Realtime Database: port `9000`
- Firebase Auth: port `9099`
- Firebase Storage: port `9199`

## Project Structure

```text
puzzly/
|-- mobile/                     # React Native mobile app
|-- campnion-site/              # Next.js web companion
|-- database/firebase/          # Firebase Functions, rules, and emulator config
`-- scripts/                    # Local development launchers
```
