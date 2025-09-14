@echo off
echo Starting Tourist Verification Blockchain Network...

:: Create data directory
md "..\src\data" 2>nul

:: Initialize blockchain file
if not exist "..\src\data\blockchain.json" (
    echo [] > "..\src\data\blockchain.json"
    echo Initialized empty blockchain
) else (
    echo Found existing blockchain file
)

:: Install dependencies
call npm install crypto fs-extra path --save

echo.
echo Blockchain network initialized successfully!
echo Blockchain file location: ..\src\data\blockchain.json
pause