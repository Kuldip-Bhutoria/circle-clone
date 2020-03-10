$(function() {
    return position = $("#circle1").draggable({
        containment: "parent",
        drag: function() {
            var offset = $(this).position();
            var xpos = offset.left - $("#mobile1").offset().left;
            var ypos = offset.top - $("#mobile1").offset().top;
            var data = JSON.stringify({
                xpos: xpos,
                ypos: ypos
            });
            $.ajax({
                type: "POST",
                url: "http://localhost:8000",
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: data
            });
            $.get("http://localhost:8000", function(data) {
                data = JSON.parse(data);
                console.log(`datais`, data);
                $("#circle2").css({
                    position: "absolute",
                    left: data.xpos + $("#mobile2").offset().left,
                    top: data.ypos + $("#mobile2").offset().top,
                }).show();
            });
        }
    });

});