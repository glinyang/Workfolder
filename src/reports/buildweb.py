'''
Created on 2014-10-3

@author: Michael
'''

import urllib.parse
import urllib.request

class BuildWeb(object):
    '''
    This class represents the Builddashboard Web client and provides functions to get data from it
    '''
    def __init__(self, username, password):
        '''
        Constructor, initialize the BuildWeb environment
        '''
        self.username = username
        self.password = password

    
    def _add_common_headlers(self, req):
        req.add_header('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        #req.add_header('User-Agent', 'Python-urllib/3.4') Default User-Agent 
        #req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0')

    
    is_logged_in = False
    def login(self):
        print('[BuildWeb] login...', end='')
        login_url = 'http://builddashboard/LoginServlet'
        
        # Prepare POST data
        post_list = {}
        post_list['username'] = self.username
        post_list['password'] = self.password
        
        post_data = urllib.parse.urlencode(post_list)
        post_data = post_data.encode('utf-8')
        
        # Build the request
        request = urllib.request.Request(login_url, post_data)
        
        # Add necessary common headers
        self._add_common_headlers(request)
        
        # Send and get the response
        response = urllib.request.urlopen(request)
        # response.url format: 
        # http://builddashboard/ShowProjectSites.jsp;jsessionid=114707581E7C66ABB1E88214882E2956
        if 'jsessionid=' in response.url:
            self.is_logged_in = True
            print('success')
        else:
            self.is_logged_in = False
            print('failed')
            print(response.url)
        
        
        self.jsessionid = response.url.split('=')[1]
        
 
                
    def get_build_item(self, release_version, build_name):
        print("[BuildWeb] getting page {0} {1}".format(build_name, release_version))
        if not self.is_logged_in:
            self.login()
        
        # Get info from dashboard
        # example: http://builddashboard/RptRlsList.jsp?version=6.0.1.0&type=DimensionsMaster&rlsType=0
        
        # Prepare the query string
        query_list = {}
        query_list['version'] = release_version
        query_list['type'] = build_name
        query_list['rlsType'] = '0'
        query_string = urllib.parse.urlencode(query_list)
        
        # get list page
        list_page = 'http://9.30.226.36/RptRlsList.jsp' + '?' + query_string
        request = urllib.request.Request(list_page)
        self._add_common_headlers(request)
        request.add_header("Cookie", 'JSESSIONID=' + self.jsessionid)

        # Send and get the response
        response = urllib.request.urlopen(request)
        list_html = response.read().decode('utf-8')
        list_html = list_html.replace('\n', ' ')
        
        import re        
        data = []  
        # analyze the list page
        items = re.findall('<p class="TableCells">(.*?)</p>', list_html)
        data.append(items[1].strip())   # version
        data.append(items[2].strip())   # date
        data.append(items[3].strip())   # start time
        
        if 'has been promoted to GA state' in items[4]:
            data.append('GA')               # GA status
        elif 'SUCCESSFUL' in items[4]:
            data.append('SUCCESSFUL')       # SUCCESSFUL status
        elif 'FAILED' in items[4]:
            data.append('FAILED')           # FAILED status
        elif 'BUILD RUNNING' in items[4]:
            data.append('RUNNING')          # RUNNING status
        else:
            data.append(items[4].strip())   # status
        
        
        if 'BUILD RUNNING' in items[4]:
            # No end time
            data.append('')
        else:
            # Get detail page to get build end time
            # Note: get detail page using the latest version number
            query_list['version'] = items[1]
            query_string = urllib.parse.urlencode(query_list)
            
            # get detail page
            detail_page = 'http://9.30.226.36/RptBldDetails.jsp' + '?' + query_string
            request = urllib.request.Request(detail_page)
            self._add_common_headlers(request)
            request.add_header("Cookie", 'JSESSIONID=' + self.jsessionid)

            # Send and get the response
            response = urllib.request.urlopen(request)
            detail_html = response.read().decode('utf-8')
            detail_html = detail_html.replace('\n', '')

            # analyze the detail page to find the end time
            # regex: .*?  un-greedy search, return the shortest match
            items = re.findall("End:&nbsp;<span style='color:Navy'>(.*?)</span>", detail_html)
            data.append(items[0].strip())   # end time
        
        return data
    
        
def do_self_test():        
    username= 'dcbuild' 
    password = '********'
    
    build = BuildWeb(username, password)
    data = build.get_build_item('7.0.1.0', 'DCMaster')
    print((data))
    
    
    
if __name__ == '__main__':
    do_self_test()
