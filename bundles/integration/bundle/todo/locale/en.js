Oskari.registerLocalization({
	"lang" : "en",
	"key" : "todo",
	"value" : {
		"title" : "ToDo View",
		"desc" : "",
		"flyout" : {
			"title" : "ToDo View!"
		},
		"tile" : {
			"title" : "ToDo",
			"tooltip" : "."
		},
		"view" : {
			"title" : "",
			"prompt" : "",
			"templates" : {
				"stats-template" : "<% if (done) { %> <a id=\"clear-completed\">Clear <%= done %> completed <%= done == 1 ? 'item' : 'items' %></a><% } %><div class=\"todo-count\"><b><%= remaining %></b> <%= remaining == 1 ? 'item' : 'items' %> left</div>",
				"item-template" : "<div class=\"view\"><input class=\"toggle\" type=\"checkbox\" <%= done ? 'checked=\"checked\"' : '' %> /><label><%- title %></label><a class=\"destroy\"></a></div><input class=\"edit\" type=\"text\" value=\"<%- title %>\" />",
				"view-template" : "<div class=\"todoapp\"><header><h1>Todos</h1><input id=\"new-todo\" type=\"text\" placeholder=\"What needs to be done?\"></header><section id=\"main\"><input id=\"toggle-all\" type=\"checkbox\"><label for=\"toggle-all\">Mark all as complete</label><ul id=\"todo-list\"></ul></section><footer><a id=\"clear-completed\">Clear completed</a><div id=\"todo-count\"></div></footer></div>"
			}

		}

	}
});
