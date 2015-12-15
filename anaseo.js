/**
 * Created by fjywan on 15/12/15.
 */
var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var btn_list = [];
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/bower_components'));

function getMoreRelateInfo($ele) {
    if ($ele.parents('.program-sidebar').length) {
        return $ele.parents('.program-sidebar').find('h3>a').text();
    } else if ($ele.parents('.row').find('.media-heading').length) {
        return $ele.parents('.row').find('.media-heading').text();
    } else if ($ele.parents('.tab-pane').length) {
        return $ele.parents('.tab-pane').find('h4').text()
    } else if ($ele.parents('.experts').find('h3>a').length) {
        return $ele.parents('.experts').find('h3>a').text();
    } else if ($ele.parents('.col-xs-3').find('h4').length) {
        return $ele.parents('.col-xs-3').find('h4').text();
    }
}

app.get('/', function(req, res) {
    res.render('nav', {'btn_list': [{
        title : '澳洲',
        url : '/au/'
    },{
        title : '香港',
        url : '/hk/'
    }]});
});

app.get('/au/', function(req, res) {
    superagent.get('http://au.shunshunliuxue.com/')
        .end(function(err, sres) {
            if (err) {
                console.log(err);
            }
            var $ = cheerio.load(sres.text);
            $("a[id*='live-btn-']").each(function(idx, element) {
                var $element = $(element);
                btn_list.push({
                    content: $element.text(),
                    id: $element.attr('id'),
                    fatherCon: getMoreRelateInfo($element)
                });
            });


            res.render('main', {'btn_list': btn_list});

        });
});

app.get('/hk/', function(req, res) {
    superagent.get('http://hk.shunshunliuxue.com/')
        .end(function(err, sres) {
            if (err) {
                console.log(err);
            }
            var $ = cheerio.load(sres.text);
            $("a[id*='live-btn-']").each(function(idx, element) {
                var $element = $(element);
                btn_list.push({
                    content: $element.text(),
                    id: $element.attr('id'),
                    fatherCon: getMoreRelateInfo($element)
                });
            });


            res.render('main', {'btn_list': btn_list});

        });
});

app.listen(9001, function() {
    console.log('app is listening at port 9001');
});