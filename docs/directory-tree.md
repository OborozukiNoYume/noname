# 项目目录结构

> 生成时间：2026-03-31
> 命令：`tree -d -a -I '.git|node_modules|dist|.cache'`

```text
.
├── .github                         # GitHub 仓库协作配置目录
│   ├── ISSUE_TEMPLATE              # Issue 模板分类目录，细分错误、功能、支持等提单模板
│   ├── PULL_REQUEST_TEMPLATE       # Pull Request 模板目录，用于规范提交流程与更新说明
│   └── workflows                   # GitHub Actions 工作流，包含构建、Lint 与陈旧议题清理
├── apps                           # 应用层工作区目录，包含 core 本体、Electron 桌面壳与移动端壳工程
│   ├── core                        # 无名杀 core 应用目录，包含本体源码、模式包、扩展包与静态资源
│   │   ├── audio                   # 内置音频资源目录，按背景音、卡牌语音、技能语音等分类
│   │   │   ├── background          # 背景音乐与环境音资源
│   │   │   ├── card                # 卡牌使用语音资源
│   │   │   │   ├── female          # 女性武将卡牌语音
│   │   │   │   └── male            # 男性武将卡牌语音
│   │   │   ├── die                 # 武将阵亡语音资源
│   │   │   ├── effect              # 通用音效资源
│   │   │   ├── skill               # 技能触发语音资源
│   │   │   └── voice               # 快捷聊天语音资源
│   │   │       ├── female          # 女性快捷聊天语音
│   │   │       └── male            # 男性快捷聊天语音
│   │   ├── card                    # 卡牌包定义目录，每个文件对应一组可导入的卡牌内容
│   │   ├── character               # 角色包目录；下级目录通常包含武将、关联卡牌、技能、翻译、语音文本/映射，以及部分配对/排序等元数据
│   │   │   ├── bingshi
│   │   │   ├── clan
│   │   │   ├── collab
│   │   │   ├── diy
│   │   │   ├── extra
│   │   │   ├── huicui
│   │   │   ├── jsrg
│   │   │   ├── key
│   │   │   ├── mobile
│   │   │   ├── newjiang
│   │   │   ├── offline
│   │   │   ├── old
│   │   │   ├── onlyOL
│   │   │   ├── refresh
│   │   │   ├── sb
│   │   │   ├── shenhua
│   │   │   ├── shiji
│   │   │   ├── sixiang
│   │   │   ├── sp
│   │   │   ├── sp2
│   │   │   ├── standard
│   │   │   ├── sxrm
│   │   │   ├── tw
│   │   │   ├── xianding
│   │   │   ├── yijiang
│   │   │   └── yingbian
│   │   ├── extension               # 运行时可加载的扩展目录；包含内置扩展与工程化扩展构建产物，每个子目录是一套可独立启用的扩展内容
│   │   │   ├── 3D精选
│   │   │   │   ├── character
│   │   │   │   ├── image
│   │   │   │   │   └── character
│   │   │   │   └── main
│   │   │   ├── boss
│   │   │   ├── cardpile
│   │   │   ├── coin
│   │   │   ├── 杀海拾遗
│   │   │   │   ├── audio
│   │   │   │   │   └── card
│   │   │   │   ├── card
│   │   │   │   │   ├── gujian
│   │   │   │   │   ├── gwent
│   │   │   │   │   ├── hearth
│   │   │   │   │   ├── mtg
│   │   │   │   │   ├── swd
│   │   │   │   │   ├── yunchou
│   │   │   │   │   └── zhenfa
│   │   │   │   ├── character
│   │   │   │   │   ├── gujian
│   │   │   │   │   ├── gwent
│   │   │   │   │   ├── hearth
│   │   │   │   │   ├── mtg
│   │   │   │   │   ├── ow
│   │   │   │   │   ├── swd
│   │   │   │   │   ├── xianjian
│   │   │   │   │   └── yunchou
│   │   │   │   ├── image
│   │   │   │   │   ├── card
│   │   │   │   │   └── character
│   │   │   │   ├── main
│   │   │   │   └── play
│   │   │   │       └── wuxing
│   │   │   ├── 欢乐卡牌
│   │   │   │   ├── audio
│   │   │   │   │   ├── card
│   │   │   │   │   └── skill
│   │   │   │   ├── card
│   │   │   │   ├── image
│   │   │   │   │   └── card
│   │   │   │   └── main
│   │   │   ├── 玩点论杀
│   │   │   │   ├── audio
│   │   │   │   │   └── card
│   │   │   │   ├── card
│   │   │   │   ├── character
│   │   │   │   ├── image
│   │   │   │   │   ├── card
│   │   │   │   │   └── character
│   │   │   │   └── main
│   │   │   └── 英雄杀
│   │   │       ├── character
│   │   │       ├── image
│   │   │       │   └── character
│   │   │       └── main
│   │   ├── font                    # 字体资源目录，供主题与界面渲染使用
│   │   ├── game                    # 运行时清单与少量桥接/兼容文件目录，如 asset、package、update 等配置/清单文件及启动期桥接文件
│   │   ├── image                   # 内置图片资源目录，覆盖背景、卡图、武将图与模式插图
│   │   │   ├── background          # 背景图资源
│   │   │   ├── card                # 卡牌图片资源
│   │   │   ├── character           # 武将立绘与头像资源
│   │   │   ├── emotion             # 表情包资源
│   │   │   │   ├── biexiao_emotion
│   │   │   │   ├── chaijun_emotion
│   │   │   │   ├── guojia_emotion
│   │   │   │   ├── huangdou_emotion
│   │   │   │   ├── maoshu_emotion
│   │   │   │   ├── mobile_emotion
│   │   │   │   ├── shibing_emotion
│   │   │   │   ├── throw_emotion
│   │   │   │   ├── wanglang_emotion
│   │   │   │   ├── xiaojiu_emotion
│   │   │   │   ├── xiaokuo_emotion
│   │   │   │   ├── xiaosha_emotion
│   │   │   │   ├── xiaotao_emotion
│   │   │   │   ├── xiaowu_emotion
│   │   │   │   └── zhenji_emotion
│   │   │   ├── flappybird          # 内置小游戏 Flappy Bird 的图片资源
│   │   │   │   ├── bird
│   │   │   │   ├── ground
│   │   │   │   └── tap
│   │   │   ├── mode                # 各游戏模式专用图片资源
│   │   │   │   ├── boss
│   │   │   │   │   ├── card
│   │   │   │   │   └── character
│   │   │   │   ├── chess
│   │   │   │   │   ├── card
│   │   │   │   │   ├── character
│   │   │   │   │   └── difficulty
│   │   │   │   ├── identity
│   │   │   │   │   └── mark
│   │   │   │   ├── stone
│   │   │   │   │   ├── card
│   │   │   │   │   ├── career
│   │   │   │   │   └── character
│   │   │   │   ├── tafang
│   │   │   │   │   └── character
│   │   │   │   └── versus
│   │   │   │       └── character
│   │   │   ├── pointer             # 指示线/连线样式资源
│   │   │   │   ├── anheilinexy
│   │   │   │   ├── jianfenglinexy
│   │   │   │   ├── jianqilinexy
│   │   │   │   ├── jinjianlinexy
│   │   │   │   ├── jinlonglinexy
│   │   │   │   ├── luoyinglinexy
│   │   │   │   ├── mohualinexy
│   │   │   │   ├── mozhualinexy
│   │   │   │   ├── shenjianlinexy
│   │   │   │   ├── shezhanglinexy
│   │   │   │   ├── xingdielinexy
│   │   │   │   ├── yuexianlinexy
│   │   │   │   ├── yujianlinexy
│   │   │   │   └── zhuzhanglinexy
│   │   │   ├── splash              # 启动页样式图片资源
│   │   │   │   ├── style1
│   │   │   │   └── style2
│   │   │   └── zhanfa              # 战法相关图片资源
│   │   ├── layout                  # 布局样式目录，按终端形态与界面布局方案拆分 CSS
│   │   │   ├── default             # 默认布局样式
│   │   │   ├── long                # 长屏布局样式
│   │   │   ├── long2               # 另一套长屏布局样式
│   │   │   ├── mobile              # 移动端布局样式
│   │   │   ├── mode                # 模式相关布局补丁
│   │   │   ├── newlayout           # 新布局样式资源
│   │   │   ├── nova                # Nova 风格布局资源
│   │   │   └── others              # 其他零散界面样式，如 dialog、skill 等
│   │   ├── mode                    # 模式目录；部分模式直接由顶层文件实现，guozhan 等较复杂模式另设子目录
│   │   │   └── guozhan             # 国战模式独立工作区
│   │   │       ├── res             # 国战模式专属静态资源
│   │   │       │   ├── audio
│   │   │       │   │   ├── card
│   │   │       │   │   ├── character
│   │   │       │   │   └── skill
│   │   │       │   └── image
│   │   │       │       ├── card
│   │   │       │       ├── character
│   │   │       │       └── skill
│   │   │       └── src             # 国战模式源码目录
│   │   │           ├── card        # 国战专属卡牌定义
│   │   │           ├── character   # 国战专属武将数据
│   │   │           ├── help        # 国战帮助页与说明界面
│   │   │           ├── info        # 国战额外元数据，如牌堆、评级等
│   │   │           ├── patch       # 对通用 game/get/player/content 的国战模式补丁
│   │   │           ├── skill       # 国战技能定义
│   │   │           │   ├── card
│   │   │           │   └── character
│   │   │           ├── translate   # 国战翻译文本
│   │   │           │   ├── card
│   │   │           │   ├── character
│   │   │           │   └── skill
│   │   │           │       ├── card
│   │   │           │       └── character
│   │   │           └── voices      # 国战语音文本或映射
│   │   │               ├── card
│   │   │               └── character
│   │   ├── noname                  # 本体核心源码目录，启动、状态、UI、事件系统都在这里
│   │   │   ├── ai                  # AI 相关逻辑
│   │   │   ├── game                # 游戏运行时逻辑，如暂停、选择检查、Promise 封装等
│   │   │   │   └── dynamic-style   # 运行时动态样式生成
│   │   │   ├── get                 # 各类查询/计算辅助方法
│   │   │   │   └── pinyins         # 拼音数据与检索辅助
│   │   │   ├── init                # 启动初始化流程，负责按环境加载资源与模式
│   │   │   │   └── onload          # 启动页（splash）实现
│   │   │   ├── library             # 核心运行库，封装 element、事件系统、缓存等基础设施，并承载系统级技能、战法管理与规则提示等运行时能力
│   │   │   │   ├── announce
│   │   │   │   ├── cache
│   │   │   │   ├── element
│   │   │   │   │   ├── GameEvent
│   │   │   │   │   │   └── compilers
│   │   │   │   │   └── Player
│   │   │   │   ├── experimental
│   │   │   │   ├── hooks
│   │   │   │   └── init
│   │   │   ├── status              # 全局运行时状态定义
│   │   │   ├── ui                  # UI 层逻辑，包含点击处理与界面构造
│   │   │   │   ├── click
│   │   │   │   └── create
│   │   │   │       └── menu
│   │   │   │           ├── pages
│   │   │   │           └── views
│   │   │   └── util                # 通用工具函数、配置读写、错误处理与沙盒能力
│   │   │       └── sandbox         # 运行时代码执行安全与沙盒基础设施，覆盖联机、扩展及其他动态代码执行场景
│   │   ├── scripts                 # core 子项目的构建、资源生成与开发脚本
│   │   ├── theme                   # 主题资源目录，控制卡面、边框、血条、玩家样式等外观
│   │   │   ├── music               # 音乐主题资源
│   │   │   ├── simple              # 简约主题资源
│   │   │   ├── style               # 主题部件样式目录，按 card/cardback/hp/player 分类
│   │   │   │   ├── card
│   │   │   │   │   └── image
│   │   │   │   ├── cardback
│   │   │   │   │   └── image
│   │   │   │   ├── hp
│   │   │   │   │   └── image
│   │   │   │   └── player
│   │   │   └── woodden             # 木纹主题资源
│   │   └── typings                 # TypeScript 声明文件目录，补充运行时对象与全局类型
│   ├── electron                   # Electron 桌面端应用目录，负责将 core 打包为桌面客户端
│   │   └── app                    # Electron 主进程与桌面壳源码目录
│   └── mobile                     # 移动端应用目录，当前主要维护 Capacitor Android 工程
│       ├── android                # Android 原生工程目录，由 Capacitor 管理并承载 WebView 容器
│       │   ├── app                # Android 应用模块
│       │   │   └── src            # Android 应用源码与资源目录
│       │   │       ├── androidTest # Android 仪器测试目录
│       │   │       │   └── java
│       │   │       │       └── com
│       │   │       │           └── getcapacitor
│       │   │       │               └── myapp
│       │   │       ├── main       # Android 主源码集，包含 Activity、资源与清单
│       │   │       │   ├── java
│       │   │       │   │   └── com
│       │   │       │   │       └── libnoname
│       │   │       │   │           └── noname
│       │   │       │   └── res    # Android 资源目录，含图标、启动图、布局与配置
│       │   │       │       ├── drawable
│       │   │       │       ├── drawable-land-hdpi
│       │   │       │       ├── drawable-land-mdpi
│       │   │       │       ├── drawable-land-xhdpi
│       │   │       │       ├── drawable-land-xxhdpi
│       │   │       │       ├── drawable-land-xxxhdpi
│       │   │       │       ├── drawable-port-hdpi
│       │   │       │       ├── drawable-port-mdpi
│       │   │       │       ├── drawable-port-xhdpi
│       │   │       │       ├── drawable-port-xxhdpi
│       │   │       │       ├── drawable-port-xxxhdpi
│       │   │       │       ├── drawable-v24
│       │   │       │       ├── layout
│       │   │       │       ├── mipmap-anydpi-v26
│       │   │       │       ├── mipmap-hdpi
│       │   │       │       ├── mipmap-mdpi
│       │   │       │       ├── mipmap-xhdpi
│       │   │       │       ├── mipmap-xxhdpi
│       │   │       │       ├── mipmap-xxxhdpi
│       │   │       │       ├── values
│       │   │       │       └── xml
│       │   │       └── test       # Android 本地单元测试目录
│       │   │           └── java
│       │   │               └── com
│       │   │                   └── getcapacitor
│       │   │                       └── myapp
│       │   └── gradle             # Android 构建系统目录
│       │       └── wrapper        # Gradle Wrapper 文件
│       └── src                    # 移动端运行时补充脚本与 Capacitor 插件接口
├── docs                            # 项目文档目录，包含启动、异步、音频、皮肤与目录结构说明
├── packages                        # 工作区子包目录
│   ├── extension                   # 工程化扩展源码工作区，initExtension.ts 会在此生成扩展包源码，并构建输出到 apps/core/extension
│   ├── fs                          # 本地文件访问与静态资源服务子包（Fastify）
│   │   └── src                     # 文件服务入口与读写 API 实现
│   ├── jit                         # Vite JIT 子包，用于在客户端启用即时编译能力
│   │   ├── public                  # JIT 测试与随构建复制的公开资源
│   │   └── src                     # Vite 插件与浏览器侧注入脚本源码
│   │       └── service-worker      # Service Worker 编译链，负责扩展资源的即时编译与资源代理
│   └── server                      # 联机房间与大厅通信服务子包（WebSocket）
│       └── src                     # WebSocket 服务端核心实现
└── scripts                         # 仓库级开发、构建与脚手架脚本目录
    └── extension-template          # 扩展脚手架模板，供 initExtension.ts 生成新扩展
        ├── default                 # 默认扩展模板
        │   ├── audio               # 模板音频资源占位目录
        │   ├── image               # 模板图片资源占位目录
        │   └── src                 # 模板源码目录，入口为 src/index.ts
        └── vue                     # Vue 增量模板，补充 Vue 依赖与构建配置

309 directories
```
