var app = {};


//@codekit-append "lib/jquery.enhancement.js";
//@codekit-append "actions.js";
//@codekit-append "store.js";
//@codekit-append "alerts.js";
//@codekit-append "modals.js";
//@codekit-append "toggle.js";
//@codekit-append "togglebox.js";

/* **********************************************
     Begin jquery.enhancement.js
********************************************** */

(function($){

  $.fn.show = function() {
    this.removeClass('hidden');
  }

  $.fn.hide = function() {
    this.addClass('hidden');
  }

  $.fn.toggle = function (){
    this.hasClass('hidden') ? this.show() : this.hide();
  }

})(jQuery);

/* **********************************************
     Begin actions.js
********************************************** */

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

/* **********************************************
     Begin store.js
********************************************** */

app.store = (function(m){

  var _this = {};

  _this.set = function(name, value) {
    return (m.localstorage) ? (localStorage.setItem(name, value) || true) : false;
  }

  _this.get = function(name) {
    return (m.localstorage) ? localStorage.getItem(name) : false;
  }

  _this.setJson = function(name, json) {
    var val = a_.isString(val) ? val : JSON.stringify(json)
    return (val) ? _this.set(name, val) : false;
  }

  _this.getJson = function(name, json) {
    var val = _this.get(name)
    return (val) ? a_.toJson(val) : false;
  }

  _this.remove = function(name) {
    return (m.localstorage) ? (localStorage.removeItem(name) && true) : false;
  }

  return _this;
})(Modernizr);


/* **********************************************
     Begin alerts.js
********************************************** */

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


/* **********************************************
     Begin modals.js
********************************************** */

app.modal = (function ($, modal) {
 
  if(modal.length < 1) { return {} }
  if(!modal.is(":hidden")) { modal.addClass("hidden"); }
  
  var container, body, loader;

  container = modal.find("#modal-content");
  body      = container.find("#modal-body");
  loader    = modal.find(".loader");

  // Events

  $(document)
    .on('click', 'a[data-action=modal]', registerModalTrigger)
    .on("ajax:modal:load", loadContent);

  modal
    .on("click", "a[data-action=dismiss]", hideModal)

  function show(content) {
    if(content) { body.html(content) }
    modal.add(container)
      .removeClass("hidden");
  }

  function hide(persistBody) {
    modal.add(container)
      .addClass("hidden");
    if(!persistBody) { body.empty(); }
  }

  function hideModal(e) { 
    e.preventDefault();
    hide(false); 
  }

  function hideLoader() {
    loader.addClass('hidden');
  }

  function registerModalTrigger(e) {
    modal.add(loader).removeClass("hidden");
  }

  function loadContent(event, content, action, actionContent) {

    if(!modal.is(":hidden")) {
      body.html(content);
      container.removeClass("hidden");
      hideLoader();
    }
    
    if (action) {
      app.actions.trigger(action, actionContent);
      //console.log(action + " triggered!");
    }
  }

  return {
    el : modal, body: body, container: container,
    show: show, hide: hide, hideLoader: hideLoader, loadContent: loadContent
  };

})(jQuery, jQuery('#modal'));

/* **********************************************
     Begin toggle.js
********************************************** */

(function($, global){

  var toggleBtns = global.find('[data-action="toggle"]');
  if(!toggleBtns.length) return;

  var toggleSections;

  global.on('click', '[data-action="toggle"]', toggle);

  function toggle(e) {
    e.preventDefault();

    var btn, group, target, section,
        btnGroup, sectionGroup;

    btn           = $(e.target);
    if(btn.hasClass('active')) return;

    group         = btn.data('group');
    toggleTarget  = btn.data('target');

    btnGroup      = global.find('[data-action="toggle"][data-group="'+group+'"]');
    sectionGroup  = global.find('[data-toggle][data-group="'+group+'"]');

    section       = sectionGroup.filter('[data-toggle="'+ toggleTarget +'"]');

    btnGroup.removeClass('active');
    btn.addClass('active');

    sectionGroup.hide();
    section.show();

    $.event.trigger('toggle:' + group, [toggleTarget]);
  }

  //return
  return;

})(jQuery, jQuery(document));

// Example listening to toggle events
// (function($, global){

//   global.on('toggle:modules', function(e, link){
//     console.log(link);
//   })
// })(jQuery, jQuery(document));

/* **********************************************
     Begin togglebox.js
********************************************** */

app.togglebox = (function ($, global) {
 
  var container, buttons;

  container = global.find(".togglebox");

  function init() {
    container = global.find(".togglebox");
    container.on("click", "a[data-action]", toggleContents);
  }

  function toggleContents(e) {
    e.preventDefault(); 
    
    var button, box;

    button        = $(e.target);
    box           =  {};
    box.container = button.parents(".togglebox").first();
    box.hook      = box.container.next(".togglefallback").find("select");   
    box.left      = box.container.find("select").first();
    box.right     = box.container.find("select").last();
    box.action    = button.data("action");

    
    if(box.action == "add") {
      swapSelectedItems(box.left, box.right);
    } else if (box.action == "remove") {
      swapSelectedItems(box.right, box.left);
    }

    updateSelectedValues(box.right, box.hook);
  }

  function swapSelectedItems(fromBox, toBox){

    var selectedItems, fromBoxIds;

    selectedItems = $();
    fromBoxIds    = fromBox.val();

    if (fromBoxIds) {
      $.each(fromBoxIds, function(index,id) {
        fromBox.find("option").each(function(){
          current = $(this);
          if ( current.val() == id ) {
            selectedItems = selectedItems.add(current);
          }
        });
      });
    }
    selectedItems.appendTo(toBox);
  }

  function updateSelectedValues(source, target) {
    var values, options;

    values  = [];
    options = source.find("option");

    options.each(function(){
      values.push($(this).val());
    })

    target.val(values);
  }

  if(container.length > 0) { init(); }
  
  return { init: init };

})(jQuery, jQuery(document));