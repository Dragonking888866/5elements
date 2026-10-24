# 五行战记 V40 · 神兽灵材

正式入口：https://dragonking888866.github.io/5elements/?v=40.0.0

沿用原存档，已有的十大究极灵兽与隐藏混沌祖兽会自动使用新材质。在营地五行灵宠阁的融合页面，点击「究极灵兽图鉴」查看十兽，混沌祖兽仍在独立隐藏图鉴中。无需重新获取或重新融合。

本次只升级十一张4×4动画精灵的表面配色、毛发/鳞甲/羽片层次和局部亮纹。没有更换游戏引擎，没有修改原有造型、四行动作分派、骑乘挂点、英雄装备、数值、技能判定、融合池或保存格式。PETS 类型103～112及隐藏113保持原ID。地图骑乘、随行、图鉴、包裹、融合结果与V39神兽投影共用ultimatePet35().art映射。

新资源为assets/divine-pet-0-v40.png至divine-pet-10-v40.png；V36原图保留。材质声明和唯一映射见divine-materials-v40.js。完整配色要求、内置imagegen编辑提示词、图片来源与SHA256分别见PALETTES-v40.json、AI-PROMPTS-v40.json及AI-ASSETS-v40.json。美术采用内置imagegen编辑，未使用外部版权素材。

这是Canvas 2.5D精灵材质，并非3D PBR或真实发光网格。局部光感绘入每行动画，未新增每帧全图滤镜、像素读回、粒子或身体光晕。

本地构建：node build.cjs。回归：node tests/release-v40.cjs。
浏览器验收：python tests/ui/serve40.py，打开http://127.0.0.1:8740/qa.html。验收页仅限隔离端口，使用虚构进度，不连接正式网站存档。不能把模拟手机视口的结果称为真实手机测量。
