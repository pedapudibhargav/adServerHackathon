window.onload = function () {
    if (window.jQuery) {
        console.log("EQ AD SERVER: script file loaded");
    } else {
        // jQuery is not loaded
        console.error("EQ AD SERVER: Jquery not found");
    }
}

$(window).on("load", function (e) {
    if (!window.jQuery) {
        console.warn("EQ AD SERVER: Jquery not found. Ads are not exicuted");
        return;
    }
    var samePrimaryCat = [{
        cat: 1005,
        subCat: '0',
        metro: 'NY',
        css: 'ad-1005',
        desc: 'Financial service',
        sub_Desc: ''
    },
    {
        cat: 1005,
        subCat: '0',
        metro: 'HK',
        css: 'ad-1005',
        desc: 'Financial service',
        sub_Desc: ''
    }];

    var dropdownData = [
        {
            cat: 1005,
            subCat: '0',
            metro: 'NY',
            css: 'ad-1005',
            desc: 'Financial service',
            sub_Desc: ''
        },
        {
            cat: 1005,
            subCat: '0',
            metro: 'HK',
            css: 'ad-1005',
            desc: 'Financial service',
            sub_Desc: ''
        },
        {
            cat: 1001,
            subCat: '0',
            metro: 'SV',
            css: 'ad-1004',
            desc: 'Content and Digital Media',
            sub_Desc: ''
        },
        {
            cat: 2031,
            subCat: 2032,
            metro: 'NY',
            css: 'ad-2031',
            desc: 'Content and Digital Media',
            sub_Desc: 'Gaming',
        },
        {
            cat: 2031,
            subCat: 2034,
            metro: 'HK',
            css: 'ad-2031',
            desc: 'Content and Digital Media',
            sub_Desc: 'Ecommerce'
        }];


    var currentCustCatg = dropdownData[Math.floor(Math.random() * dropdownData.length)];

    var initializeAdServeCode = function (custDataSourceArray) {
        currentCustCatg = custDataSourceArray[Math.floor(Math.random() * custDataSourceArray.length)];
        console.log("Subcat:" + currentCustCatg["subCat"]);
        console.log("custDataSourceArray:", custDataSourceArray);
        var apiUrlToSCI = "http://uslp2m3ml12:9000/adExchange?cat=" + currentCustCatg.cat + "&metro=" + currentCustCatg.metro + "&pindex=0";
        if (currentCustCatg["subCat"] != "0") {
            apiUrlToSCI = apiUrlToSCI + "&subCat=" + currentCustCatg["subCat"];
        }
        $("#eq-ads-industry").html(currentCustCatg.desc);
        console.log("API URL to get SCI:" + apiUrlToSCI);
        $.ajax({
            url: apiUrlToSCI,
            success: function (data) {
                var tmpSCIObjIn = JSON.parse(data);
                console.log("Get SCI info:", tmpSCIObjIn);
                $("#eq-ads-providers").html(tmpSCIObjIn.count);                
                $("#eq-ads-location").html(currentCustCatg.metro);
                updateAdDOMS();
            }
        });

    }
    initializeAdServeCode(dropdownData);


    var updateAdDOMS = function () {
        $(".eq-ad-serve").each(function () {
            var layoutType = "300by600";
            if ($(this).hasClass("eq-ads-layout-720-by-120")) {
                layoutType = "720by120";
                // ## 600by500|600by500
            }
            if ($(this).hasClass("eq-ads-layout-600-by-500")) {
                layoutType = "600by500";
            }
            var apiUrlToCMS = "http://sv2lxcmwpas01:10080/api/widget/id/9192e865-4af2-4c07-a8ae-df74cf70f26b/?sic=" + currentCustCatg.cat + "&region=" + currentCustCatg.metro + "&layout=" + layoutType + "&subCatergories=" + currentCustCatg.subCat;
            console.log("API URL:" + apiUrlToCMS);
            $.ajax({
                url: apiUrlToCMS,
                currentAdSpaceDom: $(this),
                success: function (data) {
                    $(this.currentAdSpaceDom).html(data);
                }
            });
        })
    }

    $(document).on("click", "#eq-randomize", function () {
        console.log("Randomizer cliked");
        initializeAdServeCode(dropdownData);
        $("#eq-loc-selec-wrapper").hide();
    });

    $(document).on("click", "#eq-same-industry", function () {
        console.log("Same industry - select location cliked: " + $(this).find("input.checked").val());

        initializeAdServeCode([{
            cat: 1005,
            subCat: '0',
            metro: 'NY',
            css: 'ad-1005',
            desc: 'Financial service',
            sub_Desc: ''
        }]);
        $("#eq-loc-selec-wrapper").show();
    });


    $(document).on("click", ".eq-location-selector", function () {
        console.log("Location slected:" + $(this).find("input").val());
        if ($(this).find("input").val() == 'NY') {
            initializeAdServeCode([{
                cat: 1005,
                subCat: '0',
                metro: 'NY',
                css: 'ad-1005',
                desc: 'Financial service',
                sub_Desc: ''
            }]);
        }
        else {
            initializeAdServeCode([
                {
                    cat: 1005,
                    subCat: '0',
                    metro: 'HK',
                    css: 'ad-1005',
                    desc: 'Financial service',
                    sub_Desc: ''
                }]);
        }
    });
})