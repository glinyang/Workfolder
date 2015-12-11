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
            content1 = 'This is a brief description of Interim Fix {0} for IBM SPSS Data Collection {1} {2} ( "Software").\n\n\
BY DOWNLOADING, INSTALLING, COPYING, ACCESSING, OR OTHERWISE USING THE SOFTWARE, YOU AGREE TO THE TERMS OF THE IBM LICENSE AGREEMENT UNDER WHICH YOU ACQUIRED IBM SPSS DATA COLLECTION. \n\
BY AGREEING, YOU REPRESENT AND WARRANT THAT YOU HAVE FULL AUTHORITY TO ACCEPT THESE TERMS. IF YOU DO NOT AGREE TO THESE TERMS,\n\
- DO NOT DOWNLOAD, INSTALL, COPY, ACCESS, OR USE THE SOFTWARE; AND \n\
- PROMPTLY RETURN THE UNUSED MEDIA AND DOCUMENTATION TO THE PARTY FROM WHOM IT WAS OBTAINED. IF THE SOFTWARE WAS DOWNLOADED, DESTROY ALL COPIES OF THE SOFTWARE. \n\n\
Released on {3} \n\n\
IBM SPSS Data Collection {4} {5} Interim Fix {6}, to be applied with IBM SPSS Data Collection {7} {8} ({9}). \n\n\
Note: This Interim Fix is available for IBM SPSS Data Collection {10} {11} ({12}). \n\n\
Prerequisite Interim Fix:\n-------------------------\n\n{13}\n\n\
Bugs Fixed:\n-------------------------\n\n{14}\n\nSymptoms:\n-------------------------\n\n{15}\n\n\
Cause:\n-------------------------\n\n{16}\n\nResolution:\n-------------------------\n\n{17}\n\
Affected Modules:\n-------------------------\n\n{18}\nFile Name          File Version        Date            Time       Platform\n\
---------------------------------------------------------------------------\n\n{19}\n\n'.format(cd['number'],cd['hfapply'],cd['hftype'],cd['release_date'],cd['hfapply'],\
cd['hftype'],cd['number'],cd['hfapply'],cd['hftype'],cd['environment'],cd['hfapply'],\
cd['hftype'],cd['environment'],cd['Prerequisite_Interim_fix'],cd['Bugs_Fixed'],cd['Symptoms'],\
cd['Cause'],cd['Resolution'],cd['Affected_Modules'],cd['Discribe'])
            content3 = '-------------------------\nLicensed Materials - Property of IBM \n\n\n(C) Copyright IBM Corp. 2000, 2015.\n\nUS Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.'
            a ='.pre' + str(cd['hftype']).replace(' ','').replace('.','').replace('FixPack','p')+ 'IF' + str(cd['number']) 
            c=''.join(str(cd['Discribe']).split()[:1])
            
            #cd['hfapply'] and 'Yes' or 'No'
            if cd['hfapply'] == 'Server' or cd['hfapply'] == 'Desktop/Server':
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
                if cd['Reporter_Server'] == 'Yes' and cd['Survey_Server'] == 'Yes':
                    strd='Carry out the following steps on all Survey Tabulation and Survey Reporter server:'
                elif cd['Reporter_Server'] == 'Yes':
                    strd='Carry out the following steps on all Survey Reporter servers:'
                elif cd['Survey_Server'] == 'Yes':
                    strd='Carry out the following steps on all Survey Tabulation:'
                else:
                    strd='Carry out the following steps on all Affected servers:'
                server_select='Affected Servers:\n-------------------------\nInstall on Accessories Tier Server :{0}\nInstall on Interview Tier Server : {1}\n\
Install on Web Tier Server : {2} \nInstall on Author Tier Server : {3} \n\
Install on Remote Administration Tier Server : {4} \nInstall on Survey Tabulation Tier Server : {5}\n\
Install on Reporter Tier Server :{6}\n\n'.format(cd['Accessories_Server'],cd['Interview_Server'],cd['Web_Server'],cd['Author_Server'],cd['Remote_Server'],cd['Survey_Server'],cd['Reporter_Server'])
                if cd['hfapply'] == 'Server':
                    server_install = 'Installation Instructions:\n-------------------------\r\n\r\n\
Note: If you are not Administrator, you have two options for installing the Interim Fix on Windows Vista, Windows 7 and Windows Server 2008:\n\n\
(1) Run the exe file, as an administrator, from Windows a command prompt.\n\n(2) You can alternately turn off Windows UAC and reboot the computer before running the interim fix installer.\n\n{0}\n\n\
1. Backup the original file by adding the"{1}" extension suffix to the file name.\n\n\
   For example, the file "{2}" should be renamed "{2}{1}".\n\n   {3}\n\
2. Run the "IBM SPSS Data Collection Server {4} Interim Fix {5}({6}).exe" installer\n\n\
3. Restart IIS.\r\n   iisreset \r\n\r\n'.format(strd,a,c,cd['Affected_Modules'],cd['hftype'],cd['number'],cd['environment'])
                    server_uninstall = 'Uninstallation Instructions:\n-------------------------\n\n{0}\n\n\
1. Uninstall "IBM SPSS Data Collection Server {1} Interim Fix {2}({3}) from the Windows Control Panel\'s "Add or Remove Programs" feature.\n\n\
2. Run the following command to restart the IIS server:\n   iisreset\n\n\
3. Restore the backup file by removing "{5}" from the end of the file name. If the original file exists, you must first delete it to ensure that renaming will work.\n\n\
   For example, the file "{4}{5}" should be renamed "{4}".\n\n   {6}\n\
4. Run the following command to restart the IIS server:\n   iisreset \n\n'.format(strd,cd['hftype'],cd['number'],cd['environment'],c,a,cd['Affected_Modules'])
                    content2 = server_select + server_install + server_uninstall

                else :
                    ds_install = 'Installation Instructions:\n-------------------------\r\n\r\n\
Note: If you are not Administrator, you have two options for installing the Interim Fix on Windows Vista, Windows 7 and Windows Server 2008:\n\n\
(1) Run the exe file, as an administrator, from Windows a command prompt.\n\n\
(2) You can alternately turn off Windows UAC and reboot the computer before running the interim fix installer.\n\n\
Carry out the following steps on all Desktop application workstations:\n\n\
1. Close all Data Collection applications (such as Author and Professional).\n\n\
2. Make a copy of the original file by adding the "{0}" extension suffix to the file name.\n\n\
   For example, the file "{1}" should be renamed "{1}{0}".\n\n   {6}\n\
3. Run the "IBM SPSS Data Collection Desktop {3} Interim Fix (x86).exe" or "IBM SPSS Data Collection Desktop {3} Interim Fix (x64).exe" installer.\n\n\
{5}\n\n\
1. Make a copy of the original file by adding the "{0}" extension suffix to the file name.\n\n\
   For example, the file "{1}" should be renamed "{1}{0}".\n\n   {6}\n\
2. Run the "IBM SPSS Data Collection Server {2} Interim Fix {3}({4}).exe" installer\n\n\
3. Restart IIS.\n   iisreset\n\n'.format(a,c,cd['hftype'],cd['number'],cd['environment'],strd,cd['Affected_Modules'])
                    ds_uninstall = 'Uninstallation Instructions:\n-------------------------\n\n\
Carry out the following steps on all Desktop application workstations:\n\n\
1. Close all Data Collection applications (such as Author and Professional).\n\n\
2. Uninstall "IBM SPSS Data Collection  Desktop {0} Interim Fix {1}({2})" from the Windows Control Panel\'s "Add or Remove Programs" feature.\n\n\
3. Restore the backup file by removing "{3}" extension suffix.\n\n\
   For example, the file "{4}{3}" should be renamed "{4}".\n\n   {5}\n\
{6}\n\n\
1. Uninstall "IBM SPSS Data Collection Server {0} Interim Fix {1}({2})" from the Windows Control Panel\'s "Add or Remove Programs" feature.\n\n\
2. Run the following command to restart the IIS server:\n\n   iisreset\n\n\
3. Restore the backup file by removing "{3}" from the end of the file name. If the original file exists, you must first delete it to ensure that renaming will work.\n\n\
   For example, the file "{4}{3}" should be renamed "{4}".\n\n   {5}\n\
4. Run the following command to restart the IIS server:\n\n   iisreset\n\n'.format(cd['hftype'],cd['number'],cd['environment'],a,c,cd['Affected_Modules'],strd)
                    content2=server_select + ds_install + ds_uninstall

            else :
                desktop_install = 'Installation Instructions:\n-------------------------\r\n\r\n\
Carry out the following steps on all Desktop application workstations:\n\n\
1. Close all Data Collection applications (such as Author and Professional).\n\n\
2. Backup the following file by adding the "{0}" extension suffix to the file name.\n\n\
   For example, the file "{1}" should be renamed "{1}{0}".\n\n   {2}\n\
3. Run the "IBM SPSS Data Collection Desktop {3} Interim Fix {4}({5}).exe" installer.\n\n'.format(a,c,cd['Affected_Modules'],cd['hftype'],cd['number'],cd['environment'])
                desktop_uninstall = 'Uninstallation Instructions:\n-------------------------\n\n\
Carry out the following steps on all Desktop application workstations: \n\n\
1. Close all Data Collection applications (such as Author and Professional).\n\n\
2. Uninstall "IBM SPSS Data Collection Desktop {0} Interim Fix {1} ({2})" from the Windows Control Panel\'s "Add or Remove Programs" feature.\n\n\
3. Restore the backup file by removing "{3}" from the end of the file name. If the original file exists, you must first delete it to ensure that renaming will work.\n\n\
   For example, the file "{4}{3}" should be renamed "{4}".\n\n   {5}\n'.format(cd['hftype'],cd['number'],cd['environment'],a,c,cd['Affected_Modules'])
                content2=desktop_install + desktop_uninstall

            readme_txt=content1+content2+content3
            fout=open('Readme.txt','wt')
            fout.write(readme_txt)
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
    


