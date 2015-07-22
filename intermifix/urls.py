from django.conf.urls import patterns, url

from reports import views
        
urlpatterns = patterns('',
                       

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