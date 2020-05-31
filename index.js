const Vec3 = require('tera-vec3');

let {DungeonInfo,
	 DW_BOSS_1, DW_TipMsg1,  DW_BOSS_2, DW_TipMsg2,
	 FI_BOSS_1,  FI_BOSS_2,  FI_BOSS_3, FI_TipMsg,
	 DF_BOSS_1,  DF_BOSS_2,  DF_BOSS_3,
	 RM_BOSS_1,  RM_BOSS_2,  RM_BOSS_3,
	 VS_BOSS_1,  VS_BOSS_2,  VS_BOSS_3, VS_TipMsg,
	 RR_BOSS_1,  RR_BOSS_2,  RR_BOSS_3,
	 AA_BOSS_1,  AA_BOSS_2,  AA_BOSS_3,
	DRC_BOSS_1, DRC_BOSS_2, DRC_BOSS_3, DRC_TipMsg,
	GLS_BOSS_1, GLS_BOSS_2, GLS_BOSS_3,
	 GV_BOSS_1,  GV_BOSS_2,
	 AQ_BOSS_1,  AQ_BOSS_2
} = require('./boss');

module.exports = function Tera_Guide(mod) {
	let Enabled            =  true, // 总开关
		SendToStream       = false, // true 关闭队长通知, 并将消息发送到聊天[代理]频道
		BossLog            = false,
		debug              = false,
		itemID1            =     1, // 告示牌: 1一般布告栏, 2兴高采烈布告栏, 3狂人布告栏
		itemID2            = 98260, // 战利品: 古龍貝勒古斯的頭 (光柱), 369: 鑽石
		itemID3            =   413, // 采集物: 413调味草
		itemID4            =   445, // 采集物: 445艾普罗
		itemID5            =   513, // 采集物: 513吞食之草
		itemID6            =   912; // 采集物: 912鸵鸟蛋
	// 定义变量
	let hooks              = [],
		job                = -1,
		partyMembers       = [],
		isTank             = false, // 坦克职业
		isHealer           = false, // 补师职业
		whichzone          = null,  // 登陆地区(zone)
		whichmode          = null,  // 副本地图(huntingZoneId)
		whichboss          = null,  // 区域位置(templateId)
		boss_GameID        = null,  // BOSS gameId
		boss_HP            = 0,     // BOSS 血量%
		boss_CurLocation   = {},    // BOSS 坐标
		boss_CurAngle      = 0,     // BOSS 角度
		skillid            = 0,     // BOSS 攻击技能编号
		uid1      = 999999999n,     // 告示牌UID
		uid2      = 899999999n,     // 龙头UID
		uid3      = 799999999n,     // 花朵UID
		curLocation        = {},    // 地面提示 坐标 x y z
		curAngle           = 0,     // 地面提示 角度
		// DW
		circleCount        = 0,     // 累计点名圆圈数
		ballColor          = 0,     // 打投掷颜色
		// VS
		checked            = false, // 鉴定
		inverted           = false, // 恢复正常 / 进入灵魂
		nextMsg            = 0,     // 预告下一次[鉴定消息数组]角标
		// AA
		lastTwoUpDate      = 0,
		lastRotationDate   = 0,
		rotationDelay      = 0,
		// GLS
		sign_CurLocation   = {},    // 水波石碑 坐标
		sign_CurAngle      = 0,     // 水波石碑 角度
		power              = false, // 充能计数
		Level              = 0,     // 充能层数
		levelMsg           = [],    // 充能文字 数组
		powerMsg           = "",    // 充能文字
		// AQ
		myColor            = null,
		tipMsg             = "";
	// 控制命令
	mod.command.add(["tg", "tguide"], (arg) => {
		if (!arg) {
			Enabled = !Enabled;
			mod.command.message("Tera Guide " + (Enabled ? "Enabled" : "Disabled"));
		} else {
			switch (arg) {
				case "stream":
				case "主播":
					SendToStream = !SendToStream;
					mod.command.message("Stream Mode" + (SendToStream ? "Enabled" : "Disabled"));
					break;
				case "info":
					mod.command.message("Module Switch: " + Enabled);
					mod.command.message("Stream Mode " + (SendToStream ? "Enabled" : "Disabled"));
					mod.command.message("Zone: " + whichzone);
					mod.command.message("Mode: " + whichmode);
					mod.command.message("Area Location: " + whichboss);
					mod.command.message("bossID: "   + boss_GameID);
					mod.command.message("isTank: "   + isTank);
					mod.command.message("isHealer: " + isHealer);
					mod.command.message("partyMembers: " + partyMembers.length);
					break;
				case "log":
					BossLog = !BossLog;
					mod.command.message("Boss-Log: " + (BossLog ? "ON" : "OFF"));
					break;
				case "debug":
					debug = !debug;
					mod.command.message("debug: " + (debug ? "on" : "off"));
					break;
				default :
					mod.command.message("Invalid parameters!");
					break;
			}
		}
	});
	// 登陆游戏
	mod.game.on('enter_game', () => {
		job = (mod.game.me.templateId -10101) % 100;
		if (job==1 || job==10) {
			isTank = true;
		} else if (job==6 || job==7) {
			isHealer = true;
		} else {
			isTank   = false;
			isHealer = false;
		}
	})
	// 切换场景
	mod.game.me.on('change_zone', (zone, quick) => {
		whichzone = zone;
		var dungeonInfo = DungeonInfo.find(obj => obj.zone == zone);
		if (dungeonInfo) {
			mod.command.message(dungeonInfo.string);
			load();
		} else {
			unload();
		}
	})
	
	mod.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
		partyMembers = event.members;
	})
	
	mod.hook('S_LEAVE_PARTY_MEMBER', 2, (event) => {
		partyMembers = partyMembers.filter(obj => obj.name != event.name);
	})
	
	mod.hook('S_LEAVE_PARTY', 1, (event) => {
		partyMembers = [];
	})
	
	function load() {
		if (!hooks.length) {
			hook('S_BOSS_GAGE_INFO',        3, sBossGageInfo);
			hook('S_SPAWN_NPC',            11, sSpawnNpc);
			hook('S_SPAWN_PROJECTILE',      5, sSpawnProjectile);
			hook('S_CREATURE_ROTATE',       2, sCreatureRotate);
			hook('S_DUNGEON_EVENT_MESSAGE', 2, sDungeonEventMessage);
			hook('S_QUEST_BALLOON',         1, sQuestBalloon);
			hook('S_ABNORMALITY_BEGIN',     4, UpdateAbnormality);
			hook('S_ABNORMALITY_REFRESH',   2, UpdateAbnormality);
			hook('S_ABNORMALITY_END',       1, sAbnormalityEnd);
			hook('S_ACTION_STAGE',          9, sActionStage);
		}
	}
	
	function hook() {
		hooks.push(mod.hook(...arguments));
	}
	
	function unload() {
		if (hooks.length) {
			for (let h of hooks) {
				mod.unhook(h);
			}
			hooks = [];
		}
		reset();
		whichmode = null;
	}
	
	function reset() {
		// 清除所有定时器
		mod.clearAllTimeouts();
		// 清除BOSS信息
		whichboss          = null;
		boss_GameID        = null;
		// DW
		circleCount        = 0;
		ballColor          = 0;
		// VS_3王
		checked            = false;
		inverted           = false;
		nextMsg            = 0;
		// GLS_3王
		power              = false;
		Level              = 0;
		levelMsg           = [];
		powerMsg           = "";
		// AQ_1王
		myColor            = null;
		tipMsg             = "";
	}
	
	function sBossGageInfo(event) {
		boss_HP = (Number(event.curHp) / Number(event.maxHp));
		if (!whichmode) whichmode = event.huntingZoneId;
		if (!whichboss) whichboss = event.templateId;
		if (!boss_GameID) boss_GameID = event.id;
		if (boss_HP <= 0 || boss_HP == 1) reset();
	}
	
	function sSpawnNpc(event) {
		if (!Enabled || SendToStream) return;
		
		if (BossLog && partyMembers.find(obj => obj.gameId != event.owner)) {
			mod.command.message("Spawn-Npc: [" + event.huntingZoneId + "] " + event.templateId);
		}
		// 移除 恶灵岛上级                             1号门   2号门   3号门
		if ([459, 759].includes(event.huntingZoneId) && [2003, 200,210, 211].includes(event.templateId)) return false;
		/* 
		const boxTempIds = [
			//      1      2      3      4      5      6
			      75953, 75955, 75957, 75959, 75961, 75963,
			75941,                                         75942, // 1
			75943,                                         75944, // 2
			75945,                                         75946, // 3
			75947,                                         75948, // 4
			75949,                                         75950, // 5
			75951,                                         75952, // 6
			      75954, 75956, 75958, 75960, 75962, 75964
			-------------------------- 入口 --------------------------
		];
		 */
		
	}
	
	function sSpawnProjectile(event) {
		if ([459, 759].includes(whichmode) && event.templateId==1003 && event.skill.id==3107) {
			boss_CurLocation = event.dest;
			SpawnThing(true, 4000, 0, 0);
		}
	}
	
	function sCreatureRotate(event) {
		// AA_3王 后砸
		if (lastTwoUpDate && boss_GameID==event.gameId) {
			lastRotationDate = Date.now();
			rotationDelay = event.time;
		}
	}
	
	function sDungeonEventMessage(event) {
		if (!Enabled || !whichmode || !whichboss) return;
		// var msg_Id = parseInt(event.message.replace('@dungeon:', '') % 1000);
		// var msg_Id = parseInt(event.message.replace(/[^0-9]/ig, '') % 1000);
		var msg_Id = parseInt(event.message.match(/\d+/ig)) % 1000;
		if (BossLog) mod.command.message("D-Message: " + event.message + " | " + msg_Id);
		
		// DRC_1王 能量满100提醒 下级-9783103 上级-9983103
		if ([783, 983, 3018].includes(whichmode) && whichboss==1000 && msg_Id==103) {
			sendMessage(DRC_TipMsg[0]);
		}
		// VS_3王 下一次鉴定提示(翻译王说话)
		if ([781, 981].includes(whichmode) && whichboss==3000) {
			// 1 注 - 9781043 9981043  2 闪 - 9781044 9981044  3 炸 - 9781045 9981045
			if ([43, 44, 45].includes(msg_Id)) {
				nextMsg = msg_Id % 42;
				if (inverted) nextMsg = nextMsg+3;
				sendMessage((VS_TipMsg[0] + VS_TipMsg[nextMsg]), 25);
			}
		}
	}
	
	function sQuestBalloon(event) {
		if (!Enabled || !whichmode || !whichboss) return;
		// var msg_Id = parseInt(event.message.replace('@monsterBehavior:', '') % 1000);
		// var msg_Id = parseInt(event.message.replace(/[^0-9]/ig, '') % 1000);
		var msg_Id = parseInt(event.message.match(/\d+/ig)) % 1000;
		if (BossLog) mod.command.message("Q-Balloon: " + event.message + " | " + msg_Id);
		
		// DW_2王 轮盘选中球的颜色(王的说话)
		if (whichmode==466 && whichboss==46602) {
			// 逆-466054 [红色] 顺-466050 | 逆-466055 [白色] 顺-466051 | 逆-466056 [蓝色] 顺-466052
			if ([50, 51, 52, 54, 55, 56].includes(msg_Id)) {
			//    1   2   3   5   6   7
				ballColor = msg_Id % 49;
				sendMessage((DW_TipMsg2[0] + DW_TipMsg2[ballColor]), 25);
			}
		}
		// FI_1王 
		if ([459, 759].includes(whichmode) && [1001, 1004].includes(whichboss)) {
			// 459015 谁要被我诅咒看看吗(伯恩斯坦的诅咒)
			if (msg_Id==15) sendMessage(FI_TipMsg[0], 25);
			// 459021 有人撑不住我的诅咒(拉道斯的诅咒)
			if (msg_Id==21) sendMessage(FI_TipMsg[1], 25);
		}
		// FI_2王 
		if ([459, 759].includes(whichmode) && [1002, 1005].includes(whichboss)) {
			// 459022 亡灵会暂时醒来
			if (msg_Id==22) sendMessage(FI_TipMsg[2], 25);
		}
		// VS_3王 鉴定
		if ([781, 981].includes(whichmode) && whichboss==3000) {
			// 死于混乱之中吧(开始鉴定) - 78142
			if (msg_Id==142) {
				checked = true;
				mod.setTimeout(() => { checked = false; }, 1000);
				
				if (boss_HP > 0.5) {
					nextMsg = nextMsg+1;
					if (!inverted && nextMsg>3) nextMsg = 1; // VS_TipMsg[1] - VS_TipMsg[2] - VS_TipMsg[3]
					if ( inverted && nextMsg>6) nextMsg = 4; // VS_TipMsg[4] - VS_TipMsg[5] - VS_TipMsg[6]
				} else {
					nextMsg = nextMsg-1;
					if (!inverted && nextMsg<1) nextMsg = 3; // 1注(近)-2闪(分)-3炸(解)
					if ( inverted && nextMsg<4) nextMsg = 6; // 4注(远)-5闪(集)-6炸(不)
				}
				mod.setTimeout(() => {
					sendMessage((VS_TipMsg[0] + VS_TipMsg[nextMsg]), 25);
				}, 5000);
			}
			// 进入灵魂 - 78151
			if (msg_Id==151) {
				inverted = true;
				nextMsg = nextMsg+3;
				sendMessage(("Into -> " + VS_TipMsg[nextMsg]), 25);
			}
			// 挺能撑的 - 78152
			if (msg_Id==152) {
				inverted = false;
				nextMsg = nextMsg-3;
				sendMessage(("Out  -> " + VS_TipMsg[nextMsg]), 25);
			}
			// 在神的面前不要掉以轻心 - 78155
		}
	}
	
	function UpdateAbnormality(event) {
		if (!mod.game.me.is(event.target)) return;
		// AQ_1王 内外圈-鉴定 紅色詛咒氣息 藍色詛咒氣息
		if (whichmode==3023 && whichboss==1000 && (event.id==30231000||event.id==30231001)) {
			myColor = event.id;
		}
	}
	
	function sAbnormalityEnd(event) {
		if (!mod.game.me.is(event.target)) return;
		// AQ_1王 内外圈-鉴定
		if (whichmode==3023 && whichboss==1000 && (event.id==30231000||event.id==30231001)) {
			myColor = null;
		}
	}
	
	function sActionStage(event) {
		// 模块关闭 或 不在副本中 或 找不到BOSS血条
		if (!Enabled || !whichmode || !whichboss) return;
		
		if (BossLog && partyMembers.find(obj => obj.gameId != event.gameId)) {
			mod.command.message("Boss-Skill: [" + whichmode + "] " + event.templateId + " - " + event.skill.id + "_" + event.stage);
		}
		
		// GLS_2 石碑 水波攻击 范围提示
		if ([782, 982, 3019].includes(whichmode) && [2021, 2022, 2023].includes(event.templateId)) {
			if (event.stage!=0) return;
			var sign_skillid = event.skill.id % 1000; // 石碑攻击技能编号简化
			sign_CurLocation = event.loc;             // 石碑的 x y z 坐标
			sign_CurAngle = event.w;                  // 石碑的角度
			
			var sign_X = sign_CurLocation.x - boss_CurLocation.x;               // 石碑与王 X坐标之差
			var sign_Y = sign_CurLocation.y - boss_CurLocation.y;               // 石碑与王 Y坐标之差
			var sign_Radius = Math.pow((sign_X*sign_X) + (sign_Y*sign_Y), 0.5); // 勾股定理: C等于(A平方+B平方)的1/2次幂
			
			curLocation = sign_CurLocation; // 传递石碑坐标参数
			curAngle = sign_CurAngle;       // 传递石碑角度参数
			
			if (sign_skillid==302||sign_skillid==306||sign_skillid==303||sign_skillid==307) {
				SpawnCircle(itemID4, 7000, 6, sign_Radius); // 构造圆形花圈 石碑到王的距离为 [半径]
			}
		}
		// GLS_3 接电石碑 队员间隔
		if ([782, 982, 3019].includes(whichmode) && event.templateId==3022 && event.skill.id==1101) {
			if (event.stage!=0) return;
			// 3王回地图中间点的 (x, y) 坐标
			boss_CurLocation.x = -95703;
			boss_CurLocation.y = 144980;
			// 上级HP<40% 较短一侧石碑到王 提示跳过
			var X = Math.pow((boss_CurLocation.x - event.loc.x), 2);
			var Y = Math.pow((boss_CurLocation.y - event.loc.y), 2);
			var C = Math.pow(X+Y, 0.5);
			if (C < 500) return;
			// 石碑的坐标/角度 设定为提示物初始点
			curLocation = event.loc;
			curAngle = event.w;
			// 4圈 1直线
			SpawnCircle(itemID4, 8000,  15, 105);
			SpawnCircle(itemID4, 8000,  12, 210);
			SpawnCircle(itemID4, 8000,  10, 315);
			SpawnCircle(itemID4, 8000,   8, 420);
			SpawnString(itemID6, 8000, 180, 440);
		}
		
		if (whichboss != event.templateId) return;
		
		skillid = event.skill.id % 1000;     // 愤怒简化 取1000余数运算
		boss_CurLocation = event.loc;        // BOSS的 x y z 坐标
		boss_CurAngle = event.w;             // BOSS的角度
		curLocation = boss_CurLocation;      // 传递BOSS坐标参数
		curAngle = boss_CurAngle;            // 传递BOSS角度参数
		
		var bossSkillID;
		// DW_1王
		if (whichmode==466 && event.templateId==46601) {
			if (event.stage!=0 || !(bossSkillID = DW_BOSS_1.find(obj => obj.id==skillid))) return;
			// BOSS HP > 50%  +1圈 +2圈 +3圈 +4圈 +5圈
			if ([306, 307, 308, 309, 310].includes(skillid)) {
				circleCount += skillid % 305;
				sendMessage((bossSkillID.msg + "=" + circleCount + " | " + DW_TipMsg1[circleCount % 2]), 25);
				return;
			}
			// BOSS HP < 50%  +1圈 +2圈 +3圈 +4圈 +5圈
			if ([319, 320, 321, 322, 323].includes(skillid)) {
				circleCount += skillid % 318;
				sendMessage((bossSkillID.msg + "=" + circleCount + " | " + DW_TipMsg1[circleCount % 2]), 25);
				return;
			}
			// 鉴定-出圈 重置圈数
			if ([311, 315, 313, 317].includes(skillid) || [312, 316, 314, 318].includes(skillid)) {
				circleCount = 0;
			}
			sendMessage(bossSkillID.msg);
		}
		// DW_2王
		if (whichmode==466 && event.templateId==46602) {
			if (event.stage!=0 || !(bossSkillID = DW_BOSS_2.find(obj => obj.id==skillid))) return;
			// 举球 内外圈 (开场 / 30%重新进场)
			if (skillid==309||skillid==310) {
				ballColor = 4;
			}
			// 举球 内外圈
			if ([311, 314, 312, 313].includes(skillid)) {
				SpawnCircle(itemID3, 5000, 10, 320);
			}
			// 鉴定 打投掷
			if (skillid==303) {
				sendMessage(bossSkillID.msg + " -> " + DW_TipMsg2[ballColor]);
				return;
			}
			sendMessage(bossSkillID.msg);
		}
		
		// FI_1王
		if ([459, 759].includes(whichmode) && [1001, 1004].includes(event.templateId)) {
			if (event.stage!=0 || !(bossSkillID = FI_BOSS_1.find(obj => obj.id==event.skill.id))) return;
			// 旋转攻击
			if (event.skill.id==1106||event.skill.id==2106) {
				SpawnCircle(itemID3, 3000, 8, 320);
			}
			// 重击
			if (event.skill.id==3107) {
				SpawnThing(   false,  100,  90,   60);
				SpawnString(itemID3, 2000, 170, 1000);
				SpawnThing(   false,  100, 270,   60);
				SpawnString(itemID3, 2000, 190, 1000);
			}
			sendMessage(bossSkillID.msg);
		}
		// FI_2王
		if ([459, 759].includes(whichmode) && [1002, 1005].includes(event.templateId)) {
			if (event.stage!=0 || !(bossSkillID = FI_BOSS_2.find(obj => obj.id==event.skill.id))) return;
			sendMessage(bossSkillID.msg);
		}
		// FI_3王
		if ([459, 759].includes(whichmode) && event.templateId==1003) {
			if (event.stage!=0 || !(bossSkillID = FI_BOSS_3.find(obj => obj.id==event.skill.id))) return;
			sendMessage(bossSkillID.msg);
		}
		
		// DF_1王
		if ([767, 467].includes(whichmode) && event.templateId==46701) {
			if (event.stage!=0 || !(bossSkillID = DF_BOSS_1.find(obj => obj.id==skillid))) return;
			sendMessage(bossSkillID.msg);
		}
		// DF_2王
		if ([767, 467].includes(whichmode) && event.templateId==46703) {
			if (event.stage!=0 || !(bossSkillID = DF_BOSS_2.find(obj => obj.id==skillid))) return;
			sendMessage(bossSkillID.msg);
		}
		// DF_3王
		if ([767, 467].includes(whichmode) && event.templateId==46704) {
			if (event.stage!=0 || !(bossSkillID = DF_BOSS_3.find(obj => obj.id==skillid))) return;
			sendMessage(bossSkillID.msg);
		}
		
		// RM_1王
		if ([770, 970].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = RM_BOSS_1.find(obj => obj.id==skillid))) return;
			// 前喷
			if (skillid==107) {
				SpawnString(itemID3, 3000, 130, 500);
				SpawnString(itemID3, 3000, 230, 500);
			}
			sendMessage(bossSkillID.msg);
		}
		// RM_2王
		if ([770, 970].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = RM_BOSS_2.find(obj => obj.id==skillid))) return;
			//插地眩晕
			if (skillid==106) {
				SpawnThing(   false,  100, 180,  30);
				SpawnCircle(itemID3, 2000,  18, 180);
			}
			// 直线攻击
			if (skillid==111) {
				SpawnString(itemID3, 3000, 180, 500);
			}
			sendMessage(bossSkillID.msg);
		}
		// RM_3王
		if ([770, 970].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0 || !(bossSkillID = RM_BOSS_3.find(obj => obj.id==skillid))) return;
			// 前推坦
			if (skillid==106) {
				SpawnThing(   false, 100,    0,  30);
				SpawnString(itemID3, 2000, 140, 580);
				SpawnString(itemID3, 2000, 240, 580);
			}
			// 尾巴横扫
			if (skillid==110) {
				SpawnString(itemID3, 2000, 155, 580);
				SpawnString(itemID3, 2000, 205, 580);
				SpawnCircle(itemID3, 2000,   8, 580);
			}
			// 内外圈 出
			if (skillid==113) {
				SpawnCircle(itemID3, 3000, 20,  80);
				SpawnCircle(itemID3, 3000, 18, 150);
				SpawnCircle(itemID3, 3000, 12, 220);
				SpawnCircle(itemID3, 3000, 10, 290);
				SpawnCircle(itemID3, 3000,  8, 580);
			}
			// 内外圈 进
			if (skillid==116) {
				SpawnCircle(itemID3, 3000, 10, 290);
				SpawnCircle(itemID3, 3000,  8, 580);
			}
			// 命运圈
			if (skillid==322) {
				SpawnCircle(itemID3, 5000, 20, 240);
				SpawnCircle(itemID3, 5000, 12, 400);
				SpawnCircle(itemID3, 5000,  8, 580);
			}
			sendMessage(bossSkillID.msg);
		}
		
		// VS_1王
		if ([781, 981].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = VS_BOSS_1.find(obj => obj.id==skillid))) return;
			// 内外圈
			if (skillid==304) {
				SpawnThing(   false, 100,   0,  10);
				SpawnCircle(itemID3, 5000, 18, 290);
			}
			// 左/右刀
			if (skillid==401||skillid==402) {
				SpawnString(itemID3, 2000, 180, 500); // 垂直对称轴 头部
				SpawnString(itemID3, 2000,   0, 500); // 垂直对称轴 尾部
				SpawnThing(true, 2000, bossSkillID.sign_degrees, 250);
				if (isTank) bossSkillID.msg = bossSkillID.msg_tk;
			}
			sendMessage(bossSkillID.msg);
		}
		// VS_2王
		if ([781, 981].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = VS_BOSS_2.find(obj => obj.id==skillid))) return;
			// 左刀
			if (skillid==130) {
				SpawnString(itemID3, 1500, 180, 500); // 垂直对称轴 头部
				SpawnString(itemID3, 1500,   0, 500); // 垂直对称轴 尾部
				SpawnThing(true, 2000, bossSkillID.sign_degrees, 250);
				if (isTank) bossSkillID.msg = bossSkillID.msg_tk;
			}
			// 右刀
			if (skillid==131) {
				SpawnString(itemID3, 1500, 175, 500); // 垂直对称轴 头部
				SpawnString(itemID3, 1500,   5, 500); // 垂直对称轴 尾部
				SpawnThing(true, 2000, bossSkillID.sign_degrees, 250);
				if (isTank) bossSkillID.msg = bossSkillID.msg_tk;
			}
			sendMessage(bossSkillID.msg);
		}
		// VS_3王
		if ([781, 981].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0 || !(bossSkillID = VS_BOSS_3.find(obj => obj.id==skillid))) return;
			if (skillid==103 && !checked) return;
			// 前盾砸(晕坦) / 甜甜圈
			if (skillid==116) {
				if (whichmode==781) { // 下级 前盾砸
					SpawnThing(   false,  100, 180,  30);
					SpawnString(itemID3, 5000, 115, 500);
					SpawnString(itemID3, 5000, 245, 500);
				} else { // 上级 甜甜圈
					SpawnThing(   false,  100, 180,  35);
					SpawnCircle(itemID3, 8000,  18, 200);
					// SpawnCircle(itemID3, 8000,  15, 380);
					// SpawnCircle(itemID3, 8000,  12, 560);
					bossSkillID.msg = bossSkillID.msg2;
				}
			}
			// 滚开 内外圈
			if (skillid==138) {
				SpawnCircle(itemID3, 5000, 18, 250);
			}
			// 前砸 后喷
			if (skillid==152) {
				SpawnThing(   false,  100, 180,  30);
				SpawnString(itemID3, 5000,  60, 500);
				SpawnString(itemID3, 5000, 300, 500);
			}
			// 后喷 前戳
			if (skillid==701) {
				SpawnThing(   false,  100,   0,  60);
				SpawnString(itemID3, 2000,  60, 500);
				SpawnString(itemID3, 2000, 300, 500);
			}
			sendMessage(bossSkillID.msg);
		}
		// RR_1王
		if ([739, 939].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = RR_BOSS_1.find(obj => obj.id==skillid))) return;
			sendMessage(bossSkillID.msg);
		}
		// RR_2王
		if ([739, 939].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = RR_BOSS_2.find(obj => obj.id==skillid))) return;
			// 前喷
			if (skillid==119) {
				SpawnString(itemID3, 3000, 130, 500);
				SpawnString(itemID3, 3000, 230, 500);
			}
			// 后喷
			if (skillid==120) {
				SpawnString(itemID3, 3000,  45, 500);
				SpawnString(itemID3, 3000, 315, 500);
			}
			sendMessage(bossSkillID.msg);
		}
		// RR_3王
		if ([739, 939].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0 || !(bossSkillID = RR_BOSS_3.find(obj => obj.id==skillid))) return;
			sendMessage(bossSkillID.msg);
		}
		
		// AA_1王
		if ([720, 920, 3017].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = AA_BOSS_1.find(obj => obj.id==skillid))) return;
			sendMessage(bossSkillID.msg);
		}
		// AA_2王
		if ([720, 920, 3017].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = AA_BOSS_2.find(obj => obj.id==skillid))) return;
			sendMessage(bossSkillID.msg);
		}
		// AA_3王
		if ([720, 920, 3017].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0 || !(bossSkillID = AA_BOSS_3.find(obj => obj.id==skillid))) return;
			// 后砸技能判定
			if (skillid==104) {
				if (Date.now() - lastRotationDate > 1200) {
					rotationDelay = 0;
				}
				if (Date.now() - lastTwoUpDate - rotationDelay < 2900) {
					sendMessage(bossSkillID.msg);
				}
				lastTwoUpDate = Date.now();
			} else {
				lastTwoUpDate = 0;
				lastRotationDate = 0;
				// 3王 左/右刀
				if (skillid==109||skillid==111) {
					SpawnString(itemID3, 2000, 180, 500); // 垂直对称轴 头部
					SpawnString(itemID3, 2000,   0, 500); // 垂直对称轴 尾部
					SpawnThing(true, 2000, bossSkillID.sign_degrees, 250);
					if (isTank) bossSkillID.msg = bossSkillID.msg_tk;
				}
				sendMessage(bossSkillID.msg);
			}
		}
		
		// DRC_1王
		if ([783, 983, 3018].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = DRC_BOSS_1.find(obj => obj.id==skillid))) return;
			// 后跳(眩晕)
			if (skillid==108) {
				SpawnThing(   false,  100, 0,  75);
				SpawnCircle(itemID3, 2000, 6, 470);
			}
			// 蓄力捶地
			if (skillid==119) {
				SpawnThing(   false,  100, 180,  90);
				SpawnCircle(itemID3, 2000,   6, 420);
			}
			sendMessage(bossSkillID.msg);
		}
		// DRC_2王
		if ([783, 983, 3018].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = DRC_BOSS_2.find(obj => obj.id==skillid))) return;
			// 点名(击飞)
			if (skillid==105) {
				SpawnString(itemID3, 3000, 180, 600);
			}
			// 上级 属性攻击 - 草地圈范围
			if (skillid==318) {
				SpawnCircle(itemID3, 5000, 20, 680);
			}
			sendMessage(bossSkillID.msg);
		}
		// DRC_3王
		if ([783, 983, 3018].includes(whichmode) && event.templateId==3000) {
			if (event.stage!=0 || !(bossSkillID = DRC_BOSS_3.find(obj => obj.id==skillid))) return;
			// S攻击
			if (skillid==303||skillid==306) {
				SpawnString(itemID3, 5000,  90, 400);       // 王右侧 直线花朵
				SpawnString(itemID3, 5000, 270, 400);       // 王左侧 直线花朵
				SpawnThing(true, 5000, bossSkillID.sign_degrees1, 250); // 王右侧 光柱+告示牌
				SpawnThing(true, 5000, bossSkillID.sign_degrees2, 250); // 王左侧 光柱+告示牌
			}
			sendMessage(bossSkillID.msg);
		}
		
		// GLS_1王
		if ([782, 982, 3019].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = GLS_BOSS_1.find(obj => obj.id==skillid))) return;
			// 后喷
			if (skillid==107) {
				SpawnString(itemID3, 3000,  45, 500);
				SpawnString(itemID3, 3000, 315, 500);
			}
			sendMessage(bossSkillID.msg);
		}
		// GLS_2王
		if ([782, 982, 3019].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = GLS_BOSS_2.find(obj => obj.id==skillid))) return;
			// 内外圈
			if (skillid==301) { // 捶地+旋转
				SpawnCircle(itemID3, 5000, 8, 260);
				SpawnCircle(itemID3, 5000, 6, 580);
			}
			if (skillid==302) { // 旋转+捶地
				SpawnCircle(itemID3, 5000, 8, 260);
				SpawnCircle(itemID3, 5000, 6, 680);
			}
			if (skillid==114) { // 三连拍
				SpawnCircle(itemID3, 5000, 8, 260);
				SpawnCircle(itemID3, 5000, 6, 580);
			}
			// 前砸后砸 横向对称轴
			if (skillid==116) {
				SpawnString(itemID3, 5000,  90, 500); // 右侧直线花朵
				SpawnString(itemID3, 5000, 270, 500); // 左侧直线花朵
			}
			sendMessage(bossSkillID.msg);
		}
		// GLS_3王
		if ([782, 982, 3019].includes(whichmode) && event.templateId==3000) {
			if (!(bossSkillID = GLS_BOSS_3.find(obj => obj.id==skillid))) return;
			// 蓄电层数计数系统
			if (whichmode==982) {
				if (skillid==300) Level = 0, levelMsg = bossSkillID.level_Msg, power = true; // 一次觉醒 开始充能计数
				if (skillid==360) Level = 0;                                                 // 放电爆炸 重置充能计数
				if (skillid==399) Level = 0, levelMsg = bossSkillID.level_Msg;               // 二次觉醒 重置充能计数
				// 充能开关打开 并且 施放以下技能 则增加一层
				if (power) {
					// 三连击, 左后, 左后 (扩散), 右后, 右后 (扩散), 后砸前砸, 尾巴
					if ([118, 143, 145, 146, 154, 144, 147, 148, 155, 161, 162, 213, 215].includes(skillid)) {
						powerMsg = " | " + levelMsg[Level];
						Level++;
					} else {
						powerMsg = "";
					}
				}
				// 屏蔽[三连击]技能连续触发充能
				if (power && (skillid==118)) {
					power = false;
					mod.setTimeout(() => { power = true }, 4000);
				}
			}
			// 左/右扩散电圈标记
			if ([146, 154, 148, 155].includes(skillid)) {
				// 中心点告示牌标记 持续8秒
				SpawnThing(true, 8000, bossSkillID.sign_degrees, bossSkillID.sign_distance);
				// 花圈范围 延迟2.5秒出现 持续5.5秒
				mod.setTimeout(() => {
					SpawnCircle(itemID3, 5500, 15, 160);
					SpawnCircle(itemID3, 5500, 12, 320);
					SpawnCircle(itemID3, 5500, 10, 480);
					SpawnCircle(itemID3, 5500,  8, 640);
					SpawnCircle(itemID3, 5500,  6, 800);
				}, 2500); 
			}
			// 飞天半屏左/右攻击
			if ([139, 150, 141, 152].includes(skillid)) {
				SpawnString(itemID3, 2000, 180, 500); // 垂直对称轴 头部
				SpawnString(itemID3, 2000,   0, 225); // 垂直对称轴 尾部
				SpawnItem(  itemID5, 2000,   0, 250); // 垂直对称轴 尾部特殊标记
				SpawnItem(  itemID5, 2000,   0, 350);
				SpawnItem(  itemID5, 2000,   0, 450);
				SpawnThing(true, 2000, bossSkillID.sign_degrees, 250); // 光柱+告示牌
			}
			sendMessage(bossSkillID.msg + powerMsg);
		}
		
		// GV_1王
		if ([3101, 3201].includes(whichmode) && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = GV_BOSS_1.find(obj => obj.id==skillid))) return;
			// 右手蓄力
			if (skillid==148) {
				SpawnThing(  false,   100, 150, 140);
				SpawnCircle(itemID3, 3000,  10, 320);
			}
			// 左手蓄力
			if (skillid==149) {
				SpawnThing(  false,   100, 200, 140);
				SpawnCircle(itemID3, 3000,  10, 320);
			}
			// 直线后喷
			if (skillid==127||skillid==107) {
				SpawnThing(   false,  100,  90, 140);
				SpawnString(itemID3, 3000,   7, 500);
				SpawnThing(   false,  100, 270, 140);
				SpawnString(itemID3, 3000, 353, 500);
			}
			// 扇形后喷
			if (skillid==131||skillid==111) {
				SpawnThing(   false,  100, 180, 100);
				SpawnString(itemID3, 3000,  70, 800);
				SpawnString(itemID3, 3000, 290, 800);
			}
			// 左右喷射
			if (skillid==132||skillid==112) {
				SpawnString(itemID3, 3000, 340, 800);
				SpawnString(itemID3, 3000,  20, 800);
				SpawnString(itemID3, 3000, 160, 800);
				SpawnString(itemID3, 3000, 200, 800);
			}
			// 前后喷射
			if (skillid==139||skillid==119) {
				SpawnString(itemID3, 3000,  70, 800);
				SpawnString(itemID3, 3000, 110, 800);
				SpawnString(itemID3, 3000, 250, 800);
				SpawnString(itemID3, 3000, 290, 800);
			}
			// 内外圈
			if (skillid==313||skillid==314) {
				SpawnThing(   false,  100, 180,  88);
				SpawnCircle(itemID3, 4000,  10, 300);
			}
			sendMessage(bossSkillID.msg);
		}
		// GV_2王
		if ([3101, 3201].includes(whichmode) && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = GV_BOSS_2.find(obj => obj.id==skillid))) return;
			// 前插 后喷
			if (skillid==108) {
				SpawnThing(   false,  100,  90,   80);
				SpawnString(itemID3, 4000,  15, 1000);
				SpawnThing(   false,  100, 270,   80);
				SpawnString(itemID3, 4000, 345, 1000);
			}
			// 内外圈
			if (skillid==231||skillid==232) {
				SpawnCircle(itemID3, 3000, 10, 300);
			}
			// 前推
			if (skillid==236) {
				SpawnThing(   false,  100,  90,   80);
				SpawnString(itemID3, 4000, 165, 1000);
				SpawnThing(   false,  100, 270,   80);
				SpawnString(itemID3, 4000, 195, 1000);
			}
			sendMessage(bossSkillID.msg);
		}
		
		// AQ_1王
		if (whichmode==3023 && event.templateId==1000) {
			if (event.stage!=0 || !(bossSkillID = AQ_BOSS_1.find(obj => obj.id==event.skill.id))) return;
			// 前插
			if (event.skill.id==1110||event.skill.id==2110) {
				SpawnThing(   false,  100, 180, 180);
				SpawnCircle(itemID3, 3000,  10, 220);
			}
			// 左右手拉
			if ([1111,2111, 1113,2113, 1112,2112, 1114,2114].includes(event.skill.id)) {
				if ([1111,2111, 1113,2113].includes(event.skill.id)) SpawnThing(false, 100, 270, 180); // 左拉
				if ([1112,2112, 1114,2114].includes(event.skill.id)) SpawnThing(false, 100,  90, 180); // 右拉
				SpawnString(itemID3, 2000, 180, 280);
				SpawnString(itemID3, 2000,   0, 500);
				
				if ([1111,2111, 1113,2113].includes(event.skill.id)) SpawnThing(false, 100,  90, 20); // 左拉
				if ([1112,2112, 1114,2114].includes(event.skill.id)) SpawnThing(false, 100, 270, 20); // 右拉
				SpawnString(itemID3, 2000, 180, 280);
				SpawnString(itemID3, 2000,   0, 500);
			}
			// 后扫半圈
			if (event.skill.id==1115||event.skill.id==2115) {
				Half_Circle(itemID3, 2000, 20, 160);
				Half_Circle(itemID3, 2000, 12, 220);
				Half_Circle(itemID3, 2000, 10, 300);
			}
			// 重击
			if (event.skill.id==3107) {
				SpawnThing(   false,  100,  90,   60);
				SpawnString(itemID3, 2000, 170, 1000);
				SpawnThing(   false,  100, 270,   60);
				SpawnString(itemID3, 2000, 190, 1000);
			}
			// 旋转攻击
			if (event.skill.id==3115) {
				SpawnCircle(itemID3, 3000, 8, 320);
			}
			if (event.skill.id==3116) {
				mod.setTimeout(() => { SpawnCircle(itemID3, 3000, 8, 320); }, 2000);
			}
			// 诅咒
			if (myColor && (event.skill.id==3119||event.skill.id==3220)) {
				tipMsg = bossSkillID.TIP[myColor%30231000];
			} else {
				tipMsg = "";
			}
			sendMessage(bossSkillID.msg + tipMsg);
		}
		// AQ_2王
		if (whichmode==3023 && event.templateId==2000) {
			if (event.stage!=0 || !(bossSkillID = AQ_BOSS_2.find(obj => obj.id==skillid))) return;
			// 插地板
			if (skillid==181) {
				SpawnThing(   false,  100,  90,   60);
				SpawnString(itemID3, 3000, 170, 1000);
				SpawnThing(   false,  100, 270,   60);
				SpawnString(itemID3, 3000, 190, 1000);
			}
			// 后退 | 前搓
			if (skillid==202) {
				SpawnThing(   false,  100,  90,  90);
				SpawnString(itemID3, 3000,   0, 500);
				SpawnString(itemID3, 3000, 180, 500);
				SpawnThing(   false,  100, 270,  90);
				SpawnString(itemID3, 3000,   0, 500);
				SpawnString(itemID3, 3000, 180, 500);
			}
			sendMessage(bossSkillID.msg);
		}
		
	}
	// 发送提示文字
	function sendMessage(msg, chl) {
		if (SendToStream) {
			mod.command.message(msg);
		} else {
			mod.send('S_CHAT', 3 , {
				channel: chl ? chl : 21, // 21 = Party_Notice, 1 = Party, 2 = Guild, 25 = 团长通知
				name: 'DG-Guide',
				message: msg
			});
		}
	}
	// 地面提示(光柱+告示牌)
	function SpawnThing(show, times, degrees, radius) {          // 是否显示 持续时间 偏移角度 半径距离
		if (SendToStream) return;
	
		var r = null, rads = null, finalrad = null, spawnx = null, spawny = null;
		r = boss_CurAngle - Math.PI;
		rads = (degrees * Math.PI/180);
		finalrad = r - rads;
		spawnx = boss_CurLocation.x + radius * Math.cos(finalrad);
		spawny = boss_CurLocation.y + radius * Math.sin(finalrad);
		
		curLocation = new Vec3(spawnx, spawny, curLocation.z);
		curAngle = boss_CurAngle;
		
		if (!show) return;
		// 告示牌
		mod.send('S_SPAWN_BUILD_OBJECT', 2, {
			gameId : uid1,
			itemId : itemID1,
			loc : curLocation,
			w : isTank ? boss_CurAngle : r,
			ownerName : "TIP",
			message : "TIP"
		});
		// 龙头光柱
		// curLocation.z = curLocation.z - 100;
		mod.send('S_SPAWN_DROPITEM', 8, {
			gameId: uid2,
			loc: curLocation,
			item: itemID2, // 98260-古龙贝勒古斯的头
			amount: 1,
			expiry: 600000
		});
		// curLocation.z = curLocation.z + 100;
		// 延迟消除
		setTimeout(DespawnThing, times, uid1, uid2);
		uid1--;
		uid2--;
	}
	// 消除 光柱+告示牌
	function DespawnThing(uid_arg1, uid_arg2) {
		mod.send('S_DESPAWN_BUILD_OBJECT', 2, {
			gameId : uid_arg1
		});
		mod.send('S_DESPAWN_DROPITEM', 4, {
			gameId: uid_arg2
		});
	}
	// 地面提示(花朵)
	function SpawnItem(item, times, degrees, radius) {           // 显示物品 持续时间 偏移角度 半径距离
		if (SendToStream) return;
		
		var r = null, rads = null, finalrad = null, spawnx = null, spawny = null;
		r = curAngle - Math.PI;
		rads = (degrees * Math.PI/180);
		finalrad = r - rads;
		spawnx = curLocation.x + radius *Math.cos(finalrad);
		spawny = curLocation.y + radius *Math.sin(finalrad);
		// 花朵
		mod.send('S_SPAWN_COLLECTION', 4, {
			gameId : uid3,
			id : item,
			amount : 1,
			loc : new Vec3(spawnx, spawny, curLocation.z),
			w : r
		});
		// 延时消除
		setTimeout(Despawn, times, uid3);
		uid3--;
	}
	// 消除 花朵
	function Despawn(uid_arg3) {
		mod.send('S_DESPAWN_COLLECTION', 2, {
			gameId : uid_arg3
		});
	}
	// 构造 直线花朵
	function SpawnString(item, times, degrees, maxRadius) {      // 显示物品 持续时间 偏移角度 最远距离
		for (var radius=50; radius<=maxRadius; radius+=50) {     // 默认间隔 50
			SpawnItem(item, times, degrees, radius);
		}
	}
	// 构造 圆形花圈
	function SpawnCircle(item, times, intervalDegrees, radius) { // 显示物品 持续时间 偏移间隔 半径距离
		for (var degrees=0; degrees<360; degrees+=intervalDegrees) {
			SpawnItem(item, times, degrees, radius);
		}
	}
	// 构造 后方 半圆形 花圈
	function Half_Circle(item, times, intervalDegrees, radius) { // 显示物品 持续时间 偏移间隔 半径距离
		for (var degrees=0; degrees<360; degrees+=intervalDegrees) {
			if (90<degrees && degrees<270) continue;
			SpawnItem(item, times, degrees, radius);
		}
	}
	
	mod.hook('C_PLAYER_LOCATION', 5, event => {
		if (!debug) return;
		boss_CurLocation = event.loc;
		boss_CurAngle = event.w;
		curLocation = event.loc;
		curAngle = event.w;
	});
}
