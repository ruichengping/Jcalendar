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
                "<td><p class='Jcalendar-time-tag'>时</p><p class='hour-add'>+</p><p class='hour-text'>12</p><p class='hour-dec'>-</p></td>" +
                "<td><p class='Jcalendar-time-tag'>分</p><p class='minute-add'>+</p><p class='minute-text'>12</p><p class='minute-dec'>-</p></td>" +
                "<td><p class='Jcalendar-time-tag'>秒</p><p class='second-add'>+</p><p class='second-text'>12</p><p class='second-dec'>-</p></td>" +
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
                this.selectorBindEvent(container,document.getElementsByClassName("Jcalendar-bg")[0]);                                            
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
                _this.render(_this.currentYear, _this.currentMonth, _this.currentDay, true);
                event.stopPropagation();
            });
        },
        selectorBindEvent: function (element, bg) {
            var _this = this;
            //“确定”按钮
            element.getElementsByClassName("Jcalendar-btn-sure")[0].addEventListener("click", function (event) {
                if(this.timeSelector===false){
                    _this.inputDom.value = _this.currentYear + "-" + toTwo(_this.currentMonth) + "-" + toTwo(_this.currentDay);                    
                }
                removeSelector(element);               
                event.stopPropagation();
            });
            //"取消“按钮
            element.getElementsByClassName("Jcalendar-btn-cancel")[0].addEventListener("click",function(event){
                event.stopPropagation();
                removeSelector(element);
            });
            //上一年
            element.getElementsByClassName("Jcalendar-prev-year")[0].addEventListener("click", function (event) {
                _this.render(_this.currentYear - 1, _this.currentMonth, _this.currentDay, false);
                event.stopPropagation();
            });
            //上月
            element.getElementsByClassName("Jcalendar-prev-month")[0].addEventListener("click", function (event) {
                 if (_this.currentMonth - 1 === 0) {
                    _this.render(_this.currentYear - 1, 12, _this.currentDay,false);
                } else {
                    _this.render(_this.currentYear, _this.currentMonth -1, _this.currentDay, false);
                }
                event.stopPropagation();
            });
            //下月
            element.getElementsByClassName("Jcalendar-next-month")[0].addEventListener("click", function (event) {
                if (_this.currentMonth + 1 > 12) {
                    _this.render(_this.currentYear + 1, 1, _this.currentDay,false);
                } else {
                    _this.render(_this.currentYear, _this.currentMonth + 1, _this.currentDay, false);
                }
                event.stopPropagation();

            });
            //下一年
            element.getElementsByClassName("Jcalendar-next-year")[0].addEventListener("click", function (event) {
                _this.render(_this.currentYear + 1, _this.currentMonth, _this.currentDay, false);
                event.stopPropagation();

            });
            //选择日期
            element.getElementsByClassName("available")[0].addEventListener("click", function (event) {
                _this.currentDay = event.target.innerHTML;
                event.stopPropagation();
            });
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