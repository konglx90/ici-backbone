# 使用backbone实现一个单页的单词查询

### 调用接口

http://dict-co.iciba.com/api/dictionary.php
 
### 基本页面来自backbone的官方例子todos

- 采用HTML5标签
- localStorage(TODO)
- jsonp跨域

### 基本功能

- 单词查询
    + 读音
    + 词性
    + 例句及翻译
- 翻译
- 历史查询记录(TODO)
- 移动端适配（TODO）
    + 加入查询按钮
    + 响应式
- 使用Grunt来构建项目， 完成一些自动化过程（TODO）
- 

### 效果

![翻译](https://raw.githubusercontent.com/konglx90/ici_backbone/master/static/ici.png)
![单词查询](https://raw.githubusercontent.com/konglx90/ici_backbone/master/static/ici2.png "单词查询")

### 波折

```<script type="text/javascript" src="http://dict-co.iciba.com/api/dictionary.php?key=E0F0D336AF47D3797C68372A869BDBC5&w=good&callback=console.log"></script>```

- 原接口不支持jsonp，而是直接返回json数据，应该返回callback(data)

```<script type="text/javascript" src="http://dict-co.iciba.com/api/dictionary.php?key=E0F0D336AF47D3797C68372A869BDBC5&w=good&callback=console.log"></script>```

- 改用有道词典的接口

```http://fanyi.youdao.com/openapi.do?keyfrom=love-ici&key=1848391244&type=data&doctype=jsonp&version=1.1&q=API```


