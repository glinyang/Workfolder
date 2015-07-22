//产生随机数
Selenium.prototype.doStoreRandom = function(variableName){
random = Math.floor(Math.random()*10000000);
storedVars[variableName] = random;
}


//弹出框
Selenium.prototype.doDisplayAlert = function(value, varName) {
    alert(value);
}

//在控件中输入当前日期
Selenium.prototype.doTypeTodaysDate = function(locator){
var dates = new Date();
var day = dates.getDate();
if (day < 10){
day = '0' + day;
}
month = dates.getMonth() + 1;
if (month < 10){
month = '0' + month;
}
var year = dates.getFullYear();
var prettyDay = day + '/' + month + '/' + year;
this.doType(locator, 'dddddd');
}