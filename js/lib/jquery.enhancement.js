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