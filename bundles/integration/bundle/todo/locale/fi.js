Oskari.registerLocalization({
	"lang" : "fi",
	"key" : "todo",
	"value" : {
		"title" : "ToDo",
		"desc" : "",
		"flyout" : {
			"title" : "Työlista"
		},
		"tile" : {
			"title" : "Työlista",
			"tooltip" : "."
		},
		"view" : {
			"title" : "",
			"prompt" : "",
			"templates" : {
				"stats-template" : "<% if (done) { %> <a id=\"clear-completed\">Poista <%= done %> valmista <%= done == 1 ? 'tehtävä' : 'tehtävää' %></a><% } %><div class=\"todo-count\"><b><%= remaining %></b> <%= remaining == 1 ? 'tehtävä' : 'tehtävää' %> jäljellä</div>",
				"item-template" : "<div class=\"view\"><input class=\"toggle\" type=\"checkbox\" <%= done ? 'checked=\"checked\"' : '' %> /><label><%- title %></label><a class=\"destroy\"></a></div><input class=\"edit\" type=\"text\" value=\"<%- title %>\" />",
				"view-template" : "<div class=\"todoapp\"><header><h1>Työlista</h1><input id=\"new-todo\" type=\"text\" placeholder=\"Mitä pitäisi tehdä?\"></header><section id=\"main\"><input id=\"toggle-all\" type=\"checkbox\"><label for=\"toggle-all\">Merkitse kaikki valmistuneiksi</label><ul id=\"todo-list\"></ul></section><footer><a id=\"clear-completed\">Poista valmistuneet</a><div id=\"todo-count\"></div></footer></div>"
			}
		}
	}
});
