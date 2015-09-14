import random
def row_add(mylist,start,end):
    a = mylist[start:end:1]
    return sum(a)

def col_add(mylist,start,end):
    a= mylist[start:end:3]
    return sum(a)

def solve_squre_puzzle(mylist): 
    if len(mylist) != 7:
        return False
    else:
        nlist = []
        while True:
            num = random.randint(1,9)
            if num  in nlist:
                nlist.remove(num)
            nlist.append(num)
            if len(nlist) == 9:
                if row_add(nlist,0,3) == mylist[0] and \
                    row_add(nlist,3,6) == mylist[1] and \
                    row_add(nlist,6,9) == mylist[2] and \
                    nlist[0]+nlist[4]+nlist[8] == mylist[3] and\
                    col_add(nlist,0,7) == mylist[6] and \
                    col_add(nlist,1,8) == mylist[5] and \
                    col_add(nlist,2,9) == mylist[4] :
                    print('Exit a list')
                    return(nlist)
                    break  
                else:
                    continue
               
mylist =[11,15,19,15,15,14,16]  
print(solve_squre_puzzle(mylist))          

    