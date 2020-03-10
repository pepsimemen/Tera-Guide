module.exports = {
	// Enter Dungeon Announcement
	DungeonInfo : [
		{zone: 9066, string: '<font color="#56B4E9">Demon Wheel</font>'},
		
		{zone: 9059, string: '<font color="#56B4E9">Forsaken Island</font> <font color="#E69F00">Normal</font>'},
		{zone: 9759, string: '<font color="#56B4E9">Forsaken Island</font> <font color="#00FFFF">Hard</font>'},
		
		{zone: 9767, string: '<font color="#56B4E9">Demokron Factory</font> <font color="#E69F00">Normal</font>'},
		{zone: 9067, string: '<font color="#56B4E9">Demokron Factory</font> <font color="#00FFFF">Hard</font>'},
		
		{zone: 9770, string: '<font color="#56B4E9">Ruinous Manor</font> <font color="#E69F00">Normal</font>'},
		{zone: 9970, string: '<font color="#56B4E9">Ruinous Manor</font> <font color="#00FFFF">Hard</font>'},
		
		{zone: 9781, string: '<font color="#56B4E9">Velik Sanctuary</font> <font color="#E69F00">Normal</font>'},
		{zone: 9981, string: '<font color="#56B4E9">Velik Sanctuary</font> <font color="#00FFFF">Hard</font>'},
		
		{zone: 9735, string: '<font color="#56B4E9">RK9</font> <font color="#E69F00">Normal</font>'},
		{zone: 9935, string: '<font color="#56B4E9">RK9</font> <font color="#00FFFF">Hard</font>'},
		
		{zone: 9739, string: '<font color="#56B4E9">Red Refuge</font> <font color="#E69F00">Normal</font>'},
		{zone: 9939, string: '<font color="#56B4E9">Red Refuge</font> <font color="#00FFFF">Hard</font>'},
		
		{zone: 9720, string: '<font color="#56B4E9">Antaroth Abyss</font> <font color="#E69F00">Normal</font>'},
		{zone: 9920, string: '<font color="#56B4E9">Antaroth Abyss</font> <font color="#00FFFF">Hard</font>'},
		{zone: 3017, string: '<font color="#56B4E9">Antaroth Abyss</font> <font color="#FF0000"> 7人</font>'},
		
		{zone: 9783, string: '<font color="#56B4E9">Dark Reach Citadel</font> <font color="#E69F00">Normal</font>'},
		{zone: 9983, string: '<font color="#56B4E9">Dark Reach Citadel</font> <font color="#00FFFF">Hard</font>'},
		{zone: 3018, string: '<font color="#56B4E9">Dark Reach Citadel</font> <font color="#FF0000"> 7人</font>'},
		
		{zone: 9782, string: '<font color="#56B4E9">Grotto Lost Souls</font> <font color="#E69F00">Normal</font>'},
		{zone: 9982, string: '<font color="#56B4E9">Grotto Lost Souls</font> <font color="#00FFFF">Hard</font>'},
		{zone: 3019, string: '<font color="#56B4E9">Grotto Lost Souls</font> <font color="#FF0000"> 7人</font>'},
		
		{zone: 3101, string: '<font color="#56B4E9">Gossamer Vault</font> <font color="#E69F00">Normal</font>'},
		{zone: 3201, string: '<font color="#56B4E9">Gossamer Vault</font> <font color="#00FFFF">Hard</font>'},
		
		{zone: 3023, string: '<font color="#56B4E9">AQ</font>'}
	],
	// Demon Wheel (Demon's Wheel)
	DW_BOSS_1 : [
		{id: 105, msg: 'Leap(Stun)'},
		{id: 106, msg: 'Tail Backspray'},
		{id: 109, msg: 'Front Slam(Tank)'},
		{id: 110, msg: 'Swing Tail(Poison)'},
		// > 50%
		{id: 306, msg: '+1Ring'},
		{id: 307, msg: '+2Ring'},
		{id: 308, msg: '+3Ring'},
		{id: 309, msg: '+4Ring'},
		{id: 310, msg: '+5Ring'},
		// < 50%
		{id: 319, msg: '+1Ring'},
		{id: 320, msg: '+2Ring'},
		{id: 321, msg: '+3Ring'},
		{id: 322, msg: '+4Ring'},
		{id: 323, msg: '+5Ring'},
		// Identify - Calculate Total Rings(Double Blue /Red Single) Similar In Ring Different Out Ring
		{id: 311, msg: 'Out Ring'}, // Boss-Red buff
		{id: 315, msg: 'Out Ring'}, // Boss-Red buff
		{id: 313, msg: 'Out Ring'}, // Boss-Blue buff
		{id: 317, msg: 'Out Ring'}, // Boss-Blue buff
		
		{id: 312, msg: 'In Ring'}, // Boss-Red buff
		{id: 316, msg: 'In Ring'}, // Boss-Red buff
		{id: 314, msg: 'In Ring'}, // Boss-Blue buff
		{id: 318, msg: 'In Ring'}  // Boss-Blue buff
		
	],
	DW_TipMsg1: ["Double(Blue )", "Single(Red)"],
	DW_BOSS_2 : [
		{id: 113, msg: 'Laser!!'},
		{id: 116, msg: 'Pull(Group)'},
		// {id: 217, msg: 'Blue Ring - 1 Time Hurt'},
		{id: 223, msg: 'Red Ring - 2 Time Hurt'},
		{id: 303, msg: 'Hit and Throw'},
		{id: 309, msg: 'In Arena | Boss Raise(Blue )Ball In Ring'}, // ==> DW_TipMsg2[4]
		{id: 310, msg: 'In Arena | Boss Raise(Red)Ball In Ring'}, // ==> DW_TipMsg2[4]
		// Boss Raise(Blue )Ball
		{id: 311, msg: 'In Ring(Blue '},
		{id: 313, msg: 'Out Ring(Blue)'},
		// Boss Raise(Red)Ball
		{id: 314, msg: 'In Ring(Red)'},
		{id: 312, msg: 'Out Ring(Red)'}
		
	],
	DW_TipMsg2: [
		"Next -> ",
		"Red(Smooth) | (Blue +White)", "White(Tank) | (Red+Blue )", "Blue (Tank) | (Red+White)", // 466050   466051   466052
		"All!!",
		"Red(Reverse)",           "White(Reverse)",           "Blue (Reverse)"            // 466054   466055   466056
	],
	// Forsaken Island (Forsaken Island)
	FI_BOSS_1 : [
		{id: 1104, msg: 'Big Jump(Stun)'},
		{id: 2104, msg: 'Big Jump(Stun)'},
		{id: 1106, msg: 'Spin'},
		{id: 2106, msg: 'Spin'}
		// 3111 Curse
		// 3106 Identify-Outer Ring Explode
		// 3101 Identify-Inner Ring Explode
	],
	FI_BOSS_2 : [
		{id: 3101, msg: 'Stomp(Repel)'},
		{id: 3102, msg: 'Party Yellow Ring(Explode)'},
		{id: 3104, msg: 'Big AOE!!'},
		{id: 3105, msg: 'Pull | Push'},
		{id: 3107, msg: 'Poison Ring(Dodge)'}
	],
	FI_BOSS_3 : [
		{id: 1101, msg: 'Diffuse'},
		{id: 2101, msg: 'Diffuse'},
		{id: 1102, msg: 'Pull'},
		{id: 2102, msg: 'Pull'},
		
		{id: 1106, msg: 'Care Carpet'}, // Forward Missile
		{id: 2106, msg: 'Care Carpet'},
		{id: 1107, msg: 'Care Carpet'}, // Back Missile
		{id: 2107, msg: 'Care Carpet'},
		{id: 1108, msg: 'Care Carpet'}, // Right Missile
		{id: 2108, msg: 'Care Carpet'},
		{id: 1109, msg: 'Care Carpet'}, // Left Missile
		{id: 2109, msg: 'Care Carpet'},
		
		{id: 1110, msg: 'Lightning'},
		{id: 2110, msg: 'Lightning'},
		
		{id: 3105, msg: 'Seek Player(Evade)'},
		{id: 3108, msg: 'Curse x2'},
		{id: 3109, msg: 'Carpet Identify'}
	],
	FI_TipMsg : ['Curse x1 | Outer Ring', 'Curse x2', 'Lasers!'],
	// Demokron Factory (Demokron Factory)
	DF_BOSS_1 : [
		
	],
	DF_BOSS_2 : [
		
	],
	DF_BOSS_3 : [
		{id: 205, msg: 'Repel(Slow Slow Slow)'},
		{id: 218, msg: 'Repel'},
		{id: 211, msg: 'In->Out'},
		{id: 212, msg: 'Out->In'},
		{id: 219, msg: 'In Out Same Time'}
	],
	// RM (Ruinous Manor)
	RM_BOSS_1 : [
		{id: 107, msg: 'Front Spray(Tank)'}
	],
	RM_BOSS_2 : [
		{id: 106, msg: 'Slam(Stun)'},
		{id: 111, msg: 'Rapid Hit(Cannot Block)'}
	],
	RM_BOSS_3 : [
		// 102 101 103          Back Spray
		{id: 103, msg: 'Back Spray(Hand Hit)'},
		// 101 102 104 105     No Push
		// 101 102 104 106 107 Push Tank
		{id: 106, msg: 'Front Push(Tank)'},
		{id: 110, msg: 'Tail Sweep!!'}, // 108 110 111
		// {id: 317, msg: 'Spread Balls!!'},
		// {id: 319, msg: 'Spread Balls!!'}, // Rage
		// {id: 303, msg: 'Circles'},
		// {id: 304, msg: 'Circles'}, // Rage
		{id: 113, msg: 'Out'}, // 113  114 115
		{id: 116, msg: 'In'}, // 116  117 118
		// < 30% 
		{id: 311, msg: 'Knockback!!'},
		{id: 322, msg: 'Destiny!!(Healer take Buff)'}
	],
	// Velik Sanctuary (Velik’s Sanctuary)
	VS_BOSS_1 : [
		{id: 301, msg: 'Silence(All)'},
		{id: 304, msg: 'In Out Ring'},
		{id: 401, msg: 'Left Safe', msg_tk: '→→→ →→ →', sign_degrees: 270},
		{id: 402, msg: 'Right Safe', msg_tk: '← ←← ←←←', sign_degrees:  90}
	],
	VS_BOSS_2 : [
		{id: 106, msg: 'Back Slam ↓'},
		{id: 108, msg: 'Front Slam ↑'},
		{id: 131, msg: 'Left Safe ←←', msg_tk: '→→→ →→ →', sign_degrees: 270},
		{id: 130, msg: 'Right Safe', msg_tk: '← ←← ←←←', sign_degrees:  90},
		{id: 134, msg: 'Warning'}
	],
	VS_BOSS_3 : [
		{id: 116, msg: 'Front Slam(Stun Tank)', msg2: 'Donut(Knock Up)'},
		{id: 138, msg: 'Get Away!!'},
		{id: 144, msg: 'Outer Ring Safe ↓'},
		{id: 145, msg: 'Inner Ring Safe ↑'},
		// {id: 149, msg: 'Front Stab(Tank)'},
		{id: 151, msg: 'Ground Slam(Stun) + Seek Player(3 Claw)'},
		{id: 152, msg: 'Front Slam(Stun) | Back Kick(Repel)'},
		{id: 701, msg: 'Back Sweep(Repel) | Front Stab(Dodge)'},
		{id: 103, msg: 'Lightning (Split)'},
		{id: 301, msg: 'Bomb (Gather) | Cleanse'},
		{id: 404, msg: 'Warning (Near)'},
		{id: 105, msg: 'Lightning (Gather)'},
		{id: 302, msg: 'Bomb (Gather) | Add HP'},
		{id: 405, msg: 'Warning (Far)'},
		{id: 401, msg: 'Spread!!'},
		{id: 402, msg: 'Stun Boss!!'}
	],
	//            0           1         2         3         1+3=4     2+3=5     3+3=6
	VS_TipMsg : ["Next -> ", "Warning(Near x2)", "Dodge(Spread)", "Explode(Dismantle)", "Warning(Far x2)", "Dodge(Gather)", "Explode(Add HP)"],
	// RR (Red Refuge)
	RR_BOSS_1 : [
	
	],
	RR_BOSS_2 : [
		{id: 119, msg: 'Front Spray'},
		{id: 120, msg: 'Back Spray'}
	],
	RR_BOSS_3 : [
		{id: 115, msg: 'Roar(Stun)!!'},
		{id: 175, msg: 'Real Roar(Stun)'},
		{id: 201, msg: 'Real·Face(Dodge)'}
	],
	// AAN (Antaroth’s Abyss)
	AA_BOSS_1 : [
		{id: 116, msg: 'Out'},
		{id: 117, msg: 'In'},
		{id: 300, msg: '~I want to fly high~'}
	],
	AA_BOSS_2 : [
		// {id: 111, msg: 'Left Hand+Back Pull'},
		// {id: 112, msg: 'Left Hand+Back Pull'},
		// {id: 110, msg: 'Front Stab(Stun)'},
		// {id: 115, msg: 'Spin'},
		{id: 119, msg: 'Curse!!'}
	],
	AA_BOSS_3 : [
		{id: 104, msg: 'Back Stun'},
		{id: 113, msg: 'Front Stun | Back Stun'},
		{id: 202, msg: 'Backstep | Spin'},
		{id: 109, msg: '←← Left Safe', msg_tk: '→→→ →→ →', sign_degrees: 270},
		{id: 111, msg: 'Right Safe →→', msg_tk: '← ←← ←←←', sign_degrees:  90},
		{id: 310, msg: 'Puddle'},
		{id: 311, msg: 'Puddle'},
		{id: 312, msg: 'Puddle'},
		{id: 313, msg: 'Puddle'},
		{id: 314, msg: 'Puddle'},
		{id: 400, msg: '3Phantom Laser'}, // 3Phantom-Laser 205 500 400 204 204
		{id: 401, msg: '3Phantom Spin'}  // 3Phantom-Spin 205 500 401 115 309
	],
	// Dark Reach Citadel (Dark Reach Citadel)
	DRC_BOSS_1 : [
		{id: 108, msg: 'Backleap(Stun)'},
		{id: 109, msg: 'Backsweep(Repel)'},
		{id: 119, msg: 'GroundSlam'},
		{id: 127, msg: 'Lightning!!'}
	],
	DRC_BOSS_2 : [
		{id: 105, msg: 'Seek Player(Knock Up)'},
		{id: 110, msg: 'Front Slam(Dodge)'},
		{id: 111, msg: 'Right Back Kick(Repel)'},
		{id: 115, msg: 'Left Back Kick(Repel)'},
		{id: 119, msg: 'Leap(Stun)'},
		{id: 120, msg: 'Front Punch | Back Kick(Repel)'},
		{id: 316, msg: 'Flame(Explode)'},
		{id: 317, msg: 'Puddle(Knock Up)'},
		{id: 318, msg: 'Carpet(Stun)'}
	],
	DRC_BOSS_3 : [
		{id: 106, msg: 'Front Push(Repel)'},
		{id: 109, msg: 'Front Stab(Stun)'},
		{id: 112, msg: 'Back Sweep(Repel)'},
		{id: 301, msg: 'Ground Spikes(Knock Up)'},
		{id: 303, msg: 'Right', sign_degrees1:  80, sign_degrees2: 260},
		{id: 306, msg: 'Left', sign_degrees1: 100, sign_degrees2: 280},
		{id: 309, msg: 'Warning!!'},
		{id: 315, msg: 'Fear(Suck Blood)'}
	],
	DRC_TipMsg : ["100 Energy Identify!!"],
	// Grotto (Grotto of Lost Souls)
	GLS_BOSS_1 : [
		{id: 106, msg: 'Heavy Blow(Tank)'},
		{id: 107, msg: 'Backspray(Knockback)'},
		{id: 109, msg: 'Rolling Stones(Small)'},
		{id: 110, msg: 'Rolling Stones(Big)'},
		{id: 116, msg: 'Whole Map Attack!!'},
		{id: 301, msg: 'Floor Flower(Stun)'},
		{id: 307, msg: 'Cage(Imprison)'},
		{id: 309, msg: '1 Flower!!'},
		{id: 310, msg: '2 Flower!!'},
		{id: 312, msg: 'Gold Flower!'}
	],
	GLS_BOSS_2 : [
		{id: 105, msg: 'Rolling Attack'},
		{id: 113, msg: 'Double Slam(Stun)'},
		{id: 114, msg: 'Triple Slam(Stay Near)'},
		{id: 116, msg: 'Front Smash|Back Smash'},
		{id: 301, msg: ' Slam Floor(Retreat) | Spin(Knockback)'},
		{id: 302, msg: ' Spin(Get Near) | Slam Floor(Knockback)'}
	],
	GLS_BOSS_3 : [
		{id: 118, msg: 'Triple Combo(Left-Right-Spray)'},
		{id: 143, msg: 'Left Back'},
		{id: 145, msg: 'Left Back'},
		{id: 146, msg: 'Left Back(Spread) →→', sign_degrees: 325, sign_distance: 370},
		{id: 154, msg: 'Left Back(Spread) →→', sign_degrees: 325, sign_distance: 370},
		{id: 144, msg: 'Right Back'},
		{id: 147, msg: 'Right Back'},
		{id: 148, msg: 'Right Back(Spread)', sign_degrees: 25, sign_distance: 388},
		{id: 155, msg: 'Right Back(Spread)', sign_degrees: 25, sign_distance: 388},
		{id: 161, msg: 'Back Slam | Front Slam'},
		{id: 162, msg: 'Back Slam | Front Slam'},
		{id: 213, msg: 'Tail!!'},
		{id: 215, msg: 'Tail!!'},
		{id: 139, msg: 'Boss Left Safe (Smooth)', sign_degrees: 270}, //151
		{id: 150, msg: 'Boss Left Safe (Smooth)', sign_degrees: 270}, //151
		{id: 141, msg: '(Inverse) Boss Right Safe', sign_degrees:  90}, //153
		{id: 152, msg: '(Inverse) Boss Right Safe', sign_degrees:  90}, //153
		{id: 300, msg: '1st Phase(Knockback)', level_Msg: ['1st Phase!', '2nd Phase!!', '3rd Phase!!!', '<font color="#FF0000">Explode!!!!</font>']},
		{id: 399, msg: '2nd Phase(Knockback)', level_Msg: ['1st Phase!', '<font color="#FF0000">Explode!!</font>']},
		{id: 360, msg: 'Explode!! Explode!!'}
	],
	// GVN (Gossamer Vault)
	GV_BOSS_1 : [
		{id: 124, msg: 'Front Slam(Stun)'},
		{id: 131, msg: 'Backspray'},
		{id: 132, msg: 'Left Right Spray Shot'},
		
		{id: 133, msg: 'Leap(Knockup)-1'},
		{id: 138, msg: 'Leap(Knockup)-2'},
		{id: 113, msg: '(Slow)Leap(Knockup)-1'},
		{id: 118, msg: '(Slow)Leap(Knockup)-2'},
		
		{id: 127, msg: '|Straight Backblast|'},
		{id: 111, msg: '(Slow)|Straight Backblast|'},
		
		{id: 139, msg: 'Front and Back Blast'},
		{id: 119, msg: '(Slow)Front and Back Blast'},
		
		{id: 148, msg: 'Right arm slam(Knockup)'},
		{id: 149, msg: 'Left arm slam(Knockup)'},
		
		{id: 313, msg: 'Out In Cirle'},
		{id: 314, msg: '(Fast)Out In Circle'},
		
		{id: 305, msg: 'Pizza'}
	],
	GV_BOSS_2 : [
		{id: 105, msg: 'Front Stab'}, // 104 105
		{id: 109, msg: 'Dodge(slow slow slow)'},
		{id: 108, msg: 'Front Stab | Backblast'},
		{id: 228, msg: 'Heal Heal Heal'},
		{id: 230, msg: 'Powder Explosion'},
		{id: 231, msg: 'Get Out'},
		{id: 232, msg: 'Get In'},
		{id: 235, msg: 'Look Out'}
	],
	// Akalath Quarantine (Akalath Quarantine)
	AQ_BOSS_1 : [
		{id: 1104, msg: 'Jump Stun'},
		{id: 2104, msg: 'Jump Stun'},
		{id: 1110, msg: 'Front Stun'},
		{id: 2110, msg: 'Front Stun'},
		{id: 1111, msg: 'Left Slash'},
		{id: 1113, msg: 'Left Slash'}, // 1112 1113
		{id: 2111, msg: 'Left Slash'},
		{id: 2113, msg: 'Left Slash'}, // 2112 2113
		{id: 1112, msg: 'Right Slash'},
		{id: 1114, msg: 'Right Slash'}, // 1111 1114
		{id: 2112, msg: 'Right Slash'},
		{id: 2114, msg: 'Right Slash'}, // 2111 2114
		{id: 1115, msg: 'Backslash'},
		{id: 2115, msg: 'Backslash'},
		{id: 1116, msg: 'Explosion (Shield)!!'}, // 1117
		{id: 2116, msg: 'Explosion (Shield)!!'}, // 2117
		{id: 3107, msg: 'Forward Wave'},
		{id: 3115, msg: 'Spin'}, // 1106 2106
		{id: 3116, msg: 'Circles + Spin'}, // 1106 2106
		{id: 3119, msg: 'Debuff ', TIP: [" Get OUT", " Get IN"]}, // Red OUT | Blue IN
		{id: 3220, msg: 'Debuff ', TIP: [" Get IN", " Get OUT"]}  // Red IN | Blue OUT
	],
	AQ_BOSS_2 : [
		{id: 164, msg: 'Hold (Bleed)'},
		{id: 166, msg: 'Turn around'}, // 169 166 前搓 左购拳 右勾拳
		{id: 175, msg: 'Roar (iframe)!!'},
		{id: 181, msg: 'Rock'},
		// 214 Triple Rocks 181
		{id: 182, msg: 'Stomp (Knockdown)'}, // 183 184
		// 302 209 Stomp (Knockdown) 182 183 184
		{id: 185, msg: 'Explosion (Shield)!!'},
		{id: 202, msg: 'Back + Front Stab'},  // 177
		{id: 207, msg: 'AimBack (Bleed)'}, // 204 206 205
		{id: 212, msg: 'Bait (Bleed)'}    // 180
	]
}
