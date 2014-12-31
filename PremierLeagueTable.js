var teams = {};
teams['Arsenal'] = "°¢É­ÄÉ";
teams['Aston Villa'] = "°¢Ë¹¶ÙÎ¬À­";
teams['Burnley'] = "²®¶÷Àû";
teams['Chelsea'] = "ÇÐ¶ûÎ÷";
teams['Crystal Palace'] = "Ë®¾§¹¬";
teams['Everton'] = "°£¸¥¶Ù";
teams['Hull City'] = "ºÕ¶û³Ç";
teams['Leicester City'] = "À³Ë¹ÌØ³Ç";
teams['Liverpool'] = "ÀûÎïÆÖ";
teams['Manchester City'] = "Âü³Ç";
teams['Manchester United'] = "ÂüÁª";
teams['Newcastle United'] = "Å¦¿¨Ë¹¶û";
teams['Queens Park Rangers'] = "Å®Íõ¹«Ô°Ñ²ÓÎÕß";
teams['Southampton'] = "ÄÏ°²ÆÕ¶Ù";
teams['Stoke City'] = "Ë¹ÍÐ¿Ë³Ç";
teams['Sunderland'] = "É£µÂÀ¼";
teams['Swansea City'] = "Ë¹ÍúÎ÷";
teams['Tottenham Hotspur'] = "ÈÈ´Ì";
teams['West Bromwich Albion'] = "Î÷²¼ÀÊ";
teams['West Ham United'] = "Î÷ººÄ·Áª";

//Season 2013-2014
teams['Norwich City'] = "ÅµÎ¬Ææ";
teams['Fulham'] = "¸»ÀÕÄ·";
teams['Cardiff City'] = "¼ÓµÏ·ò³Ç";

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

function TopPlayer() {
    this.rank = "";
    this.name = "";
    this.club = "";
    this.data = "";
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
        //4´ú±í³É¹¦·µ»ØÊý¾Ý
        var result= xmlhttp.responseText;//µÃµ½·þÎñÆ÷·µ»ØµÄÊý¾Ý
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
    var StringArray = [];

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

function trim(x) {
    return x.replace(/^\s+|\s+$/g,'');
}

function parseFromESPNHtml(url) {
    var resource = XMLHTTPResponse(url,0);
    var board = getSection(resource,"tbody");
    var teamArray = getSections(board,"tr");

    //2014-08-24
    /*
    <tr style="background-color: #81D6AC">
     0    <td class="pos">1</td>
     1    <td class="team">
            <a href="http://www.espnfc.com/club/tottenham-hotspur/367/index">Tottenham Hotspur</a>
          </td>

     2    <td headers="colA" class="space">&nbsp;</td>
     3    <td class="groupA" headers="colA">2</td>
     4    <td class="groupA" headers="colA">2</td>
     5    <td class="groupA" headers="colA">0</td>
     6    <td class="groupA" headers="colA">0</td>
     7    <td class="groupA" headers="colA">5</td>
     8    <td class="groupA" headers="colA">0</td>

        

     9            <td headers="colB" class="space">&nbsp;</td>
    10            <td class="groupB" headers="colB">1</td>
    11            <td class="groupB" headers="colB">0</td>
    12            <td class="groupB" headers="colB">0</td>
    13            <td class="groupB" headers="colB">4</td>
    14            <td class="groupB" headers="colB">0</td>

    15            <td headers="colC" class="space">&nbsp;</td>
    16            <td headers="colC">1</td>
    17            <td headers="colC">0</td>
    18            <td headers="colC">0</td>
    19            <td headers="colC">1</td>
    20            <td headers="colC">0</td>
        
            
         

    21    <td class="space">&nbsp;</td>
    22    <td class="gd">5</td>
    23    <td class="pts">6</td>

    </tr>
    */
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
        teamRecord.team = teams[trim(details[1])];
        teamRecord.points = details[23];
        teamRecord.goalsDiff = details[22];
        teamRecord.played = details[3];

        teamRecord.allWins = details[4];
        teamRecord.allDraws = details[5];
        teamRecord.allLosts = details[6];
        teamRecord.allGoalsFor = details[7];
        teamRecord.allGoalsAgainst = details[8];

        teamRecord.homeWins = details[10];
        teamRecord.homeDraws = details[11];
        teamRecord.homeLosts = details[12];
        teamRecord.homeGoalsFor = details[13];
        teamRecord.homeGoalsAgainst = details[14];

        teamRecord.awayWins = details[16];
        teamRecord.awayDraws = details[17];
        teamRecord.awayLosts = details[18];
        teamRecord.awayGoalsFor = details[19];
        teamRecord.awayGoalsAgainst = details[20];

        teamRecords.push(teamRecord);
    }

    return teamRecords;
}

function getTopPlayersFromESPNUrl(url, top) {
    var resource = XMLHTTPResponse(url,0);
    var board = getSection(resource,"tbody");
    var trs = getSections(board,"tr");

    /*
     2014-12-27
     <tr>
     <td headers="rank">1 </td>
     <td headers="player"><a href="http://www.espnfc.com/player/44927/sergio-aguero">Sergio Ag¨¹ero</a></td>
     <td headers="team"><a href="http://www.espnfc.us/club/manchester-city/382/index">Manchester City</a></td>

     <td headers="goals">14</td>

     </tr>
     */
    var topPlayers = [];

    for (var i=0; i < top && i < trs.length; i++) {
        var details = getSections(peelSections(trs[i].replace(/&nbsp;/g, ""), "a"), "td");

        var topPlayer = new TopPlayer();
        topPlayer.rank = details[0];
        topPlayer.name = details[1];
        topPlayer.club = details[2];
        topPlayer.data = details[3];

        topPlayers.push(topPlayer);
    }

    return topPlayers;
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
        if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) < 128) {
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

function renderTeamColor(data) {
    var rank = data.rank;
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

function renderData(datas, renderingRules, preRowAction) {
    for (var j = 0; j < datas.length; j++) {
        var data = datas[j];
        if (preRowAction != null) {
            preRowAction(data);
        }
        var line = "";
        for (var i = 0; i < renderingRules.length; i++) {
            var renderingRule = renderingRules[i];
            line += fixStringLength(data[renderingRule.name], renderingRule.width, renderingRule.pendAction);
        }
        line += "\x1b\x1b[m\x0d";
        FTerm.CurrentWindow.SendData(line);
    }
}

function renderTable(teamRecords, renderingRules) {
    var title = "\x1b\x1b[4m\x1b\x1b[44;1;37mÓ¢¸ñÀ¼×ãÇò³¬¼¶ÁªÈü           ºÏ¼Æ              \x1b\x1b[4m\x1b\x1b[41;37m      Ö÷³¡       \x1b\x1b[4m\x1b\x1b[46;37m      ¿Í³¡      \x1b\x1b[m\x0d" +
        "\x1b\x1b[4m\x1b\x1b[1;44;37mÅÅÃû Çò¶Ó        »ý·Ö ¾»Ê¤  Èü Ê¤ Æ½ ¸º ½ø Ê§  \x1b\x1b[4m\x1b\x1b[41;37m Ê¤ Æ½ ¸º ½ø Ê§  \x1b\x1b[4m\x1b\x1b[46;37m Ê¤ Æ½ ¸º ½ø Ê§ \x1b\x1b[m\x0d";
    FTerm.CurrentWindow.SendData(title);
    renderData(teamRecords, renderingRules, renderTeamColor);

    var about = "\x0d" +
        "\x1b\x1b[1m×¢£º\x1b\x1b[31m¹Ú¾üÁªÈü\x1b\x1b[m\x0d" +
        "\x1b\x1b[1;31m    \x1b\x1b[35m¹Ú¾üÁªÈü×Ê¸ñÈü\x1b\x1b[m\x0d" +
        "\x1b\x1b[1;35m    \x1b\x1b[36mÅ·ÂÞ°ÍÁªÈü\x1b\x1b[m\x0d" +
        "\x1b\x1b[1;36m    \x1b\x1b[33m½µ¼¶Çø\x1b\x1b[m\x0d";
    FTerm.CurrentWindow.SendConvertedData(about);
}

function renderTopScorers(topScorers, renderingRules) {
    FTerm.CurrentWindow.SendData("\x0d\x0d");

    //title
    var title = "\x1b\x1b[37;40;1mÉäÊÖ°ñÇ°Ê®£º\x1b\x1b[m\x0d" +
        "\x1b\x1b[4m\x1b\x1b[44;1;37mRank    Player                  Club                    Goals                    \x1b\x1b[m\x0d";
    FTerm.CurrentWindow.SendData(title);

    //data
    renderData(topScorers, renderingRules, null);
}

function renderTopAssists(topAssists, renderingRules) {
    FTerm.CurrentWindow.SendData("\x0d\x0d");

    //title
    var title = "\x1b\x1b[37;40;1mÖú¹¥°ñÇ°Ê®£º\x1b\x1b[m\x0d" +
        "\x1b\x1b[4m\x1b\x1b[44;1;37mRank    Player                  Club                    Assists                  \x1b\x1b[m\x0d";
    FTerm.CurrentWindow.SendData(title);

    //data
    renderData(topAssists, renderingRules, null);
}



var url = "http://www.espnfc.com/barclays-premier-league/23/table";
//var url = "http://www.espnfc.com/barclays-premier-league/23/table?season=2013";
var topScorersUrl = "http://www.espnfc.us/barclays-premier-league/23/statistics/scorers";
var topAssistsUrl = "http://www.espnfc.us/barclays-premier-league/23/statistics/assists";

var teamRecords = parseFromESPNHtml(url);
var topScorers = getTopPlayersFromESPNUrl(topScorersUrl, 10);
var topAssists = getTopPlayersFromESPNUrl(topAssistsUrl, 10);

var bigGoals = false;
for (var i = 0; i < teamRecords.length; i++) {
    var teamRecord = teamRecords[i];
    if (teamRecord.allGoalsFor >= 100) {
        bigGoals = true;
        break;
    }
}

var tableRenderingRules = [
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

var topPlayerRenderingRules = [
    new RenderingRule("rank", 8, append),
    new RenderingRule("name", 24, append),
    new RenderingRule("club", 24, append),
    new RenderingRule("data", 10, append)
]

renderTable(teamRecords, tableRenderingRules);
renderTopScorers(topScorers, topPlayerRenderingRules);
renderTopAssists(topAssists, topPlayerRenderingRules);
