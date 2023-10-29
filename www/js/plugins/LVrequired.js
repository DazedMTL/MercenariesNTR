//=============================================================================
// レベル制限装備 / requiredLevelEquipment.js
//=============================================================================

/*:ja
 * v0.5.0
 * @plugindesc レベルが足りないと装備できない武器防具を作成する
 * @author Declare War
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * 武器、防具のメモ:
 *   <requiredLevel:n>       # 装備に必要なレベル
 */

/*:en
 * @plugindesc required level equipment
 * @author Declare War
 *
 * @help This plugin does not provide plugin commands.
 *
 * Weapon, Armor Note:
 *   <requiredLevel:n>       # required level
 */

(function () {
	// Game_BattlerBase
	// canEquip #a
	var _Game_BattlerBase_canEquip = Game_BattlerBase.prototype.canEquip;
	Game_BattlerBase.prototype.canEquip = function (item) {
		if (_Game_BattlerBase_canEquip.call(this, item)) {
			if (this.level >= Number(item.meta.requiredLevel || 0)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};

})();