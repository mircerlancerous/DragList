# DragList
Simple JavaScript drag and drop list with no external dependencies

Methods:

addHolder(id,title,colour)  
addItem(holder,id,label)  
getHolderItems(holder)  
revertItems()  
getChanges()  
getHolderOrder(holder)  

 
Usage:

 

dl = new DragList("dragholder");  
dl.addHolder("col1","Column One","lightblue");  
dl.addHolder("col2","Column Two","lightgreen");  
dl.addHolder("trash","Trash");  
  
dl.addItem("col1","appl","Apple");  
dl.addItem("col1","pear","Pear");  
dl.addItem("col1","bana","Banana");  
dl.addItem("col1","bkby","Blackberry");  
  
dl.addItem("col2","strw","Stawberry");  
dl.addItem("col2","pech","Peach");  
dl.addItem("col2","plum","Plum");  
