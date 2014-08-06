var team = {};
team['Arsenal'] = "阿森纳";
team['Aston Villa'] = "阿斯顿维拉";
team['Burnley'] = "伯恩利";
team['Chelsea'] = "切尔西";
team['Crystal Palace'] = "水晶宫";
team['Everton'] = "埃弗顿";
team['Hull City'] = "赫尔城";
team['Leicester City'] = "莱斯特城";
team['Liverpool'] = "利物浦";
team['Manchester City'] = "曼城";
team['Manchester United'] = "曼联";
team['Newcastle United'] = "纽卡斯尔";
team['Queens Park Rangers'] = "公园流浪者";
team['Southampton'] = "南安普顿";
team['Stoke City'] = "斯托克城";
team['Sunderland'] = "桑德兰";
team['Swansea City'] = "斯旺西";
team['Tottenham Hotspur'] = "热刺";
team['West Bromwich Albion'] = "西布朗";
team['West Ham United'] = "西汉姆联";

//Season 2013-2014
team['Norwich City'] = "诺维奇";
team['Fulham'] = "富勒姆";
team['Cardiff City'] = "加迪夫城";

function TeamRecord() {
    this.rank = "";
    this.team = "";
    this.points = "";
    this.goalsDiff = "";
    this.played = "";

    this.allWins = "";
    this.allDraws = "";
    this.allLosts = "";
    this.allGoalsFor = "";
    this.allGoalsAgainst = "";

    this.homeWins = "";
    this.homeDraws = "";
    this.homeLosts = "";
    this.homeGoalsFor = "";
    this.homeGoalsAgainst = "";

    this.awayWins = "";
    this.awayDraws = "";
    this.awayLosts = "";
    this.awayGoalsFor = "";
    this.awayGoalsAgainst = "";
}

function RenderingRule(name, width, left) {
    this.name = name;
    this.width = width;
    this.left = left;
}

function XMLHTTPResponse(url,type) {
    var xmlhttp;
    if (type == 0) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (type == 1) {
        xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.open("get",url,false);
    xmlhttp.send(null);
    if(xmlhttp.readyState==4) {
        //4代表成功返回数据
        var result= xmlhttp.responseText;//得到服务器返回的数据
        return result;
    }
}


function GetSection(htmlString,secName) {
    var startExp = "<"+secName+"([^>]*)>"
    var endExp =  "</"+secName+"([^>]*)>"
    var start = new RegExp(startExp);
    var end = new RegExp(endExp);
    var startPos = htmlString.search(start);
    var endPos = htmlString.search(end);
    if(startPos > 0 && endPos > 0 && startPos < endPos) {
        return htmlString.slice(startPos, endPos);
    } else {
        return "";
    }
}


function GetSections(htmlString,secName) {
    var StringArray = new Array();

    var startExp = "<"+secName+"([^>]*)>"
    var endExp =  "</"+secName+"([^>]*)>"
    var start = new RegExp(startExp);
    var end = new RegExp(endExp);

    var startPos = htmlString.search(start);
    var endPos = htmlString.search(end);

    while(startPos > 0 && endPos > 0 && startPos < endPos) {
        var secStr = htmlString.slice(startPos, endPos);
        secStr = secStr.replace(start,"");
        secStr = secStr.replace(end,"");
        StringArray.push(secStr);
        htmlString = htmlString.slice(endPos+1);
        startPos = htmlString.search(start);
        endPos = htmlString.search(end);
    }

    return StringArray;
}

function PeelSections(htmlString,secName) {
    var startExp = "<"+secName+"([^>]*)>"
    var endExp =  "</"+secName+"([^>]*)>"
    var start = new RegExp(startExp);
    var end = new RegExp(endExp);
    while(htmlString.search(start) >= 0) {
        htmlString = htmlString.replace(start,"");
    }
    while(htmlString.search(end) >= 0) {
        htmlString = htmlString.replace(end,"");
    }
    return htmlString;
}

function formatNumber(number, length, right) {
    var num = "" + number;
    while (num.length < length) {
        num = right ? (num + " ") : (" " + num);
    }

    return num;
}

function parseFromESPNHtml(url) {
    var resource = XMLHTTPResponse(url,0);
    var board = GetSection(resource,"tbody");
    var teamArray = GetSections(board,"tr");

    //0   1    2 3   4  5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
    //pos,team,s,pts,gd,s,0,0,0,0,0, 0, s, 0, 0, 0, 0, 0, s, 0, 0, 0, 0, 0
    var teamRecords = [];
    for (i=1; i<teamArray.length; i++) {
        /*
         FTerm.CurrentWindow.SendConvertedData("=====================\x0d");
         FTerm.CurrentWindow.SendConvertedData(teamArray[i]);
         FTerm.CurrentWindow.SendConvertedData("\x0d");
         FTerm.CurrentWindow.SendConvertedData("=====================\x0d");
         */

        var details = GetSections(PeelSections(teamArray[i].replace(/&nbsp;/g, ""), "a"), "td");
        var teamRecord = new TeamRecord();
        teamRecord.rank = details[0];
        teamRecord.team = details[1];
        teamRecord.points = details[3];
        teamRecord.goalsDiff = details[4];
        teamRecord.played = details[6];

        teamRecord.allWins = details[6];
        teamRecord.allDraws = details[7];
        teamRecord.allLosts = details[8];
        teamRecord.allGoalsFor = details[9];
        teamRecord.allGoalsAgainst = details[10];

        teamRecord.homeWins = details[13];
        teamRecord.homeDraws = details[14];
        teamRecord.homeLosts = details[15];
        teamRecord.homeGoalsFor = details[16];
        teamRecord.homeGoalsAgainst = details[17];

        teamRecord.awayWins = details[19];
        teamRecord.awayDraws = details[20];
        teamRecord.awayLosts = details[21];
        teamRecord.awayGoalsFor = details[22];
        teamRecord.awayGoalsAgainst = details[23];

        teamRecords.push(teamRecord);
    }

    return teamRecords;
}

function render(teamRecords, renderingRulues) {
    for (var teamRecord in teamRecords) {
        var line = "";
        for (var renderingRule in renderingRulues) {
            line += formatNumber(teamRecord[renderingRule.name], renderingRule.width, renderingRule.left);
        }
    }
}

var resource = XMLHTTPResponse("http://www.espnfc.com/barclays-premier-league/23/table",0);
// var resource = XMLHTTPResponse("http://www.espnfc.com/barclays-premier-league/23/table?season=2013",0);
var board = GetSection(resource,"tbody");
if(board != "") {
    var teamArray = GetSections(board,"tr");
    var title = "\x1b\x1b[4m\x1b\x1b[44;1;37m英格兰足球超级联赛           合计              \x1b\x1b[4m\x1b\x1b[41;37m      主场       \x1b\x1b[4m\x1b\x1b[46;37m      客场            \x1b\x1b[m\x0d" +
        "\x1b\x1b[4m\x1b\x1b[1;44;37m排名 球队       积分 净胜   赛 胜 平 负 进 失  \x1b\x1b[4m\x1b\x1b[41;37m 胜 平 负 进 失  \x1b\x1b[4m\x1b\x1b[46;37m 胜 平 负 进 失 \x1b\x1b[m\x0d";
    FTerm.CurrentWindow.SendConvertedData(title);

    //0   1    2 3   4  5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23
    //pos,team,s,pts,gd,s,0,0,0,0,0, 0, s, 0, 0, 0, 0, 0, s, 0, 0, 0, 0, 0
    var bigGoals = false;
    var detailsArray = new Array();
    for (i=1; i<teamArray.length; i++) {
        /*
         FTerm.CurrentWindow.SendConvertedData("=====================\x0d");
         FTerm.CurrentWindow.SendConvertedData(teamArray[i]);
         FTerm.CurrentWindow.SendConvertedData("\x0d");
         FTerm.CurrentWindow.SendConvertedData("=====================\x0d");
         */

        var details = GetSections(PeelSections(teamArray[i].replace(/&nbsp;/g, ""), "a"), "td");
        detailsArray.push(details);
        if (details[10] >= 100) {
            bigGoals = true;
        }
    }

    for (i=0; i<detailsArray.length; i++){
        var details = detailsArray[i];

        var light = "";
        if (details[0] <= 3) {
            light = "\x1b\x1b[1;31m";
        } else if (details[0] <= 4) {
            light = "\x1b\x1b[1;35m";
        } else if (details[0] <= 5) {
            light = "\x1b\x1b[1;36m";
        } else if (details[0] <= 17) {
            light = "\x1b\x1b[1m";
        } else {
            light = "\x1b\x1b[1;33m";
        }

        FTerm.CurrentWindow.SendConvertedData(light);


        var line = "";
        //Rank
        line += formatNumber(details[0], 3, true);

        //Team
        var teamname = team[details[1]];
        line += " "+teamname;
        for(span=teamname.length*2;span<11;span++) {
            line += " ";
        }

        //PTS
        line += formatNumber(details[3], 4);
        //GD
        line += formatNumber(details[4], 5);
        line += "  ";

        //Details
        //All
        line += " ";
        for (var j=6; j<=9; j++) {
            line += formatNumber(details[j], 3);
        }
        line += formatNumber(details[10], bigGoals ? 4 : 3);
        line += formatNumber(details[11], 3);
        if (!bigGoals) {
            line += " ";
        }

        //Home
        line += " ";
        for (var j=13; j<=17; j++) {
            line += formatNumber(details[j], 3);
        }
        line += " ";

        //Away
        line += " ";
        for (var j=19; j<=23; j++) {
            line += formatNumber(details[j], 3);
        }

        line += "\x1b\x1b[m\x0d";
        FTerm.CurrentWindow.SendConvertedData(line);
    }
    var about = "\x0d" +
        "\x1b\x1b[1m注：\x1b\x1b[31m冠军联赛    1 2 3   \x1b\x1b[m\x0d" +
        "\x1b\x1b[1;31m    \x1b\x1b[35m冠军联赛资格赛  4   \x1b\x1b[m\x0d" +
        "\x1b\x1b[1;35m    \x1b\x1b[36m欧罗巴联赛      5   \x1b\x1b[m\x0d" +
        "\x1b\x1b[1;36m    \x1b\x1b[33m降级区   18 19 20 \x1b\x1b[m\x0d";
    FTerm.CurrentWindow.SendConvertedData(about);
}