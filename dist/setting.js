const { Fragment, jsx } = require('nano-jsx')
const anotherFile = require('./css.js');


exports.SettingUI = () => {
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
      <style>${anotherFile.PureCss}</style>
      <style>${anotherFile.CustomCss}</style>
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