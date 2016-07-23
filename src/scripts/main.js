/**
 * Created by kong90 on 16-5-25.
 */
define(['../bower_components/jquery/dist/jquery',
        '../bower_components/underscore/underscore',
        '../bower_components/backbone/backbone'
    ],
    function (jquery, underscore, backbone) {
        "use strict";

        var query = $('#new-ici');
        var footer = $('footer');
        var LIMIT_OF_QUERY_HISTORY = 50;

        // 小应用, 为方便
        window.answer = {};
        window.klx = function (data) {
            window.answer = data;
        };

        // ici Model
        // ---------

        // Our basic
        var ici = Backbone.Model.extend({

            default: function () {
                return {
                    translation: ["你好"],
                    basic: {
                        "us-phonetic": "[hɛˈlo, hə-]",
                        "uk-speech": "hello&type=1",
                        speech: "hello&type=1",
                        phonetic: "hə'ləʊ; he-",
                        "uk-phonetic": "hə'ləʊ; he-",
                        "us-speech": "hello&type=2",
                        explains: ["n. 表示问候， 惊奇或唤起注意时的用语", "int. 喂；哈罗", "n. (Hello)人名；(法)埃洛"]
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
                    ],
                    queryTime: Date.now()   // 查询时间
                }
            },

            toggle: function () {
                this.save({done: true})
            }
        });

        var query_history  = Backbone.Model.extend({

            default: function () {
                return {
                    query: 'hello',
                    explain: 'n. 表示问候， 惊奇或唤起注意时的用语', // 只存第一条解释
                    queryTime: ''
                }
            },

            saveToLocalStorage: function(){
                var query_history;
                if (window.localStorage){

                    //  Assume read history is more than save(the fact is reverse),  add count-ici for quick query
                    var counts = localStorage.getItem('count-ici');
                    if (counts === undefined) {
                        localStorage.setItem('count-ici', 1)
                    }else if (counts === LIMIT_OF_QUERY_HISTORY){
                        query_history = new QueryHistory;
                        query_history.getLastAndRemoveIt();
                    }

                    localStorage.setItem('ici-'+this.attributes.query, JSON.stringify(this.attributes));
                }
            }

        });

        // The Collection of query history
        var QueryHistory = Backbone.Collection.extend({
            model: query_history,
            comparator : function( model ){
                return -model.get("queryTime");
            },

            getDataFromLocalStorage: function(){
                var that = this;
                if (window.localStorage) {
                    for (var pro in localStorage) {
                        if (localStorage.hasOwnProperty(pro) && pro.match('ici-*')) {
                            that.add(JSON.parse(localStorage[pro]))
                        }
                    }
                }
            },

            getLastAndRemoveIt: function(){
                var that = this;
                var old_query_time = Date.now();
                var oldest_index;
                if (window.localStorage) {
                    for (var pro in localStorage) {
                        if (localStorage.hasOwnProperty(pro) && pro.match('ici-*')) {
                            if (JSON.parse(localStorage[pro])['queryTime'] < old_query_time){
                                old_query_time = JSON.parse(localStorage[pro])['queryTime'];
                                oldest_index = pro;
                            }
                        }
                    }
                    localStorage.removeItem(oldest_index);
                }
                return oldest_index;
            }

        });

        // ici view
        var IciView = Backbone.View.extend({

            el: $("#iciapp"),

            tagName: "div",

            template: _.template($('#item-template').html()),

            // The DOM events specific to an item.
            events: {
                'click .js-query-history': 'showQueryHistory',
                'keypress #new-ici': 'queryOnEnterOrClick',
                'click #js-button-query': 'queryOnEnterOrClick'
            },

            initialize: function () {
                console.log("********initialize in ici_view********");

                this.querys = new QueryHistory;
                this.querys.getDataFromLocalStorage();

            },


            // If you hit `enter` or `click`, we're through editing the item.
            queryOnEnterOrClick: function (e) {
                var that = this;
                var one_ici = new ici();
                var one_query_history = new query_history();

                var one_query = query.val();
                if (one_query === '') return;
                if (e.keyCode == 13 || e.type == 'click') {
                    $.ajax({
                        type: "GET",
                        dataType: "jsonp",
                        jsonpCallback: "klx",
                        url: "http://fanyi.youdao.com/openapi.do?keyfrom=love-ici&key=1848391244&type=data&doctype=jsonp&version=1.1&q=" + one_query,
                        success: function (data) {

                            // show query result
                            footer.css('display', "block");
                            if (window.answer.basic === undefined) {
                                window.answer["basic"] = false;
                            }
                            window.answer['queryTime'] = Date.now();
                            one_ici.set(window.answer);
                            footer.html(_.template($('#item-template').html())(one_ici.attributes));

                            // console query history
                            if (window.answer['basic'] !== false) {
                                one_query_history.set(
                                    {
                                        query: one_ici.get('query'),
                                        explain: one_ici.get('basic')['explains'][0],
                                        queryTime: one_ici.get('queryTime')
                                    }
                                );
                                that.querys.add(one_query_history);
                                one_query_history.saveToLocalStorage();
                            }

                        },
                        error: function (error) {
                            console.log(error)
                        }
                    })
                }
            },

            // show query history by click
            showQueryHistory: function(e) {
                var that = this;

                if (window.localStorage){
                    if (that.querys.length === 0){
                        alert('No History');
                        return;
                    }

                    footer.css('display', "block");
                    footer.html(_.template($('#query-history-template').html())({querys: JSON.parse(JSON.stringify(that.querys))}));
                } else {
                    alert('No LocalStorage');
                }
            }

        });

        var App = new IciView;
    });
