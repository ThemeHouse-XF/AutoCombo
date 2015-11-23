/**
 * @author th
 */
/** @param {jQuery} $ jQuery Object */
!function($, window, document, _undefined)
{
	XenForo.AutoCombo = function($element) { this.__construct($element); };

	XenForo.AutoCombo.prototype = XenForo.AutoComplete.prototype;
	XenForo.AutoCombo.defaultUrl = 'index.php?members/find-auto-combo&_xfResponseType=json';
	
	$.extend(XenForo.AutoCombo.prototype,
	{	
		keystroke: function(e)
		{
			var code = e.keyCode || e.charCode, prevent = true;

			switch(code)
			{
				case 40: // down
					this.selectResult(1);
					this.scrollMenu();
					break;
				case 38: // up
					this.selectResult(-1);
					this.scrollMenu();
					break;
				case 27: this.hideResults(); break; // esc
				case 13: // enter
					if (this.resultsVisible)
					{
						this.insertSelectedResultOnReturnKey();
					}
					else
					{
						prevent = false;
					}
					break;

				default:
					prevent = false;
					if (this.loadTimer)
					{
						clearTimeout(this.loadTimer);
					}
					this.loadTimer = setTimeout($.context(this, 'load'), 200);
			}

			if (prevent)
			{
				e.preventDefault();
			}
			this.preventKey = prevent;
		},
		
		scrollMenu: function()
		{
			if (!this.$results)
			{
				return;
			}

			scrollTop = this.$results.scrollTop();
			scrollTo = this.selectedResult * 30;
			
			if (scrollTop > scrollTo)
			{
				this.$results.scrollTop(scrollTo);
			}
			if (scrollTop + 150 < scrollTo)
			{
				this.$results.scrollTop(scrollTo-150);
			}
		},
		
		insertSelectedResultOnReturnKey: function()
		{
			var res, ret = false;

			if (!this.resultsVisible)
			{
				return false;
			}

			if (this.selectedResult >= 0)
			{
				res = this.$results.children().get(this.selectedResult);
				if (res)
				{
					this.addValue($(res).data('autoComplete'));
					ret = true;
				}
			}

			return ret;
		},

		// load the drop down list on focus
		focus: function()
		{
			this.loadVal = null;
			this.load();
		},
		
		// clicks outside the box are now handled in the load method below
		blur: function(e)
		{
			// do nothing
		},

		// removed minimum query length and added document click event listener
		load: function()
		{
			var lastLoad = this.loadVal,
				params = this.extraParams;

			if (this.loadTimer)
			{
				clearTimeout(this.loadTimer);
			}

			this.loadVal = this.getPartialValue();

			if (this.loadVal == lastLoad)
			{
				return;
			}

			params[this.queryKey] = this.loadVal;

			if (this.extraFields != '')
			{
				$(this.extraFields).each(function()
				{
					params[this.name] = $(this).val();
				});
			}

			if (this.xhr)
			{
				this.xhr.abort();
			}

			this.xhr = XenForo.ajax(
				this.url,
				params,
				$.context(this, 'showResults'),
				{ global: false, error: false }
			);
			
			// TODO: make this global?
			// TODO: touch interfaces don't like this
			$(document).bind(
			{
				click:         $.context(this, 'hideMenu'),
			});
		},
		
		// don't hide menu if text box is clicked
		hideMenu: function(e)
		{
			if (!$(e.target).hasClass('AutoCombo'))
			{
				clearTimeout(this.loadTimer);
	
				// timeout ensures that clicks still register
				setTimeout($.context(this, 'hideResults'), 250);
	
				if (this.xhr)
				{
					this.xhr.abort();
					this.xhr = false;
				}
			}
		},
		
		// removed focus from text box when result is clicked
		resultClick: function(e)
		{
			e.stopPropagation();

			this.addValue($(e.currentTarget).data('autoComplete'));
			this.hideResults();
		},
	});
	
	// register auto-combo controls
	XenForo.register('input.AutoCombo', function(i)
	{
		autoCombo = XenForo.create('XenForo.AutoCombo', this);
		$(this).focus($.context(autoCombo, 'focus'));
	});
}
(jQuery, this, document);