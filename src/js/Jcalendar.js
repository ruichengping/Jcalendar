(function (win, doc) {
    var currentYear = "";
    var currentMonth = "";
    //根据input来计算并设置Jcalendar的top值和left值
    function setPosition(inputDom) {
        var left = inputDom.offsetLeft;
        var top = inputDom.clientHeight + inputDom.offsetHeight + 6;
        console.log(left + ";" + top);
    }
    function toTwo(num){
        if(num<10){
            return "0"+num;
        }else{
            return num;
        }
    }
    //根据年，月获取日数组
    function getMonthData(year, month) {
        var days = [];
        var today = new Date();
        if (!year || !month) {
            year = today.getFullYear();
            month = today.getMonth() + 1;
        }
        //获取该月第一天的Date对象
        var firstDateObj = new Date(year, month - 1, 1);
        //获取该月第一天对应的星期几
        var firstDateWeekDay = firstDateObj.getDay();
        //获取该月最后一天的Date对象
        var lastDateObj = new Date(year, month, 0);
        //获取该月最后一天的日期
        var lastDate = lastDateObj.getDate();
        //获取上一个月最后一天的Date对象
        var lastDateOfPrevMonthObj = new Date(year, month - 1, 0);
        //获取上一个月最后一天的日期
        var lastDateOfPrevMonth = lastDateOfPrevMonthObj.getDate();
        //上月
        for (var i = 0; i < firstDateWeekDay; i++) {
            var className = "available disabled";
            var thisMonth = month - 1;
            var date = lastDateOfPrevMonth - firstDateWeekDay + i + 1;
            if (thisMonth === 0) { thisMonth = 1; }
            days.push({
                "date": date,
                "thisMonth": thisMonth,
                "className": className
            });
        }
        //本月
        for (var i = 0; i < lastDate; i++) {
            var className = "available";
            var date = i + 1;
            var thisMonth = month;
            if (date === today.getDate()) {
                className = "available current";
            }
            days.push({
                "date": date,
                "thisMonth": thisMonth,
                "className": className
            });
        }
        var nextMonthLength = days.length;
        //下月
        for (var i = 0; i < 7 * 6 - nextMonthLength; i++) {
            var className = 'available disabled';
            var date = i + 1;
            var thisMonth = month + 1;
            if (thisMonth === 13) { thisMonth = 12; }
            days.push({
                "date": date,
                "thisMonth": thisMonth,
                "className": className
            });
        }
        return {
            "year": firstDateObj.getFullYear(),
            "month": firstDateObj.getMonth() + 1,
            "days": days
        }
    }
    function Jcalendar(options) {
        this.inputDom = doc.getElementById(options.input);
        this.init();
    }
    Jcalendar.prototype = {
        constructor: Jcalendar,
        init: function () {
            this.render();
            this.bind();
        },
        render: function (year, month) {
            var monthData = getMonthData(year, month);
            var year = monthData.year;
            var month = monthData.month;
            var days = monthData.days;
            currentYear = year;
            currentMonth = month;
            var daysHtml = "";
            days.forEach(function (item, index) {
                if (index % 7 === 0) {
                    daysHtml += "<tr>";
                }
                daysHtml += "<td class='" + item.className + "'>" + item.date + "</td>"
                if (index % 7 === 6) {
                    daysHtml += "<tr>";
                }
            });
            var htmlStr = "<div class='Jcalendar-header'>"
                + "<a class='Jcalendar-prev-year' href='javascript:void(0);'>&lt;&lt;</a>"
                + "<a class='Jcalendar-prev-month' href='javascript:void(0);'>&lt;</a>"
                + "<span class='Jcalendar-year'> " + currentYear + "年</span>"
                + "<span class='Jcalendar-month'>" + toTwo(currentMonth) + "月 </span>"
                + "<a class='Jcalendar-next-month' href='javascript:void(0);'>&gt;</a>"
                + "<a class='Jcalendar-next-year' href='javascript:void(0);'>&gt;&gt;</a>"
                + "</div>"
                + "<div class='Jcalendar-body'>"
                + "<table class='Jcalendar-table'>"
                + "<thead>"
                + "<tr>"
                + "<th>日</th>"
                + "<th>一</th>"
                + "<th>二</th>"
                + "<th>三</th>"
                + "<th>四</th>"
                + "<th>五</th>"
                + "<th>六</th>"
                + "</tr>"
                + "</thead>"
                + "<tbody>"
                + daysHtml
                + "</tbody>"
                + "</table>"
                + "</div>";

            if (doc.getElementsByClassName("Jcalendar-wrapper").length === 0) {
                var element = doc.createElement("div");
                element.className = "Jcalendar-wrapper";
                element.innerHTML = htmlStr;
                doc.body.appendChild(element);
            } else {
                doc.getElementsByClassName("Jcalendar-wrapper")[0].innerHTML = htmlStr;
            }
        },
        bind: function () {
            var _this = this;
            //input框控制Jcalendar的显示和隐藏
            this.inputDom.addEventListener("click", function () {
                doc.getElementsByClassName("Jcalendar-wrapper")[0].style.display = "block";
            });
            doc.addEventListener("click", function (event) {
                if (event.target.className === "Jcalendar-prev-year") {
                    _this.inputDom.focus();
                    _this.render(currentYear - 1, currentMonth);
                } else if (event.target.className === "Jcalendar-prev-month") {
                    _this.inputDom.focus();
                    _this.render(currentYear, currentMonth - 1);
                } else if (event.target.className === "Jcalendar-next-month") {
                    _this.inputDom.focus();
                    _this.render(currentYear, currentMonth +1);
                } else if (event.target.className === "Jcalendar-next-year") {
                    _this.inputDom.focus();
                    _this.render(currentYear+1, currentMonth);
                }
            });
        }
    }

    if (typeof exports == "object") {
        module.exports = Jcalendar;
    } else if (typeof define == "function" && define.amd) {
        define([], function () {
            return Jcalendar;
        })
    } else {
        win.Jcalendar = Jcalendar;
    }
})(window, document);