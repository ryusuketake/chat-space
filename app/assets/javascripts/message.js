$(function() {

  
  function buildHTML(message) {
    var image = message.image ? `<img src="${message.image}">` : "";
    
    var html = `<div class = "message" data-id=${message.id}>
    <div class = "message__upper-info clearfix">
    <div class = "message__upper-info__talker">
    ${message.user_name}
    </div>
    <div class = "message__upper-info__date">
    ${message.created_at}
    </div>
    </div>
    <div class = "message__text">
    ${message.content}
    ${image}
    </div>
    </div>`
    
    return html;
  }
  
  $('#new_message').on('submit',function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data) {
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({'scrollTop': $('.messages')[0].scrollHeight});
      $('#new_message')[0].reset();
      $('.submit-btn').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました")
    });
  })
  
  var reloadMessages = function() {
    var urlGetter = location.href;
    var splitUrl = urlGetter.split("/");
    var groupsId = splitUrl.slice(4, 5);

    last_message_id = $(".message").last().attr("data-id");

    $.ajax( {
      url: `/groups/${groupsId}/api/messages`,
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      messages.forEach(function(message) {
        var html = buildHTML(message);
        $('.messages').append(html);
        $('.messages').animate({'scrollTop': $('.messages')[0].scrollHeight});
      });
    })
    .fail(function() {
      console.log('error');
    });
  };
  
  if(location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});