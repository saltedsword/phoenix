'use strict'
$(function(){
	// drop-down box tree
	$("#inputParentShow").click(function(e) {  
		let target = $(e.target)
		let tree = target.data('tree')
	    let options = {  
	        bootstrap2 : false,  
	        showTags : true,  
	        levels : 5,  
	        data : tree,  
	        // showCheckbox : true,  
	        // checkedIcon : "glyphicon glyphicon-check",  
	        onNodeSelected : function(event, data) {  
	            $("#inputParentShow").val(data.text) 
	            $("#inputParentid").val(data._id)
	            $("#treeview").hide() 
	        }  
	    } 
	    $("#treeview").show() 
	    $('#treeview').treeview(options) 
	})
	$(document).on('click', function(e) { 
		let target = $(e.target)
		if (target[0]!=$("#inputParentShow")[0] && !target.parent().attr('data-nodeid') && !target.attr('data-nodeid')) {
			$("#treeview").hide()
		}
	})
	// del
	$('.del').click(function(e) {
		let target = $(e.target)
		let id = target.data('id')
		let tr = $('#item-id-' + id)

		$.ajax({
			type: 'DELETE',
			url: '/admin/menu/del?id=' + id
		})
		.done(function(results) {
			if (results.success === 1) {
				if (tr.length > 0) {
					tr.remove()
				}
			} else {
				alert(results.msg)
			}
		})
	})
})  