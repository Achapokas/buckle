app.actions = (function ($, global) {

  var boundEvents = [], eventObjs = {};
 
  function register(controller, actionsObj) {
    $.each(actionsObj, function(action, method){
      var eventActionName = "ajax:" + controller + ":" + action;
      global.on(eventActionName, method);
      boundEvents.push(eventActionName);
      //console.log("bound " + eventActionName);
    })
    eventObjs[controller] = actionsObj;
  }

  function trigger(event, data) {
    $.event.trigger(event, data);
  }

  function showAlerts(flash, inModal){
    inModal = ( inModal && $('#modal-body').is(":visible") );

    var target = (inModal) ? $('#modal-body') : false,
        alerts = a_.toJson(flash).alerts;

    if (alerts.length > 0) {
      app.alerts.display(alerts, target);
    }
  }

  function debugShowEvents() {
    $.each(boundEvents, function(i,v) { console.log(v); });
  }

  return {
    debugShowEvents : debugShowEvents,
    register    : register,
    trigger     : trigger,
    showAlerts  : showAlerts,
    boundEvents : boundEvents,
    eventObjs   : eventObjs
  };

})(jQuery, jQuery(document));