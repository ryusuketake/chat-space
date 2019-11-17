$(function() {

  function appendUser(user){
    var html =  `
                <div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
                </div>
                `
    $("#user-search-result").append(html);
  }
  function appendNilUser(msg){
    var html =  `
                <div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${ msg }</p>
                </div>
                `
    $("#user-search-result").append(html);
  }

  function appendGroupUser(name, id){
    var html =  `
                <div class='chat-group-user'>
                 <input name='group[user_ids][]' type='hidden' value='${id}'>
                  <p class='chat-group-user__name'>${name}</p>
                  <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>
                `
    $("#chat-group-users").append(html);
  }

  function addMember(userId) {
    var html =  `
                <input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />
                `
    $(`#${userId}`).append(html);
  }

  $("#user-search-field").on("keyup", function() {
    let input = $("#user-search-field").val();
    $.ajax ({
      type: 'GET',
      url: '/users',
      data: { keyword: input },
      dataType: 'json',
    })
    .done(function(users) {
      $("#user-search-result").empty();
      if (users.length !== 0) {
        users.forEach(function(user) {
          appendUser(user);
        });
      } else {
        appendNilUser("ユーザーが見つかりません")
      }
    })
    .fail(function() {
      alert("ユーザー検索に失敗しました");
    })
  });

  $(document).on("click", ".user-search-add", function() {
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");
    $(this)
      .parent()
      .remove();
    appendGroupUser(userName, userId);
    addMember(userId);
  });

  $(document).on("click", ".user-search-remove", function() {
    $(this)
      .parent()
      .remove();
  })
});