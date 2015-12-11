def Fibonacci(n):
    if n == 1:
        return 1
    else:   
        Fibolist = []
        Fibolist.append(0)
        Fibolist.append(1)
        for i in range(2,n):
            Fibolist.append(Fibolist[i-1] + Fibolist[i-2])
        print(Fibolist)
    
Fibonacci(50)

l=range(11)
print(sum(l))

        