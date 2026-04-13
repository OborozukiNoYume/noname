/**
 * OL曹金玉 - 技能代码（OL版）
 *
 * 武将信息：
 *   - 名称：OL曹金玉 (ol_caojinyu)
 *   - 所属包：sp (apps/core/character/sp)
 *   - 源文件：apps/core/character/sp/skill.js
 *   - 翻译文件：apps/core/character/sp/translate.js
 *
 * 技能列表：
 *   - olchunhui（春晖）：锁定技，每轮首张牌被使用后，若此牌为: 红色，你回复1点体力；黑色，你摸一张牌。
 *   - olxiasheng（夏晟）：准备阶段或当你受到伤害后，令一名其他角色交给你一张牌。
 *     若此牌为黑色，本轮你与其下一次使用红色牌时，可为此牌增加或减少一个目标（至多减至1）。
 *   - olqiumu（秋暮）：锁定技，你脱离濒死状态后，你重铸所有红色牌，
 *     并将〖春晖〗〖夏晟〗〖秋暮〗描述中的"红色"均改为"黑色"。
 */

// ======================== 春晖 (olchunhui) ========================
// 定义位置：apps/core/character/sp/skill.js 第 785 行

olchunhui: {
	audio: 2,
	forced: true,
	trigger: {
		global: "useCardAfter",
	},
	filter(event, player) {
		const bool = player.storage["olchunhui_rewrite"];
		const color = get.color(event.card);
		if (color == "red" && (bool || !player.isDamaged())) {
			return false;
		}
		return game.getRoundHistory("useCard").indexOf(event) == 0;
	},
	async content(event, trigger, player) {
		const bool = player.storage[`${event.name}_rewrite`];
		const color = get.color(trigger.card);
		if (color == "red" && !bool) {
			await player.recover();
		}
		if (color == "black") {
			if (bool) {
				await player.recover();
			}
			await player.draw();
		}
	},
},

// ======================== 夏晟 (olxiasheng) ========================
// 定义位置：apps/core/character/sp/skill.js 第 813 行

olxiasheng: {
	audio: 2,
	forced: true,
	locked: false,
	trigger: {
		player: ["damageEnd", "phaseZhunbeiBegin"],
	},
	filter(event, player) {
		return game.hasPlayer(target => target != player && target.countCards("he"));
	},
	async content(event, trigger, player) {
		const bool = player.storage[`${event.name}_rewrite`];
		const color = bool ? "black" : "red";
		const result = await player
			.chooseTarget(`###${get.translation(event.name)}###令一名角色交给你一张牌`, true, (card, player, target) => {
				return target != player && target.countCards("he");
			})
			.set("ai", target => -get.attitude(get.player(), target) * (114514 - target.countCards("he")))
			.forResult();
		const {
			targets: [target],
		} = result;
		player.line(target);
		const result2 = await target
			.chooseToGive(`夏晟：交给${get.translation(player)}一张牌`, true, "he", player)
			.set("ai", card => {
				if (get.color(card, false) == "black") {
					return 7 - get.value(card);
				}
				return 6 - get.value(card);
			})
			.forResult();
		const {
			cards: [card],
		} = result2;
		if (get.color(card, false) == "black") {
			[player, target].forEach(current => {
				current.addTempSkill(`${event.name}_effect`, "roundStart");
				current.setStorage(`${event.name}_effect`, color, true);
			});
		}
	},
	subSkill: {
		effect: {
			charlotte: true,
			onremove: true,
			trigger: {
				player: "useCard2",
			},
			forced: true,
			popup: false,
			filter(event, player) {
				return get.color(event.card) == player.storage.olxiasheng_effect;
			},
			async content(event, trigger, player) {
				player.removeSkill(event.name);
				const { card, targets } = trigger;
				let bool1 = true;
				const bool2 = targets?.length > 1;
				// 判断能不能多指（allowMultiple为true、没有multiTarget、是否有能够增加的目标，缺一不可）
				const info = get.info(card);
				const addTargets = game.filterPlayer(function (target) {
					return !targets.includes(target) && lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
				});
				if (info.allowMultiple == false || !targets.length || info.multitarget || !addTargets.length) {
					bool1 = false;
				}
				// 能否增加和能否减少分开判断
				if (bool1 || bool2) {
					const next = player
						.chooseTarget(`###${get.translation(event.name)}###为${get.translation(card)}增加或减少一个目标（至多减至一）`, (card, player, target) => {
							const { bool1, bool2, targetsx, targetsy } = get.event();
							return (bool1 && targetsx.includes(target)) || (bool2 && targetsy.includes(target));
						})
						.set("bool1", bool1)
						.set("bool2", bool2)
						.set("targetsx", addTargets)
						.set("targetsy", targets)
						.set("ai", target => {
							const targets = get.event().targetsy;
							const card = get.event().getTrigger().card;
							const player = get.player();
							return get.effect(target, card, player, player) * (targets.includes(target) ? -1 : 1);
						});
					next.targetprompt2.push(target => {
						if (!target.classList.contains("selectable")) {
							return false;
						}
						if (get.event().targetsy.includes(target)) {
							return `可减少目标`;
						}
					});
					const result = await next.forResult();
					if (result?.bool && result.targets?.length) {
						const {
							targets: [target],
						} = result;
						player.line(target);
						if (targets.includes(target)) {
							trigger.targets.remove(target);
							game.log(target, "从", card, "的目标中移除");
						} else {
							trigger.targets.add(target);
							game.log(target, "成为", card, "的额外目标");
						}
					}
				}
			},
			intro: {
				content: "下次使用$牌可以增加或减少一个目标（至多减至1）",
			},
		},
	},
},

// ======================== 秋暮 (olqiumu) ========================
// 定义位置：apps/core/character/sp/skill.js 第 928 行

olqiumu: {
	audio: 2,
	forced: true,
	trigger: { player: "dyingAfter" },
	filter(event, player) {
		const color = player.storage.olqiumu_rewrite ? "black" : "red";
		return player.hasCard(card => get.color(card) == color && player.canRecast(card), "he");
	},
	async content(event, trigger, player) {
		const color = player.storage[`${event.name}_rewrite`] ? "black" : "red";
		const cards = player.getCards("he", card => get.color(card) == color && player.canRecast(card));
		await player.recast(cards);
		if (!player.storage[`${event.name}_rewrite`]) {
			["olchunhui", "olxiasheng", "olqiumu"].forEach(i => player.setStorage(`${i}_rewrite`, true));
		}
	},
},
