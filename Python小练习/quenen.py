class Quenen(object):
    def __init__(self,size):
        self.quenen = []
        self.size = size
        self.head = -1
        self.tail = -1
    def InQuenen(self,data):
        if self.Full():
            print("It is full")
        else:
            self.quenen.append(data)
            self.tail = self.tail+1
    def OutQuenen(self):
        if self.Empty():
            print("It is empty")
        else:
            self.head = self.head +1
            self.quenen.pop()
    def Full(self):
        if self.tail - self.head +1 ==self.size:
            return True
        else:
            return False
    def Empty(self):
        if self.head == self.tail:
            return True
        else:
            return False
        
if __name__ =='__main__':
    q1 = Quenen(3)
    q1.InQuenen(3)
    print(q1.quenen)
    q1.OutQuenen()
    print(q1.quenen) 
    q1.OutQuenen()
    