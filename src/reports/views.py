from datetime import datetime, date, timedelta
from collections import OrderedDict
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from reports.models import Project, ItemType, WeekPlan,Customer_issues
from isoweek import Week
from reports.myforms import ProjectForm, IssuesForm
import reports.mydata
import isoweek

SYSTEM_BEGINNING_DATE = date(2014, 7, 21)

# Create your views here.
def index_default(request):
    today = datetime.today()
    year = today.year
    week = today.isocalendar()[1]
    return index(request, year, week)

def index(request, year, week):
    context = {}
    # iexact means case-insensitive match
    users = User.objects.filter(groups__name__iexact='dcdev').order_by('username')

    data_group_by_project = reports.mydata.get_workitem_group_by_project(year, week, users)
    context['data_group_by_project'] = data_group_by_project

    data_group_by_user = reports.mydata.get_workitem_group_by_user(year, week, users)
    context['data_group_by_user'] = data_group_by_user

    data_efforts = reports.mydata.get_user_efforts_group_by_project(year, week, users)
    context['users'] = data_efforts[0]
    context['team_capacity'] = len(data_efforts[0]) * 40
    context['total_efforts'] = data_efforts[2]
    context['user_efforts_list'] = data_efforts[1]

    context['week'] = Week(int(year), int(week))
    context['prevweek'] = Week(int(year), int(week) - 1)
    context['nextweek'] = Week(int(year), int(week) + 1)
    return render(request, 'reports/index.html', context)


def index_qa_default(request):
    today = datetime.today()
    year = today.year
    week = today.isocalendar()[1]
    return index_qa(request, year, week)

def index_qa(request, year, week):
    context = {}
    # iexact means case-insensitive match
    users = User.objects.filter(groups__name__iexact='dcqa').order_by('username')

    data_group_by_project = reports.mydata.get_workitem_group_by_project(year, week, users)
    context['data_group_by_project'] = data_group_by_project

    data_group_by_user = reports.mydata.get_workitem_group_by_user(year, week, users)
    context['data_group_by_user'] = data_group_by_user

    data_efforts = reports.mydata.get_user_efforts_group_by_project(year, week, users)
    context['users'] = data_efforts[0]
    context['team_capacity'] = len(data_efforts[0]) * 40
    context['total_efforts'] = data_efforts[2]
    context['user_efforts_list'] = data_efforts[1]

    context['week'] = Week(int(year), int(week))
    context['prevweek'] = Week(int(year), int(week) - 1)
    context['nextweek'] = Week(int(year), int(week) + 1)
    return render(request, 'reports/qa.html', context)


def index_intern_default(request):
    today = datetime.today()
    year = today.year
    week = today.isocalendar()[1]
    return index_intern(request, year, week)

def index_intern(request, year, week):
    context = {}
    # iexact means case-insensitive match
    users = User.objects.filter(groups__name__iexact='dcintern').order_by('username')

    data_group_by_project = reports.mydata.get_workitem_group_by_project(year, week, users)
    context['data_group_by_project'] = data_group_by_project

    data_group_by_user = reports.mydata.get_workitem_group_by_user(year, week, users)
    context['data_group_by_user'] = data_group_by_user

    data_efforts = reports.mydata.get_user_efforts_group_by_project(year, week, users)
    context['users'] = data_efforts[0]
    context['team_capacity'] = len(data_efforts[0]) * 40
    context['total_efforts'] = data_efforts[2]
    context['user_efforts_list'] = data_efforts[1]

    context['week'] = Week(int(year), int(week))
    context['prevweek'] = Week(int(year), int(week) - 1)
    context['nextweek'] = Week(int(year), int(week) + 1)
    return render(request, 'reports/intern.html', context)


@login_required()
def myreports(request):
    data = OrderedDict()

    current_week = isoweek.Week(datetime.today().year, datetime.today().isocalendar()[1])
    if 'reports/all' in request.path:
        # show all data start from the beginning day
        start_week = isoweek.Week(SYSTEM_BEGINNING_DATE.year, SYSTEM_BEGINNING_DATE.isocalendar()[1])
        show_all_data = True
    else:
        # show just recent 15 weeks' data (include current week)
        start_week = current_week - 14
        show_all_data = False

    index = current_week
    while index >= start_week:
        week_data = reports.mydata.get_workitem_group_by_user(index.year, index.week, [request.user])
        data[index] = week_data

        # continue load previous week's data
        index -= 1

    plan_in_this_week = WeekPlan.objects.filter(year=current_week.year, week=current_week.week, user=request.user)
    plan_in_this_week = ''.join(p.plan_text for p in plan_in_this_week)
    next_week = current_week + 1
    plan_for_next_week = WeekPlan.objects.filter(year=next_week.year, week=next_week.week, user=request.user)
    plan_for_next_week = ''.join(p.plan_text for p in plan_for_next_week)

    context = {'data' : data }
    context['plan_in_this_week'] = plan_in_this_week
    context['plan_for_next_week'] = plan_for_next_week
    context['show_all_data'] = show_all_data
    return render(request, 'reports/myreports.html', context)


@login_required()
def myreports_edit(request, year, week):
    system_beginning_year = SYSTEM_BEGINNING_DATE.year
    system_beginning_week = SYSTEM_BEGINNING_DATE.isocalendar()[1]
    current_year = datetime.today().year
    current_week = datetime.today().isocalendar()[1]

    if (int(year) >= current_year and int(week) > current_week) or \
       (int(year) <= system_beginning_year and int(week) < system_beginning_week):
        return HttpResponseRedirect(reverse('reports:myreports'))

    forms = []
    projects = Project.objects.filter(is_active=True)

    active_project_index = 0
    active_row_index = 0

    plan_in_this_week = WeekPlan.objects.filter(year=int(year), week=int(week), user=request.user)
    plan_in_this_week = ''.join(p.plan_text for p in plan_in_this_week)
    plan_for_next_week = WeekPlan.objects.filter(year=int(year), week=int(week) + 1, user=request.user)
    plan_for_next_week = ''.join(p.plan_text for p in plan_for_next_week)

    if request.method == 'POST':
        data = request.POST.copy()
        plan_for_next_week = data['plan_for_next_week']

        if request.POST.get('save'):
            for project_index, project in enumerate(projects):
                rows_count_key = '{0}-rows_count'.format(project_index)
                if not rows_count_key in data:
                    continue

                rows_count = int(data[rows_count_key])

                # remove the old plan of this week
                WeekPlan.objects.filter(year=year, week=int(week) + 1, user=request.user).delete()
                WeekPlan.objects.create(year=year, week=int(week) + 1, user=request.user, plan_text=plan_for_next_week)

                # remove all old items of current week
                p = Project.objects.get(project_name=project)
                p.workitem_set.filter(year=year, week=week, user=request.user).delete()

                for row_index in range(int(rows_count)):
                    item_type_value = data['{0}-item_type_{1}'.format(project_index, row_index)]
                    item_text_value = data['{0}-item_text_{1}'.format(project_index, row_index)]
                    item_comments_value = data['{0}-item_comments_{1}'.format(project_index, row_index)]
                    item_efforts_value = data['{0}-item_efforts_{1}'.format(project_index, row_index)]

                    if item_type_value.strip() and item_text_value.strip():
                        # save to database
                        p.workitem_set.create(item_type=ItemType.objects.get(display_order=item_type_value),
                                              item_text=item_text_value,
                                              item_comments=item_comments_value,
                                              item_efforts=item_efforts_value,
                                              year=year,
                                              week=week,
                                              user=request.user)
            # redirect to view page
            # Always return an HttpResponseRedirect after successfully dealing
            # with POST data. This prevents data from being posted twice if a
            # user hits the Back button.
            return HttpResponseRedirect(reverse('reports:myreports'))
        elif request.POST.get('add') and request.POST.get('current_project') and request.POST.get('current_row'):
            data['data_changed'] = "true"
            current_project = int(data['current_project'])
            current_row = int(data['current_row'])

            for project_index, project in enumerate(projects):
                rows_count_key = '{0}-rows_count'.format(project_index)
                if not rows_count_key in data:
                    continue

                rows_count = int(data[rows_count_key])

                if project_index == current_project:
                    # new row added
                    rows_count += 1
                    data['{0}-rows_count'.format(project_index)] = rows_count
                    new_row_index = current_row + 1

                    # set focus to new added row
                    active_project_index = current_project
                    active_row_index = new_row_index

                    # Move all rows behind the current row to the next position
                    for row_index in range(rows_count - 1, new_row_index, -1):
                        data['{0}-item_type_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_type_{1}'.format(project_index, row_index - 1)]
                        data['{0}-item_text_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_text_{1}'.format(project_index, row_index - 1)]
                        data['{0}-item_comments_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_comments_{1}'.format(project_index, row_index - 1)]
                        data['{0}-item_comments_status_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_comments_status_{1}'.format(project_index, row_index - 1)]
                        data['{0}-item_efforts_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_efforts_{1}'.format(project_index, row_index - 1)]

                    # set new row to a new default workitem
                    data['{0}-item_type_{1}'.format(project_index, new_row_index)] = 10
                    data['{0}-item_text_{1}'.format(project_index, new_row_index)] = ''
                    data['{0}-item_comments_{1}'.format(project_index, new_row_index)] = ''
                    data['{0}-item_comments_status_{1}'.format(project_index, new_row_index)] = 'hide'
                    data['{0}-item_efforts_{1}'.format(project_index, new_row_index)] = 4

                # Restore the form status
                form = ProjectForm(data, prefix=str(project_index), rows_count=rows_count)
                forms.append(form)
        elif request.POST.get('remove') and request.POST.get('current_project') and request.POST.get('current_row'):
            data['data_changed'] = "true"
            current_project = int(data['current_project'])
            current_row = int(data['current_row'])

            for project_index, project in enumerate(projects):
                rows_count_key = '{0}-rows_count'.format(project_index)
                if not rows_count_key in data:
                    continue

                rows_count = int(data[rows_count_key])

                if project_index == current_project:
                    # existing row removed
                    rows_count -= 1
                    data['{0}-rows_count'.format(project_index)] = rows_count

                    # set focus to new added row
                    active_project_index = current_project
                    if current_row < rows_count:
                        active_row_index = current_row
                    else:
                        active_row_index = rows_count - 1

                    # Move all rows behind the current row to the previous position
                    for row_index in range(current_row, rows_count):
                        data['{0}-item_type_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_type_{1}'.format(project_index, row_index + 1)]
                        data['{0}-item_text_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_text_{1}'.format(project_index, row_index + 1)]
                        data['{0}-item_comments_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_comments_{1}'.format(project_index, row_index + 1)]
                        data['{0}-item_comments_status_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_comments_status_{1}'.format(project_index, row_index + 1)]
                        data['{0}-item_efforts_{1}'.format(project_index, row_index)] = \
                        data['{0}-item_efforts_{1}'.format(current_project, row_index + 1)]

                # Restore the form status
                form = ProjectForm(data, prefix=str(project_index), rows_count=rows_count)
                forms.append(form)
    else:
        # Initialize the project forms
        for project_index, project in enumerate(projects):
            workitems = []
            for item in project.workitem_set.filter(year=year, week=week, user=request.user).order_by('item_type'):
                workitem = {'item_type_display_order': item.item_type.display_order,
                        'item_text': item.item_text,
                        'item_comments': item.item_comments,
                        'item_efforts': item.item_efforts}
                workitems.append(workitem)

            if len(workitems) == 0:
                # add 3 default items
                # 10    ECM
                # 20    Feature
                # 30    Meeting / Training
                # 40    Holidays / Leave
                # 50    Other
                default_types_list = []
                if 'Customer Issues' in project.project_name:
                    default_types_list.extend([10, 10, 50])
                elif 'FP3' in project.project_name:
                    default_types_list.extend([10, 20, 50])
                elif '7.0.1' in project.project_name:
                    default_types_list.extend([10, 20, 50])
                elif 'Leave' in project.project_name:
                    default_types_list.extend([40, 40])
                elif 'Others' in project.project_name:
                    default_types_list.extend([10, 50])
                else:
                    default_types_list.extend([10, 20, 50])

                for item_type in default_types_list:
                    workitem = {'item_type_display_order': item_type, 'item_text': '', 'item_comments': '', 'item_efforts': 4}
                    workitems.append(workitem)
            elif len(workitems) > 0:
                # add 1 default item as 'other
                default1 = {'item_type_display_order': 50, 'item_text': '', 'item_comments': '', 'item_efforts': 4}
                workitems.append(default1)

            data = {}
            data['data_changed'] = "false"
            data['{0}-project_name'.format(project_index)] = project.project_name
            data['{0}-rows_count'.format(project_index)] = len(workitems)
            for row_index, row_item in enumerate(workitems):
                data['{0}-item_type_{1}'.format(project_index, row_index)] = row_item['item_type_display_order']
                data['{0}-item_text_{1}'.format(project_index, row_index)] = row_item['item_text']
                data['{0}-item_comments_{1}'.format(project_index, row_index)] = row_item['item_comments']
                data['{0}-item_comments_status_{1}'.format(project_index, row_index)] = 'hide' if len(row_item['item_comments']) == 0 else 'show'
                data['{0}-item_efforts_{1}'.format(project_index, row_index)] = row_item['item_efforts']

            # Note: prefix MUST be string
            form = ProjectForm(data, prefix=str(project_index), rows_count=len(workitems))
            forms.append(form)

    context = {}
    context['week'] = Week(int(year), int(week))
    context['forms'] = forms
    context['projects_count'] = len(projects)
    context['active_project_index'] = active_project_index
    context['active_row_index'] = active_row_index
    context['current_path'] = request.get_full_path()
    context['data_changed'] = data['data_changed']
    context['item_types'] = ItemType.objects.filter(is_active=True).order_by('display_order')
    context['plan_in_this_week'] = plan_in_this_week
    context['plan_for_next_week'] = plan_for_next_week
    return render(request, 'reports/myreports_edit.html', context)


def build(request):
    data = {}
    context = {'data' : data }
    return render(request, 'reports/build.html', context)

# interim fix index page
def interimfix(request):
    data = []
    for item in Customer_issues.objects.all():
        showitem = (item.id,
                    item.ecm,
                    item.headline,
                    item.target_version,
                    item.customer,
                    item.report_by,
                    item.dev,
                    item.qa_owner,
                    item.status,
                    item.eta,
                    item.hf_no,
                    item.cq_note,  
                    )      
        data.append(showitem)
    context = {'data' : data }
    return render(request, 'reports/interimfix.html', context)
    
def interimfix_detail(request, ecm):
    data = []
    q=Customer_issues.objects.get(ecm=ecm)
    showitem = (ecm,
                q.headline,
                q.target_version,
                q.customer,
                q.report_by,
                q.report_date,
                q.dev,
                q.qa_reject,
                q.qa_owner,
                q.status,
                q.release_date,
                q.eta,
                q.hf_no,
                q.cq_note,
                q.modules,
                q.file_version,
                q.package_version,
                q.package_description,
                q.dsg,
                q.duplicate,
                q.fix_location,
                q.fixcenterlurl,             
                )
    data.append(showitem)
    context = {'data' : data }
    return render(request, 'reports/interimfix_detail.html', context)

def interimfix_delete(request):
    if request.method == 'Post':
        m=request.REQUEST.get(id)    
        a=Customer_issues.objects.get(id=m)
        a.delete()     
def interimfix_edit(request):
    pass           
def interimfix_add(request):
    if request.method == 'POST':
        form = IssuesForm(request.POST)
        if form.is_valid():
            headline = request.POST['headline']
            customer = request.POST['customer']
            report_date = request.POST['report_date']
            report_by = request.POST['report_by']
            ecm = request.POST['ecm']
            target_version = request.POST['target_version']
            hf_no = request.POST['hf_no']
            modules = request.POST['modules']
            file_version = request.POST['file_version']
            package_version =request.POST['package_version']
            package_description = request.POST['package_description']
            dev = request.POST['dev']
            dsg = request.POST['dsg']
            duplicate = request.POST['duplicate']
            qa_reject = request.POST['qa_reject']
            qa_owner =request.POST['qa_owner']
            status = request.POST['status']
            release_date = request.POST['release_date']
            fix_location =request.POST['fix_location']     
            fixcenterlurl =request.POST['fixcenterlurl'] 
            eta = request.POST['eta'] 
            cq_note =  request.POST['cq_note']          
            st=Customer_issues()
            st.headline = headline
            st.customer = customer
            st.report_date = report_date
            st.report_by = report_by
            st.ecm = ecm
            st.target_version =target_version
            st.hf_no = hf_no
            st.modules = modules
            st.file_version = file_version
            st.package_version =package_version
            st.package_description = package_description
            st.dev = dev 
            st.dsg = dsg
            st.duplicate = duplicate
            st.qa_reject = qa_reject
            st.qa_owner = qa_owner
            st.status = status
            st.release_date = release_date
            st.fix_location =fix_location
            st.fixcenterlurl =fixcenterlurl
            st.eta = eta
            st.cq_note = cq_note
            st.save()
            return render(request,'reports/Successful.html', {'form': form})
    else:
        form = IssuesForm()
    return render(request,'reports/interimfix_add.html', {'form': form})
    
def test(request):
    data = {}
    context = {'data' : data }
    return render(request, 'reports/test.html', context)


from django_ajax.decorators import ajax
from django.views.decorators.cache import cache_page
@ajax
def get_ecm(request):
    data = {}
    ecm = request.GET.get('ecm')

    defect = reports.mydata.get_ecm(ecm)
    if defect:
        data['headline'] = defect['item_text']
        data['comments'] = defect['item_comments']

    return data


@cache_page(30 * 60)  # reduce the cache to half an hour due to new cc server's very shot time-out duration
@ajax
def get_query_data(request):
    data = {}
    query_name = request.GET.get('query_name')
    week = Week(int(request.GET.get('year')), int(request.GET.get('week')))

    if query_name == 'all_resolved_defects':
        extra_users = User.objects.filter(groups__name__iexact='dcdev').order_by('username')
    elif query_name == 'all_verified_defects':
        extra_users = User.objects.filter(groups__name__iexact='dcqa').order_by('username')
    else:
        extra_users = None

    query_data = reports.mydata.get_query_data(query_name, week.monday(), week.sunday(), extra_users)

    data['rows_count'] = query_data['rows_count']
    data['user_list'] = query_data['user_list']
    data['owner_list'] = query_data['owner_list']
    data['target_version_list'] = query_data['target_version_list']
    data['target_version_counter'] = query_data['target_version_counter']
    data['severity_list'] = query_data['severity_list']
    data['row_list'] = query_data['row_list']


    target_version_serials_list = []
    for target_version in query_data['target_version_list']:
        serial = {}
        if target_version:
            serial['name'] = target_version
        else:
            serial['name'] = 'Not Assigned'
        serial['data'] = query_data['user_serials_group_by_target_version'][target_version]
        target_version_serials_list.append(serial)
    data['target_version_serials_list'] = target_version_serials_list


    owner_serials_list = []
    for user in query_data['user_list']:
        serial = {}
        serial['name'] = user
        serial['data'] = query_data['owner_serials_group_by_user'][user]
        owner_serials_list.append(serial)
    data['owner_serials_list'] = owner_serials_list


    data['severity_counter'] = query_data['severity_counter']

    return data


@cache_page(30 * 60)  # reduce the cache to half an hour due to new cc server's very shot time-out duration
@ajax
def get_query_items_count(request):
    data = {}
    query_name = request.GET.get('query_name')
    items_count = reports.mydata.get_query_items_count(query_name)
    data['items_count'] = items_count
    return data


@ajax
def get_build_item(request):
    data = {}
    version = request.GET.get('version')
    name = request.GET.get('name')
    build_item = reports.mydata.get_build_item(version, name)
    data['build_item'] = build_item
    return data
