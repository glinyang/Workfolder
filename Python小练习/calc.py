class cacl(object):
    def __init__(self,a,b,mark):
        self.a=a
        self.b=b
        self.mark=mark
    def markfunc(self):
        if self.mark == "+":
            print (self.a+self.b)
        elif self.mark == "-":
            print(self.a-self.b)
        elif self.mark == "*":
            print(self.a*self.b)
        elif self.mark == "/":
            print(self.a/self.b)
        elif self.mark == "%":
            print(self.a % self.b)
def main():
    oper = cacl(10,20,"-")
    print(oper.markfunc())

if __name__ == '__main__':
    main()
        
        