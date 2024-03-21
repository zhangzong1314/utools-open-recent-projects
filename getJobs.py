# -*- coding: utf-8 -*-
import requests
import json
from lxml import etree
from urllib.parse import unquote
cookies = {
    'screenResolution': '1920x1080',
    'jenkins-timestamper-offset': '-28800000',
    'jenkins-timestamper': 'system',
    'jenkins-timestamper-local': 'true',
    'JSESSIONID.1f9ed866': 'node02bduxvwdncrcnzvhlqv7nuu218.node0',
    'remember-me': 'emhhbmdodWk6MTcxMTQ0ODE4Mjc5NDo3OGFiOTY0Njc5MjI4MTJmZTc4MDcyMjBlZjdmMTQ5YjdjZWNjZjc4MGI4ZjkxNmY1YmY0NTYwMzhjNzNiNTgy',
}

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    'Connection': 'keep-alive',
    # 'Cookie': 'screenResolution=1920x1080; jenkins-timestamper-offset=-28800000; jenkins-timestamper=system; jenkins-timestamper-local=true; JSESSIONID.1f9ed866=node02bduxvwdncrcnzvhlqv7nuu218.node0; remember-me=emhhbmdodWk6MTcxMTQ0ODE4Mjc5NDo3OGFiOTY0Njc5MjI4MTJmZTc4MDcyMjBlZjdmMTQ5YjdjZWNjZjc4MGI4ZjkxNmY1YmY0NTYwMzhjNzNiNTgy',
    'Referer': 'http://10.0.0.152:8080/view/%E8%87%AA%E5%8A%A8%E5%8C%96%E6%B5%8B%E8%AF%95/job/robot-test/',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
}

response = requests.get('http://10.0.0.152:8080/', cookies=cookies, headers=headers, verify=False)

# print(response.text)
html = etree.HTML(response.text)
job_lists = html.xpath('//a[@class="jenkins-table__link jenkins-table__badge model-link inside"]/@href')
jobs = []
for i in job_lists:
    job = i.split('/')
    job_ = job[0] + '/' + job[1]
    if job_ not in jobs:
        jobs.append(unquote(job_))
res_jobs = []
for i in jobs:
    res_jobs.append({"description":"http://10.0.0.152:8080/"+ i,"url":"http://10.0.0.152:8080/"+ i,"name":i.split('/')[-1],"icon":"jenkin.png"})
res_jobs.insert(0, {"name": '返回', "description": '返回上一级筛选', "url": "返回上一级筛选"})
print(json.dumps(res_jobs,ensure_ascii=False))
# response = requests.get('http://10.0.0.152:8080/job/robot-test/', cookies=cookies, headers=headers, verify=False)
