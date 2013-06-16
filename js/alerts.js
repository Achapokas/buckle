app.alerts = (function ($, global, alertSelector) {
 
  var _this, alertContainer, delayed

  _this   = {};
  delayed = app.store.getJson('flash');

  if(delayed) { 
    console.log(delayed);
    display(delayed.alerts); 
    app.store.remove('flash');
  }

  alertContainer = global.find('#alerts');

  global
    .on("click", alertSelector, dismiss);

  function dismiss(e){
    e.preventDefault();

    var btn   = $(e.target),
        alert = btn.parent('.alert');

    alert.remove();
  }

  function display(alerts, showIn) {
    showIn = showIn || alertContainer;
     //expects [{name: "notice", message: "..successfully created"}]
    $.each(alerts, function(index, alert) {
      $('<div/>', { class: "alert alert-" + alert.name, text: alert.message })
        .append($('<a/>', { class: "close", html: "&times;", "data-dismiss" : "alert"}))
        .prependTo(showIn);
    });
  }

  function delay(flash) {
    app.store.setJson('flash', flash);
  }

  return {
    display: display,
    delay: delay
  };

})(jQuery, jQuery(document), '[data-dismiss="alert"]');
