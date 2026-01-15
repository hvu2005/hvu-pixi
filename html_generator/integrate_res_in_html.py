#!/usr/bin/python3

import os
import time
import sys
from html.parser import HTMLParser
import base64
import simplejson
import math
import zipfile
import shutil
from pathlib import Path

date = '200825'
titles = ['test']
version = ['11a25']
dev = 'Thepn'
language = 'EN'

ads = ['IronSource', 'Unity', 'Adwords_48x32','Adwords_32x48', 'Applovin', 'Facebook', 'Adcolony', 'Mintegral','Pangle', 'Vungle', 'Moloco']
# ads = ['IronSource', 'Unity']

projectMatchKey = '{#project}'

if sys.getdefaultencoding() != 'utf-8':
    reload(sys)
    sys.setdefaultencoding('utf-8')

def read_in_chunks(filePath):
    file_object = open(filePath, encoding='utf-8')
    return file_object.read()

def writeToPath(path, data):
    with open(path,'w', encoding='utf-8') as f:
        f.write(data)
    
def fixTitle(mainStr, title):
    newMainStr = mainStr.replace("{#title}", title, 1)
    return newMainStr
    
def fixPangle(fileJson, language):
    newJson = fileJson.replace("{#language}", language, 1)
    return newJson
    
def fixAds(mainStr, ad, title , v):
    newMainStr = mainStr.replace("this.PlayableAdsType=this.defaultAds", "this.PlayableAdsType=this." + ad, 1)
    newMainStr = newMainStr.replace("this.language=this.default", "this.language=this." + language, 1)
    newMainStr = newMainStr.replace("this.PlayableAdsGame=this.defaultGame", "this.PlayableAdsGame=this." + title, 1)
    newMainStr = newMainStr.replace('this.version=this.defautlVersion', 'this.version="' + v + '"', 1)
    newMainStr = newMainStr.replace("javascript:0", '', -1)
    newMainStr = newMainStr.replace("window.release=!1", 'window.release=1', -1)
    
    return newMainStr

def minify(mainStr):
    newMainStr = mainStr.replace("/*! For license information please see game.bundle.js.LICENSE.txt */", '/*Playable Ads by Falcon Game Studio*/', -1)
    return newMainStr
    
def integrate(projectRootPath):
    for title in titles:
        for x in ads:
            for v in version:
                Path("./output/" + title + '/'  + v + '/'  + x).mkdir(parents=True, exist_ok=True)
                htmlPath = projectRootPath + '/build-templates/' + x + '.html'
                
                mainPath = projectRootPath + '/dist/bundle.js'
                htmlStr = read_in_chunks(htmlPath)
                
                projectStr = read_in_chunks(mainPath)
                htmlStr = htmlStr.replace(projectMatchKey, projectStr, 1)
                
                htmlStr = fixTitle(htmlStr, title)
                htmlStr = fixAds(htmlStr, x, title, v)
                htmlStr = minify(htmlStr)
                
                newHtmlPath = './output/'+ title + '/' + v + '/'  + x + '/' + date + '_' + title + '_' + x + '_' + v + '_' + dev + '_' + language + '.html'
                writeToPath(newHtmlPath, htmlStr)
                
                if x == "Adwords_48x32" or x == "Adwords_32x48" or x == "Mintegral" or x == "Pangle"or x == "Vungle":
                    newZipPath = './output/'+ title + '/' + v + '/'  + x + '/' + date + '_' + title + '_' + x + '_' + v + '_' + dev + '_' + language + '.zip'
                    zipObj = zipfile.ZipFile(newZipPath, 'w')
                    if (x == "Pangle"):
                        zipObj.write(newHtmlPath, 'index.html', compress_type = zipfile.ZIP_DEFLATED)
                        
                        json = read_in_chunks(projectRootPath + '/build-templates/config.json')
                        json = fixPangle(json, language.lower())
                        newJson = './output/'+ title + '/' + v + '/'  + x + '/config.json'
                        writeToPath(newJson, json)
                        
                        zipObj.write(newJson, 'config.json', compress_type = zipfile.ZIP_DEFLATED)
                        os.remove(newJson)
                    elif (x == "Vungle"):
                        zipObj.write(newHtmlPath, 'ad.html', compress_type = zipfile.ZIP_DEFLATED)
                    else:
                        zipObj.write(newHtmlPath, date + '_' + title + '_' + v + '_' + x + '_' + dev + '_' + language + '.html', compress_type = zipfile.ZIP_DEFLATED)
                    zipObj.close()
                    os.remove(newHtmlPath)
                    newHtmlPath = newZipPath
                
                targetFileSize = os.path.getsize(newHtmlPath)
                targetFileSizeInMegabyte = math.ceil(targetFileSize * 1000 / (1024 * 1024)) / 1000

                print("===================  All Done! =================== ")
                print("Target file = {}, with size {}M".format(newHtmlPath, targetFileSizeInMegabyte))

if __name__ == '__main__':
    workDir = os.getcwd() + "/.."
    integrate(workDir)