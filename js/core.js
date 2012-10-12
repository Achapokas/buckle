var app = {};

//@codekit-append "alerts.js";

/* **********************************************
     Begin alerts.js
********************************************** */

app.alerts = (function ($, alerts) {
 
  if(alerts.length < 1) return [];

  alerts.on("click", dismiss);

  function dismiss(e){
    e.preventDefault();

    var btn = $(e.currentTarget),
        alert = btn.parent('.alert');

    alert.remove();
  }

  return alerts;

})(jQuery, jQuery("[data-dismiss=alert]"));