(function (win, doc) {
    var inputId = "";
    //根据input来计算并设置Jcalendar的top值和left值
    function setPosition(inputDom, selector) {
        var left = inputDom.offsetLeft;
        var top = inputDom.offsetTop + inputDom.offsetHeight + 6;
        selector.style.left = left + "px";
        selector.style.top = top + "px";
    }

    function toTwo(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return num;
        }
    }

    function removeSelector() {
        var selector = doc.getElementsByClassName("Jcalendar-wrapper")[0];
        if (selector) {
            selector.parentNode.removeChild(selector);
        }
    }

    function checkDateStr(dateStr) {
        var dateArray = dateStr.split("-");
        var currentYear = "";
        var currentMonth = "";
        var currentDay = "";
        var today = new Date();
        if (dateStr === '') {
            currentYear = today.getFullYear();
            currentMonth = today.getMonth() + 1;
            currentDay = today.getDate();
        } else if (dateArray.length === 3) {
            var year = dateArray[0];
            var month = parseInt(dateArray[1]);
            var day = parseInt(dateArray[2]);
            if (new Date(year, month, 0) >= day) {
                currentYear = year;
                currentMonth = month;
                currentDay = day;
            }
        }
        return {
            "currentYear": currentYear,
            "currentMonth": currentMonth,
            "currentDay": currentDay
        }
    }
    //根据年，月获取日数组
    function getMonthData(year, month, day) {
        var days = [];
        var today = new Date();
        if (!year | !month | !day) {
            year = today.getFullYear();
            month = today.getMonth() + 1;
            day = today.getDate();
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
            if (thisMonth === 0) {
                thisMonth = 1;
            }
            days.push({
                "date": date,
                "showDate": date,
                "thisMonth": thisMonth,
                "className": className
            });
        }
        //本月
        for (var i = 0; i < lastDate; i++) {
            var className = "available";
            var date = i + 1;
            var thisMonth = month;
            if (date === day) {
                className = "available current";
            }
            if (today.getDate() === date && today.getFullYear() === year && today.getMonth() + 1 === month) {
                days.push({
                    "date": date,
                    "showDate": "今天",
                    "thisMonth": thisMonth,
                    "className": className
                });
            } else {
                days.push({
                    "date": date,
                    "showDate": date,
                    "thisMonth": thisMonth,
                    "className": className
                });
            }

        }
        var nextMonthLength = days.length;
        //下月
        for (var i = 0; i < 7 * 6 - nextMonthLength; i++) {
            var className = 'available disabled';
            var date = i + 1;
            var thisMonth = month + 1;
            if (thisMonth === 13) {
                thisMonth = 12;
            }
            days.push({
                "date": date,
                "showDate": date,
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
        this.currentYear = "";
        this.currentMonth = "";
        this.currentDay = "";
        this.init();
    }
    Jcalendar.prototype = {
        constructor: Jcalendar,
        init: function () {
            this.inputBindEvent();
        },
        render: function (year, month, day, flag) {
            var monthData = getMonthData(year, month, day);
            var year = monthData.year;
            var month = monthData.month;
            var days = monthData.days;
            this.currentYear = year;
            this.currentMonth = month;
            this.currentDay = day;
            var daysHtml = "";
            days.forEach(function (item, index) {
                if (index % 7 === 0) {
                    daysHtml += "<tr>";
                }
                daysHtml += "<td class='" + item.className + "'>" + item.showDate + "</td>"
                if (index % 7 === 6) {
                    daysHtml += "<tr>";
                }
            });
            var htmlStr = "<div class='Jcalendar-header'>" +
                "<a class='Jcalendar-prev-year' href='javascript:void(0);'>&lt;&lt;</a>" +
                "<a class='Jcalendar-prev-month' href='javascript:void(0);'>&lt;</a>" +
                "<span class='Jcalendar-year'> " + this.currentYear + "年</span>" +
                "<span class='Jcalendar-month'>" + toTwo(this.currentMonth) + "月 </span>" +
                "<a class='Jcalendar-next-month' href='javascript:void(0);'>&gt;</a>" +
                "<a class='Jcalendar-next-year' href='javascript:void(0);'>&gt;&gt;</a>" +
                "</div>" +
                "<div class='Jcalendar-body'>" +
                "<table class='Jcalendar-table'>" +
                "<thead>" +
                "<tr>" +
                "<th>日</th>" +
                "<th>一</th>" +
                "<th>二</th>" +
                "<th>三</th>" +
                "<th>四</th>" +
                "<th>五</th>" +
                "<th>六</th>" +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                daysHtml +
                "</tbody>" +
                "</table>" +
                "</div>";
            var container = doc.getElementsByClassName("Jcalendar-wrapper")[0];
            if (!flag && typeof container === "object") {
                container.innerHTML = htmlStr;
            } else {
                //渲染时间选择器并绑定事件            
                var element = doc.createElement("div");
                element.className = "Jcalendar-wrapper";
                element.innerHTML = htmlStr;
                doc.body.appendChild(element);
                this.selectorBindEvent(element);
                //设置时间选择器位置
                setPosition(this.inputDom, element);
            }
        },
        inputBindEvent: function () {
            var _this = this;
            //input框控制Jcalendar的显示和隐藏
            this.inputDom.addEventListener("click", function (event) {
                //年
                _this.currentYear = checkDateStr(_this.inputDom.value).currentYear;
                //月
                _this.currentMonth = checkDateStr(_this.inputDom.value).currentMonth;
                //日
                _this.currentDay = checkDateStr(_this.inputDom.value).currentDay;
                removeSelector();
                _this.render(_this.currentYear, _this.currentMonth, _this.currentDay, true);
                event.stopPropagation();
            });
            doc.addEventListener("click", function () {
                removeSelector();
            });
        },
        selectorBindEvent: function (element) {
            var _this = this;
            element.addEventListener("click", function (event) {
                    _this.inputDom.focus();                
                if (event.target.className === "Jcalendar-prev-year") {
                    //上一年
                    _this.render(_this.currentYear - 1, _this.currentMonth, _this.currentDay,false);
                } else if (event.target.className === "Jcalendar-prev-month") {
                    //上月
                    _this.render(_this.currentYear, _this.currentMonth - 1, _this.currentDay,false);
                } else if (event.target.className === "Jcalendar-next-month") {
                    //下月
                    if (_this.currentMonth + 1 > 12) {
                        _this.render(_this.currentYear + 1, 1, _this.currentDay);
                    } else {
                        _this.render(_this.currentYear, _this.currentMonth + 1, _this.currentDay,false);
                    }
                } else if (event.target.className === "Jcalendar-next-year") {
                    //下年
                    _this.render(_this.currentYear + 1, _this.currentMonth, _this.currentDay,false);
                } else if (event.target.className.indexOf("available") > -1) {
                    //本月可选择的日期
                    _this.currentDay = event.target.innerHTML;
                    removeSelector();
                    _this.inputDom.value = _this.currentYear + "-" + toTwo(_this.currentMonth) + "-" + toTwo(_this.currentDay);
                }
                event.stopPropagation();
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