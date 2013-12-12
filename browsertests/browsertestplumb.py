import os
from selenium import webdriver
from selenium.webdriver import ActionChains
import time
import random
url = "http://localhost:3000/"
import datetime

chromedriver = "/Users/chiller/projects/mint/.testenv/bin/chromedriver"
os.environ["webdriver.chrome.driver"] = chromedriver
driver = webdriver.Chrome(chromedriver)
driver.implicitly_wait(60)
driver.get(url)
index = datetime.datetime.now().microsecond % 5
print index

i = 100
while(i>0):
    element = driver.find_elements_by_class_name("drag")[3]

    vector = [random.randint(-20,20),0]
    print vector
    actionChains = ActionChains(driver)
    actionChains.click_and_hold(element).move_by_offset(*vector).perform()
    time.sleep(0.1)
    i=i-1;



driver.quit()