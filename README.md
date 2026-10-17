# 木木跳绳 Mumu Jump Rope

面向 iPad Safari 的本地摄像头跳绳训练 Web App。Vite + TypeScript + MediaPipe Pose Landmarker，无账号、后端或付费 API。

## 本地运行

需要 Node.js 24 和 pnpm 10+：

```sh
pnpm install
node scripts/prepare-assets.mjs
pnpm dev
```

电脑打开终端显示的 localhost 地址。iPad 访问局域网 HTTP 地址不能取得摄像头权限；请部署到 GitHub Pages HTTPS，或自行配置可信的本地 HTTPS。

```sh
pnpm test
pnpm build
pnpm preview
```

模型准备脚本从 Google 官方存储下载固定 lite 模型，并从安装包复制 WASM 到 public。构建产物内包含全部运行资产，没有运行时 CDN、字体服务或视频上传。首次打开需要下载约数十 MB 静态文件；未实现离线缓存。

## GitHub Pages 部署

1. 将本目录内容推送到 GitHub 仓库的 `main` 分支。
2. 仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
3. `.github/workflows/deploy.yml` 自动安装、准备模型、测试、构建并部署。也可手动运行 workflow。
4. 使用部署页面提供的 HTTPS 链接在 iPad Safari 打开。Vite 使用相对 base，支持仓库子路径。

部署仓库：https://github.com/Blake027/mumu-jump 。模型与 WASM 为构建时准备的静态资源，不提交生成文件。

## 使用

- 稳固放置 iPad，保持光线充足、单人入镜，确保头部和双脚有余量。打开摄像头，允许 Safari 权限。可在训练前切换镜头。
- 全身可见后站稳约 1 秒。1 分钟测试：3 秒倒计时，计满 60 秒自动保存；自由跳：倒计时后开始，可暂停、继续和结束。
- 训练中可用 + / − 修正，静音按钮随时可切换。暂停不计时、不计数。丢失人体仅停止计数，计时继续；切到后台会自动暂停（倒计时会取消），返回后手动继续。
- 成绩保存在当前浏览器 localStorage，最多最近 1000 条；清理网站数据或更换设备不会保留成绩。存储失败会在成绩弹窗明确提示。
- 排行卡展示完整 1 分钟测试的最高次数，避免和自由跳总次数混淆；7 天图按设备本地日期累计，历史显示模式、时间、次数、时长、平均频率。
- 语音依赖设备中文 SpeechSynthesis 声音，部分 iPad 系统设置可能导致无声，界面会始终显示倒计时和成绩。

## 模块与算法

`camera.ts` 管理摄像头流和前后切换；`poseDetector.ts` 管理模型及全身可见性；`jumpCounter.ts` 为独立纯算法；`timer.ts` 为可测试训练状态机；`speech.ts` 管理语音；`storage.ts` 管理本地成绩；`main.ts` 连接 UI。

计数信号取双肩和双髋中心的平均垂直坐标。按帧间隔进行指数平滑，预采样建立站立基线，以躯干长度归一化；结合噪声估计、动态阈值、起跳/落地状态机、滞回、最短离地时长、220ms 去抖和950ms周期上限。只有超过起跳阈值后回到落地阈值才计一次；人体丢失、长时间缺帧和暂停都会重置周期。

这属于身体跳跃周期估计，不能直接确认绳子是否成功过脚。蹲起、摄像头移动、遮挡、过小跳幅和过低帧率仍可能影响结果；真实计数精度需在目标 iPad 上录制人工对照测试后调参。建议分别测试：静止30秒、单跳20次、连续100次、空挥绳、蹲起、人物出入画面、逆光和横竖屏。

## 验证范围

自动测试覆盖不同帧率完整周期、抖动、基线漂移、不完整周期、缺帧重置、倒计时、60秒边界、暂停、自由模式及修正下限。桌面无真实摄像头环境不能替代 iPad 摄像头、语音和运动准确率验收。

MediaPipe 文档：https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker/web_js
模型及依赖分别遵循上游许可；模型来源为 Google 官方 MediaPipe 模型分发地址。
