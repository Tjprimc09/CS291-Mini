# SkyMesh Command Reference

## 1. Connect to AWS EC2

From Windows PowerShell:

```powershell
cd "$HOME\Downloads"
ssh -i "SkyMesh-Key.pem" ec2-user@18.221.182.216
```

The SSH hostname must match the instance's current public DNS name.

## 2. Activate the local Python virtual environment

From Windows PowerShell:

```powershell
cd "C:\Users\Tyler Prince\OneDrive\Desktop\School\CS291"
.\.venv\Scripts\Activate.ps1
```

## 3. Start the local Flask backend

In the same terminal, with the virtual environment activated:

```powershell
python -m flask --app app run
```

Backend: http://127.0.0.1:5000

## 4. Run the frontend development server

In a separate PowerShell terminal:

```powershell
cd "C:\Users\Tyler Prince\OneDrive\Desktop\School\CS291\frontend"
npm run dev
```

Frontend: http://localhost:5173

## 5. Build the frontend for production

In a separate PowerShell terminal:

```powershell
cd "C:\Users\Tyler Prince\OneDrive\Desktop\School\CS291\frontend"
npm run build
```

Build output: `frontend/dist/`

## Notes

- Keep Flask and Vite running in separate terminals during local development.
- Press `Ctrl+C` to stop either development server.
- The EC2 production backend is managed by systemd and Gunicorn. The Flask development command above is for local use.
