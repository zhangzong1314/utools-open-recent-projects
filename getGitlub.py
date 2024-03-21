import json

import requests

cookies = {
    'gr_user_id': '6851618b-863a-4e3d-8f28-26f41690defe',
    'sensorsdata2015jssdkcross': '%7B%22%24device_id%22%3A%2218e3af162f34dc-0fcf78074de37b8-26001851-2073600-18e3af162f411a7%22%7D',
    '934a89823bed3e05_gr_last_sent_cs1': '1901625824',
    '934a89823bed3e05_gr_cs1': '1901625824',
    'experimentation_subject_id': 'eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqWTNZelkwT1RBekxUSTRZekF0TkdNeVpDMDVaRGxpTFRZNU16QmlOVGhoTXpWbE9DST0iLCJleHAiOm51bGwsInB1ciI6ImNvb2tpZS5leHBlcmltZW50YXRpb25fc3ViamVjdF9pZCJ9fQ%3D%3D--c4684056442dbdfaa9f07547fe525ee02db3ba67',
    'known_sign_in': 'TEplZmU0MWRDVENWSUdGaWsyZHZoQktQRWYvRlVQWktqdnk0SnVpYVlwMkhoUExHdmdIK2laN1piRnI1d05GY3lOb1g4OGJZZy9XMHlNYWFPNzhLUjdIcE5KaE9hSVZoZUxTejJpa2ZvcG02Z0hVMWRwTVgrN3JLSEowUFh2VzktLUhpMStWZHFXWUVTbmcxek96MkVldFE9PQ%3D%3D--b8353ce810b422515ab0ebdbe5b5938dc1010165',
    '_gitlab_session': 'be7738e201442bc234089de92eb76eb7',
    'event_filter': 'all',
    'sidebar_collapsed': 'false',
}

headers = {
    'authority': 'gitlab.xiaoduoai.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    # 'cookie': 'gr_user_id=6851618b-863a-4e3d-8f28-26f41690defe; sensorsdata2015jssdkcross=%7B%22%24device_id%22%3A%2218e3af162f34dc-0fcf78074de37b8-26001851-2073600-18e3af162f411a7%22%7D; 934a89823bed3e05_gr_last_sent_cs1=1901625824; 934a89823bed3e05_gr_cs1=1901625824; experimentation_subject_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqWTNZelkwT1RBekxUSTRZekF0TkdNeVpDMDVaRGxpTFRZNU16QmlOVGhoTXpWbE9DST0iLCJleHAiOm51bGwsInB1ciI6ImNvb2tpZS5leHBlcmltZW50YXRpb25fc3ViamVjdF9pZCJ9fQ%3D%3D--c4684056442dbdfaa9f07547fe525ee02db3ba67; known_sign_in=TEplZmU0MWRDVENWSUdGaWsyZHZoQktQRWYvRlVQWktqdnk0SnVpYVlwMkhoUExHdmdIK2laN1piRnI1d05GY3lOb1g4OGJZZy9XMHlNYWFPNzhLUjdIcE5KaE9hSVZoZUxTejJpa2ZvcG02Z0hVMWRwTVgrN3JLSEowUFh2VzktLUhpMStWZHFXWUVTbmcxek96MkVldFE9PQ%3D%3D--b8353ce810b422515ab0ebdbe5b5938dc1010165; _gitlab_session=be7738e201442bc234089de92eb76eb7; event_filter=all; sidebar_collapsed=false',
    'referer': 'https://gitlab.xiaoduoai.com/tester-group',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'x-csrf-token': 'P7Ei/gIAARJ3j5XSg3QK2+0Fk5QnD1pNlqr38qGcFwNW8HwAmjMxeuEDvILTn3cf1RrAlyI6rqlh8OBZvBJgqw==',
    'x-requested-with': 'XMLHttpRequest',
}

job = []
for num in range(5):
    if num == 0:
        url = 'https://gitlab.xiaoduoai.com/groups/tester-group/-/children.json'
    else:
        url = f'https://gitlab.xiaoduoai.com/groups/tester-group/-/children.json?page={num + 1}'
    response = requests.get(url, cookies=cookies, headers=headers)
    if response.text:
        for i in response.json():
            job.append({"name": i["name"],
                        "description": i["description"] if i["description"] else "https://gitlab.xiaoduoai.com" + i[
                            "relative_path"], "url": "https://gitlab.xiaoduoai.com" + i["relative_path"]})
job.insert(0, {"name": '返回', "description": '返回上一级筛选', "url": "返回上一级筛选"})
print(json.dumps(job, ensure_ascii=False))
