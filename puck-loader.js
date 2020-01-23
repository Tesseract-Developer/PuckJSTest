/*
NRF.nfcURL("ms-outlook://compose?to=jason@tesseractventures.io"); // MS Outlook
NRF.nfcURL("googlegmail:///co?to=dave@tesseractventures.io"); // Google Mail
NRF.nfcURL("mailto://jason@tesseractventures.io"); // default Apple Mail handler
*/
var puckName = NRF.getAddress();
puckName = puckName.replace(/\W/ig,'');
puckName = puckName.substr(puckName.length - 4).toUpperCase();

NRF.setAdvertising({},{name:"TESS-PIN "+ puckName});

var clickTimer = null;
var resetTimer = null;
var clickCount = 0;
var activeLight = null;

setWatch(function() {
    if (clickTimer !== null) {
        clearTimeout(clickTimer);
        clickTimer = null;
    }

    clickCount+=1;
    clickTimer = setTimeout(function () {
        clickTimer = null;
        if(clickCount == 1){
            setLight(LED1,10);
          NRF.nfcURL("mailto:johnb@tesseractventures.io"); // default Apple Mail handler
          //NRF.nfcURL("ms-outlook://compose?to=johnb@tesseractventures.io"); // MS Outlook
        }else if(clickCount == 2){
            setLight(LED2,20);
NRF.nfcURL("googlegmail:///co?to=johnb@tesseractventures.io"); // Google Mail
        }else if(clickCount >= 3){
            setLight(LED3,30);
          //NRF.nfcURL("mailto:johnb@tesseractventures.io"); // default Apple Mail handler
          NRF.nfcURL("https://www.linkedin.com/in/johnboucard/");
        }
    }, 400);
}, BTN, {edge:"falling", debounce:50, repeat:true});


function setLight(light,v) {
    NRF.setAdvertising({
        0x180F : [v]
    },{interval:200});
    clickCount = 0;
    if (activeLight !== null) {
        activeLight.reset();
    }
    light.set();
    activeLight = light;
    if (resetTimer !== null) {
        clearTimeout(resetTimer);
        resetTimer = null;
    }
    resetTimer = setTimeout(function() {
        resetTimer = null;
        activeLight.reset();
        NRF.setAdvertising({
            0x180F : [0]
        },{interval:200});
        resetTime = setTimeout(function() {
            NRF.setAdvertising({});
        },1000);
    },3000);
}
