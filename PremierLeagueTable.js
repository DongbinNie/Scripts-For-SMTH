var teams = {};
teams['Arsenal'] = "阿森纳";
teams['Aston Villa'] = "阿斯顿维拉";
teams['Burnley'] = "伯恩利";
teams['Chelsea'] = "切尔西";
teams['Crystal Palace'] = "水晶宫";
teams['Everton'] = "埃弗顿";
teams['Hull City'] = "赫尔城";
teams['Leicester City'] = "莱斯特城";
teams['Liverpool'] = "利物浦";
teams['Manchester City'] = "曼城";
teams['Manchester United'] = "曼联";
teams['Newcastle United'] = "纽卡斯尔";
teams['Queens Park Rangers'] = "女王公园流浪者";
teams['Southampton'] = "南安普顿";
teams['Stoke City'] = "斯托克城";
teams['Sunderland'] = "桑德兰";
teams['Swansea City'] = "斯旺西";
teams['Tottenham Hotspur'] = "热刺";
teams['West Bromwich Albion'] = "西布朗";
teams['West Ham United'] = "西汉姆联";

//Season 2013-2014
teams['Norwich City'] = "诺维奇";
teams['Fulham'] = "富勒姆";
teams['Cardiff City'] = "加迪夫城";

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

function RenderingRule(name, width, pendAction) {
    this.name = name;
    this.width = width;
    this.pendAction = pendAction;
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


function getSection(htmlString,secName) {
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


function getSections(htmlString,secName) {
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

function peelSections(htmlString,secName) {
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
    var board = getSection(resource,"tbody");
    var teamArray = getSections(board,"tr");

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

        var details = getSections(peelSections(teamArray[i].replace(/&nbsp;/g, ""), "a"), "td");
        var teamRecord = new TeamRecord();
        teamRecord.rank = details[0];
        teamRecord.team = teams[details[1]];
        teamRecord.points = details[3];
        teamRecord.goalsDiff = details[4];
        teamRecord.played = details[6];

        teamRecord.allWins = details[7];
        teamRecord.allDraws = details[8];
        teamRecord.allLosts = details[9];
        teamRecord.allGoalsFor = details[10];
        teamRecord.allGoalsAgainst = details[11];

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

function prepend(str) {
    return " " + str;
}

function append(str) {
    return str + " ";
}

function fixStringLength(str, length, pendAction) {
    if (str == null || str == undefined) {
        str = "";
    }
    var witdh = 0;
    for (var i = 0; i < str.length; i++) {
        var charWitdh;
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) < 256) {
            charWitdh = 1;
        } else {
            charWitdh = 2;
        }
        if (witdh + charWitdh > length) {
            str = str.substring(0, i);
            break;
        }

        witdh += charWitdh;
    }

    while (witdh ++ < length) {
        str = pendAction(str);
    }

    return str;
}

function renderTeamColor(rank) {
    var light = "";
    if (rank <= 3) {
        light = "\x1b\x1b[1;31m";
    } else if (rank <= 4) {
        light = "\x1b\x1b[1;35m";
    } else if (rank <= 5) {
        light = "\x1b\x1b[1;36m";
    } else if (rank <= 17) {
        light = "\x1b\x1b[1m";
    } else {
        light = "\x1b\x1b[1;33m";
    }

    FTerm.CurrentWindow.SendData(light);
}

function render(teamRecords, renderingRules) {
    var title = "\x1b\x1b[4m\x1b\x1b[44;1;37m英格兰足球超级联赛           合计              \x1b\x1b[4m\x1b\x1b[41;37m      主场       \x1b\x1b[4m\x1b\x1b[46;37m      客场      \x1b\x1b[m\x0d" +
        "\x1b\x1b[4m\x1b\x1b[1;44;37m排名 球队        积分 净胜  赛 胜 平 负 进 失  \x1b\x1b[4m\x1b\x1b[41;37m 胜 平 负 进 失  \x1b\x1b[4m\x1b\x1b[46;37m 胜 平 负 进 失 \x1b\x1b[m\x0d";
    FTerm.CurrentWindow.SendData(title);
    for (var j = 0; j < teamRecords.length; j++) {
        var teamRecord = teamRecords[j];
        renderTeamColor(teamRecord.rank);
        var line = "";
        for (var i = 0; i < renderingRules.length; i++) {
            var renderingRule = renderingRules[i];
            line += fixStringLength(teamRecord[renderingRule.name], renderingRule.width, renderingRule.pendAction);
        }
        line += "\x1b\x1b[m\x0d";
        FTerm.CurrentWindow.SendData(line);
    }

//    var about = "\x0d" +
//        "\x1b\x1b[1m注：\x1b\x1b[31m冠军联赛    1 2 3   \x1b\x1b[m\x0d" +
//        "\x1b\x1b[1;31m    \x1b\x1b[35m冠军联赛资格赛  4   \x1b\x1b[m\x0d" +
//        "\x1b\x1b[1;35m    \x1b\x1b[36m欧罗巴联赛      5   \x1b\x1b[m\x0d" +
//        "\x1b\x1b[1;36m    \x1b\x1b[33m降级区   18 19 20 \x1b\x1b[m\x0d";
//    FTerm.CurrentWindow.SendConvertedData(about);
}

var url = "http://www.espnfc.com/barclays-premier-league/23/table";
//var url = "http://www.espnfc.com/barclays-premier-league/23/table?season=2013";
var teamRecords = parseFromESPNHtml(url);

var bigGoals = false;
for (var i = 0; i < teamRecords.length; i++) {
    var teamRecord = teamRecords[i];
    if (teamRecord.allGoalsFor >= 100) {
        bigGoals = true;
        break;
    }
}

var renderingRules = [
    new RenderingRule("rank", 3, append),
    new RenderingRule("team", 14, append),
    new RenderingRule("points", 3, prepend),
    new RenderingRule("goalsDiff", 5, prepend),

    new RenderingRule("played", 5, prepend),
    new RenderingRule("allWins", 3, prepend),
    new RenderingRule("allDraws", 3, prepend),
    new RenderingRule("allLosts", 3, prepend),
    new RenderingRule("allGoalsFor", bigGoals ? 4 : 3, prepend),
    new RenderingRule("allGoalsAgainst", 3, prepend),

    new RenderingRule("homeWins", bigGoals ? 4 : 5, prepend),
    new RenderingRule("homeDraws", 3, prepend),
    new RenderingRule("homeLosts", 3, prepend),
    new RenderingRule("homeGoalsFor", 3, prepend),
    new RenderingRule("homeGoalsAgainst", 3, prepend),

    new RenderingRule("awayWins", 5, prepend),
    new RenderingRule("awayDraws", 3, prepend),
    new RenderingRule("awayLosts", 3, prepend),
    new RenderingRule("awayGoalsFor", 3, prepend),
    new RenderingRule("awayGoalsAgainst", 3, prepend)
];

render(teamRecords, renderingRules);
