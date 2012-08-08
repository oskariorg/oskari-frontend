// SolitairePlayer GPL (C) janne.korhonen at mac.com
// Depends JQuery for drop zone visualisation drag drop and and animation
/**
 * @todo remove jQuery deps
 */

Oskari.clazz.define("Oskari.mapframework.solsol.SolSolPlayer",
    function () {
         this.dropZoneMoves = [];
         this.sol = null;

         this.timer = null;
         this.alerted = -1;
         this.paused = true;
         this.stepper = 0;
         this.el = null;
         this.dlg = {
             'success': null,
             'failure': null
         };
         this.cards = {};
     }, {

        getCardDiv: function(cardId) {
                return this.cards[cardId];
        },

         calcCardPos: function(c,s) {
            // 0-6 == game
            // 7 == deal
           // 8 == deck
        // 9-12 == finals for club, diamond, heart, spade
          if( s < 7 ) {
              return { lpos:s*64+s,  tpos: 128+c*24 };
          } else if( s < 9 ) {
              return { lpos:(s-7)*64+s,  tpos: c };

          } else {
              return { lpos:3*64+(s-9)*64+s,  tpos: c };

          }

        },

      createCardDiv: function(cardId,cardNum) {
                var cd = document.createElement('div');
                cd.id = cardId;
                cd.setAttribute('cardNum',cardNum);
                cd.className = 'card';

                return cd;
      },

        toHtml: function(container) {
            var sol = this.sol;
            var state = sol.getRoState();

          var s =8;
         for( var c =0; c < 52; c++) {
            {
                var stacksS = state.stacks.elementAt(s);
                var sv = stacksS.elementAt(c);
                 if( sv < 0 ) {
                      var bgpos = 2*-57.15384+" "+4*-83;
                  } else if( s== 8 || c <= state.firstHidden.elementAt(s)  ) {
                      var bgpos = 2*-57.15384+" "+4*-83;
                      var pos = this.calcCardPos(c,s);
                      var cardId = 'card_'+sv;
                      var cd = this.cards[cardId];
                      if( !cd ) {
                          cd = this.createCardDiv(cardId,sv);
                          container.appendChild(cd);
                         this.cards[cd.id] = cd;
                     }
                      cd.style.left = pos.lpos;
                      cd.style.top= pos.tpos;
                      cd.style.zIndex = c;
                      cd.style.backgroundPosition = bgpos;
             } else {
                     var suite = Math.floor(sv / 16);
                     var card = Math.floor(sv % 16);
                      var bgpos = card*-57.15384+" "+suite*-83;
                      var pos = this.calcCardPos(c,s);
                      var cardId = 'card_'+sv;
                      var cd = this.cards[cardId];
                      if( !cd) {
                          cd = this.createCardDiv(cardId,sv);
                           container.appendChild(cd);
                         this.cards[cd.id] = cd;
                     }
                      cd.style.left = pos.lpos;
                      cd.style.top= pos.tpos;
                      cd.style.zIndex = c;
                      cd.style.backgroundPosition = bgpos;
                 }
            }

        }
        },

         render: function(container) {
                this.toHtml(container);

               /*$(".card").each(function(item) {
                   $(this).dropShadow({}); // shadows left behind when cards move
                  $(this).draggable({ revert: true });
               });*/
                var sol = this.sol;

                 var state = sol.getRoState();

//                for( var c =0; c < 24; c++) {
                  //for(var s = 0 ; s < 16 ; s++ )
                 var s =8;
                 for( var c =0; c<52;c++) {
                  {
                     var stacksS = state.stacks.elementAt(s);
                     var sv = stacksS.elementAt(c);
                     if( sv < 0 ) continue;

                      var cardId = "card_"+sv;
                      var cardDiv = this.getCardDiv(cardId);

                     if( c <= state.firstHidden.elementAt(s)  ) {
                      // $(cardDiv).draggable('destroy');
                     } else {
                     	var self = this;
                       var sol = this.sol;                     	
                       $(cardDiv).draggable({ //revert: true,
                         cardNum: sv,
                         start: function(event,ui) {
                          	self.resetDropZoneMoves();
                            sol.prepareMovesForCard(Number(ui.helper.attr('cardNum')),self.dropZoneMoves);
                           	self.visualiseDropZones(self.dropZoneMoves);
                        },
                         helper: 'clone',
                         zIndex: 2700

                        });//.draggable('enable');

                    }
                }}
          },

          renderMove: function(m,anim) {

                for( var n = 0 ; n <24;n++) {
                       var sv = m.cards.elementAt(n);
                       if( sv == -1 ) break;

                       var cardId = "card_"+sv;
                       var cardDiv = this.getCardDiv(cardId);

                       var pos = this.calcCardPos(m.toPos+n,m.toStack);
                       cardDiv.style.zIndex = m.toPos+n;
                       var card = Math.floor(sv %16);
                       var suite = Math.floor(sv / 16);
                       if( m.toStack == 7 || (m.toStack < 7 && m.toPos == m.toStack)) {
                       var bgpos = card*-57.15384+" "+suite*-83;
                       cardDiv.style.backgroundPosition = bgpos;
                       }
                       if( anim )
                           $(cardDiv).animate({left:pos.lpos, top: pos.tpos},'slow');
                            else {
                              cardDiv.style.top = pos.tpos;
                              cardDiv.style.left=pos.lpos;

                             }
                }
                if( m.unfold != -1 ) {
                       var n = m.unfold;
                       var cardId = "card_"+n;
                       var cardDiv = this.getCardDiv(cardId);
                       var card = Math.floor(m.unfold %16);
                       var suite = Math.floor(m.unfold / 16);
                       if( m.fromStack != 8 ) {
                       var bgpos = card*-57.15384+" "+suite*-83;
                       cardDiv.style.backgroundPosition = bgpos;
                       }
                       var self = this;
                       var sol = this.sol;
                       $(cardDiv).draggable({ //revert: true,
                         cardNum: n,
                            start: function(event,ui) {
                            	self.resetDropZoneMoves();
	                            sol.prepareMovesForCard(Number(ui.helper.attr('cardNum')),self.dropZoneMoves);
    	                        self.visualiseDropZones(self.dropZoneMoves);
                        },

                         helper: 'clone', zIndex: 2700
                         });
                }
            },

           applyDropZoneMove: function(cardNum,toStack,toPos) {
                var sol = this.sol;
                for(var n =0 ; n < this.dropZoneMoves.length;n++) {
                    var m = this.dropZoneMoves[n];
                    if( !(m.toStack == toStack && m.toPos == toPos && m.cards.elementAt(0) == cardNum ) )
                        continue;
                    sol.m = m;
                    this.step(false);

                    break;

                }
            },

            resetDropZoneMoves: function() {

                    var m = this.dropZoneMoves.shift();
                    while( m!= null) {
                        m.destroy();
                        delete m;
                        m = this.dropZoneMoves.shift();
                    }
            },

           visualiseDropZones: function(moves) {
                var sol = this.sol;
                var el = this.el;
               $(el).find(".dropZone").remove();
               $(el).find(".dropZone").droppable('destroy');

               for(var n=0;n < moves.length;n++) {
                   var m = moves[n];
                   var pos = this.calcCardPos(m.toPos,m.toStack);
                   if( m.toStack != 7 ) {
                    $(el).append(
                         "<div id='droppable' toStack='"+m.toStack+"' toPos='"+m.toPos+"' class='dropZone' style='z-index:"+(m.toPos+1)+"; left:"+(pos.lpos)+
                           "; top:"+(pos.tpos)+";'></div>");
                   } else {
                    $(el).append(
                         "<div id='droppable' toStack='"+m.toStack+"' toPos='"+m.toPos+"' class='dropZone' style='z-index:"+(m.toPos+1)+"; left:"+(pos.lpos)+
                           "; top:"+(pos.tpos+24)+";'></div>");
                   }

               }
               var self = this;
              $(".dropZone").droppable({
                        accept: '.card',
                        hoverClass: 'ui-state-active',
                        drop: function(event, ui) {
                                $(this).addClass('ui-state-highlight');
                                self.applyDropZoneMove(Number(ui.draggable.attr('cardNum')),Number($(this).attr('toStack')),Number($(this).attr('toPos')));
                        }
                });
            },

            step: function(anim) {
                var sol = this.sol;

                 var m = sol.getMove();

                    if( m.ok ) {
                        sol.applyMove(m);
                        this.renderMove(m,anim);
                    } else if( sol.detectSuccess(m) != 1 && sol.getRoState().state >= 1) {
                       this.paused = true;
                       this.alerted = 10;
                       //$(this.dlg['failure']).dialog('open');
                       this.report({ state: 'failure'});
                    }

                    m = sol.stepSimulation();

                    if( sol.detectSuccess(m) == 1) {
                        this.paused = true;
                        this.alerted = 10;
                       // $(this.dlg['success']).dialog('open');
                        this.report({ state: 'success'});
                    }

                    if( m.ok ) {
                         // rendataan
                    }

                    if( sol.getRoState().state != 0 ) {
                    // saatais getMoves(),mutta ei saada ns. bouncerseja
                    this.resetDropZoneMoves();
                    sol.prepareMovesForPos(-1,-1,this.dropZoneMoves);
                    this.visualiseDropZones(this.dropZoneMoves);//sol.getMoves());
                   }

                   //sol.toHtmlTable(document.getElementById('debug'));
            },

            bd: function (moves,bc,bi) {

                   //debug.innerHTML = "ML: "+moves.length+" BC: "+bc+" BI: "+bi;
               },

            startup:  function (el) {
            
               this.el = el;
                var sol = this.sol;//new SolSol.solitaire();
                //this.sol = sol;
                sol.bouncerDebugger = this.bd;

               sol.newGame(true);
               this.render(el);
               this.paused = false;

               var self = this;
               this.func = function() { self.autoStep(); }

               //this.prepareDialogs();


               this.timer = window.setInterval(this.func,250);

               },
               
               report: function(what) {
            	   
               },

               shutdown: function() {
                  if( this.timer )
                      window.clearInterval(this.timer);
                 var sol = this.sol;
                 this.sol = null;
                 sol.destroy();
                 delete sol;
               },
               solNewGame: function() {
                   this.paused = true;
                   this.stepper = 0;
                   var sol = this.sol;
                   sol.newGame(true);
                   this.render(this.el);
               },

               solStep: function() {
                   var sol = this.sol;
                   sol.stepSimulation();
                   this.step(true);
               },

               solStart: function () {
                   this.paused = !this.paused;
               },

               solHint: function() {
                   var sol = this.sol;
                   this.resetDropZoneMoves();
                   sol.prepareMovesForPos(-1,-1,this.dropZoneMoves);
                   this.visualiseDropZones(this.dropZoneMoves);
              },

              autoStep: function() {
              var sol = this.sol;
                if( sol.state.state == 0 )
                   this.step(true);
                 else if ( !this.paused  ) {
                    this.stepper++;
                    if( this.stepper %2 == 0 )
                      this.step(true);
                 }
                 else if( this.alerted > 0 ) {
                    this.alerted--;
                    if( this.alerted == 0 ) {
                           /*$(this.dlg['success']).dialog('close');
                            $(this.dlg['failure']).dialog('close');*/
                             this.solNewGame();
                             this.solStart();
                    }
                 }
              },
              /*prepareDialogs: function() {

              var el = this.el;
              var dlgSuccess = document.createElement('div')
              var dlgFailure = document.createElement('div')
              this.dlg.success = dlgSuccess;
              this.dlg.failure = dlgFailure;

              dlgSuccess.id = 'dialogSuccess';
              dlgSuccess.title="Success";
              el.appendChild(dlgSuccess);

              dlgSuccess.appendChild(document.createTextNode("Success!"));

              dlgFailure.id = 'dialogFailure';
              dlgFailure.title="Failure";
              dlgFailure.appendChild(document.createTextNode("No moves!"));
              el.appendChild(dlgFailure);


                var player = this;
              $(this.dlg['success']).dialog({
                      bgiframe: true,
                      modal: true,
                      autoOpen: false,
                      buttons: {
                              Ok: function() {
                                     player.alerted = -1;
                                      $(this).dialog('close');
                              }
                      }
              });
              $(this.dlg['failure']).dialog({
                      bgiframe: true,
                      modal: true,
                      autoOpen: false,
                      buttons: {
                              Ok: function() {
                                     player.player.alerted = -1;
                                      $(this).dialog('close');
                              }
                      }
              });
              },*/
              
              createAI: function() {

            	     function Vector(n){
            	         this.arr = new Array(n);
            	         this.length = 0;
            	         this.capacity = n;
            	    }

            	     Vector.prototype = {
            	              add:function( o) {
            	                      this.arr[this.length]=o;
            	                      this.length++;
            	             },
            	            elementAt:function(n) { return this.arr[n]; },
            	            assignAt:function(n,v) { this.arr[n] =v ; },
            	            isEmpty:function() {return this.length==0;},
            	            size:function() { return this.length;},
            	            clear:function() { this.length = 0;
            	                for(n=0; n<this.capacity;n++) this.arr[n]=-1;
            	           },
            	            begin:function() { return 0; },
            	            end:function() { return this.capacity; },
            	            fill: function(b,e,v) { for( var n = b; n < e ;n++) this.arr[n]=v;},

            	            assignCopy:function(b,e,src) {
            	                this.clear();
            			    var assPos = 0;
            	                for(var n = b; n <e;n++) this.arr[assPos++] = src.arr[n];
            	            }
            	     };

            	     function DeckOfCards() {
            	            this.deck = new Vector(52);

            	            var deckIndex =0;
            	            for( var suit = 0 ; suit < 4; suit++ ) {
            	                for(var card=0;card <13;card++) {
            	                    this.deck.assignAt(deckIndex,suit*16+card);
            	                    deckIndex++;
            	                }
            	            }


            	     }

            	     DeckOfCards.prototype.assignCopy = function(other) {
            	            this.deck.assignCopy(other.deck.begin(),other.deck.end(),other.deck);
            	     };

            	     DeckOfCards.prototype.randomShuffle = function() {
//            	         Math.random(
            	        var cards = this.deck.arr; // prim hack
            	        var n = cards.length;            // The number of items left to shuffle (loop invariant).
            	        while (n > 1)
            	        {
            	            n--;                         // n is now the last pertinent index
            	            var k = Math.floor(Math.random()*(n + 1));  // 0 <= k <= n.
            	            var tmp = cards[k];
            	            cards[k] = cards[n];
            	            cards[n] = tmp;
            	        }

            	     };

            	   function State() {
            	         this.state = -1;
            	         this.bouncerIndex = 0;
            	         this.bouncerCount = 0;
            	         this.stacks = new Vector(16);
            	         for(n=0; n <16;n++) {
            	             var stacksN = new Vector(n == 8 ? 52 : 24);
            	                this.stacks.assignAt(n,stacksN);
            	                stacksN.fill(stacksN.begin(),stacksN.end(),-1);
            	          }
            	         this.firstHidden = new Vector(16);
            	         this.tops = new Vector(16);
            	         this.dealerIndex = -1;
            	         this.restartLooped =-1;
            	         this.firstHidden.fill(this.firstHidden.begin(),this.firstHidden.end(),-1);
            	         this.tops.fill(this.tops.begin(),this.tops.end(),-1);

            	   }

            	   State.prototype = {
            	       assignCopy: function(other) {
            	               for(n=0;n<16;n++){
            	                   var stacksN = other.stacks.elementAt(n);
            	                   this.stacks.elementAt(n).assignCopy(stacksN.begin(),stacksN.end(),stacksN);
            	               }
            	               this.firstHidden.assignCopy(other.firstHidden.begin(),other.firstHidden.end(),other.firstHidden);
            	               this.tops.assignCopy(other.tops.begin(),other.tops.end(),other.tops);
            	               this.dealerIndex = other.dealerIndex;
            	               this.restartLooped = other.restartLooped;
            	               this.state = other.state;
            	       }
            	   };

            	   function Move() {
            	        this.ok = false;
            	        this.fromStack = -1;
            	        this.fromPos = -1;
            	        this.toStack = -1;
            	        this.toPos =-1;
            	        this.cards = new Vector(24);
            	        this.unfold =-1;
            	        this.restartLooped = -1;
            	        this.msg = "";
            	        this.cards.fill(this.cards.begin(),this.cards.end(),-1);
            	   }

            	   Move.prototype = {
            	           destroy: function() {
            	                   var v  =this.cards;
            	                   this.cards =null;
            	                   delete v;
            	           },
            	           assign:function(
            	                pok,pfromStack,pfromPos,ptoStack, ptoPos,punfold ) {

            	            this.ok = pok;
            	            this.fromStack = pfromStack;
            	            this.fromPos = pfromPos;
            	            this.toStack = ptoStack;
            	            this.toPos = ptoPos;
            	            this.unfold = punfold ;
            	            this.restartLooped =0;
            	            this.msg = "";
            	            this.cards.fill(this.cards.begin(),this.cards.end(),-1);
            	        },
            	        reset:function() {
            	         this.assign(false,-1,-1,-1,-1,-1);
            	       },
            	       assignCopy:function(other) {
            	          this.assign(other.ok,other.fromStack,other.fromPos,other.toStack,other.toPos,other.unfold);
            	          this.restartLooped = other.restartLooped;
            	          this.cards.assignCopy(other.cards.begin(),other.cards.end(),other.cards);
            	          this.msg = other.msg;
            	       }
            	   };


            	   function Solitaire() {
            	       this.deck = new DeckOfCards();
            	       this.state = new State();
            	       this.ms = [];
            	       this.m = new Move();
            	       this.bouncerDebugger = function() {};
            	  }



            	   Solitaire.prototype = {
            	       destroy: function() {
            	                var d = this.deck;
            	                var s = this.state;
            	                var m = this.m;
            	                this.deck = null;
            	                this.state = null;
            	                this.m = null;
            	                delete d;
            	                delete s;
            	                delete m;
            	           },
            	    getRoState:function() { return this.state; },
            	    getRwState:function()  {  return this.state;},
            	    newGame:function(shuffle) {
            	        this.ms = [];
            	        this.m.reset();


            	        var cards = new DeckOfCards();
            	        cards.assignCopy(this.deck);


            	         if( shuffle)
            	            cards.randomShuffle();

            	        // reset game board
            	        var state = this.getRwState();
            	        state.restartLooped =-1;
            	        state.bouncerCount = 0;
            	        state.bouncerIndex = 0;

            	        state.firstHidden.fill(state.firstHidden.begin(),state.firstHidden.end(),-2);
            	        state.tops.fill(state.tops.begin(),state.tops.end(),-1);
            	        for( var n =0; n <16;n++) {
            	            var stacksN = state.stacks.elementAt(n);
            	            stacksN.fill(stacksN.begin(),stacksN.end(),-1);
            	        }


            	    // deal cards to stacks 1-7 from cards
            	    // adjust backside val to match
            	    // push rest to stack 0 for redeals
            	    var dealt = 0;
            	/*    for( var s = 0 ;s<7;s++) {
            	        var stacksS = state.stacks.elementAt(s);
            	        for( var c = 0 ; c <= s ; c++ ) {
            	            stacksS.assignAt(c, cards.deck.elementAt(dealt++));
            	        }
            	        state.firstHidden.assignAt(s,s-1);
            	        state.tops.assignAt(s,s);
            	    }
            	*/
            	    // pakka

            	    //
            	    state.dealerIndex = 0;
            	    var stackd = state.stacks.elementAt(8);
            	    for( ; dealt<52;dealt++) {
            	        stackd.assignAt(state.dealerIndex++,cards.deck.elementAt(dealt));
            	    }

            	    //state.firstHidden.assignAt(8,22);
            	    //state.tops.assignAt(8,23);
            	    state.firstHidden.assignAt(8,50);
            	    state.tops.assignAt(8,51);

            	    state.state = 0;

            	        },
            	    applyMove:function(m) {
            	          // let's move stuff

            	        if( !m.ok ) {
            	            //window.alert("INVALID MOVE");
            	            return;
            	        }

            		  //window.alert("F:"+m.fromStack+":"+m.fromPos+" T:"+m.toStack+":"+m.toPos);

            	        var state = this.getRwState();
            	        state.restartLooped = m.restartLooped;

            	        var stacksf = state.stacks.elementAt(m.fromStack);
            	        var stackst = state.stacks.elementAt(m.toStack);

            	        // for_each
            	        for(var mc =0;mc<24;mc++) {
            	            if(m.cards.elementAt(mc) == -1 )
            	                break;

            	            stackst.assignAt(m.toPos+mc,stacksf.elementAt(m.fromPos+mc));
            	            state.tops.assignAt(m.toStack,state.tops.elementAt(m.toStack)+1);
            	            if( state.state == 0 && m.fromStack == 8 ) {
            	                state.firstHidden.assignAt(m.toStack,state.firstHidden.elementAt(m.toStack)+1)
            	            }

            		        // IF dealer deck
            	      	 if( m.toStack == 7 ) {
            		            state.firstHidden.assignAt(m.toStack,state.tops.elementAt(m.toStack)-1);
            	            	stacksf.assignAt(m.fromPos+mc,-1);
            	      	      state.tops.assignAt(m.fromStack,state.tops.elementAt(m.fromStack)-1);
            		       } else {

            		            // and unfold next card
            		
            	      	      stacksf.assignAt(m.fromPos+mc,-1);
            	            	state.tops.assignAt(m.fromStack,state.tops.elementAt(m.fromStack)-1);
            	        	 }
            		  }

            	    	  if( m.unfold !=-1)
            	           state.firstHidden.assignAt(m.fromStack, state.firstHidden.elementAt(m.fromStack)-1);

            	    }
            	    ,
            	    render:function(elm) {

            	    },

            	     detectSuccess:function(m) {
            	        var  sum1 = 0;
            	        var state = this.getRoState();
            	         for(var n = 0 ; n < 9; n++)
            	             sum1+=state.tops.elementAt(n);


            	         var sum2 = 0;

            	         for( var n = 9; n < 13; n++)
            	             sum2 += state.tops.elementAt(n);

            	         return sum1 == -9 && sum2 == 48 ? 1: (m.restartLooped >0 ? -1: 0);
            	     },

            	        getMove:function() { return this.m; },
            	        getMoves:function() { return this.ms; },
            	        prepareMovesForPos:function( s, c, moves ) {
            	        },

            	        stepSimulation:function() {

            	          this.ms = [];//.clear();
            	          this.m.reset();
            	          this.m.restartLooped = this.getRoState().restartLooped;

            	         var moves = this.ms;

            	         var state = this.getRwState();
            	         if( state.state == 0 ) {
            	             state.state = this.prepareMovesForDeal(moves) ? 0 : 1;
            	         }

            	         if( state.state == 1 || state.state ==2 ) {
            	         this.prepareOrganiseVisibleCardsMove(moves,false);
            	         this.preparePullKingsToEmptyStacksMove(moves);
            	         this.preparePullCardsToFinalisationMove(moves);
            	         this.preparePullCardsFromDealerDeckMove(moves);
            	         this.prepareRestartDealerDeckMove(moves);
            	         this.prepareOrganiseRoomForDealerDeckPull(moves) ;


            	         if( moves.length == 0 && state.state != 2) {
            	             // bouncers
            	              this.prepareOrganiseVisibleCardsMove(moves,true);
            	              this.bouncerDebugger(moves,state.bouncerCount,state.bouncerIndex);
            	              if( state.bouncerCount > 16 )
            	                  state.state = 2;
            	              else {
            	                  if( moves.length > 1 ) {
            	                       state.bouncerCount++;

            	                       if( state.bouncerIndex > moves.length-1 ) {
            	                           state.bouncerIndex = 0;
            	                       }

            	                       var bouncers = moves;
            	                       moves = [];
            	                       moves.push(bouncers[state.bouncerIndex++]);

            	                  } else
            	                      state.state = 2;
            	              }
            	         } else if( moves.length !=0&& state.state == 2 )
            	             state.state = 1;

            	         }
            	          if( moves.length != 0 )
            	            this.m = moves[0];
            	          else
            	             this.m.reset();

            	          return this.m;

            	        },

            	        prepareOrganiseVisibleCardsMove:function(moves, bouncers) {
            	           var  move = new Move();

            	           var  found = false;

            	           var state = this.getRoState();

            	           for( var t = 0; t < 7 //&& !found
            	                ; t++ ) {

            	            var tts = state.tops.elementAt(t);

            	            if( tts == -1 ) continue;

            	            var stackst = state.stacks.elementAt(t);

            	            var tsuit = Math.floor( stackst.elementAt(tts) / 16);
            	            var tcard = Math.floor(stackst.elementAt(tts) % 16);

            	            for( var f = 0; f < 8 //&& !found
            	             ; f++ ) {
            	            if( t == f ) continue;

            	            var fts = state.tops.elementAt(f);

            	            if( fts == -1 ) continue;

            	            var ffh = state.firstHidden.elementAt(f);
            	            var stacksf = state.stacks.elementAt(f);

            	            for( var ffhts = ffh+1; //!found &&
            	                 ffhts <= fts;ffhts++) {

            	                var fsuit = Math.floor(stacksf.elementAt(ffhts) / 16);
            	                var fcard = Math.floor(stacksf.elementAt(ffhts) % 16);

            	                // estetään tässä turhat siirrot eeestaas
            	                if( !bouncers && ( ffhts > 0 && ffhts > ffh+1) ) {

            	                    //int psuit = stacks[f][ffhts-1] / 16;
            	                    var pcard = Math.floor(stacksf.elementAt(ffhts-1)% 16);

            	                    if(  pcard == fcard+1 )
            	                        continue;
            	                }

            	                if( tcard != fcard+1)
            	                    continue;

            	                if(     (  ( tsuit == 0 && (fsuit == 1 || fsuit == 2 )) ) ||
            	                        (  ( tsuit == 1 && (fsuit == 0 || fsuit == 3 )) ) ||
            	                        (  ( tsuit == 2 && (fsuit == 0 || fsuit == 3 )) ) ||
            	                        (  ( tsuit == 3 && (fsuit == 1 || fsuit == 2 )) ) )
            	                {
            	                    found = true;
            	                    move.assign(true,f,ffhts,t,tts+1);
            	                    move.cards.assignCopy(ffhts,fts+1,stacksf);
            	                    move.unfold = ( ffh>= 0 && ffh == ffhts-1)  ? stacksf.elementAt(ffh) : -1;
            	                    if( move.ok )
            	                        move.restartLooped =-1;
            	                    moves.push(move);

            	                    move = new Move();

            	                }

            	            }

            	          }
            	          }

            	        },

            	        preparePullKingsToEmptyStacksMove:function(moves) {

            	    // luetaan tops[xx] ylös suitsin mukaisiin stackeihin
            	    // HUOM! ei pullata, jos on tarpeen pidättää eri värin suitsia
            	    // jotta saadaan deal stackista kentälle
            	    var move = new Move();


            	    var found = false;
            	    var state = this.getRoState();

            	    for( var t = 0; t < 7 //&& !found
            	         ; t++ ) {

            	        var tts = state.tops.elementAt(t);

            	        if( tts != -1 ) continue;

            	        // löydettiin tyhjä
            	        // etsitäään kungen
            	        for( var f = 0; f < 8 //&& !found
            	             ; f++ ) {

            	            if( t == f ) continue;

            	            var fts = state.tops.elementAt(f);

            	            if( fts == -1 && f <7) continue;
            	            var ffh = state.firstHidden.elementAt(f);

            	            var stacksf = state.stacks.elementAt(f);

            	            for( var ffhts = ffh+1; //!found &&
            	                 ffhts <= fts;ffhts++) {


            	                //int fsuit = stacks[f][ffhts] / 16;
            	                var fcard = Math.floor(stacksf.elementAt(ffhts) % 16);

            	                if( ( ffhts > 0 || (ffhts >=0 && f == 7 )) && ffhts > ffh+1) {

            	                    //int psuit = stacks[f][ffhts-1] / 16;
            	                    var pcard =Math.floor( stacksf.elementAt(ffhts-1) % 16);

            	                    if(  pcard == fcard+1 )
            	                        continue;
            	                }

            	                if( fcard != 12)
            	                    continue;

            	                if( ffhts == 0 )
            	                    continue;

            	                found = true;
            	                move.assign(found,f,ffhts,t,tts+1);
            	                move.cards.assignCopy(ffhts,fts+1,stacksf);
            	                move.unfold = ( ffh >= 0 && ffh == ffhts-1)  ? stacksf.elementAt(ffh) : -1;
            	                if( move.ok )
            	                    move.restartLooped =-1;

            	                moves.push(move);

            	                move = new Move();
            	            }

            	        }

            	    }
            	        },

            	        preparePullCardsToFinalisationMove:function(moves) {

            	            // luetaan tops[xx] ylös suitsin mukaisiin stackeihin
            	    // TBD! HUOM! HUOM! ei pullata, jos on tarpeen pidättää eri värin suitsia
            	    // jotta saadaan deal stackista kentälle
            	       var move = new Move();

            	       var found = false;
            	       var state = this.getRoState();

            	    for( var t = 9; t < 13 //&& !found
            	         ; t++ ) {

            	        var tts = state.tops.elementAt(t);

            	        var tsuit = 12-t;
            	        var tcard = tts!=-1 ? Math.floor(state.stacks.elementAt(t).elementAt(tts)% 16) : -1;

            	        for( var f = 0; f < 8 //&& !found
            	             ; f++ ) {

            	            //int ffh = firstHidden[f];
            	            var fts = state.tops.elementAt(f);

            	            if( fts == -1 ) continue;

            	            var stacksf = state.stacks.elementAt(f);

            	            var fsuit = Math.floor(stacksf.elementAt(fts) / 16);
            	            var fcard = Math.floor(stacksf.elementAt(fts) % 16);
            	            var ffh = state.firstHidden.elementAt(f);

            	            // ordered grouped by suit
            	            if(tsuit != fsuit ) continue;
            	            if( tcard != fcard-1) continue;

            	            // TBD: postponed pull if other suit hasn't been dealt from dealers deck?
            	            // BUT: when will postponed pulls execute?
            	            found = true;
            	            move.assign(found,f,fts,t,tts+1);
            	            move.cards.assignCopy(fts,fts+1,stacksf);

            	            move.unfold = ( ffh >= 0 && ffh == fts-1)  ?  stacksf.elementAt(ffh) : -1 ;
            	            if( move.ok )
            	                move.restartLooped =-1;

            	            moves.push(move);
            	            move = new Move();
            	        }
            	    }


            	        },

            	        preparePullCardsFromDealerDeckMove:function(moves) {
            	   var move = new Move();
            	    // 3-kerrallaan siirto tähän, jotta saadaan kortit ulos pakasta
            	    // tässä tehdään näinkö ?

            	    // siirretään stackista 8 stackiin 7
            	    var state = this.getRoState();
            	    var t = 7;
            	    var tts = state.tops.elementAt(t);

            	    var f = 8;
            	    for( var pc = 0;pc < 1;pc++ ) {

            	        var fts = state.tops.elementAt(f);
            	        if( fts == -1 ) continue;

            	        var ffh = state.firstHidden.elementAt(f);
            	        var stacksf = state.stacks.elementAt(f);

            	        move.assign(true,f,fts,t,tts+1);
            	        move.cards.assignCopy(fts,fts+1,stacksf);
            	        move.unfold = ( ffh >= 0 && ffh == fts-1)  ? stacksf.elementAt(ffh): -1;
            	        moves.push(move);

            	    }


            	        },

            	       prepareOrganiseRoomForDealerDeckPull: function(moves) {
            	            /** tähän tarvitaan vempautus, jolla saman väriset
            	                    kortit venkoillaan alta pois, jotta saadaan nostettua
            	                    toiset kortit ylös ja toiset alas jakajan pakasta

            	            */
            	       },

            	        prepareRestartDealerDeckMove:function(moves) {

            	        },

            	        prepareMovesForPos: function(s,c,movesForPos) {

            	        var moves = [];

            	        this.prepareOrganiseVisibleCardsMove(moves,true);
            	        this.preparePullKingsToEmptyStacksMove(moves);
            	        this.preparePullCardsToFinalisationMove(moves);
            	        this.preparePullCardsFromDealerDeckMove(moves);
            	        this.prepareRestartDealerDeckMove(moves);

            	         if( moves.length == 0 )
            	            return false;

            	         if( s == -1 && c == -1 ) {
            	             for(var n = 0; n < moves.length; n++) {
            	                 movesForPos.push(moves[n]);
            	            }
            	             return movesForPos.length > 0;
            	         }

            	         for(var n = 0; n < moves.length; n++) {
            	            var move = moves[n];

            	            if( move.fromStack == s && move.fromPos == c ) {
            	                 movesForPos.push(move);
            	            }

            	         }

            	         if( movesForPos.length == 0 )
            	           return false;

            	         return true;
            	        },
            	  prepareMovesForCard: function(cnum,movesForPos) {

            	        var moves = [];

            	        this.prepareOrganiseVisibleCardsMove(moves,true);
            	        this.preparePullKingsToEmptyStacksMove(moves);
            	        this.preparePullCardsToFinalisationMove(moves);
            	        this.preparePullCardsFromDealerDeckMove(moves);
            	        this.prepareRestartDealerDeckMove(moves);

            	         if( moves.length == 0 )
            	            return false;

            	         for(var n = 0; n < moves.length; n++) {
            	            var move = moves[n];
            	            if( move.cards.elementAt(0) == cnum )
            	                 movesForPos.push(move);
            	         }

            	         if( movesForPos.length == 0 )
            	           return false;

            	         return true;
            	        },

            	    prepareMovesForDeal: function(moves) {
            	        // tehdään samanlainen kuin muut eli
            	        // tutkitaan pöytää ja päätetään mihin laitetaan
            	           var move = new Move();
            	           var state = this.getRoState();

            	           if( state.state != 0 )
            	               return;

            	           var t = -1;
            	           var tts = -1;

            	           for( t =0 ; t < 7 ;t++) {
            	              tts  = state.tops.elementAt(t);
            	              if( tts < t ) break;
            	           }

            	           if( t == 7 )
            	               return false;


            	          var f = 8;
            	          for( var pc = 0;pc < 1;pc++ ) {

            	           var fts = state.tops.elementAt(f);
            	           if( fts == -1 ) continue;

            	           var ffh = state.firstHidden.elementAt(f);
            	           var stacksf = state.stacks.elementAt(f);

            	           move.assign(true,f,fts,t,tts+1);
            	          move.cards.assignCopy(fts,fts+1,stacksf);
            	          move.unfold = ( ffh >= 0 && ffh == fts-1)  ? stacksf.elementAt(ffh): -1;//( tts == t-1)  ? stacksf.elementAt(ffh): -1;
            	          moves.push(move);

            	           return true;
            	      }
            	    },


            	        toHtmlTable: function(container) {


            	            var content = "";
            	            content += "<table><tbody>";

            	            var state = this.getRoState();

            	         for( var c =0; c < 24; c++) {
            	                content += "<tr>";
            	            for(var s = 0 ; s < 7 ; s++ ) {
            	                var stacksS = state.stacks.elementAt(s);
            	                var sv = stacksS.elementAt(c);
            	                 if( sv < 0 ) {
            	                       content += "<td width='12%' />";
            	                 } else if( s== 8 || c <= state.firstHidden.elementAt(s)  ) {
            	                     if( c == state.tops.elementAt(s) ) {
            	                        content += "<td width='12%' style='color: red;'>("+sv+")</td>";
            	                    } else {
            	                        content += "<td width='12%' style='color: blue;'>("+sv+")</td>";
            	                    }
            	                 } else {
            	                        content += "<td width='12%'>"+sv+"</td>";
            	                 }
            	            }
            	            content += "</tr>";
            	        }

            	            content +="</tbody></table>";

            	            container.innerHTML = content;

            	        }
            	   };

            	    //window.SolSol = { solitaire: Solitaire };

            	   this.sol = new Solitaire();
            	}


      });