// Copyright (c) 2016-2018 fuku
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//

// 最新版は↓から
// http://www5f.biglobe.ne.jp/~fuku-labo/library/etc/

/*:
 * @plugindesc ピクチャのちらつき防止 v1.01
 * @author fuku
 *
 * @param ピクチャの同期
 * @desc ピクチャの表示命令で読み込み完了までウェイトするかのデフォルトを設定します。
 * @default false
 *
 * @help ピクチャの表示時に、画像の読み込みが完了するまで直前の表示状態を維持します。
 * 適用すると、既に表示しているピクチャ番号のピクチャの表示内容を変更した時、
 * ロード完了まで画像が消えてしまう問題を回避できるようになります。
 *
 * 注意：「ピクチャの同期」設定は
 *   イベントコマンド「ピクチャの表示」の動作にのみ適用されます。
 *   それ以外の方法でピクチャを操作した場合には影響しません。
 *   また、ロード完了まで直前の画像を維持する機能はこの設定に関わらず動作します。
 *
 * このプラグインはリストの一番下に配置するようにしてください。
 *
 * プラグインコマンド：
 * FPAF_SET_SYNC ピクチャの同期を再設定します。
 *           パラメータにtrueを指定すると同期、falseを指定すると非同期になります。
 */

var Fuku_Plugins = Fuku_Plugins || {};
Fuku_Plugins.PictureAntiFlicker = { Version: 101 };

(function () {
	'use strict';
	var plugin_name = 'fuku_PictureAntiFlicker';
	Fuku_Plugins.PictureAntiFlicker.picture_sync = (PluginManager.parameters(plugin_name)['ピクチャの同期'] === 'true');

	var fuku_Sprite_bitmap_setter = Object.getOwnPropertyDescriptor(Sprite.prototype, 'bitmap').set;
	var update_waitbitmap = function () {//Sprite_Picture
		if (this._fuku_waitbitmap.isReady()) {
			fuku_Sprite_bitmap_setter.call(this, this._fuku_waitbitmap);
			this._fuku_waitbitmap = null;
		}
	};

	Object.defineProperty(Sprite_Picture.prototype, 'bitmap', {
		get: function () {
			return this._bitmap;
		},
		set: function (value) {
			this._fuku_waitbitmap = value;
			if (value) update_waitbitmap.call(this);
			else fuku_Sprite_bitmap_setter.call(this, null);
		},
		configurable: true
	});

	var sp_update = Sprite_Picture.prototype.update;
	Sprite_Picture.prototype.update = function () {
		var picture = this.picture();
		var name = (picture ? picture.name() : '');
		if (name !== this._pictureName) this.updateBitmap();

		if (this._fuku_waitbitmap) update_waitbitmap.call(this);

		if (!this._fuku_waitbitmap) {
			sp_update.call(this);
		}
	};

	var gi_command231 = Game_Interpreter.prototype.command231;
	Game_Interpreter.prototype.command231 = function () {
		if (!gi_command231.call(this)) {
			return false;
		}
		if (Fuku_Plugins.PictureAntiFlicker.picture_sync) {
			this.setWaitMode('image');
		}
		return true;
	};

	var gi_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command, args) {
		gi_pluginCommand.apply(this, arguments);
		switch (command) {
			case 'FPAF_SET_SYNC':
				Fuku_Plugins.PictureAntiFlicker.picture_sync = (args[0] === 'true');
				break;
		}
	};

})();