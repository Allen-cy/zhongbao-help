# LANGFANG_OPS - 廊坊运营

骑手垃圾单标记与配送难点排行移动应用

## 技术栈
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes + Supabase
- **地图**: 高德地图 JavaScript API
- **部署**: Vercel

## 环境变量
复制 `.env.local.example` 为 `.env.local` 并填入:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_AMAP_KEY` (已配置: 21a86f420ac2cb8b6d686c153ef1e497)
- `NEXT_PUBLIC_AMAP_SECURITY_KEY` (已配置: 432a8c672ebdf8818253a819446d54ef)

## 数据库
运行 `supabase-schema.sql` 在 Supabase SQL 编辑器中创建表结构。

## 开发
```bash
npm install
npm run dev
```

## 页面
- `/` - 地图首页 (集成高德地图)
- `/report` - 标记垃圾单
- `/ranking` - 配送难点排行
- `/profile` - 我的档案
