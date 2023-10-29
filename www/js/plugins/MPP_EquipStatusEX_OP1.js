//=============================================================================
// MPP_EquipStatusEX_OP1.js
//=============================================================================
// Copyright (c) 2017 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.1】拡張表示をショップのステータスにも反映させます。
 * @author 木星ペンギン
 *
 * @help ● 1ページ内に表示される人数が多いほど、表示されるステータスの行数が減ります。
 *    デフォルトの画面サイズでは全部で9行です。
 *    2人の場合は一人4行、3人の場合は一人3行、4人の場合は一人2行となります。
 *  
 * ● 歩行グラの表示を有効にした場合、グラフィックの幅だけ表示が右にずれます。
 *  
 * ● [装備中表示]は同じアイテムを装備している場合に表示されます。
 * 
 * ● その他プラグインパラメータで設定する値は[MPP_EquipStatusEX]と同じです。
 * 
 *  ・能力値
 *     0:最大ＨＰ, 1:最大ＭＰ, 2:攻撃力, 3:防御力,
 *     4:魔法力,   5:魔法防御, 6:敏捷性, 7:運,
 *  
 *     8:命中率,      9:回避率,     10:会心率, 11:会心回避率,
 *    12:魔法回避率, 13:魔法反射率, 14:反撃率, 15:ＨＰ再生率,
 *    16:ＭＰ再生率, 17:ＴＰ再生率,
 *  
 *    18:狙われ率,   19:防御効果率,     20:回復効果率,   21:薬の知識,
 *    22:ＭＰ消費率, 23:ＴＰチャージ率, 24:物理ダメージ, 25:魔法ダメージ,
 *    26:床ダメージ, 27:経験獲得率
 *  
 *  ・表示タイプ
 *    0 : 非表示
 *    1 : [固定ステータス]として表示
 *    2 : [装備品ステータス]として表示
 *    3 : [変動ステータス]として表示
 *    4 : [装備品ステータス]または[変動ステータス]として表示
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 *
 * @param === Status ===
 * 
 * @param Weapon Fixing Status
 * @desc 武器選択時の固定ステータスの配列
 * @default 2
 * @parent === Status ===
 * 
 * @param Armor Fixing Status
 * @desc 防具選択時の固定ステータスの配列
 * @default 3
 * @parent === Status ===
 * 
 * @param Item Status
 * @desc 装備品ステータスの配列
 * @default 2-7
 * @parent === Status ===
 * 
 * @param Flow Status
 * @desc 変動ステータスの配列
 * @default 0-27
 * @parent === Status ===
 * 
 * @param === Traits ===
 * 
 * @param Element Rate Type
 * @type number
 * @max 4
 * @desc 属性有効度の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 * @parent === Traits ===
 * 
 * @param Debuff Rate Type
 * @type number
 * @max 4
 * @desc 弱体有効度の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 * @parent === Traits ===
 * 
 * @param State Rate Type
 * @type number
 * @max 4
 * @desc ステート有効度の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 4
 * @parent === Traits ===
 * 
 * @param State Resist Type
 * @type number
 * @max 4
 * @desc ステート無効化の表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 3
 * @parent === Traits ===
 * 
 * @param Equip Feature Type
 * @type number
 * @max 4
 * @desc メモ欄で追加したステートの表示タイプ
 * (0:非表示, 1:固定, 2:装備, 3:変動, 4:装備or変動)
 * @default 3
 * @parent === Traits ===
 * 
 * @param === Shop Window ===
 * 
 * @param Members Size
 * @type number
 * @desc １ページに表示する人数(1-4)
 * @default 4
 * @parent === Shop Window ===
 * 
 * @param Actor Name Draw?
 * @type boolean
 * @desc アクターの名前を表示するかどうか
 * @default true
 * @parent === Shop Window ===
 * 
 * @param Character Draw?
 * @type boolean
 * @desc アクターの歩行グラを表示するかどうか
 * @default false
 * @parent === Shop Window ===
 * 
 * @param Equipping Item Draw?
 * @type boolean
 * @desc 装備中のアイテムを表示するかどうか
 * @default false
 * @parent === Shop Window ===
 * 
 * @param Equipping Text
 * @desc 装備中表示
 * @default Ｅ
 * @parent === Shop Window ===
 * 
 * @param Equipping Pos
 * @type number
 * @max 2
 * @desc [装備中表示]の表示位置
 * (0:非表示, 1:名前の右, 2:歩行グラに重ねて)
 * @default 1
 * @parent === Shop Window ===
 * 
 * @param Equipping Font Size
 * @type number
 * @desc [装備中表示]の文字サイズ
 * @default 24
 * @parent === Shop Window ===
 * 
 * 
 * 
 */

(function () {

    var MPPlugin = {};

    (function () {

        var parameters = PluginManager.parameters('MPP_EquipStatusEX_OP1');

        MPPlugin.contains = {};
        MPPlugin.contains['EquipStatusEX'] = $plugins.some(function (plugin) {
            return (plugin.name === 'MPP_EquipStatusEX' && plugin.status);
        });

        function convertParam(name) {
            var param = parameters[name];
            var result = [];
            if (param) {
                var data = param.split(',');
                for (var i = 0; i < data.length; i++) {
                    if (/(\d+)\s*-\s*(\d+)/.test(data[i])) {
                        for (var n = Number(RegExp.$1); n <= Number(RegExp.$2); n++) {
                            result.push(n);
                        }
                    } else {
                        result.push(Number(data[i]));
                    }
                }
            }
            return result;
        };

        // Status
        MPPlugin.WeaponFixingStatus = convertParam('Weapon Fixing Status');
        MPPlugin.ArmorFixingStatus = convertParam('Armor Fixing Status');
        MPPlugin.itemStatus = convertParam('Item Status');
        MPPlugin.flowStatus = convertParam('Flow Status');

        // Traits
        MPPlugin.elementRateType = Number(parameters['Element Rate Type'] || 2);
        MPPlugin.debuffRateType = Number(parameters['Debuff Rate Type'] || 2);
        MPPlugin.stateRateType = Number(parameters['State Rate Type'] || 2);
        MPPlugin.stateResistType = Number(parameters['State Resist Type'] || 2);
        MPPlugin.equipFeatureType = Number(parameters['Equip Feature Type'] || 2);

        // Shop Status
        MPPlugin.MembersSize = Number(parameters['Members Size'] || 4).clamp(1, 4);
        MPPlugin.ActorNameDraw = !!eval(parameters['Actor Name Draw?']);
        MPPlugin.CharacterDraw = !!eval(parameters['Character Draw?']);
        MPPlugin.EquippingItemDraw = !!eval(parameters['Equipping Item Draw?']);
        MPPlugin.EquippingPos = Number(parameters['Equipping Pos']);
        MPPlugin.EquippingFontSize = Number(parameters['Equipping Font Size']);

        // Terms
        MPPlugin.terms = {};
        MPPlugin.terms.Equipping = parameters['Equipping Text'];

    })();

    if (!MPPlugin.contains['EquipStatusEX']) {
        alert('EquipStatusEX プラグインが導入されていません。\nMPP_EquipStatusEX_OP1 は機能しません。');
        return;
    }

    var Alias = {};

    //-----------------------------------------------------------------------------
    // Window_ShopStatus

    Window_ShopStatus._directionPattern = [2, 4, 8, 6];

    //14
    Alias.WiShSt_initialize = Window_ShopStatus.prototype.initialize;
    Window_ShopStatus.prototype.initialize = function (x, y, width, height) {
        this._animeCount = 0;
        this._animeIndex = 0;
        this._animePattern = 0;
        this._list = [];
        Alias.WiShSt_initialize.call(this, x, y, width, height);
    };

    //21
    Window_ShopStatus.prototype.refresh = function () {
        this.clearUpdateDrawer();
        this.contents.clear();
        if (this._item) {
            var x = this.textPadding();
            this.drawPossession(x, 0);
            if (this.isEquipItem()) {
                this._gaugeCount = 24;
                this.makeTempList();
                if (MPPlugin.CharacterDraw) {
                    this.drawCharacters(0, this.lineHeight() * 2);
                    x += 48;
                }
                this.drawEquipInfo(x, this.lineHeight() * 2);
            }
        }
    };

    Window_ShopStatus.prototype.makeTempList = function () {
        this._list = [];
        var item = this._item;
        var members = this.statusMembers();
        for (var i = 0; i < members.length; i++) {
            var data = {};
            data.actor = members[i];
            data.tempActor = JsonEx.makeDeepCopy(data.actor);
            data.enabled = data.actor.canEquip(item);
            data.equippng = false;
            if (data.enabled) {
                data.item = this.currentEquippedItem(data.actor, item.etypeId);
                data.equippng = (data.item === item);
                if (!data.equippng) {
                    var slotId = this.currentSlotId(data.actor, item.etypeId, data.item);
                    if (slotId >= 0) data.tempActor.forceChangeEquip(slotId, item);
                }
            }
            this._list[i] = data;
        }
    };

    Window_ShopStatus.prototype.currentSlotId = function (actor, etypeId, item) {
        var equips = actor.equips();
        var slots = actor.equipSlots();
        for (var i = 0; i < slots.length; i++) {
            if (slots[i] === etypeId && equips[i] === item) return i;
        }
        return -1;
    };

    //50
    Window_ShopStatus.prototype.drawEquipInfo = function (x, y) {
        var height = this.lineHeight();
        var itemRow = (this.contentsHeight() - y) / height / this.pageSize();
        var list = this._list;
        for (var i = 0; i < list.length; i++) {
            var dy = y + height * (i * itemRow);
            this.drawActorEquipInfo(x, dy, Math.floor(itemRow), list[i]);
            this.changePaintOpacity(true);
        }
    };

    //63
    Window_ShopStatus.prototype.pageSize = function () {
        return MPPlugin.MembersSize;
    };

    //71
    Window_ShopStatus.prototype.drawActorEquipInfo = function (x, y, maxRow, data) {
        var height = this.lineHeight();
        var row = 0;
        this.changePaintOpacity(data.enabled);
        this.resetTextColor();
        if (MPPlugin.ActorNameDraw) {
            var width = this.contentsWidth() - x - this.textPadding();
            this.drawText(data.actor.name(), x, y + row * height, width);
            if (data.equippng && MPPlugin.EquippingPos === 1) {
                this.drawEquipping(x, y + row * height, width);
            }
            if (row++ === maxRow - 1) return;
            if (!MPPlugin.CharacterDraw) x += 24;
        }
        if (data.enabled) {
            if (MPPlugin.EquippingItemDraw) {
                this.drawItemName(data.item, x, y + row * height);
                if (row++ === maxRow - 1) return;
            }
            this._actor = data.actor;
            this._tempActor = data.tempActor;
            this.drawParameters(x, y + row * height, maxRow - row);
        }
        //this.changePaintOpacity(true);
    };

    Window_ShopStatus.prototype.drawEquipping = function (x, y, width) {
        var text = MPPlugin.terms.Equipping;
        if (text) {
            this.changeTextColor(this.systemColor());
            this.contents.fontSize = MPPlugin.EquippingFontSize;
            this.drawText(text, x, y, width, 'right');
            this.contents.fontSize = this.standardFontSize();
        }
    };

    Window_ShopStatus.prototype.drawCharacters = function (x, y) {
        var height = this.lineHeight();
        var itemRow = (this.contentsHeight() - y) / height / this.pageSize();
        var list = this._list;
        var pattern = this._animePattern;
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            var dy = y + height * (i * itemRow);
            this._animePattern = (data.enabled ? pattern : 1);
            this.drawActorCharacter2(data, x + 24, dy + 48);
            if (data.equippng && MPPlugin.EquippingPos === 2) {
                var sy = Math.floor((height - MPPlugin.EquippingFontSize) / 2);
                this.drawEquipping(x, dy + 48 - height + sy, 48);
            }
        }
        this._animePattern = pattern;
    };

    Window_ShopStatus.prototype.drawCharacter = function (characterName, characterIndex, x, y) {
        var bitmap = ImageManager.loadCharacter(characterName);
        var big = ImageManager.isBigCharacter(characterName);
        var pw = bitmap.width / (big ? 3 : 12);
        var ph = bitmap.height / (big ? 4 : 8);
        var n = characterIndex;
        var p = this._animePattern % 4;
        p = (p < 3 ? p : 1);
        var d = Window_ShopStatus._directionPattern[this._animeIndex];
        d = (d - 2) / 2;
        var sx = (n % 4 * 3 + p) * pw;
        var sy = (Math.floor(n / 4) * 4 + d) * ph;
        var rate = 1.0;
        this.contents.blt(bitmap, sx, sy, pw, ph,
            x - pw * rate / 2, y - ph * rate, pw * rate, ph * rate);
    };

    Window_ShopStatus.prototype.drawActorCharacter2 = function (data, x, y, drawer) {
        var pattern = this._animePattern;
        if (!data.enabled) {
            this._animePattern = 1;
            this.contents.paintOpacity = 160;
        }
        this.drawActorCharacter(data.tempActor, x, y);
        this._animePattern = pattern;
        this.contents.paintOpacity = 255;

        if (drawer !== false) {
            var process = this.actorCharacterDrawer.bind(this, data, x, y);
            this.addUpdateDrawer(process);
        }
    };

    Window_ShopStatus.prototype.actorCharacterDrawer = function (data, x, y) {
        if (this._animeCount === 0) {
            this.contents.clearRect(x - 24, y - 48, 48, 48);
            this.drawActorCharacter2(data, x, y, false);
        }
        return true;
    };

    //117
    Alias.WiShSt_update = Window_ShopStatus.prototype.update;
    Window_ShopStatus.prototype.update = function () {
        if (this._gaugeCount > 0) this._gaugeCount--;
        if (MPPlugin.CharacterDraw && this.isEquipItem()) {
            this._animeCount++;
            if (this._animeCount === 24) {
                this._animeCount = 0;
                this._animePattern++;
                if (this._animePattern === 8) {
                    this._animePattern = 0;
                    this._animeIndex = (this._animeIndex + 1) % 4;
                }
            }
        }
        Alias.WiShSt_update.call(this);
    };

    Window_ShopStatus.prototype.drawParameters =
        Window_EquipStatus.prototype.drawParameters;

    Window_ShopStatus.prototype.getFixingStatus = function () {
        if (DataManager.isWeapon(this._item)) {
            return MPPlugin.WeaponFixingStatus;
        } else {
            return MPPlugin.ArmorFixingStatus;
        }
    };
    Window_ShopStatus.prototype.getItemStatus = function () {
        return MPPlugin.itemStatus;
    };
    Window_ShopStatus.prototype.getFlowStatus = function () {
        return MPPlugin.flowStatus;
    };
    Window_ShopStatus.prototype.getElementRateType = function () {
        return MPPlugin.elementRateType;
    };
    Window_ShopStatus.prototype.getDebuffRateType = function () {
        return MPPlugin.debuffRateType;
    };
    Window_ShopStatus.prototype.getStateRateType = function () {
        return MPPlugin.stateRateType;
    };
    Window_ShopStatus.prototype.getStateResistType = function () {
        return MPPlugin.stateResistType;
    };
    Window_ShopStatus.prototype.getEquipFeatureType = function () {
        return MPPlugin.equipFeatureType;
    };
    Window_ShopStatus.prototype.drawItem =
        Window_EquipStatus.prototype.drawItem;
    Window_ShopStatus.prototype.itemDrawer =
        Window_EquipStatus.prototype.itemDrawer;
    Window_ShopStatus.prototype.drawParamGauge =
        Window_EquipStatus.prototype.drawParamGauge;
    Window_ShopStatus.prototype.drawArcLine =
        Window_EquipStatus.prototype.drawArcLine;
    Window_ShopStatus.prototype.drawArcShadow =
        Window_EquipStatus.prototype.drawArcShadow;
    Window_ShopStatus.prototype.drawParam =
        Window_EquipStatus.prototype.drawParam;
    Window_ShopStatus.prototype.drawParamName =
        Window_EquipStatus.prototype.drawParamName;
    Window_ShopStatus.prototype.drawCurrentParam =
        Window_EquipStatus.prototype.drawCurrentParam;
    Window_ShopStatus.prototype.drawRightArrow =
        Window_EquipStatus.prototype.drawRightArrow;
    Window_ShopStatus.prototype.drawNewParam =
        Window_EquipStatus.prototype.drawNewParam;
    Window_ShopStatus.prototype.includeParam =
        Window_EquipStatus.prototype.includeParam;
    Window_ShopStatus.prototype.includeTrait =
        Window_EquipStatus.prototype.includeTrait;
    Window_ShopStatus.prototype.getActorParam =
        Window_EquipStatus.prototype.getActorParam;
    Window_ShopStatus.prototype.getParamMax =
        Window_EquipStatus.prototype.getParamMax;
    Window_ShopStatus.prototype.drawElement =
        Window_EquipStatus.prototype.drawElement;
    Window_ShopStatus.prototype.drawDebuff =
        Window_EquipStatus.prototype.drawDebuff;
    Window_ShopStatus.prototype.drawState =
        Window_EquipStatus.prototype.drawState;
    Window_ShopStatus.prototype.drawRate =
        Window_EquipStatus.prototype.drawRate;
    Window_ShopStatus.prototype.drawResist =
        Window_EquipStatus.prototype.drawResist;
    Window_ShopStatus.prototype.drawFeature =
        Window_EquipStatus.prototype.drawFeature;
    Window_ShopStatus.prototype.drawTrait =
        Window_EquipStatus.prototype.drawTrait;




})();
