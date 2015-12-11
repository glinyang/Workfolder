file1 = open("C:/Users/Monica/Desktop/codetest/Reporter_generated_for_Populated_tables_read_only.txt",'r',encoding= 'utf-8')
file2 = open("C:/Users/Monica/Desktop/codetest/run6TableList.txt")
lines = file2.readlines()
lines1 = file1.readlines()
string1 = str(lines[0]).split(",")
print(string1)
for line in lines1:
    if '    Set Table = .AddNew' in line:
        for item in string1:
            if item in line:
                print(item)
            else:
                continue
    else:
        continue
        
