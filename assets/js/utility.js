$(function(){
	/* Liquidify all images when page loaded */
	imgLiquidify();

	$('.popup').each(function(){
		$(this).find('.button-close-poopup').on('click', function(){
			closePopup();
		});
	});
});

/* Loading inside button */
function showButtonLoading(cfg) {
	cfg.target.first_content = cfg.target.html();
	cfg.target.html(cfg.content ? cfg.content : '<i class="button-loading-content fa fa-spinner fa-pulse"></i>');
	cfg.target.addClass('disabled');
}
function hideButtonLoading(cfg) {
	cfg.target.html(cfg.content ? cfg.content : cfg.target.first_content);
	cfg.target.removeClass('disabled');
}

/* GET URL PARAM */
function getURLParameter(url, name) {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}

// image liquidify
function imgLiquidify(){
	$(".imgLiquid").each(function(){
		if ($(this).hasClass("imgLiquid_oke")) {} 
		else {
			$(this).hide();
			var $that = $(this);
			$(this).find("img").on("load", function() {
				$that.addClass("imgLiquid_oke");

				$that.css("visibility", "visible");
				$that.imgLiquid(
				{
			        fill: true,
			        horizontalAlign: "center",
			        verticalAlign: "top"
			    });

				// $that.fadeIn().css("opacity", 1);
				$that.css("opacity", 1);
				$that.fadeIn();

				// not error
				if (this.width > 0 && this.height > 0) {}
				else { $that.css("display", "none"); }
			}).on("error", function() {
				// error
				$that.css("visibility", "visible");
				$that.css("opacity", 0);
				$that.addClass("imgLiquid_oke");
			}).each(function() {
		  		if(this.complete) { $(this).load(); }
			});
		}
	});
}

// set image input $input for <input /> and $imageContainer for the image containing <img />
function setImageInput($input, $imageContainer) {
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $imageContainer.find('img').attr('src', e.target.result);
                $imageContainer.removeClass("imgLiquid_done imgLiquid_oke imgLiquid_ready");
                imgLiquidify();
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $input.change(function(){ readURL(this); }); 
}

// Share to social media
var popup_width  = 600,
    popup_height = 400,
    popup_left   = screen.width/2 - popup_width/2;
    popup_top    = screen.height/3 - popup_height/2;
    popup_opts   = 'toolbar=0,status=0' +
                 ',width='  + popup_width  +
                 ',height=' + popup_height +
                 ',top='    + popup_top    +
                 ',left='   + popup_left;
var popoverIdphp ='';

function shareFacebook(linkurl){
    var feed = 'https://www.facebook.com/dialog/share?';
    var u = linkurl;
    var url = encodeURIComponent(u);
    feed += 'app_id=636338529862822&display=popup&href='+url+'&redirect_uri='+url;
    window.open(feed, 'Share Facebook', popup_opts);
};

function shareTwitter(linkurl, title){
	var feed = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + url;
    var u = linkurl;
    var url = encodeURIComponent(u);
    window.open(feed, 'Share Twitter', popup_opts);
};

function shareGooglePlus(linkurl){
    var feed = 'https://plus.google.com/share?';
    var u = linkurl;
    var url = encodeURIComponent(u);
    feed += 'url=' + url;
    window.open(feed, 'Share Google Plus', popup_opts);
};

function showLoadingPage() { $('.loading').fadeIn(); }
function hideLoadingPage() { $('.loading').fadeOut(); }

function showPopup(popup, onComplete) {
	popup.css('display', 'flex').hide().fadeIn('fast', function(){
		onComplete ? onComplete() : null;
	});
}

function closePopup(onComplete) {
	$('.popup').fadeOut('fast', function(){
		onComplete ? onComplete() : null;
	});
}

function showMenu() {
	/* Show menu screen */
	const _menuScreen = $('.menu-screen');

	setTimeout(function() {
		_menuScreen.css('display', 'flex').hide().fadeIn(function(){
			var t=1;
			$('.menu-item').each(function(){
				var $this = $(this);

				setTimeout(function() {
					$this.find('.menu-item-detail').fadeIn();
				}, 250 * t);

				t++;
			});
		});
	}, 500);
}