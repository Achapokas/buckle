app.modal = (function ($, global) {
 
  var modal = global.find('.modal');
  if(modal.length < 1) { return {} }

  if(!modal.is(":hidden")) { modal.addClass("hidden"); }
  
  var container, body, loader, remote;

  container = modal.find(".wrapper");
  body      = container.find(".body");
  loader    = modal.find(".loader");

  // Events

  global
    .on('click', 'a[data-action=modal]:not([data-url])', loadModal)

  modal
    .on("click", "a[data-action=dismiss]", hideModal)


  function loadModal(e){
    e.preventDefault();

    var content;
    content = global.find($(e.target).attr('href')).clone();
    show(content.show());
  }

  function hideModal(e) { 
    e.preventDefault();
    hide(false); 
  }

  function show(content) {
    if(content) { body.html(content) }
    modal.add(container)
      .removeClass("hidden");
    app.actions.trigger('modal:open');
  }

  function hide(persistBody) {
    modal.add(container)
      .addClass("hidden");
    if(!persistBody) { body.empty(); }
    app.actions.trigger('modal:close');
  }


  //remote trigger

  remote = (function() {

    global
      .on('click', 'a[data-action=modal][data-url]', registerModalTrigger)
      .on("ajax:modal:load", loadContent);

    function hideLoader() {
      loader.addClass('hidden');
    }

    function registerModalTrigger(e) {
      e.preventDefault();

      var url = $(e.target).data('url')

      modal.add(loader).removeClass("hidden");
      
      $.ajax({
        url: url, 
        type: 'GET',
        success: parseData, 
        error: handleError
      });
    }

    function parseData(data){
      if(data) app.actions.trigger('ajax:modal:load', data);
    }

    function handleError(e){
      console.log(e);
    }

    function loadContent(event, content, action, actionContent) {

      if(!modal.is(":hidden")) {
        show(content);
        hideLoader();
      }
      
      if (action) {
        app.actions.trigger(action, actionContent);
        //console.log(action + " triggered!");
      }
    }

    return {
      hideLoader: hideLoader, loadContent: loadContent
    };

  })(); //remote

  return {
    el          : modal, 
    body        : body, 
    container   : container,
    show        : show, 
    hide        : hide
  };

})(jQuery, jQuery(document));