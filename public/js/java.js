//Javascript Document
$(document).ready(function () {
    /* UFAK CİHAZLAR İÇİN MENU AÇMA BUTONU İŞLEMLERİ>>>>>*/
    $("#HeaderMenuAcmaButonAlani").on("click", function () {
        $("#HeaderMenuAcmaButonuMenuSinirlandirmaAlanİ").slideToggle("slow");
    });
    /* UFAK CİHAZLAR İÇİN MENU AÇMA BUTONU İŞLEMLERİ<<<<<*/

    /* Main ve footer alanı için üstten boşluk hesaplamaları>>>>> */

    var DokumanGenisligi = $(window).outerWidth();

    if (!$("#HeaderMesajAlani").length) {
        if (DokumanGenisligi >= 1200) { /* xL */
            var OsfetDegeri = 185;
        } else if ((DokumanGenisligi >= 992) && (DokumanGenisligi <= 1199)) { /* L */
            var OsfetDegeri = 175;
        } else if ((DokumanGenisligi >= 768) && (DokumanGenisligi <= 991)) { /* M */
            var OsfetDegeri = 155;
        } else if ((DokumanGenisligi >= 576) && (DokumanGenisligi <= 767)) { /* M */
            var OsfetDegeri = 145;
        } else if (DokumanGenisligi >= 574) {
            var OsfetDegeri = 145;
        }
    } else {
        if (DokumanGenisligi >= 1200) { /* xL */
            var OsfetDegeri = 182;
        } else if ((DokumanGenisligi >= 992) && (DokumanGenisligi <= 1199)) { /* L */
            var OsfetDegeri = 155;
        } else if ((DokumanGenisligi >= 768) && (DokumanGenisligi <= 991)) { /* M */
            var OsfetDegeri = 135;
        } else if ((DokumanGenisligi >= 576) && (DokumanGenisligi <= 767)) { /* M */
            var OsfetDegeri = 110;
        } else if (DokumanGenisligi <= 574) {
            var OsfetDegeri = 100;
        }
    }

    $("main").css("top", OsfetDegeri);
    $("footer").css("top", OsfetDegeri);

    $(window).resize(function () {
        var DokumanGenisligi = $(window).outerWidth();

        if (!$("#HeaderMesajAlani").length) {
            if (DokumanGenisligi >= 1200) { /* xL */
                var OsfetDegeri = 185;
            } else if ((DokumanGenisligi >= 992) && (DokumanGenisligi <= 1199)) { /* L */
                var OsfetDegeri = 150;
            } else if ((DokumanGenisligi >= 768) && (DokumanGenisligi <= 991)) { /* M */
                var OsfetDegeri = 155;
            } else if ((DokumanGenisligi >= 576) && (DokumanGenisligi <= 767)) { /* M */
                var OsfetDegeri = 145;
            } else if (DokumanGenisligi >= 574) {
                var OsfetDegeri = 145;
            }
        } else {
            if (DokumanGenisligi >= 1200) { /* xL */
                var OsfetDegeri = 182;
            } else if ((DokumanGenisligi >= 992) && (DokumanGenisligi <= 1199)) { /* L */
                var OsfetDegeri = 155;
            } else if ((DokumanGenisligi >= 768) && (DokumanGenisligi <= 991)) { /* M */
                var OsfetDegeri = 135;
            } else if ((DokumanGenisligi >= 576) && (DokumanGenisligi <= 767)) { /* M */
                var OsfetDegeri = 110;
            } else if (DokumanGenisligi <= 574) {
                var OsfetDegeri = 100;
            }
        }

        $("main").css("top", OsfetDegeri);
        $("footer").css("top", OsfetDegeri);

    });




    /* Main ve footer alanı için üstten boşluk hesaplamaları<<<<< */




});

/* Sss içerik göster/gizle >>>>> */


$.SSSIceriginiGoster = function (ElemanID) {
    var SoruIDsi = ElemanID;
    var IslenecekAlan = "#" + SoruIDsi;

    $(".TamSayfaCerceveAlaniIciSssSoruIcerigiAlani").slideUp();
    $(IslenecekAlan).parent().find(".TamSayfaCerceveAlaniIciSssSoruIcerigiAlani").slideToggle();




}


/* Sss içerik göster/gizle <<<<< */




/* ALIŞVERİŞ SEPETİ FATURA VE TESLİMAT ADRESLERİ FORMU GÖNDER İŞLEMİ >>>>> */
$.AlisverisSepetiFormGonder = function () {
    $("#AlisverisSepetiFormu").submit();
}
/* ALIŞVERİŞ SEPETİ FATURA VE TESLİMAT ADRESLERİ FORMU GÖNDER İŞLEMİ <<<<< */


/* ALIŞVERİŞ ÖDEME YÖNTEMİ SEÇME AÇMA/KAPAMA >>>>> */

$.AlisverisSepetiOdemeSayfasiIcinKrediKartiSistemiSecildi = function () {
    $("#KrediKartiIleOdemeAlani").css("display", "block");
    $("#MobilOdemeIleOdemeAlani").css("display", "none");
    $("#BankaHavalesiIleOdemeAlani").css("display", "none");
}

$.AlisverisSepetiOdemeSayfasiIcinMobilOdemeSistemiSecildi = function () {
    $("#KrediKartiIleOdemeAlani").css("display", "none");
    $("#MobilOdemeIleOdemeAlani").css("display", "block");
    $("#BankaHavalesiIleOdemeAlani").css("display", "none");
}

$.AlisverisSepetiOdemeSayfasiIcinBankaHavalesiSistemiSecildi = function () {
    $("#KrediKartiIleOdemeAlani").css("display", "none");
    $("#MobilOdemeIleOdemeAlani").css("display", "none");
    $("#BankaHavalesiIleOdemeAlani").css("display", "block");
}

/* ALIŞVERİŞ ÖDEME YÖNTEMİ SEÇME AÇMA/KAPAMA <<<<< */


/* ÜRÜN DETAY SAYFASI RESİM DEĞİŞTİRME İŞLEMİ >>>>> */

$.UrunDetaySayfasiIcinResimDegistir = function (ResimDegeri) {
    $("#BuyukResim").attr("src", ResimDegeri);

}

/* ÜRÜN DETAY SAYFASI RESİM DEĞİŞTİRME İŞLEMİ <<<<< */

/* SLAYT ALANİ >>>>> */

$(function () {
    var SlaytElementi = $(".SlaytAlaniKapsayicisi");
    var SlaytListeOlusturmaElementi = SlaytElementi.find(".SlaytAlaniResimleri");
    var SlaytListesiUzunlugu = SlaytListeOlusturmaElementi.find(".SlaytResmi").length;
    var SlaytIcinDokumanGenisligi = SlaytElementi.outerWidth();
    var ToplamGenislik = SlaytListesiUzunlugu * SlaytIcinDokumanGenisligi;
    var ResimSirasi = 0;
    var KayacakAlan = 0;

    SlaytListeOlusturmaElementi.find(".SlaytResmi").width(SlaytIcinDokumanGenisligi).end().width(ToplamGenislik);

    $(window).resize(function () {
        SlaytElementi = $(".SlaytAlaniKapsayicisi");
        SlaytListeOlusturmaElementi = SlaytElementi.find(".SlaytAlaniResimleri");
        SlaytListesiUzunlugu = SlaytListeOlusturmaElementi.find(".SlaytResmi").length;
        SlaytIcinDokumanGenisligi = SlaytElementi.outerWidth();
        ToplamGenislik = SlaytListesiUzunlugu * SlaytIcinDokumanGenisligi;

        SlaytListeOlusturmaElementi.find(".SlaytResmi").width(SlaytIcinDokumanGenisligi).end().width(ToplamGenislik).css("margin-left", "-" + (ResimSirasi * SlaytIcinDokumanGenisligi) + "px");
    });

    $.OtomatikDegistir = function () {
        if (ResimSirasi < SlaytListesiUzunlugu - 1) {
            ResimSirasi++;
            KayacakAlan = "-" + (ResimSirasi * SlaytIcinDokumanGenisligi + "px");


        } else {
            ResimSirasi = 0;
            KayacakAlan = 0;
        }

        SlaytListeOlusturmaElementi.stop().animate({
            marginLeft: KayacakAlan
        }, 500, function () {
            SlaytElementi = $(".SlaytAlaniKapsayicisi");
            SlaytListeOlusturmaElementi = SlaytElementi.find(".SlaytAlaniResimleri");
            SlaytListesiUzunlugu = SlaytListeOlusturmaElementi.find(".SlaytResmi").length;
            SlaytIcinDokumanGenisligi = SlaytElementi.outerWidth();
            ToplamGenislik = SlaytListesiUzunlugu * SlaytIcinDokumanGenisligi;

            SlaytListeOlusturmaElementi.find(".SlaytResmi").width(SlaytIcinDokumanGenisligi).end().width(ToplamGenislik).css("margin-left", "-" + (ResimSirasi * SlaytIcinDokumanGenisligi) + "px");
        });
    }

    var slaytOynat = setInterval("$.OtomatikDegistir()", 3000);

});



/* SLAYT ALANİ <<<<< */




