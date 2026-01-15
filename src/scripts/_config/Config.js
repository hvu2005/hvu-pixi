
class Config {
    constructor() {
        this.isSendInfo = 0;
        this.isPlaySound = true;

        this.defaultAds = 0;
        this.IronSource = 1;
        this.Unity = 2;
        this.Adwords = 3;
        this.Adwords_48x32 = 3;
        this.Adwords_32x48 = 3;
        this.Applovin = 4;
        this.Facebook = 5;
        this.Adcolony = 6;
        this.Mintegral = 7;
        this.Vungle = 8;
        this.Maio = 9;
        this.Pangle = 10;
        this.Moloco = 11;
        this.Yandex = 12;
        this.WebAdsFB = 13;
        this.WebAdsGA = 13;
        this.defaultGame = 7;
        this.G_1942 = 1;
        this.G_1945 = 2;
        this.Falcon = 3;
        this.Galaxiga = 4;
        this.FalconVip = 5;
        this.StickBattle = 6;
        this.UnBlockJam = 7;
        this.BlockOut = 8;
        this.TeeBlockOut = 9;
        this.TangleLine = 10;
        this.GoodSort = 11;
        this.BloomTile = 12;
        this.test = 13;
        this.defautlVersion = "11a25";
        this.version = this.defautlVersion;
        this.PlayableAdsGame = this.defaultGame;
        this.PlayableAdsType = this.defaultAds;


        this.linkAndroid = 'https://play.google.com/store/apps/details?id=com.no1ornothing.bloom.tile.match.puzzle';
        this.linkiOS = 'https://apps.apple.com/us/app/bloom-tile-match-puzzle-game/id6740838784';
        this.linkWebAds = 'https://play.google.com/store/apps/details?id=com.no1ornothing.bloom.tile.match.puzzle';


        if (this.PlayableAdsType === this.Adwords || this.PlayableAdsType === this.Facebook || this.PlayableAdsType === this.IronSource) {
            this.isPlaySound = false;
        }
    }

    onGameReady() {
        if (this.PlayableAdsType === this.Mintegral) window.gameReady && window.gameReady();
    }

    openLinkApp() {
        var os = this.getOS();
        if (this.PlayableAdsType === this.Unity || this.PlayableAdsType === this.Applovin) {
            if (os === 'Android') {
                mraid.open(this.linkAndroid);
            } else if (os === 'iOS') {
                mraid.open(this.linkiOS);
            } else {
                mraid.open(this.linkAndroid);
            }
        } else if (this.PlayableAdsType === this.IronSource) {
            if (os === 'Android') {
                mraid.open(this.linkAndroid);
            } else if (os === 'iOS') {
                mraid.open(this.linkiOS);
            } else {
                mraid.open(this.linkAndroid);
            }
        } else if (this.PlayableAdsType === this.Adwords) {
            if (os === 'Android') { window.open(this.linkAndroid); }
            else if (os === 'iOS') {
                window.open(this.linkiOS);
            } else {
                window.open(this.linkAndroid);
            }
        } else if (this.PlayableAdsType === this.Facebook) {
            FbPlayableAd.onCTAClick();
        } else if (this.PlayableAdsType === this.Adcolony) {
            if (os === 'Android') { mraid.openStore(this.linkAndroid); }
            else if (os === 'iOS') { mraid.openStore(this.linkiOS); }
            else { mraid.openStore(this.linkAndroid); }
        } else if (this.PlayableAdsType === this.Mintegral) {
            window.install && window.install();
        } else if (this.PlayableAdsType === this.Vungle) {
            parent.postMessage('download', '*');
        } else if (this.PlayableAdsType === this.Maio) {
            Maio.openClickUrl('https://maio.jp');
        } else if (this.PlayableAdsType === this.Pangle) {
            window.openAppStore();
        } else if (this.PlayableAdsType === this.Moloco) {
            FbPlayableAd.onCTAClick();
        } else if (this.PlayableAdsType === this.Yandex) {
            yandexHTML5BannerApi.getClickURLNum(1);
        } else if (this.PlayableAdsType === this.WebAdsFB) {
            window.open(this.linkWebAds);
        }
        else if (this.PlayableAdsType === this.defaultAds) {
            window.open(this.linkWebAds);
        }
    }

    getOS() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        if (/Macintosh/i.test(userAgent)) {
            return "macOS";
        }
        if (/Windows/i.test(userAgent)) {
            return "Windows";
        }
        if (/Linux/i.test(userAgent)) {
            return "Linux";
        }
        return "unknown";
    }
    getGame() {
        var name = '';
        var pack = "";

        return { name: name, package: pack };
    }

    getNetwork() {
        var network = '';

        return network;
    }

    onEndGame() {
        if (this.PlayableAdsType === this.Mintegral)
            window.gameEnd && window.gameEnd();
    }

    sendInfo() {

    }
}
var CONFIG = new Config();
export default CONFIG;