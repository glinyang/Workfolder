'''
Created on 2014-06-21

@author: Michael
'''
from django.conf.urls import patterns, url

from reports import views
        
urlpatterns = patterns('',
                       # homepage
                       url(r'^$', views.index_default, name='index'),
                       url(r'^(?P<year>\d+)[wW](?P<week>\d+)/$', views.index, name='index'),
                       
                       url(r'^qa/$', views.index_qa_default, name='index_qa'),
                       url(r'^qa/(?P<year>\d+)[wW](?P<week>\d+)/$', views.index_qa, name='index_qa'),
                       
                       url(r'^intern/$', views.index_intern_default, name='index_intern'),
                       url(r'^intern/(?P<year>\d+)[wW](?P<week>\d+)/$', views.index_intern, name='index_intern'),
                       
                       # ajax
                       url(r'^get_ecm/$', views.get_ecm, name='get_ecm'),
                       url(r'^get_query_data/$', views.get_query_data, name='get_query_data'),
                       url(r'^get_query_items_count/$', views.get_query_items_count, name='get_query_items_count'),
                       url(r'^get_build_item/$', views.get_build_item, name='get_build_item'),
                       
                       # login/logout
                       url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'reports/login.html'}, name='login'),
                       url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}, name='logout'),
                       
                       # /reports/myreports
                       url(r'^myreports/$', views.myreports, name='myreports'),
                       url(r'^myreports/all/$', views.myreports, name='myreports_all'),
                       url(r'^myreports/(?P<year>\d+)[wW](?P<week>\d+)-edit/$', views.myreports_edit, name='myreports_edit'),
                       
                       #url(r'^myreports/(?P<year>\d+)/$', views.myreports_year, name='myreports_year'),
                       #url(r'^myreports/(?P<year>\d+)/(?P<week>\d+)/$', views.myreports_week, name='myreports_week'),
                       #url(r'^myreports/(?P<year>\d+)/(?P<week>\d+)/edit/$', views.myreports_edit, name='myreports_edit'),
                         

                       url(r'^interimfix/$', views.interimfix, name='interimfix'),
                       url(r'^interimfix/add/$', views.interimfix_add, name='interimfix_add'),
                       url(r'^interimfix/(?P<ecm>[eE][cC][mM]\d+)/$', views.interimfix_detail, name='interimfix_detail'),
                       #url(r'^interimfix/(?P<ecm>[eE][cC][mM]\d+)/edit/$', views.interimfix_edit, name='interimfix_edit'),
                       
                       #url(r'^interimfix/(?P<ecm>.*)/$', views.interimfix_detail, name='interimfix_detail'),
                       #url(r'^interimfix/(?P<ecm>.*)/delete/$', views.interimfix_delete, name='interimfix_delete'),
                       #url(r'^interimfix/(?P<ecm>.*)/edite/$', views.interimfix_delete, name='interimfix_edite'),
                       url(r'^build/$', views.build, name='build'),
                       url(r'^test/$', views.test, name='test'),
               )