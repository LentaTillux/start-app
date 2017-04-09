$(document).ready(function()  {
	
});


jQuery(function(){
	initValidate();
	initFancybox();
});

function initFancybox(){
	$('.fancybox, #thank').fancybox();
}

function initValidate(){
	var regPhone = /^[0-9\-\ \()]+$/;

	jQuery('.form-call').each(function() {
		var form = jQuery(this);
		var inputPhone = form.find('.text-input-phone');
		var submit = form.find('input:submit');
		submit.click(function(e) {
			e.preventDefault();
			if(regPhone.test(inputPhone.val())) {
				jQuery.ajax({
					type: form.attr('method'),
					url: "send.php",
					data: form.serialize(),
					success: function(data) {
						inputPhone.removeClass("error");
						$.fancybox('#thank');
						$('.form-call').resetForm();
						setTimeout(function(){
							$.fancybox.close();
							$('.form-call').resetForm();
							window.location.reload(true);
						}, 2000);
					},
					error:  function(){
						alert('AJAX Error!');
					}
				});
			} else {
				inputPhone.addClass("error");
				inputPhone.one('focus', function() {
					inputPhone.removeClass("error");
				});
			}
		});
	});
};


