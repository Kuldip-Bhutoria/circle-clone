// import { sendPostion } from './realm_push';

$(function() {

    return position = $("#circle1").draggable({
        containment: "parent",
        drag: function() {
            var offset = $(this).offset();
            var xpos = offset.left;
            var ypos = offset.top;
            var data = JSON.stringify({
                xpos: xpos,
                ypos: ypos
            })
            console.log(data);
            $.ajax({
                type: "POST",
                url: "http://localhost:8000",
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: data
            })
        }
    });

});