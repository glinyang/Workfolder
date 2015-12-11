tuple_name = (('A','B'),("C","D"),("E",))
print(tuple_name)
for i in  range(len(tuple_name)):
    print("tuple[%d]:"%i)
    for j in range(len(tuple_name[i])):
        print(tuple_name[i][j])


k = 0
for a in map(None,tuple_name):
    print ("tuple[%d] :" % k, "" ,)
    for x in a:
        print (x, "" ,)
    print
    k += 1