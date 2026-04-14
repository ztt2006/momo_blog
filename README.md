# Momo Blog

一个基于 `React 19 + TypeScript + Tailwind CSS + shadcn/ui + FastAPI + PostgreSQL + SQLAlchemy 2.0` 的个人博客项目，包含：

- `frontend`：读者前台
- `admin`：后台管理端
- `backend`：API、认证、文章管理、站点设置、媒体上传、SEO 输出

## 本地开发

### 1. 后端

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
python -m app.scripts.create_admin --username admin --email admin@example.com --password admin123 --nickname Admin
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. 前台

```bash
cd frontend
copy .env.example .env
pnpm install
pnpm dev
```

### 3. 后台

```bash
cd admin
copy .env.example .env
pnpm install
pnpm dev
```

默认本地地址：

- 前台：`http://localhost:5173`
- 后台：`http://localhost:5174`
- API：`http://127.0.0.1:8000`

## 生产环境变量

### backend/.env

最关键的生产变量：

- `DATABASE_URL`：PostgreSQL 连接串
- `SECRET_KEY`：JWT 签名密钥，必须替换
- `CORS_ORIGINS`：前台与后台正式域名
- `UPLOAD_DIR`：媒体文件落盘目录
- `SITE_URL`：前台正式域名，影响 `sitemap.xml`、`robots.txt`、`rss.xml`

### frontend/.env

```bash
VITE_API_BASE_URL=https://api.example.com/api
```

### admin/.env

```bash
VITE_API_BASE_URL=https://api.example.com/api
```

## 上线步骤

### 1. 准备数据库

```bash
cd backend
alembic upgrade head
```

### 2. 初始化管理员

```bash
cd backend
python -m app.scripts.create_admin --username admin --email admin@example.com --password "strong-password" --nickname Admin
```

重复执行会更新已有管理员账号，而不是重复创建。

### 3. 构建前端

```bash
cd frontend
pnpm install
pnpm build

cd ../admin
pnpm install
pnpm build
```

构建产物：

- `frontend/dist`
- `admin/dist`

### 4. 启动后端

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 5. 配置反向代理

可以直接参考：

- `deploy/nginx/momo_blog.conf.example`

推荐域名划分：

- `blog.example.com` -> `frontend/dist`
- `admin.example.com` -> `admin/dist`
- `api.example.com` -> FastAPI

## SEO 与公开文件

后端会动态输出：

- `/sitemap.xml`
- `/robots.txt`
- `/rss.xml`

这些地址依赖 `backend/.env` 中的 `SITE_URL`。

## 上线检查清单

- 已替换 `SECRET_KEY`
- 已切换正式 `DATABASE_URL`
- 已执行 `alembic upgrade head`
- 已创建管理员账号
- 已设置前后台 `VITE_API_BASE_URL`
- 已确认 `SITE_URL` 为正式前台域名
- 已开放 `UPLOAD_DIR` 读写权限
- 已把 `CORS_ORIGINS` 改为正式域名

## 常用命令

```bash
cd backend
python -m unittest

cd ../frontend
pnpm test
pnpm build

cd ../admin
pnpm test
pnpm build
```
