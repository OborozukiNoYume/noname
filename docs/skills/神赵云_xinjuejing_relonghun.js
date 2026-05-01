/**
 * 神赵云 - 技能代码
 *
 * 武将信息：
 *   - 名称：神赵云 (shen_zhaoyun)
 *   - 所属包：extra (apps/core/character/extra)
 *   - 源文件：apps/core/character/extra/skill.js
 *   - 翻译文件：apps/core/character/extra/translate.js
 *
 * 技能列表：
 *   - xinjuejing（绝境）：锁定技。①你的手牌上限+2。②当你进入或脱离濒死状态时，你摸一张牌。
 *   - relonghun（龙魂）：你可以将同花色的一至两张牌按下列规则使用或打出：
 *     红桃当【桃】，方块当火【杀】，梅花当【闪】，黑桃当普【无懈可击】。
 *     若你以此法转化了两张：红色牌，则此牌回复值或伤害值+1；黑色牌，则你弃置当前回合角色一张牌。
 */

// ======================== 绝境 (xinjuejing) ========================
// 定义位置：apps/core/character/extra/skill.js 第 3057 行

xinjuejing: {
	mod: {
		maxHandcard(player, num) {
			return 2 + num;
		},
		aiOrder(player, card, num) {
			if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
				return num;
			}
			if (player.needsToDiscard() > 1) {
				return num;
			}
			return 0;
		},
	},
	audio: 2,
	trigger: { player: ["dying", "dyingAfter"] },
	forced: true,
	async content(event, trigger, player) {
		await player.draw();
	},
	ai: {
		effect: {
			target(card, player, target) {
				if (target.getHp() > 1) {
					return;
				}
				if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
					return [1, 1];
				}
			},
		},
	},
},

// ======================== 龙魂 (relonghun) ========================
// 定义位置：apps/core/character/extra/skill.js 第 2789 行

relonghun: {
	audio: 2,
	mod: {
		aiOrder(player, card, num) {
			if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() < 2) {
				return num;
			}
			let suit = get.suit(card, player);
			if (suit === "heart") {
				return num - 3.6;
			}
		},
		aiValue(player, card, num) {
			if (num <= 0) {
				return num;
			}
			let suit = get.suit(card, player);
			if (suit === "heart") {
				return num + 3.6;
			}
			if (suit === "club") {
				return num + 1;
			}
			if (suit === "spade") {
				return num + 1.8;
			}
		},
		aiUseful(player, card, num) {
			if (num <= 0) {
				return num;
			}
			let suit = get.suit(card, player);
			if (suit === "heart") {
				return num + 3;
			}
			if (suit === "club") {
				return num + 1;
			}
			if (suit === "spade") {
				return num + 1;
			}
		},
	},
	locked: false,
	//技能发动时机
	enable: ["chooseToUse", "chooseToRespond"],
	//发动时提示的技能描述
	prompt: "将♦牌当做杀，♥牌当做桃，♣牌当做闪，♠牌当做无懈可击使用或打出",
	//动态的viewAs
	viewAs(cards, player) {
		if (cards.length) {
			var name = false,
				nature = null;
			//根据选择的卡牌的花色 判断要转化出的卡牌是闪还是火杀还是无懈还是桃
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "fire";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			//返回判断结果
			if (name) {
				return { name: name, nature: nature };
			}
		}
		return null;
	},
	//AI选牌思路
	check(card) {
		if (ui.selected.cards.length) {
			return 0;
		}
		var player = _status.event.player;
		if (_status.event.type == "phase") {
			var max = 0;
			var name2;
			var list = ["sha", "tao"];
			var map = { sha: "diamond", tao: "heart" };
			for (var i = 0; i < list.length; i++) {
				var name = list[i];
				if (
					player.countCards("hes", function (card) {
						return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
					}) > 0 &&
					player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
				) {
					var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
					if (temp > max) {
						max = temp;
						name2 = map[name];
					}
				}
			}
			if (name2 == get.suit(card, player)) {
				return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
			}
			return 0;
		}
		return 1;
	},
	//选牌数量
	selectCard: [1, 2],
	//确保选择第一张牌后 重新检测第二张牌的合法性 避免选择两张花色不同的牌
	complexCard: true,
	//选牌范围：手牌区和装备区和木马
	position: "hes",
	//选牌合法性判断
	filterCard(card, player, event) {
		//如果已经选了一张牌 那么第二张牌和第一张花色相同即可
		if (ui.selected.cards.length) {
			return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
		}
		event = event || _status.event;
		//获取当前时机的卡牌选择限制
		var filter = event._backup.filterCard;
		//获取卡牌花色
		var name = get.suit(card, player);
		//如果这张牌是梅花并且当前时机能够使用/打出闪 那么这张牌可以选择
		if (name == "club" && filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event)) {
			return true;
		}
		//如果这张牌是方片并且当前时机能够使用/打出火杀 那么这张牌可以选择
		if (name == "diamond" && filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event)) {
			return true;
		}
		//如果这张牌是黑桃并且当前时机能够使用/打出无懈 那么这张牌可以选择
		if (name == "spade" && filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event)) {
			return true;
		}
		//如果这张牌是红桃并且当前时机能够使用/打出桃 那么这张牌可以选择
		if (name == "heart" && filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event)) {
			return true;
		}
		//上述条件都不满足 那么就不能选择这张牌
		return false;
	},
	//判断当前时机能否发动技能
	filter(event, player) {
		//获取当前时机的卡牌选择限制
		var filter = event.filterCard;
		//如果当前时机能够使用/打出火杀并且角色有方片 那么可以发动技能
		if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
			return true;
		}
		//如果当前时机能够使用/打出闪并且角色有梅花 那么可以发动技能
		if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
			return true;
		}
		//如果当前时机能够使用/打出桃并且角色有红桃 那么可以发动技能
		if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
			return true;
		}
		//如果当前时机能够使用/打出无懈可击并且角色有黑桃 那么可以发动技能
		if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
			return true;
		}
		return false;
	},
	ai: {
		respondSha: true,
		respondShan: true,
		//让系统知道角色"有杀""有闪"
		skillTagFilter(player, tag) {
			var name;
			switch (tag) {
				case "respondSha":
					name = "diamond";
					break;
				case "respondShan":
					name = "club";
					break;
				case "save":
					name = "heart";
					break;
			}
			if (!player.countCards("hes", { suit: name })) {
				return false;
			}
		},
		//AI牌序
		order(item, player) {
			if (player && _status.event.type == "phase") {
				var max = 0;
				var list = ["sha", "tao"];
				var map = { sha: "diamond", tao: "heart" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hes", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({
							name: name,
							nature: name == "sha" ? "fire" : null,
						}) > 0
					) {
						var temp = get.order({
							name: name,
							nature: name == "sha" ? "fire" : null,
						});
						if (temp > max) {
							max = temp;
						}
					}
				}
				max /= 1.1;
				return max;
			}
			return 2;
		},
	},
	//让系统知道玩家"有无懈""有桃"
	hiddenCard(player, name) {
		if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
			return true;
		}
		if (name == "wuxie") {
			return player.countCards("hes", { suit: "spade" }) > 0;
		}
		if (name == "tao") {
			return player.countCards("hes", { suit: "heart" }) > 0;
		}
	},
	group: ["relonghun_num", "relonghun_discard"],
	subSkill: {
		num: {
			trigger: { player: "useCard" },
			forced: true,
			popup: false,
			filter(event) {
				var evt = event;
				return ["sha", "tao"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2;
			},
			async content(event, trigger, player) {
				trigger.baseDamage++;
			},
		},
		discard: {
			trigger: { player: ["useCardAfter", "respondAfter"] },
			forced: true,
			popup: false,
			logTarget() {
				return _status.currentPhase;
			},
			autodelay(event) {
				return event.name == "respond" ? 0.5 : false;
			},
			filter(evt, player) {
				return ["shan", "wuxie"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2 && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.countDiscardableCards(player, "he");
			},
			async content(event, trigger, player) {
				player.line(_status.currentPhase, "green");
				await player.discardPlayerCard(_status.currentPhase, "he", true);
			},
		},
	},
},
