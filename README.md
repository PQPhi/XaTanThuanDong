# XaTanThuanDong - Huong Dan Cai Dat Va Chay Du An

Tai lieu nay huong dan cai dat va khoi dong:

- Backend API (.NET)
- Frontend Admin Portal (React + Vite)
- Frontend Web nguoi dung (React + Vite)
- Swagger

## 1. Yeu cau moi truong

- Windows 10/11
- .NET SDK 9.x (hoac dung ban .NET theo file .csproj)
- Node.js LTS 18+ (khuyen nghi 20+)
- SQL Server (co quyen tao/cap nhat database)

Kiem tra phien ban:

```powershell
dotnet --version
node -v
npm -v
```

Luu y tren PowerShell Windows neu gap loi `npm.ps1 cannot be loaded`, dung `npm.cmd` thay cho `npm`.

## 2. Cau hinh backend

Mo file:

- `backend/XaTanThuanDong.Api/appsettings.Development.json`

Cap nhat chuoi ket noi trong `ConnectionStrings:DefaultConnection` theo SQL Server may ban.

Vi du:

```json
"ConnectionStrings": {
	"DefaultConnection": "Server=TEN_MAY;Database=TTD;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

## 3. Cai dat dependencies

Chay lan luot 3 lenh sau tu thu muc goc du an:

```powershell
cd backend/XaTanThuanDong.Api
dotnet restore

cd ../../frontend/xatanthuandong-portal
npm.cmd install

cd ../xatanthuandong-web
npm.cmd install
```

## 4. Khoi dong du an (Development)

Can 3 terminal rieng.

### Terminal 1 - Backend API

```powershell
cd backend/XaTanThuanDong.Api
dotnet run
```

Backend mac dinh:

- http://localhost:5116

Luu y: ung dung se tu dong migrate va seed du lieu khi chay lan dau.

### Terminal 2 - Frontend Admin Portal

```powershell
cd frontend/xatanthuandong-portal
npm.cmd run dev
```

Admin Portal:

- http://localhost:5174

### Terminal 3 - Frontend Web nguoi dung

```powershell
cd frontend/xatanthuandong-web
npm.cmd run dev
```

Frontend Web:

- http://localhost:5173

## 5. Swagger

Sau khi backend chay thanh cong, mo:

- http://localhost:5116/swagger

## 6. Build production

Backend:

```powershell
cd backend/XaTanThuanDong.Api
dotnet build -c Release
```

Frontend Admin:

```powershell
cd frontend/xatanthuandong-portal
npm.cmd run build
```

Frontend Web:

```powershell
cd frontend/xatanthuandong-web
npm.cmd run build
```

## 7. Cac loi thuong gap

- Loi `npm.ps1 cannot be loaded`: dung `npm.cmd`.
- Swagger khong mo duoc: kiem tra backend da chay dung cong `5116`.
- Loi ket noi database: kiem tra lai `DefaultConnection` va quyen truy cap SQL Server.
