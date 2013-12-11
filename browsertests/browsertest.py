import os
from selenium import webdriver
from selenium.webdriver import ActionChains
import time
import random
url = "http://galacziendre-mint.jit.su/editor"
import datetime

chromedriver = "/Users/chiller/projects/mint/chromedriver"
os.environ["webdriver.chrome.driver"] = chromedriver
driver = webdriver.Chrome(chromedriver)
driver.implicitly_wait(5)
driver.get(url)
index = datetime.datetime.now().microsecond % 5
print index

while(True):
    #import ipdb;ipdb.set_trace()
    print "*"
    element = driver.find_elements_by_class_name("drag")[index]
    vector = [random.randint(-20,20),0]
    actionChains = ActionChains(driver)
    actionChains.click_and_hold(element).move_by_offset(*vector).release().perform()
    time.sleep(1 + float(random.randint(100,200)) / 1000 )



driver.quit()