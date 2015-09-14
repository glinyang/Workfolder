def bubblesort(mylist):
    for i in range(len(mylist)-1,-1,-1):
        for j in range(i):
            if  mylist[j] >  mylist[j+1]:
                mylist[j],mylist[j+1] = mylist[j+1],mylist[j]
    return mylist

print(bubblesort([21,4,5,7,3,0,7]))

def quicksort(mylist):
    i = 0
    j = len(mylist)-1
    key = mylist[0]
    while i == j:
        for i in range(j,-1,-1):
            for i in range(j):
                if mylist[i] > key:
                    mylist[i],key = key,mylist[i]
                if mylist[i] < key:
                    mylist[i],key = key,mylist[i]
        return mylist
            
def quickSort(L, low, high):
    i = low 
    j = high
    if i >= j:
        return L
    key = L[i]
    while i < j:
        while i < j and L[j] >= key:
            j = j-1                                                             
        L[i] = L[j]
        while i < j and L[i] <= key:    
            i = i+1 
        L[j] = L[i]
    L[i] = key 
    quickSort(L, low, i-1)
    quickSort(L, j+1, high)
    return L

print(quickSort([21,4,5,7,3,0,7],0,6))   