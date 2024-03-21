const readline = require('readline');
const fs = require('fs');
const { spawn } = require('child_process');
const iconv = require('iconv-lite');
const { exec } = require("child_process");
const path = require('path');
const Nano = require('nano-jsx')
const { Fragment, jsx } = require('nano-jsx')
const { PureCss } = require('./css');
const fileName = 'config.ini';
const filePath = path.join(process.env.HOME || process.env.USERPROFILE, fileName);

const SettingUI = () => {
  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    const projectPathInput = document.getElementById('projectPath');
    const projectHistorypathInput = document.getElementById('projectHistorypath');
    if (selectedValue === 'empty') {
      projectPathInput.value = '确定之后将清空所有配置';
      projectPathInput.disabled = true;
      projectHistorypathInput.value = '确定之后将清空所有配置';
      projectHistorypathInput.disabled = true;
    } else {
      projectPathInput.disabled = false;
      projectHistorypathInput.disabled = false;
      // projectPathInput.value = '';
      // projectHistorypathInput.value = '';
      switch (selectedValue) {
        case 'Pycharm':
          projectPathInput.placeholder = '安装路径\\bin\\pycharm64.exe';
          projectHistorypathInput.placeholder = 'C:\\Users\\XXX\\AppData\\Roaming\\JetBrains\\PyCharmCEXXX\\options\\recentProjects.xml';
          break;
        case 'Goland64':
          projectPathInput.placeholder = '安装路径\\bin\\goland64.exe';
          projectHistorypathInput.placeholder = 'C:\\Users\\XXX\\AppData\\Roaming\\JetBrains\\GoLandXXX\\options\\recentProjects.xml';
          break;
        case 'Chrome':
          projectPathInput.placeholder = '安装路径\\Google\\chrome.exe';
          projectHistorypathInput.placeholder = 'C:\\Users\\XXX\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 3\\Bookmarks';
          break;
        case 'edge':
          projectPathInput.placeholder = '安装路径\\Google\\chrome.exe';
          projectHistorypathInput.placeholder = 'C:\\Users\\XXX\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Bookmarks';
          break;
        case 'VSCode':
          projectPathInput.placeholder = '安装路径\\Microsoft VS Code\\Code.exe';
          projectHistorypathInput.placeholder = 'C:\\Users\\XXX\\AppData\\Roaming\\Code\\User\\globalStorage\\state.vscdb';
          break;
        case 'VisualStudio':
          projectPathInput.placeholder = '安装路径\\Visual Studio\\IDE\Common7\\IDE\\devenv.exe';
          projectHistorypathInput.placeholder = 'C:\\Users\\XXX\\AppData\\Local\\Microsoft\\VisualStudio\\xxx\\ApplicationPrivateSettings.xml';
          break;
        default:
          projectPathInput.placeholder = '输入软件启动文件路径';
          projectHistorypathInput.placeholder = '输入最近项目或书签、历史文件路径';
          break;
      }
    }
  };
  const CustomCss = `
  /* 在这里添加你的自定义样式 */

  /* 下拉框样式 */
  #dropdown {
    width: 100%; /* 根据需要调整宽度 */
    height: 39px; /* 设置下拉菜单的高度 */
    padding: 0.5em;
    margin-bottom: 1em;
    /* 根据需要添加更多样式 */
  }
  #titleNew {
    width: 100%;
    height: 39px;
    padding: 0.5em;
    margin-bottom: 1em;
    /* 添加以下样式 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 输入框样式 */
  #projectPath,
  #projectHistorypath {
    width: 100%; /* 根据需要调整宽度 */
    height: 20px; /* 设置下拉菜单的高度 */
    padding: 0.5em;
    margin-bottom: 1em;
    /* 根据需要添加更多样式 */
  }

  /* 表单按钮样式 */
  .form-button-group {
    text-align: center; /* 根据需要调整对齐方式 */
  }

  /* 如果需要，可以添加更多自定义样式 */`;
  const submitHandler = (event) => {
    event.preventDefault();
    const dropdownValue = document.getElementById('dropdown').value;
    handleDropdownChange({ target: { value: dropdownValue } });
    const projectKey = document.getElementById('dropdown').value;
    console.log(projectKey)
    const email = document.getElementById('projectPath').value;
    const password = document.getElementById('projectHistorypath').value;
    if (email == '确定之后将清空所有配置') {
      fs.writeFileSync(filePath, '')
      return
    }
    let pathData = {};
    let fileContent = '';
    try { fileContent = fs.readFileSync(filePath, 'utf8'); console.log(fileContent) } catch (err) { console.error('config读文件时出错：', err); }
    if (fileContent) {
      try { pathData = JSON.parse(fileContent); } catch (err) { console.error('解析文件内容时出错：', err); }
    }
    pathData[getLastPathComponent(email)] = { "projectPath": email, "projectHistorypath": password };
    const data = JSON.stringify(pathData);
    try { fs.writeFileSync(filePath, data); console.log('文件保存成功！'); } catch (err) { console.error('保存文件时出错：', err); }
  };
  const cancelHandler = () => {
    console.log('取消设置页面');
    utools.outPlugin()
  };
  return jsx`
    <${Fragment}>
      <head>
      <title>Setting</title>
      <style>${PureCss}</style>
      <style>${CustomCss}</style>
      <script src="index.js"/>
      </head>
      <body>
        <div id="root"/>
        <form id="setting" class="pure-form pure-form-stacked" onsubmit=${submitHandler}>
          <fieldset>
            <legend for="titleNew">最近项目设置</legend>
            <!-- New dropdown code -->
            <label for="dropdown">选择项目类型</label>
            <select id="dropdown" onchange=${handleDropdownChange}>
              <option value="空">下拉选择配置软件</option>
              <option value="Pycharm">Pycharm</option>
              <option value="Goland64">Goland64</option>
              <option value="Chrome">Chrome</option>
              <option value="VSCode">VSCode</option>
              <option value="VisualStudio">Visual Studio</option>
              <option value="edge">Microsoft Edge</option>
              <option value="empty">清空配置</option>
              <!-- Add more options as needed -->
            </select>
            <label for="projectPath">启动文件路径</label>
            <input id="projectPath" class="pure-input-1" type="projectPath" placeholder="输入软件启动文件路径"  required />
            <label for="projectHistorypath">最近项目文件路径</label>
            <input id="projectHistorypath" class="pure-input-1" type="projectHistorypath" placeholder="输入最近项目或书签、历史文件路径" required />            
            <div class="form-button-group">
              <button type="submit" class="pure-button pure-button-primary">保存</button>
              <button type="button" class="pure-button" onclick=${cancelHandler}>取消</button>
            </div>
          </fieldset>
        </form>
      </body>
    </${Fragment}>
  `;
};

window.exports = {
  'setting': {
    args: {
      enter() {
        utools.setExpendHeight(480)
        Nano.render(jsx`${SettingUI}`, document.documentElement)
      }
    },
    mode: 'none'
  },
  'pycharm': {
    mode: 'list',
    args: {
      enter: async (action, callbackSetList) => {
        callbackSetList(await main(action['code'], ""))
      },
      search: async (action, searchWord, callbackSetList) => {
        callbackSetList(await main(action['code'], searchWord))
      },
      select: async (action, itemData) => {
        window.utools.hideMainWindow()
        cmdCurl(itemData.info.projectPath, itemData.info.name)
        // utools.outPlugin()
      }
    }
  },
  'goland': {
    mode: 'list',
    args: {
      enter: async (action, callbackSetList) => {
        callbackSetList(await main(action['code'], ""))
      },
      search: async (action, searchWord, callbackSetList) => {
        callbackSetList(await main(action['code'], searchWord))
      },
      select: async (action, itemData) => {
        window.utools.hideMainWindow()
        cmdCurl(itemData.info.projectPath, itemData.info.name)
        // utools.outPlugin()
      }
    }
  },
  'Chrome': {
    mode: 'list',
    args: {
      enter: async (action, callbackSetList) => {
        callbackSetList(await main(action['code'], ""))
      },
      search: async (action, searchWord, callbackSetList) => {
        let newList = await main(action['code'], searchWord)
        // newList.push({ "title": "返回上一级", 'type': 'back', "description": '', "icon": '', 'info': '' });
        callbackSetList(newList)
      },
      select: async (action, itemData, callbackSetList) => {
        let outUrl = itemData.info.url
        if (outUrl == 'http://10.0.0.152:8080/') {
          const logoPic = 'jenkin.png'
          const cmd = 'E:\\其他\\utool\\github\\utools-open-recent-projects\\dist\\getJobs.py'
          res_r = await getJenkinJob('', logoPic, cmd)
          callbackSetList(res_r)
          utools.setSubInput(({ text }) => {
            if (text) {
              getJenkinJob(text, logoPic, cmd).then(result => {
                console.log(result)
                callbackSetList(result)
              });
            }
          }, '子搜索');
        }
        else if (outUrl == 'https://gitlab.xiaoduoai.com/tester-group') {
          const logoPic = 'gitlab.png'
          const cmd = 'E:\\其他\\utool\\github\\utools-open-recent-projects\\dist\\getGitlub.py'
          callbackSetList(await getJenkinJob('', logoPic, cmd))
          utools.setSubInput(({ text }) => {
            if (text) {
              getJenkinJob(text, logoPic, cmd).then(result => { callbackSetList(result) });
            }
          }, '子搜索');
          outUrl = itemData.info.url
        }
        else if (outUrl == '返回上一级筛选') {
          callbackSetList(await main(action['code'], ''))
          utools.setSubInput(({ text }) => {
            if (text) {
              main(action['code'], text).then(result => { callbackSetList(result) })
            }
          }, '子搜索');
          outUrl = itemData.info.url
        }
        else {
          utools.hideMainWindow();
          await utools.shellOpenExternal(outUrl);
          utools.outPlugin()
        }

      }
    }
  },
  'Code': {
    mode: 'list',
    args: {
      enter: async (action, callbackSetList) => {
        callbackSetList(await main(action['code'], ""))
      },
      search: async (action, searchWord, callbackSetList) => {
        callbackSetList(await main(action['code'], searchWord))
      },
      select: async (action, itemData) => {
        window.utools.hideMainWindow()
        cmdCurl(itemData.info.projectPath, itemData.info.name, action['code'])
        // utools.outPlugin()
      }
    }
  },
  'VS': {
    mode: 'list',
    args: {
      enter: async (action, callbackSetList) => {
        callbackSetList(await main(action['code'], ""))
      },
      search: async (action, searchWord, callbackSetList) => {
        callbackSetList(await main(action['code'], searchWord))
      },
      select: async (action, itemData) => {
        window.utools.hideMainWindow()
        cmdCurl(itemData.info.projectPath, itemData.info.name, action['code'])
        // utools.outPlugin()
      }
    }
  }
}
//执行cmd命令
function cmdCurl(projectPath, delegate, code) {
  let cmd
  cmd = `"${projectPath}"  ${delegate}`;
  if (/Code/i.test(code)) { cmd = `"${projectPath}"  "${delegate}"`; }
  console.log(cmd)
  cmd = `"${projectPath}"  "${delegate}"`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令时发生错误: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`命令执行结果包含错误信息: ${stderr}`);
      return;
    }
    console.log(`命令执行结果: ${stdout}`);
  });
}

//主函数
async function main(utoolCode, query) {

  if (utoolCode == 'VS') { utoolCode = 'devenv' }
  const configData = readConfigFile();
  const configDataKeys = Object.keys(configData);
  // console.log(configDataKeys); // 输出：["apple", "banana", "cherry"]
  let project_lists, logoPic;
  for (let i = 0; i < configDataKeys.length; i++) {
    if (configDataKeys[i].includes(utoolCode)) {
      if (/pycharm|goland/i.test(configDataKeys[i])) {
        project_lists = await readPycharmFile(configData[configDataKeys[i]]['projectHistorypath'], configData[configDataKeys[i]]['projectPath']);
        // console.log(project_lists);
        if (/pycharm/i.test(configDataKeys[i])) { logoPic = 'pycharm.png' }
        if (/goland/i.test(configDataKeys[i])) { logoPic = 'goland.png' }
      }
      if (/Code/i.test(configDataKeys[i])) {
        project_lists = await readVscodeDb(configData[configDataKeys[i]]['projectHistorypath'], configData[configDataKeys[i]]['projectPath']);
        // console.log(project_lists);
        logoPic = 'vscode.png'
      }
      if (/devenv/i.test(configDataKeys[i])) {
        project_lists = await readVisualStudio(configData[configDataKeys[i]]['projectHistorypath'], configData[configDataKeys[i]]['projectPath']);
        // console.log(project_lists);
        logoPic = 'VS.png'
      }
      if (/Chrome/i.test(configDataKeys[i])) {
        logoPic = 'Chrome.png'
        console.log(utoolCode, typeof query)
        project_lists = readChomeBookmarks(configData[configDataKeys[i]]['projectHistorypath'])
        // console.log(project_lists)
        return Promise.resolve(
          project_lists.filter(ele => {
            const nameMatch = ele.name.toLowerCase().includes(query.toLowerCase());
            const urlMatch = ele.url.toLowerCase().includes(query.toLowerCase());
            return nameMatch || urlMatch;
          }).map(ele => ({
            title: ele.name,
            description: ele.url,
            icon: logoPic,
            info: ele,
            type: 'enter'
          }))
        );
      }
      break;
    }
  }
  if (!project_lists) { return [{ title: '未配置', description: '未配置', icon: logoPic }] }
  splitText = "/"
  if (/\\/i.test(project_lists[0]['name'])) { splitText = "\\" }
  return Promise.resolve(
    project_lists
      .filter(ele => ele.name.toLowerCase().includes(query.toLowerCase()))
      .map(ele => ({
        title: ele.name.split(splitText)[ele.name.split(splitText).length - 1],
        description: ele.name,
        icon: logoPic,
        info: ele
      }))
  );
}

//pycharm最近项目获取
function readPycharmFile(file, projectPath) {
  let project_lists = []
  return new Promise((res, rej) => {
    try {
      var readInterface = readline.createInterface({
        input: fs.createReadStream(file),
        crlfDelay: Infinity
      });
      readInterface
        .on('line', function (line) {
          const pattern = /<entry key="(.*?)">/;
          const match = line.match(pattern);
          if (match !== null) {
            const key = match[1];
            project_lists.push({ 'name': key, 'projectPath': projectPath })
          }
        })
        .on('close', function () { res(project_lists); });
    } catch (err) { rej(err) }
  });
}
//读取配置文件
function readConfigFile() {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const trimmedContent = fileContent.replace(/\n/g, ' ');
    // console.log(trimmedContent)
    const data = JSON.parse(trimmedContent);
    return data;
  } catch (err) {
    console.error('config读取文件时出错：', err);
    return null;
  }
};
// 获取路径最后一个字段值
function getLastPathComponent(path) {
  const lastIndex = path.lastIndexOf('\\');
  const lastPathComponent = path.substring(lastIndex + 1, path.length - 4);
  return lastPathComponent;
}
//获取谷歌书签1
function readChomeBookmarks(chromPath) {
  const project_lists = [];
  const fileContent = fs.readFileSync(chromPath, 'utf-8');
  const trimmedContent = fileContent.replace(/\n/g, ' ');
  const data = JSON.parse(trimmedContent);
  readChomeBookmarks_(data, project_lists);
  return project_lists
}
//获取谷歌书签2
function readChomeBookmarks_(data, project_lists) {
  const dataKeys = Object.keys(data['roots']);
  for (let i = 0; i < dataKeys.length; i++) {
    const childrens = data['roots'][dataKeys[i]]['children'];
    if (childrens) {
      processChomeChildren(childrens, project_lists);
    } else {
      console.log('无对应值');
    }
  }
}
//获取谷歌书签3
function processChomeChildren(childrens, project_lists) {
  for (let j = 0; j < childrens.length; j++) {
    const children = childrens[j]['children'];
    if (children) {
      processChomeChildren(children, project_lists);
    } else {
      // console.log(childrens)
      project_lists.push({ 'name': childrens[j]['name'], "url": childrens[j]['url'] });
    }
  }
}
//获取vscode最近项目
function readVscodeDb(vsDbPath, projectPath) {
  try {
    let fileContent = fs.readFileSync(vsDbPath, 'utf8');
    let project_lists = []
    fileContent = fileContent.replace(/[^\x20-\x7E]/g, ''); // Removes non-printable ASCII characters
    fileContent = fileContent.replace(/\s/g, ''); // Removes all whitespace characters
    fileContent = fileContent.split('recentlyOpenedPathsList')
    for (let j = 0; j < fileContent.length; j++) {
      const match = fileContent[j].match(/"entries"\s*:\s*\[([\s\S]*?)\]/);
      if (match) {
        const entriesValue = match[1];
        if (entriesValue) {
          const result = `[${entriesValue}]`
          try {
            const resultJson = JSON.parse(result)
            for (let i = 0; i < resultJson.length; i++) {
              let name = resultJson[i].folderUri || resultJson[i].fileUri;
              name = decodeURIComponent(name.replace("file:///", ""));
              if (!project_lists.some(item => item.name === name)) {
                project_lists.push({ 'name': name, "projectPath": projectPath });
              }
            }
          } catch (err) { console.error(err); }
        }
      }
    }

    return project_lists
  } catch (err) {
    console.error('Error reading or processing the file:', err.message);
    return null;
  }
}
//获取VisualStudio最近项目
function readVisualStudio(vsDbPath, projectPath) {
  try {
    let project_lists = []
    let fileContent = fs.readFileSync(vsDbPath, 'utf8');
    //console.log(fileContent)
    const regex = /\[.*?\]/g;
    const match = fileContent.match(regex);
    //console.log(match[match.length-1])
    const result = match[match.length - 1]
    //console.log(fileContent)
    if (!result) {
      return null;
    }
    let storage = JSON.parse(result);
    for (let i = 0; i < storage.length; i++) {
      console.log(storage[i]['Key'])
      project_lists.push({ 'name': storage[i]['Key'], "projectPath": projectPath });
    }
    return project_lists
  } catch (err) {
    console.error('Error reading or processing the file:', err.message);
    return null;
  }
}

async function cmdChromeJenkin(cmd) {
  exec(cmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行命令时发生错误: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`命令执行结果包含错误信息: ${stderr}`);
      return;
    }
    console.log(`命令执行结果: ${stdout}`);
    return stdout;
  });
}
let cmdCache = '';
function cmdChromeJenkin(callback, cmd) {
  // 如果已经有缓存结果，则直接返回缓存结果
  if (cmdCache) {
    callback(cmdCache);
  } else {
    // console.log(222222222222)
    const childProcess = spawn('python', [cmd]);
    let result = '';
    childProcess.stdout.on('data', (data) => {
      const res_data = iconv.decode(Buffer.from(data, 'binary'), 'gbk');
      result += res_data;
    });
    childProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    childProcess.on('exit', (code, signal) => {
      if (code !== null) {
        console.log(`命令执行退出，退出码: ${code}`);
      }
      // 将结果缓存起来
      cmdCache = result;
      callback(result);
    });
  }
}
function getJenkinJob(query, logoPic, cmd) {
  // console.log(cmd)
  return new Promise((resolve, reject) => {
    cmdChromeJenkin((result) => {
      let filteredJobs;
      try {
        const jobs = JSON.parse(result.replace(/'/g, '"'));
        filteredJobs = jobs.filter(ele => {
          const nameMatch = ele.name.toLowerCase().includes(query.toLowerCase());
          return nameMatch;
        });
        resolve(filteredJobs.map(ele => ({
          title: ele.name,
          description: ele.description,
          icon: logoPic,
          info: ele,
        })));
      } catch (error) { reject(error); }
    }, cmd);
  });
}