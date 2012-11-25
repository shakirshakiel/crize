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
      this._bindCrop();
      this._bindResize();
      this._bindFileUpload();
    },

    _save: function(){
      if(this.options.onsave)
        this.options.onsave({croppedCoords: this.croppedCoords})
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

    _bindCrop:function () {
      var element = this.element,
          widget = this;
      element.find("#crop").click(function () {
        widget.jcropApi.release();
        widget.jcropApi.disable();
        var canvas = element.find("canvas")[0],
            ctx = canvas.getContext("2d"),
            croppedCoords = widget.croppedCoords,
            width = croppedCoords.w,
            height = croppedCoords.h,
            imageData = ctx.getImageData(croppedCoords.x, croppedCoords.y, width, height);

        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.putImageData(imageData, 0, 0);
        widget.jcropApi.enable();
        return false;
      });
    },

    _bindResize:function () {
      var widget = this;
      $("#resize").click(function () {
        widget.jcropApi.release();
        widget.jcropApi.disable();
        var canvas = widget.element.find("canvas")[0],
            ctx = canvas.getContext("2d"),
            image = new Image,
            width = widget.element.find("#width").val(),
            height = widget.element.find("#height").val();
        image.onload = function () {
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
          ctx.drawImage(image, 0, 0, width, height);
          widget.jcropApi.enable();
        }
        image.src = canvas.toDataURL();
        return false;
      });
    },

    _bindFileUpload:function () {
      var widget = this,
          element = this.element;
      element.find('input[type="file"]').change(function () {
        var fileReader = new FileReader;
        fileReader.onload = function () {
          var modifiedImage = new Image, canvas, ctx;
          modifiedImage.onload = function () {
            canvas = $("canvas")[0];
            canvas.setAttribute('width', modifiedImage.width);
            canvas.setAttribute('height', modifiedImage.height);
            ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(modifiedImage, 0, 0);
            widget._bindJcrop();
          }
          modifiedImage.src = this.result;
        }
        fileReader.readAsDataURL(this.files[0]);
      });
    },

    _bindJcrop:function () {
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
