import datetime,calendar
from django.shortcuts import render_to_response
from django.http import HttpResponse
from .forms import *
from django.template import RequestContext
from django.core.servers.basehttp import FileWrapper
def readme(request):
    if request.method == 'POST':#提交请求时才会访问这一段，首次访问页面时不会执行
        form = ReadmeForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            str0='This is a brief description of Interim Fix '+str(cd['number'])+' for IBM SPSS Data Collection '+ str(cd['myapply'])+' ' + str(cd['mytype'])  + ' ( "Software"). '+ '\r\n\r\n'
            str1='BY DOWNLOADING, INSTALLING, COPYING, ACCESSING, OR OTHERWISE USING THE SOFTWARE, YOU AGREE TO THE TERMS OF THE IBM LICENSE AGREEMENT UNDER WHICH YOU ACQUIRED IBM SPSS DATA COLLECTION. '+'\n'
            str2='BY AGREEING, YOU REPRESENT AND WARRANT THAT YOU HAVE FULL AUTHORITY TO ACCEPT THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS,'+'\n'
            str3='- DO NOT DOWNLOAD, INSTALL, COPY, ACCESS, OR USE THE SOFTWARE; AND'+'\n'
            str4='- PROMPTLY RETURN THE UNUSED MEDIA AND DOCUMENTATION TO THE PARTY FROM WHOM IT WAS OBTAINED. IF THE SOFTWARE WAS DOWNLOADED, DESTROY ALL COPIES OF THE SOFTWARE. '+'\r\n\r\n'
            str5='Released on '+ str(cd['mydata1'])+'\n\n'
            str6='IBM SPSS Data Collection '+str(cd['myapply'])+' '+str(cd['mytype'])+' Interim Fix '+str(cd['number'])+', to be applied with IBM SPSS Data Collection '+ str(cd['myapply'])+str(cd['mytype'])+'('+str(cd['environment'])+').'+'\n\n\n'
            str7='Note: This Interim Fix is available for IBM SPSS Data Collection ' + str(cd['myapply'])+' '+str(cd['mytype'])+'('+str(cd['environment'])+').'+'\r\n\r\n'
            str8= 'Prerequisite Interim Fix:'+'\r\n'+'-------------------------'+'\r\n'+str(cd['Prerequisite_Interim_fix'])+'\r\n\r\n'
            str9='Bugs Fixed:'+'\r\n'+'-------------------------'+'\r\n'+str(cd['Bugs_Fixed'])+'\r\n\r\n'
            str10='Symptoms:'+'\r\n'+'-------------------------'+'\r\n'+str(cd['Symptoms'])+'\r\n\r\n'
            str11='Cause:'+'\r\n'+'-------------------------'+'\r\n'+str(cd['Cause'])+'\r\n\r\n'
            str12='Resolution:'+'\r\n'+'-------------------------'+'\r\n'+str(cd['Resolution'])+'\r\n\r\n'
            str13='Affected Modules:'+'\r\n'+'-------------------------'+'\r\n'+str(cd['Affected_Modules'])+'\r\n\r\n'
            str14='File Name          File Version        Date            Time       Platform'+'\n'+'---------------------------------------------------------------------------'+'\n'+str(cd['Discribe'])+'\r\n\r\n'
            str15='-------------------------'+'\n'+'Licensed Materials - Property of IBM'+'\n\n\n'+'(C) Copyright IBM Corp. 2000, 2015.'+'\r\n\r\n'
            str16='US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.'
            str_install='Installation Instructions:'+'\n'+'-------------------------'+'\n'
            str_uninstall='Uninstallation Instructions:'+'\n'+'-------------------------'+'\r\n\r\n'
            string1=str0+str1+str2+str3+str4+str5+str6+str7+str8+str9+str10+str11+str12+str13+str14
            string3=str15+str16
            a ='.pre' + str(cd['mytype']).replace(' ','').replace('.','').replace('FixPack','p')+ 'IF' + str(cd['number']) 
            c=''.join(str(cd['Discribe']).split()[:1])
            str_exmaple = '   For example, the file'+'"'+c+'"'+'should be renamed "'+c+a+'".'+'\r\n\r\n'+"   "+str(cd['Affected_Modules'])+'\r\n\r\n'
            str_uexmaple = '   For example, the file'+'"'+c+a+'"'+'should be renamed '+'"'+c+'"'+'.'+'\r\n\r\n'+"   "+str(cd['Affected_Modules'])+'\r\n\r\n'
            if cd['myapply'] == 'Server':
                if cd['Accessories_Server'] == 'False':
                    cd['Accessories_Server'] = 'No'
                else:
                    cd['Accessories_Server'] = 'Yes'
                if cd['Interview_Server'] == 'False':
                    cd['Interview_Server'] = 'No'
                else:
                    cd['Interview_Server'] = 'Yes'
                if cd['Web_Server'] == 'False':
                    cd['Web_Server'] = 'No'
                else:
                    cd['Web_Server'] = 'Yes'
                if cd['Author_Server'] == 'False':
                    cd['Author_Server'] = 'No'
                else:
                    cd['Author_Server'] = 'Yes'
                if cd['Reporter_Server'] == 'False':
                    cd['Reporter_Server'] = 'No'
                else:
                    cd['Reporter_Server'] = 'Yes'
                if cd['Remote_Server'] == 'False':
                    cd['Remote_Server'] = 'No'
                else:
                    cd['Remote_Server'] = 'Yes'
                if cd['Survey_Server'] == 'False':
                    cd['Survey_Server'] = 'No'
                else:
                    cd['Survey_Server'] = 'Yes'
                stra='Affected Servers:'+'\n'+'-------------------------'+'\n'+'Install on Accessories Tier Server :'+str(cd['Accessories_Server'])+'\n'+\
                'Install on Interview Tier Server :'+str(cd['Interview_Server'])+'\n'+'Install on Web Tier Server :'+ str(cd['Accessories_Server'])+'\n'+\
                'Install on Author Tier Server :'+ str(cd['Author_Server'])+'\n'+'Install on Reporter Tier Server :'+ str(cd['Reporter_Server'])+'\n'+\
                'Install on Remote Administration Tier Server :'+ str(cd['Remote_Server'])+'\n'+'Install on Survey Tabulation Tier Server :'+ str(cd['Survey_Server'])+'\r\n\r\n'
                strb=str_install+'\r\n'+'Note: If you are not Administrator, you have two options for installing the Interim Fix on Windows Vista, Windows 7 and Windows Server 2008:'+'\r\n\r\n'
                strc='(1) Run the exe file, as an administrator, from Windows a command prompt.'+'\n'+'(2) You can alternately turn off Windows UAC and reboot the computer before running the interim fix installer.'+'\r\n\r\n'
                if cd['Reporter_Server'] == 'Yes' and cd['Survey_Server'] == 'Yes':
                   strd='Carry out the following steps on all Survey Tabulation and Survey Reporter server'+'\r\n\r\n'
                elif cd['Reporter_Server'] == 'Yes':
                   strd='Carry out the following steps on all Survey Reporter servers:'+'\r\n\r\n'
                elif cd['Survey_Server'] == 'Yes':
                   strd='Carry out the following steps on all Survey Tabulation:'+'\r\n\r\n'
                else:
                   strd='Carry out the following steps on all Affected servers:'+'\r\n\r\n'
                stre='1. Backup the original file by adding the ' +'"'+a+'"'+'extension suffix to the file name.'+'\r\n\r\n'
                strg='2. Run the "IBM SPSS Data Collection Server '+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'('+str(cd['environment'])+')'+'.exe" installer'+'\r\n\r\n'
                strh='3. Restart IIS.'+'\r\n'+'   iisreset'+'\r\n\r\n'
                ustra='1. Uninstall "IBM SPSS Data Collection Server '+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'('+str(cd['environment']) +')'+'" from the Windows Control Panel\'s "Add or Remove Programs" feature.'+'\r\n\r\n'
                ustrb='2. Run the following command to restart the IIS server:'+'\r\n'+'   iisreset'+'\r\n\r\n'
                ustrc='3. Restore the backup file by removing '+'"'+a+'"'+'from the end of the file name. If the original file exists, you must first delete it to ensure that renaming will work.'+'\r\n\r\n'
                ustrd='4. Run the following command to restart the IIS server:'+'\r\n'+'   iisreset'+'\r\n\r\n'
                string2=stra+strb+strc+strd+stre+str_exmaple+strg+strh+str_uninstall+strd+ustra+ustrb+ustrc+str_uexmaple+ustrd
            if cd['myapply'] == 'Desktop':
                stra=str_install+'\r\n'+'Carry out the following steps on all Desktop application workstations:'+'\r\n\r\n'
                strb='1. Close all Data Collection applications (such as Author and Professional).'+'\r\n\r\n'
                strc='2. Backup the following file by adding the "'+a+'" extension suffix to the file name.'+'\r\n\r\n'
                stre='3. Run the "IBM SPSS Data Collection Desktop'+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'('+str(cd['environment'])+')'+'.exe" installer'+'\r\n'
                ustra='\r\n'+str_uninstall+'Carry out the following steps on all Desktop application workstations:'+'\r\n\r\n'
                ustrc='2. Uninstall "IBM SPSS Data Collection  Desktop '+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'('+str(cd['environment']) +')'+'" from the Windows Control Panel\'s "Add or Remove Programs" feature.'+'\r\n\r\n'
                ustrd='3. Restore the backup file by removing '+'"'+a+'"'+'from the end of the file name. If the original file exists, you must first delete it to ensure that renaming will work.'+'\r\n\r\n'
                string2=stra+strb+strc+str_exmaple+stre+ustra+strb+ustrc+ustrd+str_uexmaple
            if cd['myapply'] == 'Desktop/Server':
                if cd['Accessories_Server'] == 'False':
                    cd['Accessories_Server'] = 'No'
                else:
                    cd['Accessories_Server'] = 'Yes'
                if cd['Interview_Server'] == 'False':
                    cd['Interview_Server'] = 'No'
                else:
                    cd['Interview_Server'] = 'Yes'
                if cd['Web_Server'] == 'False':
                    cd['Web_Server'] = 'No'
                else:
                    cd['Web_Server'] = 'Yes'
                if cd['Author_Server'] == 'False':
                    cd['Author_Server'] = 'No'
                else:
                    cd['Author_Server'] = 'Yes'
                if cd['Reporter_Server'] == 'False':
                    cd['Reporter_Server'] = 'No'
                else:
                    cd['Reporter_Server'] = 'Yes'
                if cd['Remote_Server'] == 'False':
                    cd['Remote_Server'] = 'No'
                else:
                    cd['Remote_Server'] = 'Yes'
                if cd['Survey_Server'] == 'False':
                    cd['Survey_Server'] = 'No'
                else:
                    cd['Survey_Server'] = 'Yes'
                strm='Affected Servers:'+'\n'+'-------------------------'+'\n'+'Install on Accessories Tier Server :'+str(cd['Accessories_Server'])+'\n'+\
                'Install on Interview Tier Server :'+str(cd['Interview_Server'])+'\n'+'Install on Web Tier Server :'+ str(cd['Accessories_Server'])+'\n'+\
                'Install on Author Tier Server :'+ str(cd['Author_Server'])+'\n'+'Install on Reporter Tier Server :'+ str(cd['Reporter_Server'])+'\n'+\
                'Install on Remote Administration Tier Server :'+ str(cd['Remote_Server'])+'\n'+'Install on Survey Tabulation Tier Server :'+ str(cd['Survey_Server'])+'\r\n\r\n'
                stra=str_install+'\n'+'Note: If you are not Administrator, you have two options for installing the Interim Fix on Windows Vista, Windows 7 and Windows Server 2008:'+'\n'
                strb='(1) Run the exe file, as an administrator, from a Windows command prompt.'+'\n'+'(2) You can alternately turn off Windows UAC and reboot the computer before running the interim fix installer.'+'\n\n'
                strc='Carry out the following steps on all Desktop application workstations:'+'\n\n'
                strd='1. Close all Data Collection applications, such as Survey Reporter and Base Professional.'+'\n\n'
                stre='2. Make a copy of the original file by adding the '+'"'+a+'"'+' extension suffix to the file name.'+'\n\n'
                stre1='1. Backup the following file by adding the "'+a+'" extension suffix to the file name.'+'\r\n\r\n'
                strg='3. Run the "IBM SPSS Data Collection Desktop '+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'(x86).exe" or "IBM SPSS Data Collection Desktop '+str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'(x64).exe" installer.'+'\n\n'
                if cd['Reporter_Server'] == 'Yes' and cd['Survey_Server'] == 'Yes':
                   strh='Carry out the following steps on all Survey Tabulation and Survey Reporter server'+'\n\n'
                elif cd['Reporter_Server'] == 'Yes':
                   strh='Carry out the following steps on all Survey Reporter servers:'+'\n\n'
                elif cd['Survey_Server'] == 'Yes':
                   strh='Carry out the following steps on all Survey Tabulation:'+'\n\n'
                else:
                   strh='Carry out the following steps on all Affected servers:'+'\n\n'
                stri='3. Restart IIS.'+'\n'+'   iisreset'+'\n\n'
                strj='2. Run the "IBM SPSS Data Collection Server '+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'('+str(cd['environment'])+').exe" installer'+'\n\n'
                ustra='1. Uninstall "IBM SPSS Data Collection  Desktop '+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'(x86)" or "IBM SPSS Data Collection Desktop '+str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'(x64).exe" from the Windows Control Panel\'s "Add or Remove Programs" feature.'+'\n\n'
                ustre='1. Uninstall "IBM SPSS Data Collection Server '+ str(cd['mytype'])+' Interim Fix '+str(cd['number'])+'('+str(cd['environment'])+')'+'" from the Windows Control Panel\'s "Add or Remove Programs" feature.'+'\n\n'
                ustrb='3. Restore the backup file by removing '+'"'+a+'"'+'from the end of the file name. If the original file exists, you must first delete it to ensure that renaming will work.'+'\n\n'
                ustrd='2. Restart IIS.'+'\r\n\r\n'+'   iisreset'+'\n\n'
                ustrf='5. Restart IIS.'+'\r\n\r\n'+'   iisreset'+'\r\n\r\n'
                string2=strm+stra+strb+strc+strd+stre+str_exmaple+strg+strh+stre1+str_exmaple+\
                strj+stri+str_uninstall+strc+strd+ustra+ustrb+str_uexmaple+strh+ustre+\
                ustrd+ustrb+str_uexmaple+ustrf+'\r\n'
            mytxt=string1+string2+string3
            fout=open('Readme.txt','wt')
            fout.write(mytxt)
            fout.close()
            return render_to_response('download_readme.html', {'form': cd},context_instance=RequestContext(request))
    else:
        form = ReadmeForm()
    return render_to_response('contact_author.html', {'form': form},context_instance=RequestContext(request))

def download_readme(request):
    return render_to_response('download_readme.html',context_instance=RequestContext(request))
    
def download_file(request):
    response = HttpResponse(content_type='text/plain')                                
    response['Content-Disposition'] = 'attachment; filename=Readme.txt'                
    data = open('Readme.txt', 'rb').read()
    response.write(data)  
    return response
    


