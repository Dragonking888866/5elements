# V12 新增美术素材与生成记录

使用内置 image_gen 工具生成，未使用 API/CLI 回退。原图按生成结果原样保存，未修改像素；浏览器在运行时按规则裁切精灵图集。

- 项目资源：web/assets/woodland-v12.png
- 内容：4×2 透明图集，橡树、松林、金桦、苔岩台地、灯笼木栅、武器架、晶石柜、空心石门框。
- 本地保存：C:/Users/shang/Documents/Codex/2026-10-18/u-h/outputs/wuxing-v12/web/assets/woodland-v12.png
- 建筑、NPC、物品沿用 V11 原创图集，既有提示词保存在 ART-v11.md。
- 视觉方向来自用户提供的 Warcraft / Dota 参考说明。未将第三方游戏截图或角色模型放入项目；代理图片链接本次读取失败。

完整提示词：

```text
Use case: stylized-concept. Asset type: production game environmental sprite atlas. Create one transparent PNG atlas in an exact 4-column by 2-row regular grid, eight equal cells, all objects fully inside their own cells with generous transparent margins, NO text or dividing lines. Original eastern fantasy RPG art in a polished realistic hand-painted 2.5D RTS style, three-quarter elevated camera viewing the front and right sides, warm light from upper left, detailed natural materials and ambient occlusion. Row 1 left to right: 1 mature lush broadleaf oak tree with a beautifully irregular olive green crown, visible thick trunk, roots and tiny ground foliage; 2 clustered dark forest pines, branches with dense needles, three trunks; 3 slender golden birch grove with three white trunks and amber foliage; 4 mossy stone escarpment, broad flat grassy ledge above a craggy vertical rock wall, frontal rocky face. Row 2 left to right: 5 rustic camp fence segment with timber posts, hanging lantern and a few small barrels at its foot; 6 ornate blacksmith display rack holding three swords, polearm and steel shield, standing freely on timber support; 7 jeweler's open display cabinet with faceted blue green purple crystals, warm brass framework, red velvet interior; 8 ancient east-asian stone portal arch, two carved pillars and curved lintel with bronze insets, empty transparent open center, no magic effect inside (added at runtime). Every sprite grounded at bottom center of its cell; front surfaces light, deep natural shadows, crisp readable silhouette, painterly realistic detail. Sprite atlas only, no UI, no panorama, no characters, no logos, no watermark. Do not imitate a specific copyrighted character or building.
```
