# BugSight 百科封面图 Canvas 出图规范

## 目标

为 25 个可识别昆虫类别生成统一风格的百科封面图，后续直接落到前端静态资源目录，并通过数据库 `coverImageUrl` 字段引用。

本规范的目标是：
- 风格统一，适合移动端百科详情页头图
- 文件命名稳定，便于批量导入
- 中文主标题 + 英文副标题清晰可读
- 后续接入数据库时不需要再改前端逻辑

## 最终接入约定

- 图片目录：`/Users/Zhuanz1/Documents/Playground/bug-sight-studio/public/wiki-covers/`
- 文件命名：`<classId>.jpg`
- 数据库存储值：`/wiki-covers/<classId>.jpg`
- 访问示例：`/wiki-covers/70.jpg`

## 画布规范

- 尺寸：`1200 x 1600`
- 比例：`3:4`
- 格式：`JPG`
- 质量：`80% ~ 90%`
- 色彩：`sRGB`
- 文件大小建议：`300 KB ~ 900 KB`

## 版式结构

建议分成 3 个区域：

### 1. 顶部主视觉区（约 58%）
- 放昆虫主体图
- 主体尽量居中偏上，保留完整轮廓
- 背景保持干净，避免复杂纹理
- 可以保留轻微投影或柔和光感，但不要做过重特效

### 2. 标题信息区（约 12%）
- 中文名：主标题，字号最大
- 英文名/学名：副标题，灰色或低一层级显示
- 可加一行简短标签，例如：`Rice pest`、`Leafhopper`、`Noctuid moth`

### 3. 底部信息卡区（约 30%）
- 使用圆角浅色卡片
- 只放 2~3 条非常短的信息，不要塞百科大段正文
- 推荐字段：
  - 所属类群（目 / 科）
  - 常见体长
  - 典型分布或危害作物

## 视觉风格建议

### 推荐风格
- 整体风格：简洁、自然、偏学术展示
- 背景：米白、浅灰绿、浅暖灰
- 卡片：白色或极浅灰，带轻阴影
- 圆角：`32 ~ 40 px`
- 阴影：柔和，不要做悬浮过重效果
- 图片边界：可以轻微羽化，但不要裁断触角、足部等关键结构

### 配色建议
- 主色：`#2F6B3B` / `#3E7C59`
- 辅助色：`#7C8B7A` / `#9FA79B`
- 背景色：`#F7F6F2` / `#F4F5F1`
- 标题文字：`#1F2937`
- 副标题文字：`#6B7280`

### 字体建议
如果 Canvas 可选字体，优先：
- 中文：思源黑体 / 苹方 / HarmonyOS Sans
- 英文：Inter / SF Pro / Helvetica Neue

## 文案规范

### 中文主标题
- 使用数据库中的中文名
- 尽量控制在 2~6 个字
- 例如：`盲蝽科`、`绿叶蝉`

### 英文副标题
- 单一物种：优先学名
- 类群标签：用规范英文类群名 + `spp.` 或科名
- 例如：
  - `Cicadella viridis`
  - `Miridae`
  - `Thrips spp.`

### 短标签
只保留一行，避免信息过多。可选格式：
- `Rice pest`
- `Field crop pest`
- `Leaf-feeding insect`
- `Hemipteran pest`
- `Noctuid moth`

## 出图时不要做的事

- 不要把整段百科正文放进图里
- 不要使用过深渐变、强烈霓虹、科技感过重背景
- 不要让文字压在昆虫主体关键部位上
- 不要出现多个主体导致识别混乱
- 不要让英文副标题过长换成三四行
- 不要使用和页面风格冲突的高饱和荧光色

## 25 类文件清单

| classId | 中文名 | 英文名/学名 | 文件名 |
|---|---|---|---|
| 0 | 稻纵卷叶螟 | Cnaphalocrocis medinalis | `0.jpg` |
| 3 | 二化螟 | Chilo suppressalis | `3.jpg` |
| 8 | 白背飞虱 | Sogatella furcifera | `8.jpg` |
| 10 | 稻水象甲 | Lissorhoptrus oryzophilus | `10.jpg` |
| 14 | 蛴螬 | Scarabaeidae larvae | `14.jpg` |
| 15 | 蝼蛄 | Gryllotalpidae | `15.jpg` |
| 16 | 金针虫 | Elateridae larvae | `16.jpg` |
| 18 | 黑地老虎 | Agrotis ipsilon | `18.jpg` |
| 22 | 玉米螟 | Ostrinia furnacalis | `22.jpg` |
| 23 | 粘虫 | Mythimna separata | `23.jpg` |
| 24 | 蚜虫 | Aphidoidea | `24.jpg` |
| 38 | 甘蓝夜蛾 | Mamestra brassicae | `38.jpg` |
| 39 | 甜菜夜蛾 | Spodoptera exigua | `39.jpg` |
| 45 | 亚麻夜蛾 | Heliothis viriplaca | `45.jpg` |
| 48 | 蝗总科 | Locustoidea | `48.jpg` |
| 50 | 豆芫菁 | Mylabris spp. | `50.jpg` |
| 51 | 芫菁 | Meloidae | `51.jpg` |
| 54 | 蓟马 | Thrips spp. | `54.jpg` |
| 58 | 刺蛾科 | Limacodidae | `58.jpg` |
| 67 | 斑衣蜡蝉 | Lycorma delicatula | `67.jpg` |
| 68 | 天牛属 | Xylotrechus spp. | `68.jpg` |
| 69 | 绿叶蝉 | Cicadella viridis | `69.jpg` |
| 70 | 盲蝽科 | Miridae | `70.jpg` |
| 86 | 斜纹夜蛾 | Spodoptera litura | `86.jpg` |
| 101 | 叶蝉科 | Cicadellidae | `101.jpg` |

## Canvas 批量制作建议

### 推荐流程
1. 先做 1 张母版
2. 固定文字样式、卡片样式、背景样式
3. 复制母版 25 次
4. 替换主体图和标题文案
5. 按 `classId.jpg` 导出

### 母版中建议固定的元素
- 背景色
- 卡片位置
- 标题字号
- 副标题字号
- 标签位置
- 阴影和圆角参数

## 落地步骤（你出完图后）

### 1. 放入静态目录
将图片放到：

```bash
/Users/Zhuanz1/Documents/Playground/bug-sight-studio/public/wiki-covers/
```

### 2. 更新种子数据中的 `coverImageUrl`
每个物种写成：

```json
"coverImageUrl": "/wiki-covers/70.jpg"
```

### 3. 重新导入数据库
在后端目录执行：

```bash
DB_HOST=localhost DB_NAME=bugsight DB_USER=your_user DB_PASS=your_pass \
python3 scripts/load_insect_catalog.py --apply
```

### 4. 本地验证
- 结果页优先展示 `coverImageUrl`
- 百科页优先展示 `coverImageUrl`
- 相似物种页卡片优先展示 `coverImageUrl`
- 网络面板应直接请求 `/wiki-covers/<classId>.jpg`

## 验收标准

满足以下条件即可认为封面图接入完成：
- 25 张图片全部存在，命名无误
- 数据库 `coverImageUrl` 已全部写入
- 本地百科页无空白封面
- 英文模式和中文模式下图片都正常显示
- Vercel 部署后图片路径仍可直接访问
