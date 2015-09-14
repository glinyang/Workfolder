class Person(object):
    def __init__(self,name,position,salary):
        self.name = name
        self.position = position
        self.salary = salary
        
class TreeNode(object):
    def __init__(self,father=0,child1=0,child2=0,child3=0):
        self.father = father
        self.child1 = child1
        self.child2 = child2
        self.child3 = child3    
    
    def Show(self,treenode):
        if treenode is 0:
            return 
        else:          
            print("{0} {1} {2}".format(treenode.father.name,
                                       treenode.father.position,
                                       treenode.father.salary ))
                      
            self.Show(treenode.child1)
            self.Show(treenode.child2)
            self.Show(treenode.child3)
                       
T  = Person( "Jenny" ,"CEO" ,10000) 
M1 = Person( "Wang" ,"Manager", 8000)  
M2 = Person("Chen" ,"Manager", 8000)  
M3 = Person("Li" ,"Manager" ,8000) 
L1 = Person("A" ,"DEV" ,2000) 
L2 = Person("B" ,"DEV", 2000)
L3 = Person("C" ,"QA" ,2000)  
L4 = Person("L" ,"DEV" ,2000) 
L5 = Person("M" ,"DEV", 2000)
L6 = Person("X" ,"QA" ,2000) 
L7 = Person("Y" ,"DEV" ,2000) 

n1 = TreeNode(L1)
n2= TreeNode(L2)
n3 = TreeNode(L3)
n4 = TreeNode(L4)
n5 = TreeNode(L5)
n6=TreeNode(L6)
n7=TreeNode(L7)
tb1 = TreeNode(M1,n1,n2,n3)
tb2 = TreeNode(M2,n4,n5)
tb3 = TreeNode(M3,n6,n7)
tb = TreeNode(T,tb1,tb2,tb3)

tb.Show(tb)


    

    
   
         
    