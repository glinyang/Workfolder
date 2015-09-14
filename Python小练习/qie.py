import pickle
Info = [(1,2,3,4),'hello word',['q','x','y','z']]

outfile = open('save.dat','wb')
pickle.dump(Info,outfile)
outfile.close()

inputfile = open('save.dat','rb')
info2 = pickle.load(inputfile)
inputfile.close()
print(info2)
