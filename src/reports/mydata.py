'''
Created on 2014-07-20

@author: Michael
'''
import re, json
from collections import OrderedDict
from django.conf import settings

from reports.models import Project, WorkItem, WeekPlan
from reports.cqweb import CQWeb
from reports.buildweb import BuildWeb

# Match exactly the ECM######## string, \b for word boundary
p = re.compile(r'\bECM\d{8}\b', re.IGNORECASE)
def update_ecm_to_links(text):
    try:
        links = []
        for ecm in p.findall(text):
            text = text.replace(ecm, '{{0}}'.format(len(links)))
            links.append('<a target="_blank" href="https://vottcq1s.canlab.ibm.com/cqweb/restapi/cq_ecm/ECM/RECORD/{0}?format=HTML&noframes=true">{0}</a>'.format(ecm))

        if links:
            text = text.format(*links)
        return text
    except:
        return text


def get_workitem_group_by_user(year, week, users):
    # data {}
    #     user : {user_data}
    #         project : {project_data}
    #             (workitem)
    data = OrderedDict()
    for user in users:
        user_total_efforts = 0
        user_rowspan = 0
        user_data = OrderedDict()

        for project in Project.objects.all():
            project_data = []

            workitems = project.workitem_set.filter(year=year, week=week, user=user).order_by('item_type')
            for item in workitems:
                workitem = (item.item_type.display_order,
                            item.item_type,
                            update_ecm_to_links(item.item_text),
                            update_ecm_to_links(item.item_comments),
                            item.item_efforts)

                project_data.append(workitem)
                user_total_efforts += item.item_efforts

            project_rowspan = len(project_data)
            if project_rowspan == 0:
                # no data, skip this project
                continue

            # project key is a tuple contains project's metadata
            project_key = (project.project_name, project_rowspan)
            user_data[project_key] = project_data
            user_rowspan += project_rowspan

        # if user_rowspan == 0:
            # no data, skip this user
            # continue

        plan_in_this_week = WeekPlan.objects.filter(year=year, week=week, user=user)
        plan_in_this_week = ''.join(p.plan_text for p in plan_in_this_week)
        plan_for_next_week = WeekPlan.objects.filter(year=year, week=int(week) + 1, user=user)
        plan_for_next_week = ''.join(p.plan_text for p in plan_for_next_week)

        # additional row for 'Plan in This Week' and 'Plan for Next Week'
        user_rowspan += 1

        # user key is a tuple contains user's metadata
        user_key = (user.username, user_rowspan, user_total_efforts, plan_in_this_week, plan_for_next_week)
        data[user_key] = user_data

    return data


def get_workitem_group_by_project(year, week, users):
    # data {}
    #     project : {project_data}
    #         user : {user_data}
    #             (workitem)
    data = OrderedDict()

    for project in Project.objects.all():
        project_data = OrderedDict()
        project_total_efforts = 0
        project_rowspan = 0

        for user in users:
            user_data = []
            workitems = project.workitem_set.filter(year=year, week=week, user=user).order_by('item_type')

            for item in workitems:
                workitem = (item.item_type.display_order,
                            item.item_type,
                            update_ecm_to_links(item.item_text),
                            update_ecm_to_links(item.item_comments),
                            item.item_efforts)

                user_data.append(workitem)
                project_total_efforts += item.item_efforts

            user_rowspan = len(user_data)

            if user_rowspan == 0:
                # no data, skip this user
                continue

            # user key is a tuple contains user's metadata
            user_key = (user.username, user_rowspan)
            project_data[user_key] = user_data
            project_rowspan += user_rowspan

        if project_rowspan == 0:
            # no data, skip this project
            continue

        # project key is a tuple contains project's metadata
        project_key = (project.project_name, project_rowspan, project_total_efforts)
        data[project_key] = project_data

    return data


def get_user_efforts_group_by_project(year, week, users):
    data = OrderedDict()
    total_efforts = 0
    for project in Project.objects.all():
        user_efforts_list = []
        user_list = []

        # get each user's efforts in current project
        for user in users:
            user_efforts = 0

            for item in WorkItem.objects.filter(year=year, week=week, project=project, user=user):
                user_efforts += item.item_efforts

            user_efforts_list.append(user_efforts)

            if user_efforts > 0:
                total_efforts += user_efforts
                user_list.append('{0}: {1} hrs'.format(user.username, user_efforts))

        # show active projects (even the efforts is ZERO) and inactive projects but efforts > 0
        if project.is_active or sum(user_efforts_list) > 0:
            # List can't be used as the key in a dict, since dict keys need to be immutable. Use a tuple instead.
            project_key = (project.project_name, sum(user_efforts_list), tuple(user_list))
            data[project_key] = user_efforts_list

    user_list = [u.username for u in users]
    return (user_list, data, total_efforts)


from django.core.cache import cache
def _get_cqweb():
    if not cache.get('__$$cqweb'):
        username = settings.INTERNAT_NAME
        password = settings.INTERNAT_PASS
        base_url = settings.BASE_URL
        repository = 'cq_ecm'
        database = 'ECM'

        cq = CQWeb(base_url, repository, database, username, password)
        cq.login()
        cache.set('__$$cqweb', cq, 30 * 60)  # reduce the cache to half an hour due to new cc server's very shot time-out duration

    return cache.get('__$$cqweb')


def get_ecm(item_text):
    if not len(item_text.strip()):
        return None;

    # Match exactly the ECM######## string, \b for word boundary
    p = re.compile(r'\bECM\d{8}\b', re.IGNORECASE)
    ecms = p.findall(item_text)
    if not ecms:
        return None

    cq = _get_cqweb()
    html = cq.get_defect(ecms[0])

    if not html:
        return None

    # In CQ 8.0, somehow the response html starts with "for(;;);"
    # need remove them before convert to json
    html = html[8:]

    data = {}
    defect = json.loads(html)
    for field in defect['fields']:
        if field['FieldName'] == 'Headline':
            data['item_text'] = defect['DisplayName'] + ": " + field['CurrentValue']
        elif field['FieldName'] == 'Note_Entry':
            data['item_comments'] = '\n'.join(field['CurrentValue'])
            data['item_comments_status'] = 'show'

    return data


def get_query_data(query_name, start_date, end_date, extra_users=None):
    cq = _get_cqweb()
    html = cq.get_query(query_name, start_date, end_date)

    if not html:
        return None

    json_result = json.loads(html)
    rows_data = json_result['resultSetData']['rowData']
    rows_count = json_result['resultSetData']['totalNumOfRows']

    user_list = []
    owner_list = []
    target_version_list = []
    target_version_counter = OrderedDict()
    severity_list = []
    row_list = []
    for row in rows_data:
        ecm_id = row['id']
        ecm_headline = row['Headline']
        user = row['history.user_name']
        owner = row['Owner.login_name']
        target_version = row['TargetVersion.Name']
        severity = row['Severity']

        'ECM, Headline, Severity, User, Owner, TargetVersion'
        row_list.append((ecm_id, ecm_headline, severity, user, owner, target_version))

        if not user in user_list:
            user_list.append(user)

        if not severity in severity_list:
            severity_list.append(severity)

        if not owner in owner_list:
            owner_list.append(owner)

        if not target_version in target_version_list:
            target_version_list.append(target_version)

        if target_version in target_version_counter:
            target_version_counter[target_version] += 1
        else:
            target_version_counter[target_version] = 1

    if extra_users:
        for extra_user in extra_users:
            if not extra_user.username in user_list:
                user_list.append(extra_user.username)

    user_list.sort()
    row_list.sort(key=lambda ecm: ecm[2])  # sort by severity
    owner_list.sort()
    target_version_list.sort()
    severity_list.sort()

    # after sort, the OrderDict() changed to a tuple list
    target_version_counter = sorted(target_version_counter.items(), key=lambda x:x[1], reverse=True)

    data = {}
    data['rows_count'] = rows_count
    data['user_list'] = user_list
    data['row_list'] = row_list
    data['owner_list'] = owner_list
    data['target_version_list'] = target_version_list
    data['target_version_counter'] = target_version_counter
    data['severity_list'] = severity_list

    # usage: for each user, how many defects are resolved/verified on each target version
    user_serials_group_by_target_version = {}
    for target_version in target_version_list:
        serials_list = []

        for user in user_list:
            counter = 0
            for row in rows_data:
                if row['history.user_name'] == user and row['TargetVersion.Name'] == target_version:
                    counter += 1

            serials_list.append(counter)
        user_serials_group_by_target_version[target_version] = serials_list
    data['user_serials_group_by_target_version'] = user_serials_group_by_target_version


    # for each owner, how many defects are rejected by each user
    owner_serials_group_by_user = {}
    for user in user_list:
        serials_list = []

        for owner in owner_list:
            counter = 0
            for row in rows_data:
                if row['history.user_name'] == user and row['Owner.login_name'] == owner:
                    counter += 1

            serials_list.append(counter)
        owner_serials_group_by_user[user] = serials_list
    data['owner_serials_group_by_user'] = owner_serials_group_by_user


    # how many defects are submitted for each severity
    severity_counter = {}
    for severity in severity_list:
        counter = 0
        for row in rows_data:
            if row['Severity'] == severity:
                counter += 1
        severity_counter[severity] = counter
    data['severity_counter'] = severity_counter

    # print(data)
    return data


def get_query_items_count(query_name):
    cq = _get_cqweb()
    html = cq.get_query(query_name)

    if not html:
        return 0

    json_result = json.loads(html)
    rows_count = json_result['resultSetData']['totalNumOfRows']

    return int(rows_count)


def _get_buildweb():
    if not cache.get('__$$buildweb'):
        username = settings.DOMAIN_NAME
        password = settings.DOMAIN_PASS

        build = BuildWeb(username, password)
        # build.login()
        cache.set('__$$buildweb', build, 2 * 60 * 60)  # cache the login for 2 hours

    return cache.get('__$$buildweb')

def convert_timedelta(duration):
    days, seconds = duration.days, duration.seconds
    hours = days * 24 + seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = (seconds % 60)
    return hours, minutes, seconds

from datetime import datetime, timedelta
def get_build_item(release_version, build_name):
    try:
        web = _get_buildweb()

        # Convert to China time
        # Note:
        # 1. China time is 15 or 16 hours ahead SVL (depends on daylight-saving time)
        # 2. Need change according to daylight-saving time change in SVL
        timediff = timedelta(seconds=15 * 3600)

        raw_items = web.get_build_item(release_version, build_name)

        # raw item format: <version>,<start_date>,<start_time>,<status>,<end_time>
        raw_version = raw_items[0]
        raw_start_date = raw_items[1]
        raw_start_time = raw_items[2]
        raw_status = raw_items[3]
        raw_end_time = raw_items[4]

        start_time = datetime.strptime(raw_start_date + " " + raw_start_time, '%Y-%m-%d %H:%M:%S')
        start_time += timediff  # convert to China time

        if 'RUNNING' in raw_status:
            end_time = ''
            duration = ''
        else:
            end_time = datetime.strptime(raw_start_date + " " + raw_end_time, '%Y-%m-%d %H:%M:%S')
            end_time += timediff  # convert to China time
            if end_time < start_time:
                # end_time mast in another day, add a day to end_time
                end_time += timedelta(days=1)

            hours, minutes, seconds = convert_timedelta(end_time - start_time)

            # show hours and minutes is enough
            strhrs = 'hrs' if hours > 1 else 'hr'
            strmins = 'mins' if minutes > 1 else 'min'
            strsecs = 'secs' if seconds > 1 else 'sec'
            if (hours == 0 and minutes == 0):
                duration = '{0} {1}'.format(seconds, strsecs)
            elif hours == 0:
                duration = '{0} {1}'.format(minutes, strmins)
            else:
                duration = '{0} {1} {2} {3}'.format(hours, strhrs, minutes, strmins)


        # build the output list, format: <version>,<start_date>,<start_time>,<end_time>,<duration><status>
        output_items = []
        output_items.append(raw_version)
        output_items.append(start_time.strftime("%Y-%m-%d"))
        output_items.append(start_time.strftime("%H:%M"))
        output_items.append(end_time.strftime("%H:%M") if end_time else '')  # end_time would be in empty in RUNNING status
        output_items.append(duration)
        output_items.append(raw_status)

        return output_items
    except:
        output_items = ["Error occurred"];
        return output_items;


if __name__ == '__main__':
    for item in get_build_item('7.0.0.1'):
        print(item)
