/*
############################################
	作者: COBRA
	改造や配布好き勝手にしても大丈夫だよ
	寧ろ積極的に配布して皆のゲーム快適にして
	http://cobrara.blogspot.jp/
############################################
*/

/*:
* @plugindesc 画像合成プラグイン
* @author COBRA
* @help Version 2.0.0
*
* ver1.5.1のコアスクリプトに対応させました。
* バージョン変わると全く違うものになるのね、超ビックリした
*
* イベント→スクリプトで実行してください
*
* CBR.imgFusion.fusion([
*	"ピクチャ名１",
*	"ピクチャ名２",
*	"ピクチャ名３"
* ])
* ※ピクチャ名1の画像がベースになってそこにピクチャ2とピクチャ3が表示されます
* ピクチャ2と3に変化はありません
*
* CBR.imgFusion.resetFusion("合成解除したいピクチャ名")
*/


var CBR = CBR || {};
CBR.imgFusion = {
	'list': []
};

//追加分のどれかがロード中だったら何も描写しないようにする

//ビットマップをロードする時別のものにすりかえる
//ビットマップ自体を変更する


//ビットマップは　onload→_renewCanvas→._createCanvas

CBR.imgFusion.fusion = function (ary) {
	for (var i = 0, len = ary.length; i < len; i++) {
		ImageManager.loadPicture(ary[i]);//ロードしとく
	}

	var name = ary.shift();
	//もし存在してたら上書き
	for (var i = 0, len = CBR.imgFusion.list.length; i < len; i++) {
		if (CBR.imgFusion.list[i].name == name) {
			CBR.imgFusion.list[i].material = ary;
			break;
		}
	}

	if (i === len) {//ロードしてなかったら
		CBR.imgFusion.list.push({
			'name': name,
			'material': ary
		});
	}
};



var CBR_ImageManager_loadPicture = ImageManager.loadPicture;
ImageManager.loadPicture = function (filename, hue) {
	var flag = false;
	var list;
	for (var i = 0, len = CBR.imgFusion.list.length; i < len; i++) {
		if (CBR.imgFusion.list[i].name == filename) {
			list = CBR.imgFusion.list[i].material;
			flag = true;
		}
	}

	if (flag) {//合成対象だったら		
		var bitmap = this.loadBitmap('img/pictures/', filename, hue, true);//loadBitmapでキャッシュも返ってくる
		bitmap.CBR_imgFusion_list = list;
		bitmap.CBR_imgFusion_fusionComplete = false;

		if (bitmap._loadingState == 'loaded') {//ロードしていた場合
			if (!bitmap.CBR_imgFusion_name) {//合成がまだの場合

				//素材のロードが終わるまで表示させたくない
				bitmap.CBR_imgFusion_name = filename;
				bitmap.CBR_imgFusion_list = list;

				bitmap.clear();

				bitmap._onLoad = CBR_imgFusion_onLoad.bind(bitmap);
				bitmap._onLoad();

				return bitmap;

			} else {
				return CBR_ImageManager_loadPicture.call(this, filename, hue);
			}
		} else {//ロードしてない場合
			//onloadを変更
			bitmap._image.removeEventListener('load', bitmap._loadListener);
			bitmap._image.addEventListener('load', bitmap._loadListener = CBR_imgFusion_onLoad.bind(bitmap));
			bitmap.CBR_imgFusion_name = filename;
			bitmap.CBR_imgFusion_list = list;
			bitmap._onLoad = CBR_imgFusion_onLoad.bind(bitmap);//ロード時合成したものを反すようにする

			return bitmap;
		}

	} else {//違ったら普通にリターン
		return CBR_ImageManager_loadPicture.call(this, filename, hue);
	}
};

var CBR_imgFusion_onLoad = function () {
	if (this.CBR_imgFusion_fusionComplete) {
		return;
	}

	//合成要素の確認
	var loaded = true;
	for (var i = 0, len = this.CBR_imgFusion_list.length; i < len; i++) {
		var img = new Image();
		img.src = 'img/pictures/' + this.CBR_imgFusion_list[i] + '.png';
		if (!img.complete) {//読みこまれてない場合
			img.CBR_imgFusion_parentImg = this.CBR_imgFusion_name;
			//ロード後ベースのonloadを実行して全て読みこめてるかどうか再チェック
			img.onload = function () {
				var bitmap = ImageManager.loadBitmap('img/pictures/', this.CBR_imgFusion_parentImg, 0, true);
				bitmap._onLoad();
			};
			loaded = false;
		}
	}

	//要素が全てロードされてたら
	if (loaded) {
		//素材の描写　ベースの描写はまた別なのでここでやってもおｋ
		for (var i = 0, len = this.CBR_imgFusion_list.length; i < len; i++) {
			var img = new Image();
			img.src = 'img/pictures/' + this.CBR_imgFusion_list[i] + '.png';
			this._context.drawImage(img, 0, 0);
		}

		if (this._loadingState == 'loaded') {
			this.__context.drawImage(this._image, 0, 0);

			this._setDirty();
			this._callLoadListeners();
		} else {//ベースを描く
			switch (this._loadingState) {
				case 'requesting':
					this._loadingState = 'requestCompleted';
					if (this._decodeAfterRequest) {
						this.decode();
					} else {
						this._loadingState = 'purged';
						this._clearImgInstance();
					}
					break;

				case 'decrypting':
					window.URL.revokeObjectURL(this._image.src);
					this._loadingState = 'decryptCompleted';
					if (this._decodeAfterRequest) {
						this.decode();
					} else {
						this._loadingState = 'purged';
						this._clearImgInstance();
					}
					break;
			}
		}
		this.CBR_imgFusion_fusionComplete = true;
	}
};


CBR.imgFusion.resetFusion = function (name) {
	for (var i = 0, len = CBR.imgFusion.list.length; i < len; i++) {
		if (CBR.imgFusion.list[i].name == name) {
			CBR.imgFusion.list.splice(i, 1);
		}
	}

	var bitmap = ImageManager.loadPicture(name);
	bitmap._onLoad = Bitmap.prototype._onLoad.bind(bitmap);

	delete bitmap.CBR_imgFusion_name;
	delete bitmap.CBR_imgFusion_list;
	delete bitmap.CBR_imgFusion_fusionComplete;

	if (bitmap.width) {//表示する前のピクチャをリセット
		bitmap.clear();
		bitmap.__context.drawImage(bitmap._image, 0, 0);
		bitmap._setDirty();
		bitmap._callLoadListeners();
	}
};