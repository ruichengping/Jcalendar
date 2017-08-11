## 简介

目前Vue和React这些框架都已经有相当优秀成熟的移动UI框架，其中就已经提供了时间选择的控件，本不需要开发一款基于移动端的时间选择控件。但是，我们开发中会需要开发一些独立手机页面，这时候采用这些移动UI框架显然是不合适。正是基于这种情况，Jcalendar应运而生，来解决这类问题。除了为了解决上述情况，Jcalendar还有一个目的就是帮助前端小白学习一个日历插件的原理，来实现自己专属的日历插件。因此，Jcalendar的学习意义远远大于它在项目中的应用。

## 演示

地址：https://ruichengping.github.io/Jcalendar/demo/

## 快速上手

### html

```
...
<link rel="stylesheet" type="text/css" href="./DateSelector.css"/>
<body>
   <input id="demo" type="text" placeholder="请选择日期"/>
</body>
<script src="../lib/Jcalendar.min.js"></script> 
...
```

### js
```
 new Jcalendar({...})
```
## npm

### 安装
```
npm i jcalendar --save-dev
```
### js
```
 import Jcalendar from ‘jcalendar’;
 
 new Jcalendar({...});

```
## 参数介绍
属性 | 取值类型 | 取值范围 |说明
----|---------|---------|----
input | String  | 字符串|input框的id值
timeSelector | Boolean  | true或者false|是否带时间选择，默认是false
title | String  | 字符串|时间选择器标题，默认是”请选择“

## 其他

### 关于Css样式修改 
由于Jcalendar将样式单独提出到一个css文件中，并且Jcalendar项目中提供了一个gulpfile用来打包我们的文件。因此，我们需要根据自己的项目需求在**Jcalendar/src/css/Jcalendar.css**中修改成项目所需样式，然后在Jcalendar该根目录下执行**gulp**命令，便可在**Jcalendar/lib**获得重新打包好的js和css文件。
### 关于Jcalendar原理学习
Jcalendar目录下有一个learn目录，这里面文件便是需要的学习的小伙伴所用。关于原理的介绍，我在segmentfault写了一篇文章详细述说了其中原理，有兴趣的小伙伴可以去查阅。附上地址：https://segmentfault.com/a/1190000010623303


