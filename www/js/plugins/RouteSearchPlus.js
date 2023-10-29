/*:ja
 * @plugindesc 経路探索の距離を変更します。
 * @author mijiishi
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function () {

    Game_Character.prototype.searchLimit = function () {
        return 50;
    };

})();