# V11 原创美术资源与提示词

制作方式：内置 `image_gen.imagegen` 工具。三张图片均为本次生成的原创项目图集，没有调用外部素材站或复制魔兽/Dota资源。生成后原样复制进工程，未通过脚本重绘或替换图片；运行时按格裁切，原透明通道保留。现有英雄、怪物与百灵图集继续来自原V10工程，本次未声称重新制作这些图片。

| 工程内文件 | 用途 | 背景 |
|---|---|---|
| assets/camp-props-v11.png | 4×2营地建筑、遗迹和宝箱图集 | 透明 |
| assets/camp-npcs-v11.png | 4×2原创功能NPC图集 | 透明 |
| assets/items-v11.png | 4×3补给、武器和防具图标 | 深色 |

以下为实际送入内置工具的完整提示词。

## 建筑与道具

```text
Use case: stylized-concept. Production game sprite atlas, original Chinese five-elements fantasy RPG with painterly 3D rendered materials, consistent isometric elevated camera 35 degrees, soft light from upper left, detailed leather wood bronze stone and cloth. Exactly 4 columns by 2 rows, eight equal square cells, 2048 by 1024 wide sprite sheet. Transparent background, no floor plane, no text, no labels, no grid, no watermark. Every object entirely inside its own cell with 12 percent transparent margin; bottom of each object at same cell baseline. Row1 left to right: 1 large blue and tan canvas adventurer trading pavilion with crates and potion shelf; 2 glowing orange stone blacksmith forge with anvil and weapons rack; 3 crystal-cutting artisan gazebo with cyan gems and bronze tools; 4 violet alchemist gazebo with three floating crystals and ritual bowl. Row2 left to right: 5 moss-covered ruined stone watchtower arch with two broken pillars; 6 realistic ornate closed oak treasure chest with iron bands and amber lock; 7 green woodland beastkeeper lodge with saddles and wooden fence; 8 ancient jade five-element awakening shrine with carved stone steps and central ornate circular bronze disc. Assets are separate game props meant to be depth-sorted into a live scene; attractive coherent high detail at small size; do not join cells into one scene, do not depict any Warcraft or Dota copyrighted designs.
```

## 人物

```text
Use case: stylized-concept. A professional original fantasy RPG NPC sprite atlas. Exactly FOUR columns and TWO rows, eight equal square cells, 2048x1024 landscape. Every character fully inside its own square with clear generous 15 percent transparent margins, no touching neighboring cell, feet aligned to lower 88 percent baseline. Transparent background, NO floor, no text, no letters, no logos, no labels, no grid. Coherent painterly 3D game render, elevated three-quarter isometric camera from front, all face slightly right, warm upper-left light and turquoise rim light, detailed cloth bronze jade leather, realistic anatomy slightly heroic proportions. Row1 left to right: 1 elderly sage in ivory green robes holding jade scroll and ornate staff; 2 cheerful female traveling merchant in navy and ochre layered leather carrying potion satchel; 3 powerful male blacksmith with leather apron, hammer held outward and armored gauntlet; 4 female gemstone artisan in cyan silver robes holding a glowing crystal in hand. Row2 left to right: 5 violet-robed alchemist man with ritual bowl and floating small purple crystal; 6 woodland beastkeeper woman in green leather armor with a small horned fox at feet; 7 venerable warrior advancement mentor in gold and teal elaborate plate armor with halberd; 8 female combat instructor in burgundy and brass light armor with sword raised diagonally. Distinct readable silhouettes, full bodies and weapons intact. Original designs only, matching five-elements Chinese magical fantasy setting, not copyright game characters. Fine detail suitable for 120px tall in-world sprites. Do not make a concept-art layout or background scene.
```

## 商品图标

```text
Use case: stylized-concept. Original fantasy RPG inventory icon atlas. Exactly FOUR columns THREE rows of equal square cells, twelve different centered highly legible item icons. Dark charcoal blue backgrounds in every cell, no borders, no text, no numbers, no logos, no watermark. Detailed polished painterly 3D renders matching ornate bronze jade leather five-elements medieval Chinese fantasy equipment. Twelve isolated objects each at 75 percent cell size: row1 left to right red healing potion in rounded glass bottle, blue mana potion in tall crystal bottle, rolled parchment town portal scroll with teal seal, turquoise spotted magical beast egg in bronze cradle. Row2 left to right elegant gold steel longsword pointing upper-right, green jade recurved bow with visible string and arrow, blue crystal mage staff, orange flame halberd. Row3 left to right silver teal warrior helmet, ornate dark steel breastplate with leather straps, heavy gold edged shield, leather armored boots. Strong clear silhouettes, rich material textures, cohesive soft upper-left highlights. This is an actual game UI sprite sheet, all cells exactly aligned for cropping, no scene.
```

生成工具未承诺严格按提示的像素尺寸交付。实际尺寸、PNG颜色类型、字节数与SHA256记录在`QA-v11.json`；运行时按图片真实尺寸等分，不依赖提示中的目标分辨率。
