from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'dcwatch.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # Use reports as portal page
    url(r'^', include('reports.urls', namespace='reports')),
    url(r'^polls/', include('polls.urls', namespace='polls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('readme.urls', namespace='readme')),
)
