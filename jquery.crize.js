(function ($, undefined) {
  $.widget("ui.crize", {
    _init:function() {
      this._buildHtml();
      var widget = this;
      this.element.dialog({
        width:1024,
        height:768,
        modal:true,
        buttons: {
          'Save': widget._save.bind(widget)
        }
      });
      this.element.find('#crop').click(this._crop.bind(this));
      this.element.find('#resize').click(this._resize.bind(this));
      this._bindFileUpload();
      this.canvas = this.element.find("canvas")[0];
    },

    _save: function(){
      if(this.options.onsave)
        this.options.onsave({croppedCoords: this.croppedCoords, imageDataUrl: this.canvas.toDataURL('image/'+this.imageType)})
      this.element.dialog('close');
    },

    _buildHtml:function () {
      var html = "<input type='file'/>" +
          "<label for='width'>Width : </label>" +
          "<input type='text' name='width' id='width' value='100'/>" +
          "<label for='height'>Height : </label>" +
          "<input type='text' name='height' id='height' value='200'/>" +
          "<input type='button' id='resize' value='Resize'/>" +
          "<input type='button' id='crop' value='Crop'/>" +
          "<div><canvas></canvas></div>";
      this.element.html(html);
    },

    _crop: function(){
      this.jcropApi.release();
      this.jcropApi.disable();
      var ctx = this.canvas.getContext("2d");
      var croppedCoords = this.croppedCoords;
      var imageData = ctx.getImageData(croppedCoords.x, croppedCoords.y, croppedCoords.w, croppedCoords.h);
      this._resizeCanvas(croppedCoords.w, croppedCoords.h);
      ctx.putImageData(imageData, 0, 0);
      this.jcropApi.enable();
      return false;
    },

    _resize: function() {
      var width = this.element.find("#width").val(),
          height = this.element.find("#height").val();
      this._drawImage(this.canvas.toDataURL(), width, height);
      return false;
    },

    _resizeCanvas: function(width, height){
      var canvas = this.canvas;
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    },

    _drawImage: function(imageDataUrl, width, height){
      var image = new Image,
      ctx = this.canvas.getContext('2d'),
      widget = this;
      image.onload = function () {
        if(!width) width = image.width;
        if(!height) height = image.height;
        widget._resizeCanvas(width, height);
        ctx.clearRect(0, 0, widget.canvas.width, widget.canvas.height);
        ctx.drawImage(image, 0, 0, width, height);
        widget._bindJcrop();
      }
      image.src = imageDataUrl;
    },

    _bindFileUpload:function(){
      var widget = this;
      this.element.find('input[type="file"]').change(function () {
        var fileReader = new FileReader;
        fileReader.onload = function(){
          widget._drawImage(this.result);
        }
        var fileType = this.files[0].type;
        if(fileType.split('/')[0] != 'image') return;
        widget.imageType = fileType.split('/')[1];
        fileReader.readAsDataURL(this.files[0]);
      });
    },

    _bindJcrop:function () {
      if(this.jcropApi) return;
      var widget = this,
      element = this.element;
      element.find("canvas").Jcrop({
        aspectRatio:16 / 9,
        bgColor:"white",
        bgOpacity:0.3,
        onSelect:function (coords) {
          widget.croppedCoords = coords;
        }
      }, function () {
        widget.jcropApi = this;
      });
    }
  });
})(jQuery);
