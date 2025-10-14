# Backend Setup Guide

## Overview
- **Framework**: ASP.NET Core 8.0
- **Database**: SQLite3
- **ORM**: ADO.NET (Raw SQL queries)
- **Package Manager**: NuGet

## Prerequisites

### 1. .NET 8.0 SDK
**Required Version**: 8.0.414 (specified in `global.json`)

**Installation via Homebrew**:
```bash
brew install --cask dotnet-sdk@8
```

**Verify Installation**:
```bash
dotnet --version
dotnet --list-sdks
```

Expected output: `8.0.414`

### 2. SQLite3
SQLite3 is typically pre-installed on macOS. Verify with:
```bash
which sqlite3
sqlite3 --version
```

## Project Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Restore NuGet Packages
```bash
dotnet restore
```

This will install:
- `Microsoft.Data.Sqlite` v9.0.9

### 3. Build the Project
```bash
dotnet build
```

### 4. Run the Backend Server
```bash
dotnet run
```

The API will start on:
- **HTTPS**: https://localhost:5001
- **HTTP**: http://localhost:5000

## Database Configuration

### Database Location
```
backend/Database/Karate.db
```

### Connection String
Configured in `appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=Database/Karate.db;"
}
```

### Database Schema
Tables:
- **Dojo**: General dojo information (hero section data)
- **Subscribers**: Newsletter subscribers
- **Programs**: Martial arts classes/programs
- **Instructor**: Team members and instructors
- **HighLights**: "What We Do" highlights section

### Database Schema SQL
See `backend/Database/dojo.sql` for full schema definition.

### Verify Database
```bash
cd backend
sqlite3 Database/Karate.db ".tables"
```

Expected output: `Dojo  HighLights  Instructor  Programs  Subscribers`

## CORS Configuration

The backend is configured to allow requests from the frontend:

**Allowed Origin**: `http://127.0.0.1:5500`

To change the allowed origin, edit `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
                .WithOrigins("http://127.0.0.1:5500")  // Change this
                .AllowAnyHeader()
                .AllowAnyMethod()
    );
});
```

## Development Commands

### Build
```bash
dotnet build
```

### Run
```bash
dotnet run
```

### Watch Mode (Auto-reload on changes)
```bash
dotnet watch run
```

### Clean Build Artifacts
```bash
dotnet clean
```

### Restore Packages
```bash
dotnet restore
```

## HTTPS Development Certificate

On first run, .NET installs a development HTTPS certificate. To trust it:
```bash
dotnet dev-certs https --trust
```

## Environment Configuration

### Development Settings
`appsettings.Development.json` - Used when `ASPNETCORE_ENVIRONMENT=Development`

### Production Settings
`appsettings.json` - Default settings

## Troubleshooting

### Port Already in Use
If ports 5000/5001 are already in use, modify `Properties/launchSettings.json` or specify a different port:
```bash
dotnet run --urls "http://localhost:5050;https://localhost:5051"
```

### Database Access Issues
Ensure the database file exists and has proper permissions:
```bash
ls -la backend/Database/Karate.db
chmod 644 backend/Database/Karate.db  # If needed
```

### Package Restore Issues
Clear NuGet cache and restore:
```bash
dotnet nuget locals all --clear
dotnet restore
```

## Project Structure

```
backend/
├── Controllers/        # API Controllers
├── DAL/               # Data Access Layer
├── Database/          # SQLite database and schema
│   ├── Karate.db
│   └── dojo.sql
├── Models/            # Data models
├── Properties/        # Launch settings
├── Program.cs         # Application entry point
├── appsettings.json   # Configuration
└── backend.csproj     # Project file
```

## API Endpoints

The backend exposes RESTful API endpoints through controllers in the `Controllers/` directory. Check individual controller files for specific endpoints.

## Notes

- This project uses **ADO.NET** for database operations (no ORM)
- All SQL queries are written manually in the Data Access Layer
- Database is SQLite3, stored as a file
- CORS is configured for local development
- The project targets .NET 8.0 specifically

## Next Steps

1. Populate the database with initial data if needed
2. Review API endpoints in the Controllers directory
3. Test API endpoints using the frontend or tools like Postman/curl
4. Check logs for any startup issues
