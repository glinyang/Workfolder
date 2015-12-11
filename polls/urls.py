'''
Created on 2014-06-21

@author: Michael
'''
from django.conf.urls import patterns, url

from polls import views

urlpatterns = patterns('',
                       # /polls/
                       url(r'^$', views.IndexView.as_view(), name='index'),
                       # /polls/7/
                       url(r'(?P<pk>\d+)/$', views.DetailView.as_view(), name='detail'),
                       # /polls/7/results/
                       url(r'(?P<pk>\d+)/results/$', views.ResultsView.as_view(), name='results'),
                       # /polls/7/vote/
                       url(r'(?P<question_id>\d+)/vote/$', views.vote, name='vote'),
               )