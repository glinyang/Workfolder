import random
class IAnimal(object):
    def __init__(self,name):
        self.name = name
        
    def fly(self,bo):  
        if bo:
            print( " can fly")
        else:
            print(" can not fly")
    
    def jump(self,bo):
        if bo:
            print( " can jump")
        else:
            print( " can not jump")
            
    def __str__(self):
        return self.name 
    
    def __repr__(self):
        return str(self)
    
class Tiger(IAnimal):
    def __init__(self,name,fly,jump):
        IAnimal.__init__(self, name)
        self.fly = fly
        self.jump = jump
    
class Bird(IAnimal):
    def __init__(self,name,fly,jump):
        IAnimal.__init__(self, name)
        self.fly = fly
        self.jump = jump
        
class Snake(IAnimal):
    def __init__(self,name,fly,jump):
        self.name = name
        self.fly = fly
        self.jump = jump

class Zoo(IAnimal):
    def __init__(self,animallist):        
        self.animallist = animallist
        
    def get10Animals(self,zoo):    
        animals = []
        while True:
            i = random.randint(0,len(zoo.animallist)-1)
            animal = zoo.animallist[i] 
            if animal in animals:
                animals.remove(animal)
            animals.append(animal)
            if len(animals) == 10:
                break           
        return animals  
    
    def relax(self,animals):
        for item in animals:
            print (item.name +str(item.__class__)+ ":" )
            IAnimal.fly(self,item.fly)
            IAnimal.jump(self,item.jump)
        
if __name__ == '__main__':
    T1 = Tiger('a',False,True)
    T2 = Tiger('b',False,True)
    T3 = Tiger('c',False,True)
    T4 = Tiger('d',False,True)
    
    B1 = Bird('e',True,False)
    B2 = Bird('f',True,False)
    B3 = Bird('g',True,False)
    B4 = Bird('h',True,False)
    
    S1 = Snake('w',False,False)
    S2 = Snake('x',False,False)
    S3 = Snake('y',False,False)
    S4 = Snake('z',False,False)
    
    ZooAnimal = Zoo([T1,T2,T3,T4,B1,B2,B3,B4,S1,S2,S3,S4])
    TenAnimal = ZooAnimal.get10Animals(ZooAnimal)
    print(TenAnimal)
    ZooAnimal.relax(TenAnimal)
    print(dir(T1))
 
    