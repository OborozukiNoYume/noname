/**
 * 高达一号 - 技能代码（经典神赵云）
 *
 * 武将信息：
 *   - 名称：高达一号 / 经典神赵云 (dc_zhaoyun / boss_zhaoyun)
 *   - 所属包：collab (apps/core/character/collab) / offline (apps/core/character/offline)
 *   - 源文件：apps/core/character/collab/skill.js / apps/core/character/offline/skill.js
 *   - 翻译文件：apps/core/character/collab/translate.js / apps/core/character/offline/translate.js
 *
 * 技能列表：
 *   - boss_juejing（绝境）：锁定技，摸牌阶段开始前，你跳过此阶段。当你得到牌/失去手牌后，
 *     若你的手牌数大于四/小于四，则你将手牌摸至四张/弃置至四张。
 *   - dclonghun（龙魂）：每回合限20次，你可以将你的牌按下列规则使用或打出：
 *     红桃当【桃】，方块当火【杀】，梅花当【闪】，黑桃当【无懈可击】。
 *   - dczhanjiang（斩将）：准备阶段，若场上有【青釭剑】，则你可以获得之。
 */

// ======================== 绝境 (boss_juejing) ========================
// 定义位置：apps/core/character/offline/skill.js 第 5276 行

boss_juejing: {
	audio: "juejing",
	audioname2: {
		dc_zhaoyun: "dcjuejing",
	},
	trigger: { player: "phaseDrawBefore" },
	forced: true,
	async content(event, trigger, player) {
		trigger.cancel();
	},
	ai: {
		noh: true,
		nogain: true,
	},
	group: "boss_juejing2",
},

// ======================== 绝境·附 (boss_juejing2) ========================
// 定义位置：apps/core/character/offline/skill.js 第 5292 行

boss_juejing2: {
	audio: "juejing",
	sourceSkill: "boss_juejing",
	audioname2: {
		dc_zhaoyun: "dcjuejing",
	},
	mod: {
		aiOrder(player, card, num) {
			if (num > 0) {
				return num;
			}
			if (card.name === "zhuge" && player.getCardUsable("sha", true) < 6) {
				return 1;
			}
		},
		aiValue(player, card, num) {
			if (card.name === "zhuge") {
				return 60 / (1 + player.getCardUsable("sha", true));
			}
		},
		aiUseful(player, card, num) {
			if (card.name === "zhuge") {
				return 60 / (1 + player.getCardUsable("sha", true));
			}
		},
	},
	trigger: {
		player: "loseAfter",
		global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
	},
	forced: true,
	filter(event, player) {
		if (event.name == "gain" && event.player == player) {
			return player.countCards("h") > 4;
		}
		var evt = event.getl(player);
		if (!evt || !evt.hs || evt.hs.length == 0 || player.countCards("h") >= 4) {
			return false;
		}
		var evt = event;
		for (var i = 0; i < 4; i++) {
			evt = evt.getParent("boss_juejing2");
			if (evt.name != "boss_juejing2") {
				return true;
			}
		}
		return false;
	},
	async content(event, trigger, player) {
		const num = 4 - player.countCards("h");
		if (num > 0) {
			await player.draw(num);
		} else {
			await player.chooseToDiscard("h", true, -num, "allowChooseAll");
		}
	},
	ai: {
		freeSha: true,
		freeShan: true,
		skillTagFilter() {
			return true;
		},
	},
},

// ======================== 龙魂 (dclonghun) ========================
// 定义位置：apps/core/character/collab/skill.js 第 7027 行

dclonghun: {
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
	enable: ["chooseToUse", "chooseToRespond"],
	prompt: "将♦牌当做火【杀】，♥牌当做【桃】，♣牌当做【闪】，♠牌当做【无懈可击】使用或打出",
	viewAs(cards, player) {
		var name;
		var nature = null;
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
		if (name) {
			return { name: name, nature: nature };
		}
		return null;
	},
	check(card) {
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
	position: "hes",
	filterCard(card, player, event) {
		event = event || _status.event;
		var filter = event._backup.filterCard;
		var name = get.suit(card, player);
		if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) {
			return true;
		}
		if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) {
			return true;
		}
		if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) {
			return true;
		}
		if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) {
			return true;
		}
		return false;
	},
	filter(event, player) {
		var filter = event.filterCard;
		if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
			return true;
		}
		if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
			return true;
		}
		if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
			return true;
		}
		if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
			return true;
		}
		return false;
	},
	usable: 20,
	ai: {
		respondSha: true,
		respondShan: true,
		skillTagFilter(player, tag) {
			if ((player.getStat("skill").dclonghun || 0) >= 20) {
				return false;
			}
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
	hiddenCard(player, name) {
		if ((player.getStat("skill").dclonghun || 0) >= 20) {
			return false;
		}
		if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) {
			return true;
		}
		if (name == "wuxie") {
			return player.countCards("hes", { suit: "spade" }) > 0;
		}
		if (name == "tao") {
			return player.countCards("hes", { suit: "heart" }) > 0;
		}
	},
},

// ======================== 斩将 (dczhanjiang) ========================
// 定义位置：apps/core/character/collab/skill.js 第 7236 行

dczhanjiang: {
	trigger: { player: "phaseZhunbeiBegin" },
	filter(event, player) {
		return game.hasPlayer(target => {
			return target.countCards("ej", card => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang");
		});
	},
	async content(event, trigger, player) {
		const cards = [];
		const targets = game.filterPlayer(target => {
			return target.countCards("ej", card => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang");
		});
		for (const target of targets) {
			cards.addArray(target.getCards("ej", card => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang"));
		}
		await player.gain(cards, "give");
	},
},
