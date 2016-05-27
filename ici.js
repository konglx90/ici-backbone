/**
 * Created by kong90 on 16-5-25.
 */

// 使用jquery, 页面加载完成
$(function(){

    var query =  $('#new-ici');
    var footer = $('footer');

    // 小应用, 为方便
    window.answer = {};
    window.klx = function(data){
        window.answer = data;
    }

    // ici Model
    // ---------

    // Our basic
    var ici = Backbone.Model.extend({

        default: function(){
            return {
                translation: ["你好"],
                basic: {
                    "us-phonetic": "[hɛˈlo, hə-]",
                    "uk-speech": "hello&type=1",
                    speech: "hello&type=1",
                    phonetic: "hə'ləʊ; he-",
                    "uk-phonetic": "hə'ləʊ; he-",
                    "us-speech": "hello&type=2",
                    explains: ["n. 表示问候， 惊奇或唤起注意时的用语",  "int. 喂；哈罗", "n. (Hello)人名；(法)埃洛"]
                },
                query: "hello",
                errorCode: 0,
                web: [
                {
                    value: ["你好", "您好", "hello"],
                    key: "Hello"
                },
                {
                    value: ["凯蒂猫", "昵称", "匿称"],
                    key: "Hello Kitty"
                },
                {
                    value: ["哈乐哈乐", "乐扣乐扣"],
                    key: "Hello Bebe"
                }
                ]
            }
        },

        toggle: function(){
            this.save({done: true})
        }
    });

    var one_ici = new ici();

    // TODO 先不用 Collection， 之后加上保存历史查询功能时再加


    // ici view
    var IciView = Backbone.View.extend({

        el: $("#iciapp"),

        tagName: "div",

        template: _.template($('#item-template').html()),

        // The DOM events specific to an item.
        events: {
            "keypress #new-ici"  : "queryOnEnterOrClick",
            "click #js-button-query": "queryOnEnterOrClick"
        },

        initialize: function() {
            console.log("initialize in ici_view");
            //this.footer = $("footer");
        },


        // If you hit `enter` or `click`, we're through editing the item.
        queryOnEnterOrClick: function(e) {
            if (e.keyCode == 13 || e.type == 'click') {
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    jsonpCallback: "klx",
                    url: "http://fanyi.youdao.com/openapi.do?keyfrom=love-ici&key=1848391244&type=data&doctype=jsonp&version=1.1&q=" + query.val(),
                    success: function (data) {
                        footer.css('display', "block");
                        if(window.answer.basic===undefined){
                            window.answer["basic"] = false;
                        }
                        one_ici.set(window.answer)
                        footer.html(_.template($('#item-template').html())(one_ici.attributes))
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        }
    });

    var App = new IciView;
});