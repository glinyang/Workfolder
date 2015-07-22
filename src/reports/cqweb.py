'''
Created on 2014-06-14

@author: Michael
'''

import urllib.parse
import urllib.request
import ssl, re
from django.conf import settings

my_queries = {'all_open_defects': 36547833,
              'all_unverified_defects': 36547832,
              'all_resolved_defects': 36547841,
              'all_submitted_defects' :36547842,
              'all_verified_defects': 36547843,
              'all_rejected_defects': 36547844 }

class CQWeb(object):
    '''
    This class represents the ClearQuest Web client and provides functions to get data via ClearQuest REST API
    '''
    def __init__(self, base_url, repository, database, username, password):
        '''
        Constructor, initialize the CQWeb environment
        '''
        self.base_url = base_url
        self.repository = repository
        self.database = database
        self.username = username
        self.password = password

        ####################
        #     IMPORTANT    #
        ####################
        # MUST use HTTPSHandler with SSL.PROTOCOL_SSLv3 set to access CQWeb,
        # else error "SSL: DECRYPTION_FAILED_OR_BAD_RECORD_MAC" will occur
        https_sslv3_handler = urllib.request.HTTPSHandler(context=ssl.SSLContext(ssl.PROTOCOL_TLSv1))
        https_sslv3_opener = urllib.request.build_opener(https_sslv3_handler)

        # Install sslv3 opener as default, so all following urlopen() will use it automatically
        urllib.request.install_opener(https_sslv3_opener)


    def _add_common_headlers(self, req):
        req.add_header('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        # req.add_header('User-Agent', 'Python-urllib/3.4') Default User-Agent
        # req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0')


    # loginId    wangxuepeng@cn.ibm.com
    # password    your_password
    # repository    cq_ecm
    # tzOffset    GMT+8:00
    # loadAllRequiredInfo    true
    # cquid    00006jMcTG2JD4-ycfLDr4-oFBx:-1
    is_logged_in = False
    def login(self):
        print('[CQWeb] login...', end='')
        # Login URL: https://vottcq1s.canlab.ibm.com/cqweb/cqlogin.cq?action=DoLogin
        login_url = urllib.request.urljoin(self.base_url, 'cqlogin.cq')

        # Prepare the query string
        query_list = {}
        query_list['action'] = 'DoLogin'
        query_string = urllib.parse.urlencode(query_list)

        # Append the query string to url
        login_url = login_url + '?' + query_string

        # Prepare POST data
        post_list = {}
        post_list['loginId'] = self.username
        post_list['password'] = self.password
        post_list['repository'] = self.repository
        post_list['userDb'] = self.database
        post_list['loadAllRequiredInfo'] = 'true'

        post_data = urllib.parse.urlencode(post_list)
        post_data = post_data.encode('utf-8')

        # Build the request
        request = urllib.request.Request(login_url, post_data)

        # Add necessary common headers
        self._add_common_headlers(request)

        # Send and get the response
        response = urllib.request.urlopen(request)
        html = response.read().decode('utf-8')

        if "status:'true'," in html:
            self.cquid = re.search("cqUid:'([^,|.]*)',.*", html).group(1)

            ####################
            #     IMPORTANT    #
            ####################
            # The response may have two 'Set-Cookie', however, only the last one is valid
            # For all following requests, the cookie MUST be attached to pass the authentication
            for item in response.headers.items():
                if item[0] == 'Set-Cookie':
                    self.set_cookie = item[1]

            # Extract JSESSIONID
            self.JSESSIONID = re.search('JSESSIONID=([^,|.]*); Path=/;.*', self.set_cookie).group(1)
            self.is_logged_in = True
            print('success')
        else:
            self.is_logged_in = False
            print(html)
            print('failed')


    # get resourceID of an ECM, this is a change in CQ 8.0
    def get_resource_id(self, ecm_num):
        print("[CQWeb] cqfind {0}...".format(ecm_num), end='')
        if not self.is_logged_in:
            self.login()

        # URL: /cqweb/cqfind.cq?action=DoFindRecord&recordId=ECM00204128&searchType=BY_RECORD_ID&dojo.preventCache=1417872449692 HTTP/1.1
        defect_url = urllib.request.urljoin(self.base_url, 'cqfind.cq')

        # Prepare the query string
        query_list = {}
        query_list['action'] = 'DoFindRecord'
        query_list['recordId'] = ecm_num
        query_list['searchType'] = 'BY_RECORD_ID'
        query_string = urllib.parse.urlencode(query_list)

        # Append the query string to url
        defect_url = defect_url + '?' + query_string

        request = urllib.request.Request(defect_url)
        self._add_common_headlers(request)
        request.add_header("Cookie", 'JSESSIONID=' + self.JSESSIONID)
        request.add_header("cquid", self.cquid)

        # Send and get the response
        response = urllib.request.urlopen(request)
        html = response.read().decode('utf-8')

        if "status:'true'," in html:
            # resourceId: cq.repo.cq-query:36547841@cq_ecm/ECM
            resourceId = re.search("id:'(.*)'}$", html).group(1)
            print("success: {1}".format(ecm_num, resourceId))
            return resourceId
        else:
            print(html)
            print("failed".format(ecm_num))
            return None


    def get_defect(self, ecm_num):
        print("[CQWeb] getting {0}...".format(ecm_num))
        if not self.is_logged_in:
            self.login()

        resourceId = self.get_resource_id(ecm_num)
        if not resourceId:
            return None

        # Defect URL: https://vottcq1s.canlab.ibm.com/cqweb/cqartifactdetails.cq?action=GetCQRecordDetails&resourceId=cqweb.record%3ADefect%2FECM00203531%40cq_ecm%2FECM&state=VIEW&tabIndex=0&acceptAllTabsData=true&cquid={0}
        defect_url = urllib.request.urljoin(self.base_url, 'cqartifactdetails.cq')

        # Prepare the query string
        query_list = {}
        query_list['action'] = 'GetCQRecordDetails'
        query_list['resourceId'] = resourceId
        query_string = urllib.parse.urlencode(query_list)

        # Append the query string to url
        defect_url = defect_url + '?' + query_string

        request = urllib.request.Request(defect_url)
        self._add_common_headlers(request)
        request.add_header("Cookie", 'JSESSIONID=' + self.JSESSIONID)
        request.add_header("cquid", self.cquid)

        # Send and get the response
        response = urllib.request.urlopen(request)
        html = response.read().decode('utf-8')

        if '"status": "LOGIN_FAIL"' in html:
            # login and retry
            print('[CQWeb] retry login and query again...')
            self.login()

            if not self.is_logged_in:
                print(html)
                print("[CQWeb] getting ecm failed")
                return None

            response = urllib.request.urlopen(request)
            html = response.read().decode('utf-8')

        print("[CQWeb] getting {0} success".format(ecm_num))
        return html


    # All Resolved
    # action    ExecuteQuery
    # resourceId    cq.repo.cq-query:36509000@cq_ecm/ECM
    # format    JSON
    # data    [{"fieldPath": "history.action_timestamp", "op": 9, "valueList": ["2014-07-14", "2014-07-20"], "fieldType": "DATE_TIME", "prompt": "Enter: history.action_timestamp", "displayName": "action_timestamp", "choiceListInfo": null}]
    # startIndex    1
    # rowCount    100
    # refresh    true
    # cquid    0000kKZ5Pyn62LmVebDejWchojU:-1
    # dojo.preventCache    1406035846891
    def get_query(self, query_name, start_date=None, end_date=None):
        if start_date and end_date:
            print("[CQWeb] getting query {0}: {1:%Y-%m-%d} to {2:%Y-%m-%d}".format(query_name, start_date, end_date))
        else:
            print("[CQWeb] getting query {0}".format(query_name))

        if not self.is_logged_in:
            self.login()

        # Query URL: https://vottcq1s.canlab.ibm.com/cqweb/cqqueryresults.cq
        query_url = urllib.request.urljoin(self.base_url, 'cqqueryresults.cq')

        # Prepare POST data
        post_list = {}
        post_list['action'] = 'ExecuteQuery'
        post_list['cquid'] = self.cquid
        post_list['format'] = 'JSON'
        post_list['resourceId'] = 'cq.repo.cq-query:{resourceId}@{repository}/{database}'.format(resourceId=my_queries[query_name], repository=self.repository, database=self.database)
        post_list['rowCount'] = '400'
        post_list['startIndex'] = '1'
        post_list['refresh'] = 'true'
        # delta = datetime.datetime.now() - datetime.datetime(1970, 1, 1)
        # post_list['dojo.preventCache'] = delta.total_seconds()

        # data_string = '[{"fieldPath": "history.action_timestamp", "op": 9, "valueList": ["2014-07-07", "2014-07-13"], "fieldType": "DATE_TIME", "prompt": "Enter: history.action_timestamp", "displayName": "action_timestamp", "choiceListInfo": null}]'
        if start_date and end_date:
            data_string = '[{"fieldPath":"history.action_timestamp","op":9,"valueList":' + '["{0:%Y-%m-%d}","{1:%Y-%m-%d}"]'.format(start_date, end_date) + ',"fieldType":"DATE_TIME","prompt":"Enter:history.action_timestamp","displayName":"action_timestamp","choiceListInfo":null}]'
        else:
            data_string = '[{"fieldPath":"history.action_timestamp","op":9,"valueList":[], "fieldType":"DATE_TIME","prompt":"Enter:history.action_timestamp","displayName":"action_timestamp","choiceListInfo":null}]'

        post_list['data'] = data_string

        post_data = urllib.parse.urlencode(post_list)
        post_data = post_data.encode('utf-8')

        # Build the request
        request = urllib.request.Request(query_url, post_data)
        self._add_common_headlers(request)
        request.add_header("Cookie", 'JSESSIONID=' + self.JSESSIONID)
        request.add_header("cquid", self.cquid)

        # Send and get the response
        response = urllib.request.urlopen(request)
        html = response.read().decode('utf-8')
        html = html[8:]
        if '"status": "LOGIN_FAIL"' in html:
            # login and retry
            print('[CQWeb] retry login and query again')
            self.login()

            if not self.is_logged_in:
                print(html)

                if start_date and end_date:
                    print("[CQWeb] getting query {0}: {1:%Y-%m-%d} to {2:%Y-%m-%d} failed".format(query_name, start_date, end_date))
                else:
                    print("[CQWeb] getting query {0} failed".format(query_name))

                return None

            response = urllib.request.urlopen(request)
            html = response.read().decode('utf-8')

        print("[CQWeb] getting query {0} success".format(query_name))
        return html


import datetime
import json
def do_self_test():
    username = settings.INTERNAT_NAME
    password = settings.INTERNAT_PASS
    base_url = settings.BASE_URL
    repository = 'cq_ecm'
    database = 'ECM'

    cq = CQWeb(base_url, repository, database, username, password)

    ecm = 'ECM00208591'
    html = cq.get_defect(ecm)

    data = {}
    defect = json.loads(html)
    for field in defect['fields']:
        if field['FieldName'] == 'Headline':
            data['item_text'] = defect['DisplayName'] + ": " + field['CurrentValue']
        elif field['FieldName'] == 'Note_Entry':
            data['item_comments'] = '\n'.join(field['CurrentValue'])
            data['item_comments_status'] = 'show'

    print(data['item_comments'])


    my_queries = ['all_resolved_defects']
    for query_name in my_queries:
        html = cq.get_query(query_name, datetime.datetime.today() - datetime.timedelta(days=7 * 2) , datetime.datetime.today() - datetime.timedelta(days=7 * 1))
        # html = html[8:]
        if html:
            raw = json.loads(html)
            result = raw['resultSetData']
            # rows = result['rowData']
            rows_count = result['totalNumOfRows']
            print(rows_count)


if __name__ == '__main__':
    do_self_test()
