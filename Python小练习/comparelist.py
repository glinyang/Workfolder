from collections import Counter
def isRepeat(mylist):
    n = len(mylist)
    for i in mylist:
        if i not in range(n):
            print("please enter right number list")
            a = -1 
            break
        else:
            a=1
    if a==1:        
        if len(set(mylist)) != n:
            print("repeat")
            
        else:
            print("no repeat")       
        