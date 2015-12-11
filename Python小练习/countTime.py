f = open("C:/Users/Monica/Desktop/TOM_TomLog.txt")
lines = f.readlines()
'-----------------------Prepare time-------------------------'

line1 = lines[0]
line2 = lines[7]
print(line1)
print(line2)
time1 = int(line1[:2]) * 3600 + int(line1[3:5]) * 60 + int(line1[6:8])
time2 = int(line2[:2]) * 3600 + int(line2[3:5]) * 60 + int(line2[6:8]) 
Preparetime = time2 - time1
print('Prepare time=',Preparetime)

'---------------------Aggregate time--------------------------'

line3 = lines[12] 
line4 = lines[8]
print(line4)
print(line3)
time3 = int(line3[:2]) * 3600 + int(line3[3:5]) * 60 + int(line3[6:8])
time4 = int(line4[:2]) * 3600 + int(line4[3:5]) * 60 + int(line4[6:8]) 
Aggregate_time = time3 - time4
print('Aggregate time=',Aggregate_time)

'---------------------Table Build time--------------------------'
 
line5 = lines[19]
print(line5)
time5 = int(line5[:2]) * 3600 + int(line5[3:5]) * 60 + int(line5[6:8]) 
table_build_time = time5 - time3
print('Table Build time=',table_build_time)


