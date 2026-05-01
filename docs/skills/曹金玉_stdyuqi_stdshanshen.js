/**
 * 标曹金玉 - 技能代码（四象封印版）
 *
 * 武将信息：
 *   - 名称：标曹金玉 (std_caojinyu)
 *   - 所属包：sixiang (apps/core/character/sixiang)
 *   - 源文件：apps/core/character/sixiang/skill.js
 *   - 翻译文件：apps/core/character/sixiang/translate.js
 *
 * 技能列表：
 *   - stdyuqi（隅泣）：与你距离小于等于你当前体力的角色受到伤害后，你可以令其摸一张牌。
 *   - stdshanshen（善身）：当一名角色死亡时，若伤害来源不是你，你可以回复1点体力。
 */

// ======================== 隅泣 (stdyuqi) ========================
// 定义位置：apps/core/character/sixiang/skill.js 第 293 行

stdyuqi: {
	audio: "yuqi",
	trigger: {
		global: ["damageEnd"],
	},
	filter(event, player) {
		return get.distance(event.player, player) <= player.getHp() && event.player.isIn();
	},
	logTarget: "player",
	check(event, player) {
		return get.effect(event.player, { name: "draw" }, player, player) > 0;
	},
	async content(event, trigger, player) {
		await event.targets[0].draw();
	},
},

// ======================== 善身 (stdshanshen) ========================
// 定义位置：apps/core/character/sixiang/skill.js 第 309 行

stdshanshen: {
	audio: "shanshen",
	trigger: {
		global: ["die"],
	},
	filter(event, player) {
		return !event.reserveOut && event.reason?.source != player && player.isDamaged();
	},
	logTarget: "player",
	check: () => true,
	async content(event, trigger, player) {
		await player.recover();
	},
},
