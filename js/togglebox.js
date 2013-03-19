// ============================================
// Togglebox
// ============================================

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