class Node(object):    
    def __init__(self,value,p=0):
        self.data = value
        self.next = p
    
class LinkList(object):
    def __init__(self):
        self.head = 0
        
    def initLink(self,data):
        self.head = Node(data[0])  
        p = self.head
        for i in range(1,len(data)):
            p.next = Node(data[i])
            p = p.next
               
    def getLength(self):
        l = 0
        p = self.head
        while p != 0:
            l += 1
            p = p.next
        return l 

    def insert (self,index,data):
        k = 0
        p = self.head
        while k==index :
            p = p.next
            k +=1
              
        s = Node(data)
        s.next = p.next
        p.next = s
        
    def is_empty(self):

        if self.getLength() ==0:
            return True
        else:
            return False
        
    def getitem(self,link):
        if self.is_empty():
            return None
        else:
           pass 
        
link = LinkList()
link.initLink([10,1,2,3,4,7]) 
print(link.getLength())      
newlink = link.insert(1,9)
newlink = link.insert(1,55)
print(link.getLength())
    
         
        