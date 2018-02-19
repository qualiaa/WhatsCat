var msg_template =       '        <div class="msg-container anim-msg-enter">\n' + 
                         '            <div class="tail"></div>\n' + 
                         '            <div class="msg"><span>{{msg}}</span></div>\n' + 
                         '            <div class="msg-info" role="button">\n' +
                         '                <span>{{time}}</span>\n' +
                         '                {{#out}}' +
                         '                <div class="status">\n' +
                         '                    <i class="status-icon material-icons">schedule</i>\n' +
                         '                </div>\n' +
                         '                {{/out}}' +
                         '            </div>\n' +
                         '        </div>';
var msg_group_template = '    <div class="msg-group msg-{{dir}}">\n' +
                         '    </div>';

$.fn.selectRange = function() {
    var e = document.getElementById($(this).attr('id'));
    if (!e) {
        console.log("nope");
        return;
    }
    e.scrollLeft = e.scrollWidth;

    /*
    // from https://gist.github.com/beiyuu/2029907
    if (e.setSelectionRange) {
        e.focus();
        e.setSelectionRange(start, end);
    } /* WebKit / 
    else if (e.createTextRange) {
        var range = e.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    } /* IE /
    else if (e.selectionStart) {
        e.selectionStart = start;
        e.selectionEnd = end;
    }
    */
};

function getTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = (hours < 10 ? "0" : "") + hours.toString();
    minutes = (minutes < 10 ? "0" : "") + minutes.toString();
    return hours + ":" + minutes;
}

var message_panel = null;
var current_msg_group = null;
var status_line = null;
var input_field = null;
var queue_obj = null;
var queue_name="msg_queue";

var SEND_LETTER_DELAY = 75;
var RECV_LETTER_DELAY = 100;

function last_message_outgoing() {
    return current_msg_group.is(".msg-out");
}

function new_msg_group(outgoing) {
    var msg_group_json = {dir:outgoing ? "out" : "in"}
    return Mustache.render(msg_group_template,msg_group_json)
}

function get_msg_html(msg,out) {
    var msg_json = {
        msg: msg,
        time: getTime(),
        out: out
    };
    return Mustache.render(msg_template,msg_json);
}

function send(msg, outgoing) {
    var msg_html = get_msg_html(msg, outgoing)
    if (last_message_outgoing() != outgoing) {
        var new_msg_group_html = new_msg_group(outgoing)
        current_msg_group = $(new_msg_group_html).insertAfter(current_msg_group);
    }
    current_msg_group.append(msg_html);
    message_panel.scrollTop(message_panel[0].scrollHeight);
}

function add_letter(l) {
    return function() {
        var old_val = input_field.val();
        input_field.val(old_val + l);
        l = old_val.length;
        input_field.selectRange(l+1,l+1);
    }
}



function m(msg) {
    w(200)
    for (var i = 0; i < msg.length; ++i) {
        enqueue(add_letter(msg.charAt(i)),SEND_LETTER_DELAY)
    }
    enqueue(function() {
        send(msg,true);
        input_field.val("");
        var icon = $(".status-icon").last();
        status_queue(icon);
    },400)
}
function t(msg) {
    enqueue(function() {
        status_line.text("typing...");
    },200);
    wait = msg.length * RECV_LETTER_DELAY;
    enqueue(function() {
        send(msg,false);
        status_line.text("online");
    },wait)
}
function w(time) {
    queue_obj.delay(time,queue_name);
}

function enqueue(fn,time) {
    w(time);
    queue_obj.queue(queue_name,function(next) {
        fn();
        next();
    });
}

function status_queue(stat) {
    stat.delay(500);
    stat.delay(200).queue(function(n) {
        stat.text("done");n();
    }).delay(400).queue(function(n) {
        stat.text("done_all");n();
    }).delay(500).queue(function(n) {
        stat.addClass("status-seen");n();
    });
}

function init() {
    msg_html=new_msg_group(false);
    message_panel = $("#messages");
    current_msg_group = $(msg_html).appendTo(message_panel);
    status_line = $(".user-activity");
    input_field = $("#msg-input");
    input_field.prop("readonly",true);
    queue_obj = $("body");
}

function dialogue() {
    w(5000);
    t("heyy :) did you feel ok in the end?");
    w(3000);
    m("Not so much :(");
    m("Think I'm gonna have to skip the party");
    m("Sorry!");
    w(1000);
    t("aww hun, that's ok! let me know if there's anything i can do");
    w(1000);
    m("Well, there is one thing...");
    w(1000);
    m("You remember when we were ill in Hong Kong? And we'd always have a " +
      "bowl of hot congee to take our minds off it and make the time go by quicker?");
    m("I'm really craving some congee right now");
    w(2000);
    t("wow really? can you not just make some yourself?")
    w(1000);
    m("I never learned how to make it :(");
    w(1000);
    t("oh, it's really easy. lol")
    w(1000);
    m("gee, thanks");
    w(1000);
    t("kinda dumb you can't make it")
    m("THANKS");
    t("actually i made some the other night")
    w(1000);
    m("what");
    m("give me some");
    w(500);
    t("no")
    w(200);
    t("lol")
    w(500);
    m("...");
    w(1000);
    t("we ate it all, soorry!")
    m("you're lying");
    w(1000);
    t("what")
    m("Where is it");
    t("uhh... i ate it all")
    w(200);
    m("I don't believe you");
    t("why would i lie?")
    w(200);
    m("WHERE IS IT");
    t("there's none left, honest!")
    m("WHERE");
    t("i'll make you some more!")
    m("BITCH I'LL CUT YOU");
    t("i'll make more!")
    m("TOO LATE BITCH");
    m("I'M COMING");
    w(1000);
    t("please don't hurt me")
    t("i have a family")
    w(1000);
    t("please")
    w(2000);
    t("Becci?")
    w(7000);
    t("... Becci?")
    w(10000);
    queue_obj.queue(queue_name,function(n) {
        status_line.text("last seen today at " + getTime());
        n();
    });
    w(5000);
    t("asdfsljfhwrwlrwhr lwrrwlrwhrwrdsfsf")
    w(1000);
    t("afljhg hgdsoiusaajvfnjvz cx'SAds9fsavff[f")
    w(500);
    t("rju")
    w(5000);
    queue_obj.queue(queue_name,function(n) {
        status_line.text("last seen today at " + getTime());
        n();
    });
    t("Should have saved me some congee...")
    w(5000);
    queue_obj.queue(queue_name,function(n) {
        status_line.text("last seen today at " + getTime());
        n();
    });
}


$(document).ready(function() {
    init();
    dialogue();
    queue_obj.dequeue(queue_name);
});
