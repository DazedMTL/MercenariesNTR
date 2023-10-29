/*:ja
 * @plugindesc タイトルのオプションを消します
 * @author mijiishi
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function () {

    Window_TitleCommand.prototype.makeCommandList = function () {
        this.addCommand(TextManager.newGame, 'newGame');
        this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
        //    this.addCommand(TextManager.options,   'options');
    };

})();