def isUgly(num):
    for p in (2,3,5):
        while num % p == 0 and num > 0:
            num/=p            
    if num == 1:
        return True
    else:
        return False
    
print(isUgly(14))