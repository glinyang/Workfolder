class Stack(object):
    def __init__(self,size):
        self.stack = []
        self.size = size
        self.top = -1
    def InStack(self,data):
        if self.Full():
            print("The stack is Full")
        else:
            self.stack.append(data)
            self.top = self.top + 1
    def OutStack(self,data):
        if self.Empty():
            print("Stack is empty")
        else:
            if data in self.stack and data == self.stack[self.top]:
                self.top = self.top - 1
                self.stack.remove(data)
            else:
                print('data is not in stack or is not the top value')
    def Full(self):
        if self.top == self.size:
            return True
        else:
            return False
    def Empty(self):
        if self.top ==-1:
            return True
        else:
            return False

s1=Stack(5)
s1.InStack("python")
s1.InStack("1")
print(s1.stack)
s1.OutStack('1')
print(s1.stack)

