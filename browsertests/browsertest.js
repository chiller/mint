/*
*
* https://code.google.com/p/selenium/wiki/WebDriverJs
*
* */


var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().
    withCapabilities(webdriver.Capabilities.chrome()).
    build();

driver.get('http://galacziendre-mint.jit.su/editor');
//driver.findElement(webdriver.By.name('q')).sendKeys('webdriver');
//driver.findElement(webdriver.By.name('btnG')).click();
driver.wait(function() {
    return driver.getTitle().then(function(title) {
        return title === 'Editor';
    });
}, 2000);
driver.quit();