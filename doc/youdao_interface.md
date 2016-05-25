```http://fanyi.youdao.com/openapi.do?keyfrom=love-ici&key=1848391244&type=data&doctype=<doctype>&version=1.1&q=要翻译的文本```


版本：1.1，请求方式：get，编码方式：utf-8
主要功能：中英互译，同时获得有道翻译结果和有道词典结果（可能没有）
参数说明：
　type - 返回结果的类型，固定为data
　doctype - 返回结果的数据格式，xml或json或jsonp
　version - 版本，当前最新版本为1.1
　q - 要翻译的文本，必须是UTF-8编码，字符长度不能超过200个字符，需要进行urlencode编码
　only - 可选参数，dict表示只获取词典数据，translate表示只获取翻译数据，默认为都获取
　注： 词典结果只支持中英互译，翻译结果支持英日韩法俄西到中文的翻译以及中文到英语的翻译
errorCode：
- 0 - 正常
  
- 20 - 要翻译的文本过长

- 30 - 无法进行有效的翻译

- 40 - 不支持的语言类型

- 50 - 无效的key

- 60 - 无词典结果，仅在获取词典结果生效


```
jsonp数据格式举例
http://fanyi.youdao.com/openapi.do?keyfrom=love-ici&key=1848391244&type=data&doctype=jsonp&callback=show&version=1.1&q=API
show({
    "errorCode":0
    "query":"API",
    "translation":["API"], // 有道翻译
    "basic":{ // 有道词典-基本词典
        "explains":[
            "abbr. 应用程序界面（Application Program Interface）；..."
        ]
    },
    "web":[ // 有道词典-网络释义
        {
            "key":"API",
            "value":["应用程序接口(Application Programming Interface)","应用编程接口","应用程序编程接口","美国石油协会"]
        },
        {...}
    ]
});
```