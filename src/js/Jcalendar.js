(function (win, doc) {
    var inputId = "";
    //一位变两位
    function toTwo(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return num;
        }
    }
    //移除选择器
    function removeSelector() {
        var selector = doc.getElementsByClassName("Jcalendar-wrapper")[0];
        var bg = doc.getElementsByClassName("Jcalendar-bg")[0];
        if (typeof selector === "object") {
            selector.style.bottom = "-100%";
            var timer1 = setTimeout(function () {
                selector.parentNode.removeChild(selector);
                clearTimeout(timer1);
            }, 300);
        }
        if (typeof bg === "object") {
            bg.style.opacity = "0";
            var timer2 = setTimeout(function () {
                bg.parentNode.removeChild(bg);
                clearTimeout(timer2)
            }, 300);
        }
    }
    //检查日期格式
    function checkDateStr(dateStr) {
        var today = new Date();
        var currentYear = today.getFullYear();
        var currentMonth = today.getMonth() + 1;
        var currentDay = today.getDate();
        var currentHour = today.getHours();
        var currentMinute = today.getMinutes();
        var currentSecond = today.getSeconds();
        var dateArray = [];
        var timeArray = [];
        var dateReg = /^[0-9]{3}[1-9]\-[0-9][1-9]\-[0-9][1-9]$/;
        var dateTimeReg = /^[0-9]{3}[1-9]\-[0-9][1-9]\-[0-9][1-9] ([0-1][1-9]|2[0-3])\:[0-5][0-9]\:[0-5][0-9]$/;
        if (dateTimeReg.test(dateStr)) {
            dateArray = /[0-9]{3}[1-9]\-[0-9][1-9]\-[0-9][1-9]/.exec(dateStr)[0].split("-");
            currentYear = dateArray[0];
            currentMonth = dateArray[1];
            currentDay = dateArray[2];
            timeArray = /([0-1][1-9]|2[0-3])\:[0-5][0-9]\:[0-5][0-9]/.exec(dateStr)[0].split(":");
            currentHour = timeArray[0];
            currentMinute = timeArray[1];
            currentSecond = timeArray[2];
        } else if (dateReg.test(dateStr)) {
            dateArray = /[0-9]{3}[1-9]\-[0-9][1-9]\-[0-9][1-9]/.exec(dateStr)[0].split("-");
            currentYear = dateArray[0];
            currentMonth = dateArray[1];
            currentDay = dateArray[2];
        }
        return {
            "currentYear": parseInt(currentYear),
            "currentMonth": parseInt(currentMonth),
            "currentDay": parseInt(currentDay),
            "currentHour": parseInt(currentHour),
            "currentMinute": parseInt(currentMinute),
            "currentSecond": parseInt(currentSecond)
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
            var className = "disabled";
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
            if (date === parseInt(day)) {
                className = "available current";
            }
            days.push({
                "date": date,
                "showDate": date,
                "thisMonth": thisMonth,
                "className": className
            });

        }
        var nextMonthLength = days.length;
        //下月
        for (var i = 0; i < 7 * 6 - nextMonthLength; i++) {
            var className = "disabled";
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
        this.currentHour = 0;
        this.currentMinute = 0;
        this.currentSecond = 0;
        this.timeSelector = false;
        this.title = "请选择";
        if (options.title && typeof options.title === "string") {
            this.title = options.title;
        }
        if (options.timeSelector && typeof options.timeSelector === "boolean") {
            this.timeSelector = options.timeSelector;
        }
        console.log(this.type);
        this.init();
    }
    Jcalendar.prototype = {
        constructor: Jcalendar,
        init: function () {
            this.inputBindEvent();
        },
        render: function (year, month, day, hour, minute, second, flag) {
            var monthData = getMonthData(year, month, day);
            var year = monthData.year;
            var month = monthData.month;
            var days = monthData.days;
            this.currentYear = year;
            this.currentMonth = month;
            this.currentDay = day;
            this.currentHour = hour;
            this.currentMinute = minute;
            this.currentSecond = second;
            var daysHtml = "";
            days.forEach(function (item, index) {
                if (index % 7 === 0) {
                    daysHtml += "<tr>";
                }
                daysHtml += "<td class='" + item.className + "'>" + item.showDate + "</td>"
                if (index % 7 === 6) {
                    daysHtml += "</tr>";
                }
            });
            //日期选择器HTML
            var dateSelectorHtml = "<div class='Jcalendar-date-wrapper'><div class='Jcalendar-date-header'>" +
                "<a class='Jcalendar-prev-year' href='javascript:void(0);'>&lt;&lt;</a>" +
                "<a class='Jcalendar-prev-month' href='javascript:void(0);'>&lt;</a>" +
                "<span class='Jcalendar-year'> " + this.currentYear + "年</span>" +
                "<span class='Jcalendar-month'>" + toTwo(this.currentMonth) + "月 </span>" +
                "<a class='Jcalendar-next-year' href='javascript:void(0);'>&gt;&gt;</a>" +
                "<a class='Jcalendar-next-month' href='javascript:void(0);'>&gt;</a>" +
                "</div>" +
                "<table class='Jcalendar-date-table'>" +
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

            //时间选择器HTML
            var timeSelectorHtml = !this.timeSelector ? "" : "<div class='Jcalendar-time-wrapper'>" +
                "<table class='Jcalendar-time-table'>" +
                "<tr>" +
                "<td><p class='Jcalendar-time-tag'>时</p><p class='hour-add'>+</p><p class='hour-text'>" + toTwo(this.currentHour) + "</p><p class='hour-dec'>-</p></td>" +
                "<td><p class='Jcalendar-time-tag'>分</p><p class='minute-add'>+</p><p class='minute-text'>" + toTwo(this.currentMinute) + "</p><p class='minute-dec'>-</p></td>" +
                "<td><p class='Jcalendar-time-tag'>秒</p><p class='second-add'>+</p><p class='second-text'>" + toTwo(this.currentSecond) + "</p><p class='second-dec'>-</p></td>" +
                "</tr>" +
                "</table>" +
                "</div>";

            //底部切换按钮
            var footHtml = !this.timeSelector ? "" : "<p class='Jcalendar-btn-tab'>选择时间</p>";


            var htmlStr = "<div class='Jcalendar-header'>" +
                "<a href='javascript:void(0);' class='Jcalendar-btn-cancel'>取消</a>" +
                "<span class='Jcalendar-title-text'>" + this.title + "</span>" +
                "<a href='javascript:void(0);' class='Jcalendar-btn-sure'>确定</a>" +
                "</div>" +
                "<div class='Jcalendar-body'>" +
                dateSelectorHtml +
                timeSelectorHtml +
                "</div>" +
                "<div class='Jcalendar-footer'>" +
                footHtml +
                "</div>";
            var container = doc.getElementsByClassName("Jcalendar-wrapper")[0];
            if (!flag && typeof container === "object") {
                container.innerHTML = htmlStr;
                this.selectorBindEvent(container, document.getElementsByClassName("Jcalendar-bg")[0]);
            } else {
                //渲染时间选择器并绑定事件            
                var element = doc.createElement("div");
                element.className = "Jcalendar-wrapper";
                element.innerHTML = htmlStr;
                //背景层
                var bg = doc.createElement("div");
                bg.className = "Jcalendar-bg";

                doc.body.appendChild(bg);
                doc.body.appendChild(element);
                var timer = setTimeout(function () {
                    bg.style.opacity = "1";
                    element.className = "Jcalendar-wrapper show";
                    clearTimeout(timer);
                }, 50);
                this.selectorBindEvent(element, bg);
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
                //时
                _this.currentHour = checkDateStr(_this.inputDom.value).currentHour;
                //分 
                _this.currentMinute = checkDateStr(_this.inputDom.value).currentMinute;
                //秒
                _this.currentSecond = checkDateStr(_this.inputDom.value).currentSecond;
                _this.render(_this.currentYear, _this.currentMonth, _this.currentDay, _this.currentHour, _this.currentMinute, _this.currentSecond, true);
                event.stopPropagation();
            });
        },
        selectorBindEvent: function (element, bg) {
            var _this = this;
            //“确定”按钮
            element.getElementsByClassName("Jcalendar-btn-sure")[0].addEventListener("click", function (event) {
                if (_this.timeSelector === false) {
                    _this.inputDom.value = _this.currentYear + "-" + toTwo(_this.currentMonth) + "-" + toTwo(_this.currentDay);
                } else {
                    _this.inputDom.value = _this.currentYear + "-" + toTwo(_this.currentMonth) + "-" + toTwo(_this.currentDay) + " " + toTwo(_this.currentHour) + ":" + toTwo(_this.currentMinute) + ":" + toTwo(_this.currentSecond);
                }
                removeSelector(element);
                event.stopPropagation();
            });
            //"取消“按钮
            element.getElementsByClassName("Jcalendar-btn-cancel")[0].addEventListener("click", function (event) {
                event.stopPropagation();
                removeSelector(element);
            });
            //上一年
            element.getElementsByClassName("Jcalendar-prev-year")[0].addEventListener("click", function (event) {
                _this.render(_this.currentYear - 1, _this.currentMonth, _this.currentDay, _this.currentHour, _this.currentMinute, _this.currentSecond, false);
                event.stopPropagation();
            });
            //上月
            element.getElementsByClassName("Jcalendar-prev-month")[0].addEventListener("click", function (event) {
                if (_this.currentMonth - 1 === 0) {
                    _this.render(_this.currentYear - 1, 12, _this.currentDay, _this.currentHour, _this.currentMinute, _this.currentSecond, false);
                } else {
                    _this.render(_this.currentYear, _this.currentMonth - 1, _this.currentDay, _this.currentHour, _this.currentMinute, _this.currentSecond, false);
                }
                event.stopPropagation();
            });
            //下月
            element.getElementsByClassName("Jcalendar-next-month")[0].addEventListener("click", function (event) {
                if (_this.currentMonth + 1 > 12) {
                    _this.render(_this.currentYear + 1, 1, _this.currentDay, false);
                } else {
                    _this.render(_this.currentYear, _this.currentMonth + 1, _this.currentDay, _this.currentHour, _this.currentMinute, _this.currentSecond, false);
                }
                event.stopPropagation();

            });
            //下一年
            element.getElementsByClassName("Jcalendar-next-year")[0].addEventListener("click", function (event) {
                _this.render(_this.currentYear + 1, _this.currentMonth, _this.currentDay, _this.currentHour, _this.currentMinute, _this.currentSecond, false);
                event.stopPropagation();

            });
            //选择日期
            element.addEventListener("click", function (event) {
                if (event.target.className.indexOf("available") > -1) {
                    _this.currentDay = event.target.innerHTML;
                    element.getElementsByClassName("current")[0].className = "available";
                    event.target.className = "available current";
                    event.stopPropagation();
                }

            });
            //选择时间或选择日期按钮
            if (_this.timeSelector === true) {
                element.getElementsByClassName("Jcalendar-btn-tab")[0].addEventListener("click", function (event) {
                    if (event.target.innerHTML === "选择时间") {
                        event.target.innerHTML = "选择日期";
                        element.getElementsByClassName("Jcalendar-time-wrapper")[0].className = "Jcalendar-time-wrapper show";
                    } else {
                        event.target.innerHTML = "选择时间";
                        element.getElementsByClassName("Jcalendar-time-wrapper")[0].className = "Jcalendar-time-wrapper";
                    }
                });
                //时-增加按钮
                element.getElementsByClassName("hour-add")[0].addEventListener("click", function (event) {
                    if (_this.currentHour < 23) {
                        _this.currentHour++;
                    } else {
                        _this.currentHour = 0;
                    }
                    element.getElementsByClassName("hour-text")[0].innerHTML = toTwo(_this.currentHour);
                    event.stopPropagation();
                });
                //时-减少按钮
                element.getElementsByClassName("hour-dec")[0].addEventListener("click", function (event) {
                    if (_this.currentHour > 0) {
                        _this.currentHour--;
                    } else {
                        _this.currentHour = 23;
                    }
                    element.getElementsByClassName("hour-text")[0].innerHTML = toTwo(_this.currentHour);
                    event.stopPropagation();
                });
                //分-增加按钮
                element.getElementsByClassName("minute-add")[0].addEventListener("click", function (event) {
                    if (_this.currentMinute < 59) {
                        _this.currentMinute++;
                    } else {
                        _this.currentMinute = 0;
                    }
                    element.getElementsByClassName("hour-text")[0].innerHTML = toTwo(_this.currentHour);
                    element.getElementsByClassName("minute-text")[0].innerHTML = toTwo(_this.currentMinute);
                    event.stopPropagation();
                });
                //分-减少按钮
                element.getElementsByClassName("minute-dec")[0].addEventListener("click", function (event) {
                    if (_this.currentMinute > 0) {
                        _this.currentMinute--;
                    } else {
                        _this.currentMinute = 59;
                    }
                    element.getElementsByClassName("hour-text")[0].innerHTML = toTwo(_this.currentHour);
                    element.getElementsByClassName("minute-text")[0].innerHTML = toTwo(_this.currentMinute);
                    event.stopPropagation();
                });
                //秒-增加按钮
                element.getElementsByClassName("second-add")[0].addEventListener("click", function (event) {
                    if (_this.currentSecond < 59) {
                        _this.currentSecond++;
                    } else {
                        _this.currentSecond = 0;
                    }
                    element.getElementsByClassName("hour-text")[0].innerHTML = toTwo(_this.currentHour);
                    element.getElementsByClassName("minute-text")[0].innerHTML = toTwo(_this.currentMinute);
                    element.getElementsByClassName("second-text")[0].innerHTML = toTwo(_this.currentSecond);
                    event.stopPropagation();
                });
                //秒-减少按钮            
                element.getElementsByClassName("second-dec")[0].addEventListener("click", function (event) {
                    if (_this.currentSecond > 0) {
                        _this.currentSecond--;
                    } else {
                        _this.currentSecond = 59;
                    }
                    element.getElementsByClassName("hour-text")[0].innerHTML = toTwo(_this.currentHour);
                    element.getElementsByClassName("minute-text")[0].innerHTML = toTwo(_this.currentMinute);
                    element.getElementsByClassName("second-text")[0].innerHTML = toTwo(_this.currentSecond);
                    event.stopPropagation();
                });
            }

            bg.addEventListener("click", function () {
                removeSelector();
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