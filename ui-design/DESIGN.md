---
name: LANGFANG_OPS 廊坊运营
description: 骑手垃圾单标记与配送难点排行移动应用设计规范
version: 1.0.0
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4beb9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8985'
  outline-variant: '#5b403d'
  surface-tint: '#ffb4ac'
  primary: '#ffb4ac'
  on-primary: '#690006'
  primary-container: '#ff544c'
  on-primary-container: '#5c0005'
  inverse-primary: '#bb171c'
  secondary: '#7ddc7a'
  on-secondary: '#00390a'
  secondary-container: '#03711e'
  on-secondary-container: '#92f28e'
  tertiary: '#ffba38'
  on-tertiary: '#432c00'
  tertiary-container: '#c08600'
  on-tertiary-container: '#3a2600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#98f994'
  secondary-fixed-dim: '#7ddc7a'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#ffdeac'
  tertiary-fixed-dim: '#ffba38'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-xl:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
  data-display:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 48px
  edge-margin: 16px
  touch-target-min: 48px
---

## 品牌与风格

**廊坊运营 (LANGFANG_OPS)** 是为城市配送骑手打造的高风险任务型应用。品牌个性： rugged（粗犷）、utilitarian（实用主义）、uncompromisingly functional（绝对功能性优先）。

视觉风格借鉴 **Brutalism（粗野主义）** 与 **High-Contrast（高对比度）** 运动。优先信息密度和辨识度，而非装饰性。界面应如同重型机械或专业战术工具——原始、高效、耐用。

## 色彩系统

色彩为功能性服务，高对比度信号用于即时传达难度和危险等级：

| 用途 | 色值 | 说明 |
|------|------|------|
| 危险/高难度 | `#ff544c` / `#ffb4ab` | 警示红，用于危险区域、严重警告 |
| 安全/低难度 | `#7ddc7a` / `#98f994` | 安全绿，用于安全路线、已完成任务 |
| 注意/中难度 | `#ffba38` / `#ffdeac` | 警示黄，用于中度难度、次要警告 |
| 背景 | `#131313` | 深工业黑，减少夜间眩光 |
| 卡片表面 | `#201f1f` | 略浅灰，创建结构分层 |

## 字体规范

采用双字体策略平衡技术感与可读性：

- **Space Grotesk**：标题、数据点、标签。其几何感、机械感强化工业美学
- **Inter**：正文和描述性内容。保证小字号下的最大可读性

关键信息默认使用白色高对比度。

## 布局与间距

基于 **Fluid Grid（流式网格）** 布局，配合大触摸目标适应戴手套操作：

- **边距**：固定 16px 边缘距，确保内容不超出屏幕
- **节奏**：8px 基础网格管理所有垂直节奏
- **触摸区域**：所有交互元素最小高度 48px
- **间距**：卡片间 12px 间距

## 仰角与深度

通过 **粗边框** 和 **色调层级** 传达深度，避免阴影（户外高亮屏上会显得浑浊）：

- **Level 0**：`#121212` 最深背景
- **Level 1**：`#201f1f` 卡片 + 2px solid `#353534` 边框
- **激活状态**：高可见度边框色（红色或绿色）表示聚焦或"执勤"状态
- **凹陷深度**：输入框使用内嵌线条，暗示"嵌入"界面

## 形状语言

"Soft-Industrial"——小圆角（0.25rem）改善屏幕耐久性和模块识别度：

- **标准容器**：`rounded`（4px）用于大多数卡片和按钮
- **状态标签**：`rounded-lg`（8px）用于状态指示，区别于交互按钮
- **地图标记**：使用菱形（diamond）表示难度节点

## 组件规范

### 按钮
大块按钮。主按钮使用警示红或安全绿实心填充 + 黑色文字。次按钮使用 2px 虚线边框。

### 工业卡片
"Header-Well"结构：顶部标题+难度分，主体技术数据（ETA、地形、交通）。边框始终可见，2px 粗。

### 地图标记
高可见度菱形。高难度标记带脉冲效果或警戒条纹边框。低难度标记为简单绿色菱形。

### 输入框
深色背景，2px 边框。错误时变红，合法输入时变绿。内部字号放大（body-lg）便于验证。

### 状态标签
小高对比度徽章，使用大写 Space Grotesk。如"陡坡"、"交通拥堵"、"简单路线"。

### 进度条
12px 厚条，使用分段块（类似电池指示器）而非平滑填充，强化粗犷数字美学。

## 页面结构

### 1. 地图首页 (_4)
骑手主仪表盘，集成高德地图，显示：
- 全城垃圾单指数（87/100）
- 黑榜分布热力图
- 实时风险预警列表
- 浮动操作按钮「标记垃圾单」

### 2. 标记垃圾单 (_2)
上报界面，用于标记困难订单：
- 当前位置识别（高德定位）
- 取餐难点选择（商场难找、出餐慢、态度恶劣等）
- 送餐难点选择（无电梯、门禁严格、坡度陡等）
- 订单性价比（单价极低、大件重物等）
- 提交按钮

### 3. 配送难点排行 (_3)
全城高难度配送点排名：
- 日排行 / 区域排行切换
- 排名卡片显示：位置、难点标签、危险指数
- 搜索功能

### 4. 我的档案 (_1)
骑手个人中心：
- 头像 + 认证状态
- 数据统计（累计标记、信誉分、排名）
- 进度条（下一等级还需积分数）
- 操作列表（我的标记、帮助中心、设置）
- 退出登录

## 导航结构

底部导航栏（移动端），4个Tab：
- 地图（首页）
- 上报（标记）
- 排行榜
- 我的（档案）

顶部应用栏：LANGFANG_OPS Logo + 用户头像

## 技术实现

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **后端**：Next.js API Routes + Supabase
- **地图**：高德地图 JavaScript API / AMap JS API
- **部署**：Vercel
- **数据库**：Supabase PostgreSQL
