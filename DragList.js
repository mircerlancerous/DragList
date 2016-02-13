/*
Name: DragList.js
File Description: JavaScript class to create a drag and drop list for quick and easy reordering of data
Web: http://www.offthebricks.com/
*/
function DragList(element){
	var self = this;
	if(typeof(element) === 'string'){
		this.element = document.getElementById(element);
	}
	else{
		this.element = element;
	}
	
	this.dragitem = null;
	this.holders = new Object();
	this.items = new Array();
	this.itemMap = new Array();
	this.restoring = false;
	
	this.dragOnDrop = function(event){
			event.preventDefault();
			event.stopPropagation();
		//	this.parentNode.insertBefore(self.dragitem,this);
			self.insertAfter(this.parentNode,self.dragitem,this);
		};
	this.dragEnd = function(){self.insertElm.style.display = "none";};
	
	this.insertElm = document.createElement("div");
	this.insertElm.className = "dragitems";
	this.insertElm.innerHTML = "<div class='insertDiv draglabels'>&nbsp;</div>";
	this.insertElm.ondragover = function(event){
			event.preventDefault();
			event.stopPropagation();
		};
	this.insertElm.ondrop = this.dragOnDrop;
	
	//Desc: adds a new holder for a list of items
	//Param: the id of the holder (must be unique) you're adding, optional title for the holder
	this.addHolder = function(id,title,colour){
			this.holders[id] = document.createElement("div");
			var holder = this.holders[id];
			holder.className = "dropdivs";
			if(typeof(title) !== 'string'){
				title = id;
			}
			holder.innerHTML = "<p>"+title+"</p>";
			if(typeof(colour) !== 'undefined'){
				holder.style.backgroundColor = colour;
			}
			holder.ondrop = function(event){
					event.preventDefault();
					event.stopPropagation();
				//	this.appendChild(self.dragitem);
					self.insertAfter(this,self.dragitem,this.firstChild);
				};
			holder.ondragover = function(event){
					event.preventDefault();
				//	this.appendChild(self.insertElm);
					self.insertAfter(this,self.insertElm,this.firstChild);
					self.insertElm.style.display = "";
				};
			this.element.appendChild(holder);
		};
	
	//Desc: adds a new item to the specified holder
	//Param: the id of the holder as specified in addHolder, the id of the item (doesn't have to be unique), optional label for the item
	this.addItem = function(holder,id,label){
			var newItem = document.createElement("div");
			newItem.id = id;
			newItem.className = "dragitems";
			newItem.draggable = true;
			newItem.ondragstart = function(event){
					self.dragitem = this;
					event.dataTransfer.setData("Text","");		//this is needed or dragging won't function
				};
			newItem.ondragover = function(event){
					event.preventDefault();
					event.stopPropagation();
					if(this == self.dragitem){
						return;
					}
				//	this.parentNode.insertBefore(self.insertElm,this);
					self.insertAfter(this.parentNode,self.insertElm,this);
					self.insertElm.style.display = "";
				};
			newItem.ondrop = self.dragOnDrop;
			newItem.ondragend = self.dragEnd;
			if(typeof(label) !== 'string'){
				label = id;
			}
			newItem.innerHTML = "<div class='draglabels'>"+label+"</div>";
			this.items[this.items.length] = newItem;
			this.holders[holder].appendChild(newItem);
			if(this.restoring){
				return;
			}
			//create an object for the item and add it to the map so that the original state can be easily restored
			var itemObj = new Object();
			itemObj.id = id;
			itemObj.label = label;
			itemObj.holder = holder;
			this.itemMap[this.itemMap.length] = itemObj;
		};
	
	//Desc: get the items in the list you choose in the order they appear on screen
	//Param: the id of the holder you wish to get as specified in addHolder
	//Returns: an array of items ids as specified in addItem for the holder requested
	this.getHolderItems = function(holder){
			if(typeof(holder) === 'string'){
				holder = this.holders[holder];
			}
			var list = new Array();
			var items = holder.getElementsByTagName("div");
			for(var i=0; i<items.length; i++){
				if(this.items.indexOf(items[i]) >= 0){
					list[list.length] = items[i].id;
				}
			}
			return list;
		};
	
	//Desc: restore the items to their original positions
	this.revertItems = function(){
			this.restoring = true;
			var original = this.itemMap;
			//clear the contents of all the holders
			var deldiv = document.createElement("div");
			for(var i=0; i<this.items.length; i++){
				deldiv.appendChild(this.items[i]);
			}
			//clear the item mapping array
			this.items = new Array();
			deldiv.innerHTML = "";
			delete deldiv;
			//loop through original items, restoring them
			for(i=0; i<original.length; i++){
				//attach the item to the appropriate holder
				self.addItem(original[i].holder,original[i].id,original[i].label);
			}
			this.restoring = false;
		};
	
	
	this.getChanges = function(){
			var changes = new Array();
			var hldrlist = Object.getOwnPropertyNames(this.holders);
			for(var i=0; i<hldrlist.length; i++){
				var hldritms = self.getHolderItems(hldrlist[i]);
				//see which items were removed and which were unchanged
				for(var v=0; v<this.itemMap.length; v++){
					//if this isn't the correct holder, skip it
					if(this.itemMap[v].holder != hldrlist[i]){
						continue;
					}
					var temp = hldritms.indexOf(this.itemMap[v].id);
					//if removed
					if(temp < 0){
						var itemObj = new Object();
						itemObj.id = this.itemMap[v].id
						itemObj.holder = hldrlist[i];
						itemObj.removed = true;
						changes[changes.length] = itemObj;
					}
					//if unchanged
					else{
						//remove the holder item
						hldritms.splice(temp,1);
					}
				}
				//all remaining holder items must be new
				for(v=0; v<hldritms.length; v++){
					var itemObj = new Object();
					itemObj.id = hldritms[v];
					itemObj.holder = hldrlist[i];
					itemObj.removed = false;
					changes[changes.length] = itemObj;
				}
			}
			return changes;
		};
	
	this.getHolderOrder = function(holder){
			return self.getHolderItems(this.holders[holder]);
		};
	
	this.insertAfter = function(parentNode,newElm,oldElm){
			parentNode.insertBefore(newElm,oldElm);
			parentNode.insertBefore(oldElm,newElm);
		};
}
